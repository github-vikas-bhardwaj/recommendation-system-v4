import type { InputHTMLAttributes, ReactNode } from "react";

type FormFieldProps = {
  label: string;
  id: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({
  label,
  id,
  hint,
  error,
  required = false,
  className = "",
  "aria-describedby": ariaDescribedBy,
  ...props
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [errorId, hintId, ariaDescribedBy].filter(Boolean).join(" ") || undefined;

  const inputStyles = error
    ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
    : "border-white/10 focus:border-violet-400/50 focus:ring-violet-500/20";

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
        {label}
        {required ? (
          <span className="text-red-400" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white transition placeholder:text-zinc-500 focus:ring-2 focus:outline-none ${inputStyles} ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-xs text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
