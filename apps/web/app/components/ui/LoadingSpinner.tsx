type LoadingSpinnerSize = "sm" | "md" | "lg";

type LoadingSpinnerProps = {
  size?: LoadingSpinnerSize;
  label?: string;
  className?: string;
};

const sizeStyles: Record<LoadingSpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function LoadingSpinner({
  size = "md",
  label = "Loading",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-block shrink-0 animate-spin rounded-full border-violet-400/25 border-t-violet-400 ${sizeStyles[size]} ${className}`}
    />
  );
}
