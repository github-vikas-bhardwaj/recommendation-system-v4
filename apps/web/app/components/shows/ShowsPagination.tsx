import Link from "next/link";

import { getPaginationRange } from "@/lib/shows/pagination";

type ShowsPaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: string;
};

function buildHref(page: number, query?: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/shows?${qs}` : "/shows";
}

export function ShowsPagination({
  currentPage,
  totalPages,
  query,
}: ShowsPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Shows pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={buildHref(Math.max(1, currentPage - 1), query)}
        aria-disabled={currentPage === 1}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          currentPage === 1
            ? "pointer-events-none text-zinc-600"
            : "text-zinc-300 hover:bg-white/5 hover:text-white"
        }`}
      >
        Previous
      </Link>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className="flex h-10 w-10 items-center justify-center text-sm text-zinc-500"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page, query)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
              page === currentPage
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1), query)}
        aria-disabled={currentPage === totalPages}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          currentPage === totalPages
            ? "pointer-events-none text-zinc-600"
            : "text-zinc-300 hover:bg-white/5 hover:text-white"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
