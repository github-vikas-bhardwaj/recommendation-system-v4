import type { Show } from "@/lib/shows/types";

import { RecommendationPill } from "./RecommendationPill";

type RecommendationPillListProps = {
  shows: Show[];
};

export function RecommendationPillList({ shows }: RecommendationPillListProps) {
  if (shows.length === 0) {
    return (
      <div className="card-surface rounded-2xl px-6 py-14 text-center">
        <p className="text-lg font-medium text-white">No watched shows yet</p>
        <p className="mt-2 text-sm text-zinc-400">
          Mark shows as watched on the catalog to build your list.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-wrap gap-3">
      {shows.map((show) => (
        <li key={show.id}>
          <RecommendationPill show={show} />
        </li>
      ))}
    </ul>
  );
}
