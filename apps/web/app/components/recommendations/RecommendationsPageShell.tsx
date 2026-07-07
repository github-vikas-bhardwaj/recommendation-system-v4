import type { ReactNode } from "react";

type RecommendationsPageShellProps = {
  children: ReactNode;
};

export function RecommendationsPageShell({
  children,
}: RecommendationsPageShellProps) {
  return <main className="mesh-bg flex-1 px-4 py-10 sm:px-6">{children}</main>;
}
