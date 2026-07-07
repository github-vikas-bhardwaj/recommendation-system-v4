import Image from "next/image";
import Link from "next/link";

import { stripHtml } from "@/lib/shows/mock-shows";
import type { Show } from "@/lib/shows/types";

import { WatchedToggle } from "./WatchedToggle";

type ShowCardProps = {
  show: Show;
};

export function ShowCard({ show }: ShowCardProps) {
  const summary = stripHtml(show.summary);
  const detailHref = `/shows/${show.id}`;

  return (
    <article className="card-surface group flex flex-col overflow-hidden rounded-2xl transition hover:border-violet-400/25 hover:bg-white/[0.06]">
      <div className="relative aspect-2/3 overflow-hidden bg-zinc-900">
        <Image
          src={show.image.original}
          alt={show.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4 pt-16">
          <div className="flex flex-wrap gap-1.5">
            {show.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-200"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <Link href={detailHref}>
            <h2 className="line-clamp-1 text-lg font-semibold text-white transition hover:text-violet-300">
              {show.name}
            </h2>
          </Link>
          <Link href={detailHref}>
            <p className="line-clamp-3 text-sm leading-6 text-zinc-400 transition hover:text-zinc-300">
              {summary}
            </p>
          </Link>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/5 pt-3">
          <span className="text-xs text-zinc-500">{show.status}</span>
          <WatchedToggle showId={show.id} showName={show.name} />
        </div>
      </div>
    </article>
  );
}
