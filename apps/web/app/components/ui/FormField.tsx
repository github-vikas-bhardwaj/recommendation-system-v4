import type { InputHTMLAttributes, ReactNode } from "react";

type FormFieldProps = {
  label: string;
  id: string;
  hint?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({
  label,
  id,
  hint,
  className = "",
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition placeholder:text-zinc-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20 focus:outline-none ${className}`}
        {...props}
      />
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}
