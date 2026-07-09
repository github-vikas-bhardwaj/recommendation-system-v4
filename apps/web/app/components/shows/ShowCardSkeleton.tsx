import { SkeletonBlock } from "@/app/components/ui/SkeletonBlock";

export function ShowCardSkeleton() {
  return (
    <article
      aria-hidden
      className="card-surface flex flex-col overflow-hidden rounded-2xl"
    >
      <SkeletonBlock className="aspect-2/3 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <SkeletonBlock className="h-6 w-3/4" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </article>
  );
}
