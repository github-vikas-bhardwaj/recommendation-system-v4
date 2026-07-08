import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
};

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="card-surface overflow-hidden rounded-3xl p-8 shadow-2xl shadow-violet-950/30 sm:p-10">
      {children}
    </div>
  );
}
