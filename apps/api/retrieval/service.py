from collections.abc import Sequence
from typing import TypedDict

from psycopg_pool import AsyncConnectionPool

from retrieval.queries import fetch_neighbors_for_seeds

DEFAULT_NEIGHBORS_PER_SEED = 2
DEFAULT_LIMIT = 20


class RecommendationItem(TypedDict):
    showId: int
    score: int


def similarity_to_percent(score: float) -> int:
    """Map cosine similarity (~0-1) to an integer percentage (0-100)."""
    return max(0, min(100, round(score * 100)))


async def recommend(
    pool: AsyncConnectionPool,
    show_ids: Sequence[int],
    *,
    neighbors_per_seed: int = DEFAULT_NEIGHBORS_PER_SEED,
    limit: int = DEFAULT_LIMIT,
) -> list[RecommendationItem]:
    """Per-watched top-k NN, merge by max score, return top ``limit`` items."""
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
    return [
        RecommendationItem(
            showId=show_id,
            score=similarity_to_percent(score),
        )
        for show_id, score in ranked[:limit]
    ]
