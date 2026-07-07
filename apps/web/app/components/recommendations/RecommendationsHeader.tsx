type RecommendationsHeaderProps = {
  count: number;
};

export function RecommendationsHeader({ count }: RecommendationsHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-medium tracking-widest text-violet-300 uppercase">
        For you
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Recommendations
      </h1>
      <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
        Your curated picks based on taste and watch history. Remove anything
        that doesn&apos;t fit — {count} title{count === 1 ? "" : "s"} right now.
      </p>
    </header>
  );
}
