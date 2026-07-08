import type { ButtonHTMLAttributes, ReactNode } from "react";

type FormButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles = {
  primary:
    "bg-violet-600 text-white shadow-lg shadow-violet-900/40 hover:bg-violet-500",
  secondary:
    "border border-white/15 bg-white/5 text-zinc-100 hover:border-violet-400/40 hover:bg-white/10",
} as const;

export function FormButton({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: FormButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
