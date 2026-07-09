"use client";

import { useFormStatus } from "react-dom";

import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

export function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
    >
      Log out
      {pending ? <LoadingSpinner size="sm" label="Logging out" /> : null}
    </button>
  );
}
