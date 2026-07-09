"use client";

import { useFormStatus } from "react-dom";

import { LoadingSpinner } from "@/app/components/ui/LoadingSpinner";

type RecommendationPillRemoveButtonProps = {
  showName: string;
};

export function RecommendationPillRemoveButton({
  showName,
}: RecommendationPillRemoveButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Remove ${showName} from watched shows`}
      aria-busy={pending}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <LoadingSpinner size="sm" label={`Removing ${showName}`} />
      ) : (
        <span aria-hidden className="text-base leading-none">
          ×
        </span>
      )}
    </button>
  );
}
