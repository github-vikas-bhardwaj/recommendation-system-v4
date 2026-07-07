import Image from "next/image";
import Link from "next/link";

import { stripHtml } from "@/lib/shows/mock-shows";
import type { Show } from "@/lib/shows/types";

import { WatchedToggle } from "./WatchedToggle";

type ShowDetailHeroProps = {
  show: Show;
};

export function ShowDetailHero({ show }: ShowDetailHeroProps) {
  const summary = stripHtml(show.summary);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
      <div className="absolute inset-0">
        <Image
          src={show.image.original}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30 blur-sm"
          aria-hidden
        />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/70" />
      </div>

      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[220px_1fr]">
        <div className="relative mx-auto aspect-2/3 w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
          <Image
            src={show.image.original}
            alt={show.name}
            fill
            priority
            sizes="220px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <Link
            href="/shows"
            className="mb-4 text-sm font-medium text-violet-300 transition hover:text-violet-200"
          >
            ← Back to shows
          </Link>
          <p className="text-xs font-medium tracking-widest text-violet-300 uppercase">
            {show.type} · {show.language}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {show.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            {summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {show.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200"
              >
                {genre}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <WatchedToggle showId={show.id} showName={show.name} />
            <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-zinc-500">Status</dt>
                <dd className="font-medium text-white">{show.status}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Premiered</dt>
                <dd className="font-medium text-white">{show.premiered}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Ended</dt>
                <dd className="font-medium text-white">{show.ended ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Weight</dt>
                <dd className="font-medium text-white">{show.weight}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
