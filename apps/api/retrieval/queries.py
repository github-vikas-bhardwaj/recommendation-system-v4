from collections.abc import Sequence

from psycopg import AsyncConnection
from psycopg.rows import dict_row


async def fetch_seed_embeddings(
    conn: AsyncConnection,
    show_ids: Sequence[int],
) -> list[tuple[int, list[float]]]:
    """Load embeddings for the given show IDs. Missing IDs are omitted."""
    if not show_ids:
        return []

    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(
            """
            SELECT show_id, embedding
            FROM shows_embeddings
            WHERE show_id = ANY(%s)
            """,
            (list(show_ids),),
        )
        rows = await cur.fetchall()

    return [(int(row["show_id"]), row["embedding"].tolist()) for row in rows]


async def fetch_neighbors(
    conn: AsyncConnection,
    embedding: Sequence[float],
    *,
    exclude_ids: Sequence[int],
    k: int = 2,
) -> list[tuple[int, float]]:
    """Return top-k nearest show IDs with cosine similarity scores."""
    if k <= 0 or not embedding:
        return []

    exclude = list(exclude_ids)

    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(
            """
            SELECT
              e.show_id,
              1 - (e.embedding <=> %(embedding)s) AS score
            FROM shows_embeddings AS e
            WHERE NOT (e.show_id = ANY(%(exclude_ids)s))
            ORDER BY e.embedding <=> %(embedding)s
            LIMIT %(k)s
            """,
            {
                "embedding": list(embedding),
                "exclude_ids": exclude if exclude else [-1],
                "k": k,
            },
        )
        rows = await cur.fetchall()

    return [(int(row["show_id"]), float(row["score"])) for row in rows]


async def fetch_neighbors_for_seeds(
    conn: AsyncConnection,
    seed_ids: Sequence[int],
    *,
    neighbors_per_seed: int = 2,
) -> list[tuple[int, float]]:
    """
    For each seed, take top-k neighbors in one round-trip (LATERAL),
    then return (neighbor_id, score) rows (may include duplicates across seeds).
    """
    if not seed_ids or neighbors_per_seed <= 0:
        return []

    exclude_ids = list(seed_ids)

    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(
            """
            WITH seeds AS (
              SELECT show_id, embedding
              FROM shows_embeddings
              WHERE show_id = ANY(%(seed_ids)s)
            )
            SELECT
              n.show_id,
              n.score
            FROM seeds AS s
            CROSS JOIN LATERAL (
              SELECT
                e.show_id,
                1 - (e.embedding <=> s.embedding) AS score
              FROM shows_embeddings AS e
              WHERE NOT (e.show_id = ANY(%(exclude_ids)s))
              ORDER BY e.embedding <=> s.embedding
              LIMIT %(k)s
            ) AS n
            """,
            {
                "seed_ids": exclude_ids,
                "exclude_ids": exclude_ids,
                "k": neighbors_per_seed,
            },
        )
        rows = await cur.fetchall()

    return [(int(row["show_id"]), float(row["score"])) for row in rows]
