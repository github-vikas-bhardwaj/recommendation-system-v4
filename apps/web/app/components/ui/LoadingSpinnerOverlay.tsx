import type { ReactNode } from "react";

import { LoadingSpinner } from "./LoadingSpinner";

type LoadingSpinnerOverlayProps = {
  label?: string;
  children?: ReactNode;
};

/** Centered spinner for page/section loading states. */
export function LoadingSpinnerOverlay({
  label = "Loading",
  children,
}: LoadingSpinnerOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <LoadingSpinner size="lg" label={label} />
      <p className="text-sm text-zinc-400">{children ?? label}</p>
    </div>
  );
}
