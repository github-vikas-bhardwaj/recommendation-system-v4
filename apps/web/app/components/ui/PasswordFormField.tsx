"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "./PasswordVisibilityIcons";

type PasswordFormFieldProps = {
  label: string;
  id: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordFormField({
  label,
  id,
  hint,
  error,
  required = false,
  className = "",
  "aria-describedby": ariaDescribedBy,
  ...props
}: PasswordFormFieldProps) {
  const [visible, setVisible] = useState(false);

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
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-xl border bg-white/5 py-3 pr-11 pl-4 text-sm text-white transition placeholder:text-zinc-500 focus:ring-2 focus:outline-none ${inputStyles} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition hover:text-white"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
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
