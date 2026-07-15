from collections.abc import Sequence

from psycopg_pool import AsyncConnectionPool

from retrieval.queries import fetch_neighbors_for_seeds

DEFAULT_NEIGHBORS_PER_SEED = 2
DEFAULT_LIMIT = 20


async def recommend(
    pool: AsyncConnectionPool,
    show_ids: Sequence[int],
    *,
    neighbors_per_seed: int = DEFAULT_NEIGHBORS_PER_SEED,
    limit: int = DEFAULT_LIMIT,
) -> list[int]:
    """Per-watched top-k NN, merge by max score, return top ``limit`` show IDs."""
    if not show_ids or limit <= 0:
        return []

    exclude_ids = list(dict.fromkeys(show_ids))

    async with pool.connection() as conn:
        neighbor_rows = await fetch_neighbors_for_seeds(
            conn,
            exclude_ids,
            neighbors_per_seed=neighbors_per_seed,
        )

    if not neighbor_rows:
        return []

    best_scores: dict[int, float] = {}
    for neighbor_id, score in neighbor_rows:
        previous = best_scores.get(neighbor_id)
        if previous is None or score > previous:
            best_scores[neighbor_id] = score

    ranked = sorted(best_scores.items(), key=lambda item: item[1], reverse=True)
    return [show_id for show_id, _score in ranked[:limit]]
