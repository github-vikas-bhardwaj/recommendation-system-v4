import Image from "next/image";

import type { Show } from "@/lib/shows/types";

type RecommendationPillProps = {
  show: Show;
};

export function RecommendationPill({ show }: RecommendationPillProps) {
  return (
    <article className="card-surface group inline-flex max-w-full items-center gap-2 rounded-full py-1.5 pr-1.5 pl-1.5 transition hover:border-violet-400/30 hover:bg-white/[0.06]">
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10">
        <Image
          src={show.image.original}
          alt=""
          fill
          sizes="36px"
          className="object-cover"
        />
      </div>
      <span className="truncate text-sm font-medium text-white">
        {show.name}
      </span>
      <button
        type="button"
        aria-label={`Remove ${show.name} from recommendations`}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
      >
        <span aria-hidden className="text-base leading-none">
          ×
        </span>
      </button>
    </article>
  );
}
