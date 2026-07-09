type SkeletonBlockProps = {
  className?: string;
};

export function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-lg bg-white/10 ${className}`}
    />
  );
}
