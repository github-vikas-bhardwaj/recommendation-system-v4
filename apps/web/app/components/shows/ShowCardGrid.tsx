import type { Show } from "@/lib/shows/types";

import { ShowCard } from "./ShowCard";

type ShowCardGridProps = {
  shows: Show[];
  watchedShowIds: ReadonlySet<number>;
  /** Optional match scores keyed by show id (0–100). */
  matchScoresById?: ReadonlyMap<number, number>;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ShowCardGrid({
  shows,
  watchedShowIds,
  matchScoresById,
  emptyTitle = "No shows found",
  emptyDescription = "Try a different search term or browse all shows.",
}: ShowCardGridProps) {
  if (shows.length === 0) {
    return (
      <div className="card-surface rounded-2xl px-6 py-16 text-center">
        <p className="text-lg font-medium text-white">{emptyTitle}</p>
        <p className="mt-2 text-sm text-zinc-400">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {shows.map((show) => (
        <ShowCard
          key={show.id}
          show={show}
          initialWatched={watchedShowIds.has(show.id)}
          matchScore={matchScoresById?.get(show.id)}
        />
      ))}
    </div>
  );
}
