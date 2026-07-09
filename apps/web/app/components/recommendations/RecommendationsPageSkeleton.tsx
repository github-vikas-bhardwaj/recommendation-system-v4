import { SkeletonBlock } from "@/app/components/ui/SkeletonBlock";

import { RecommendationPillSkeleton } from "./RecommendationPillSkeleton";

const PILL_SKELETON_COUNT = 10;

export function RecommendationsPageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading recommendations"
      className="mx-auto max-w-5xl space-y-8"
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

      <ul className="flex flex-wrap gap-3">
        {Array.from({ length: PILL_SKELETON_COUNT }).map((_, index) => (
          <li key={index}>
            <RecommendationPillSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
