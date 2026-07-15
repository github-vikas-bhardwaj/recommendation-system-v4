import { Suspense } from "react";

import { RecommendationPillList } from "@/app/components/recommendations/RecommendationPillList";
import { RecommendationsHeader } from "@/app/components/recommendations/RecommendationsHeader";
import { RecommendedShowsSection } from "@/app/components/recommendations/RecommendedShowsSection";
import { RecommendedShowsSkeleton } from "@/app/components/recommendations/RecommendedShowsSkeleton";
import { listWatchedShows } from "@/lib/watched/queries";

export async function RecommendationsPageContent() {
  const watchedShows = await listWatchedShows();
  const seedShowIds = watchedShows.map((show) => show.id);
  const watchedShowIds = new Set(seedShowIds);

  return (
    <>
      <RecommendationsHeader count={watchedShows.length} />

      <section aria-label="Watched shows" className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide text-zinc-300 uppercase">
          Watched
        </h2>
        <RecommendationPillList shows={watchedShows} />
      </section>

      <section aria-label="Recommended shows" className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium tracking-wide text-zinc-300 uppercase">
            For you
          </h2>
          <p className="text-sm text-zinc-500">
            Similar titles based on what you&apos;ve watched.
          </p>
        </div>
        <Suspense fallback={<RecommendedShowsSkeleton />}>
          <RecommendedShowsSection
            seedShowIds={seedShowIds}
            watchedShowIds={watchedShowIds}
          />
        </Suspense>
      </section>
    </>
  );
}
