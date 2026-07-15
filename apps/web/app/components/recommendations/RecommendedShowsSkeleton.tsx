import { ShowCardGridSkeleton } from "@/app/components/shows/ShowCardGridSkeleton";

type RecommendedShowsSkeletonProps = {
  count?: number;
};

export function RecommendedShowsSkeleton({
  count = 8,
}: RecommendedShowsSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading recommendations">
      <ShowCardGridSkeleton count={count} />
    </div>
  );
}
