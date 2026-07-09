import { SkeletonBlock } from "@/app/components/ui/SkeletonBlock";

export function RecommendationPillSkeleton() {
  return (
    <div
      aria-hidden
      className="card-surface inline-flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-1.5"
    >
      <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />
      <SkeletonBlock className="h-4 w-24 rounded-full" />
      <SkeletonBlock className="h-7 w-7 shrink-0 rounded-full" />
    </div>
  );
}
