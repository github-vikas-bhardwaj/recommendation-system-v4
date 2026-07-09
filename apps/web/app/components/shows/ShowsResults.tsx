import { ShowCardGrid } from "@/app/components/shows/ShowCardGrid";
import { ShowsPagination } from "@/app/components/shows/ShowsPagination";
import { listShows } from "@/lib/shows/queries";
import { SHOWS_PAGE_SIZE } from "@/lib/shows/types";
import { getWatchedShowIds } from "@/lib/watched/queries";

type ShowsResultsProps = {
  query: string;
  page: number;
};

export async function ShowsResults({ query, page }: ShowsResultsProps) {
  const [{ items, currentPage, totalPages, total }, watchedShowIds] =
    await Promise.all([listShows({ query, page }), getWatchedShowIds()]);

  const start = total === 0 ? 0 : (currentPage - 1) * SHOWS_PAGE_SIZE + 1;
  const end = Math.min(currentPage * SHOWS_PAGE_SIZE, total);

  return (
    <>
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
    </>
  );
}
