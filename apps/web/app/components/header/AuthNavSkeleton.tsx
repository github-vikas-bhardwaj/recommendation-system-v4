import { SkeletonBlock } from "@/app/components/ui/SkeletonBlock";

export function AuthNavSkeleton() {
  return (
    <nav
      aria-label="Account"
      aria-busy="true"
      className="flex items-center gap-1"
    >
      <SkeletonBlock className="h-9 w-16 rounded-full" />
      <SkeletonBlock className="h-9 w-28 rounded-full" />
      <SkeletonBlock className="h-9 w-20 rounded-full" />
    </nav>
  );
}
