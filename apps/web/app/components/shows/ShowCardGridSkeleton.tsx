import { SHOWS_PAGE_SIZE } from "@/lib/shows/types";

import { ShowCardSkeleton } from "./ShowCardSkeleton";

type ShowCardGridSkeletonProps = {
  count?: number;
};

export function ShowCardGridSkeleton({
  count = SHOWS_PAGE_SIZE,
}: ShowCardGridSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading shows"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ShowCardSkeleton key={index} />
      ))}
    </div>
  );
}
