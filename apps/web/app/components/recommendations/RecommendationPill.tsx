import Link from "next/link";

import { unwatchShowAction } from "@/actions/watched";
import { ShowPoster } from "@/app/components/shows/ShowPoster";
import type { Show } from "@/lib/shows/types";

import { RecommendationPillRemoveButton } from "./RecommendationPillRemoveButton";

type RecommendationPillProps = {
  show: Show;
};

export function RecommendationPill({ show }: RecommendationPillProps) {
  const unwatch = unwatchShowAction.bind(null, show.id);

  return (
    <article className="card-surface group inline-flex max-w-full items-center gap-2 rounded-full py-1.5 pr-1.5 pl-1.5 transition hover:border-violet-400/30 hover:bg-white/[0.06]">
      <Link
        href={`/shows/${show.id}`}
        className="flex min-w-0 items-center gap-2"
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10">
          <ShowPoster src={show.image.original} alt="" sizes="36px" compact />
        </div>
        <span className="truncate text-sm font-medium text-white">
          {show.name}
        </span>
      </Link>
      <form action={unwatch}>
        <RecommendationPillRemoveButton showName={show.name} />
      </form>
    </article>
  );
}
