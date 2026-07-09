import { SkeletonBlock } from "@/app/components/ui/SkeletonBlock";

import { ShowCardGridSkeleton } from "./ShowCardGridSkeleton";

export function ShowsResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading shows" className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-4 w-28" />
      </div>

      <ShowCardGridSkeleton />

      <div className="flex flex-wrap items-center justify-center gap-2">
        <SkeletonBlock className="h-10 w-20 rounded-full" />
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <SkeletonBlock className="h-10 w-20 rounded-full" />
      </div>
    </div>
  );
}
