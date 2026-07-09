import { SkeletonBlock } from "@/app/components/ui/SkeletonBlock";

export function ShowDetailHeroSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading show details"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
    >
      <div className="absolute inset-0">
        <SkeletonBlock className="h-full w-full rounded-none" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/70" />
      </div>

      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[220px_1fr]">
        <div className="mx-auto aspect-2/3 w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
          <SkeletonBlock className="h-full w-full rounded-none" />
        </div>

        <div className="flex flex-col justify-center">
          <SkeletonBlock className="mb-4 h-4 w-28" />
          <SkeletonBlock className="h-3 w-36" />
          <SkeletonBlock className="mt-3 h-10 w-3/4 max-w-md" />
          <div className="mt-4 space-y-2">
            <SkeletonBlock className="h-4 w-full max-w-3xl" />
            <SkeletonBlock className="h-4 w-full max-w-3xl" />
            <SkeletonBlock className="h-4 w-2/3 max-w-2xl" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <SkeletonBlock className="h-7 w-16 rounded-full" />
            <SkeletonBlock className="h-7 w-20 rounded-full" />
            <SkeletonBlock className="h-7 w-14 rounded-full" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <SkeletonBlock className="h-6 w-24 rounded-full" />
            <dl className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-4 w-20" />
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
