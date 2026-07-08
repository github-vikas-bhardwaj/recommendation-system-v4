"use client";

import { useTransition } from "react";

import { setWatchedAction } from "@/actions/watched";
import { ShowPoster } from "@/app/components/shows/ShowPoster";
import type { Show } from "@/lib/shows/types";

type RecommendationPillProps = {
  show: Show;
};

export function RecommendationPill({ show }: RecommendationPillProps) {
  const [pending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await setWatchedAction(show.id, false);
    });
  };

  return (
    <article
      className={`card-surface group inline-flex max-w-full items-center gap-2 rounded-full py-1.5 pr-1.5 pl-1.5 transition hover:border-violet-400/30 hover:bg-white/[0.06] ${
        pending ? "opacity-60" : ""
      }`}
    >
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10">
        <ShowPoster src={show.image.original} alt="" sizes="36px" compact />
      </div>
      <span className="truncate text-sm font-medium text-white">
        {show.name}
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={handleRemove}
        aria-label={`Remove ${show.name} from watched shows`}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed"
      >
        <span aria-hidden className="text-base leading-none">
          ×
        </span>
      </button>
    </article>
  );
}
