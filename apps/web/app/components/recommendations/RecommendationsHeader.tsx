type RecommendationsHeaderProps = {
  count: number;
};

export function RecommendationsHeader({ count }: RecommendationsHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-medium tracking-widest text-violet-300 uppercase">
        Watch history
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Recommendations
      </h1>
      <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
        Shows you&apos;ve marked as watched. We&apos;ll use this list to shape
        future picks — {count} title{count === 1 ? "" : "s"} right now.
      </p>
    </header>
  );
}
