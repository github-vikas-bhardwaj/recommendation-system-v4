import type { Metadata } from "next";

import { ShowCardGrid } from "@/app/components/shows/ShowCardGrid";
import { ShowsPageShell } from "@/app/components/shows/ShowsPageShell";
import { ShowsPagination } from "@/app/components/shows/ShowsPagination";
import { ShowsSearchBar } from "@/app/components/shows/ShowsSearchBar";
import { listShows } from "@/lib/shows/queries";
import { SHOWS_PAGE_SIZE } from "@/lib/shows/types";
import { getWatchedShowIds } from "@/lib/watched/queries";

export const metadata: Metadata = {
  title: "Shows — ReelMind",
  description: "Browse and search movies and TV shows.",
};

type ShowsPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};

export default async function ShowsPage({ searchParams }: ShowsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Number(params.page ?? "1");
  const [{ items, currentPage, totalPages, total }, watchedShowIds] =
    await Promise.all([
      listShows({
        query,
        page: Number.isFinite(page) ? page : 1,
      }),
      getWatchedShowIds(),
    ]);

  const start = total === 0 ? 0 : (currentPage - 1) * SHOWS_PAGE_SIZE + 1;
  const end = Math.min(currentPage * SHOWS_PAGE_SIZE, total);

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
          <ShowsSearchBar defaultQuery={query} />
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            {total === 0
              ? "No results"
              : `Showing ${start}–${end} of ${total} show${total === 1 ? "" : "s"}`}
            {query ? (
              <>
                {" "}
                for <span className="text-zinc-300">&quot;{query}&quot;</span>
              </>
            ) : null}
          </p>
          <p className="text-sm text-zinc-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <ShowCardGrid shows={items} watchedShowIds={watchedShowIds} />
        <ShowsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          query={query || undefined}
        />
      </div>
    </ShowsPageShell>
  );
}
