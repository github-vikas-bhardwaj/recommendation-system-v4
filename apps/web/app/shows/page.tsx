import type { Metadata } from "next";
import { Suspense } from "react";

import { ShowsPageContent } from "@/app/components/shows/ShowsPageContent";
import { ShowsPageShell } from "@/app/components/shows/ShowsPageShell";
import { ShowsResultsSkeleton } from "@/app/components/shows/ShowsResultsSkeleton";

export const metadata: Metadata = {
  title: "Shows — ReelMind",
  description: "Browse and search movies and TV shows.",
};

type ShowsPageProps = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default function ShowsPage({ searchParams }: ShowsPageProps) {
  return (
    <ShowsPageShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-4">
          <div>
            <p className="text-xs font-medium tracking-widest text-violet-300 uppercase">
              Browse
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Movies &amp; Shows
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Search your catalog, track what you&apos;ve watched, and dive into
              show details.
            </p>
          </div>
        </header>
        <Suspense fallback={<ShowsResultsSkeleton />}>
          <ShowsPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </ShowsPageShell>
  );
}
