import type { ReactNode } from "react";

type ShowsPageShellProps = {
  children: ReactNode;
};

export function ShowsPageShell({ children }: ShowsPageShellProps) {
  return <main className="mesh-bg flex-1 px-4 py-10 sm:px-6">{children}</main>;
}
