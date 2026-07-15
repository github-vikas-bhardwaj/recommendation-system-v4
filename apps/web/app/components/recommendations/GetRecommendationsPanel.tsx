"use client";

import { useState, useTransition } from "react";

import {
  getRecommendationsAction,
  type RecommendedShowItem,
} from "@/actions/recommendations";
import { RecommendedShowsSkeleton } from "@/app/components/recommendations/RecommendedShowsSkeleton";
import { ShowCardGrid } from "@/app/components/shows/ShowCardGrid";
import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

type GetRecommendationsPanelProps = {
  watchedShowIds: number[];
};

export function GetRecommendationsPanel({
  watchedShowIds,
}: GetRecommendationsPanelProps) {
  const [items, setItems] = useState<RecommendedShowItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const hasWatched = watchedShowIds.length > 0;
  const watchedSet = new Set(watchedShowIds);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await getRecommendationsAction();
      if (!result.ok) {
        setItems(null);
        setError(result.error);
        return;
      }
      setItems(result.items);
    });
  }

  const matchScoresById = new Map(
    (items ?? []).map((item) => [item.show.id, item.score]),
  );
  const shows = (items ?? []).map((item) => item.show);

  return (
    <section aria-label="Recommended shows" className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-medium tracking-wide text-zinc-300 uppercase">
            For you
          </h2>
          <p className="text-sm text-zinc-500">
            Similar titles based on what you&apos;ve watched.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={!hasWatched || pending}
          aria-busy={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {pending ? (
            <>
              Getting recommendations
              <LoadingSpinner size="sm" label="Loading recommendations" />
            </>
          ) : (
            "Get recommendations"
          )}
        </button>
      </div>

      {!hasWatched ? (
        <ShowCardGrid
          shows={[]}
          watchedShowIds={watchedSet}
          emptyTitle="No recommendations yet"
          emptyDescription="Mark a few shows as watched, then get recommendations."
        />
      ) : null}

      {hasWatched && pending ? <RecommendedShowsSkeleton /> : null}

      {hasWatched && !pending && error ? (
        <ShowCardGrid
          shows={[]}
          watchedShowIds={watchedSet}
          emptyTitle="Recommendations unavailable"
          emptyDescription={error}
        />
      ) : null}

      {hasWatched && !pending && !error && items != null ? (
        <ShowCardGrid
          shows={shows}
          watchedShowIds={watchedSet}
          matchScoresById={matchScoresById}
          emptyTitle="No recommendations yet"
          emptyDescription="We couldn't find similar titles. Watch a few more shows and try again."
        />
      ) : null}

      {hasWatched && !pending && !error && items == null ? (
        <p className="text-sm text-zinc-500">
          Press Get recommendations when you&apos;re ready for picks.
        </p>
      ) : null}
    </section>
  );
}
