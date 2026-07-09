"use client";

import { useFormStatus } from "react-dom";

import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

type WatchedToggleSubmitProps = {
  ariaLabel: string;
  watched: boolean;
};

export function WatchedToggleSubmit({
  ariaLabel,
  watched,
}: WatchedToggleSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      aria-pressed={watched}
      aria-busy={pending}
      className="flex cursor-pointer items-center gap-2.5 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="text-xs font-medium text-zinc-400">Watched</span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center justify-center rounded-full transition ${
          watched ? "bg-violet-600" : "bg-white/10"
        }`}
      >
        {pending ? (
          <LoadingSpinner size="sm" label="Updating watched status" />
        ) : (
          <span
            className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
              watched ? "translate-x-5" : ""
            }`}
          />
        )}
      </span>
    </button>
  );
}
