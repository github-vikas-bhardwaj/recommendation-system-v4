import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variantStyles = {
  primary:
    "bg-violet-600 text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500",
  secondary:
    "border border-white/15 bg-white/5 text-zinc-100 hover:border-violet-400/40 hover:bg-white/10",
  ghost: "text-zinc-300 hover:bg-white/5 hover:text-white",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
