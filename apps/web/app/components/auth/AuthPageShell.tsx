import type { ReactNode } from "react";

type AuthPageShellProps = {
  children: ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="mesh-bg flex flex-1 items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
