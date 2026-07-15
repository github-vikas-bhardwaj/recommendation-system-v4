import { SkeletonBlock } from "@/app/components/ui/SkeletonBlock";

import { RecommendationPillSkeleton } from "./RecommendationPillSkeleton";

const PILL_SKELETON_COUNT = 10;

export function RecommendationsPageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading recommendations"
      className="mx-auto max-w-7xl space-y-8"
    >
      <header className="space-y-2">
        <p className="text-xs font-medium tracking-widest text-violet-300 uppercase">
          Watch history
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Recommendations
        </h1>
        <SkeletonBlock className="h-4 w-full max-w-2xl" />
      </header>

      <section className="space-y-4">
        <SkeletonBlock className="h-4 w-20" />
        <ul className="flex flex-wrap gap-3">
          {Array.from({ length: PILL_SKELETON_COUNT }).map((_, index) => (
            <li key={index}>
              <RecommendationPillSkeleton />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-4 w-64 max-w-full" />
          </div>
          <SkeletonBlock className="h-11 w-full rounded-full sm:w-48" />
        </div>
        <SkeletonBlock className="h-4 w-72 max-w-full" />
      </section>
    </div>
  );
}
