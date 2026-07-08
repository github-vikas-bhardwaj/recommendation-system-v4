import type { Show } from "./types";
import { SHOWS_PAGE_SIZE } from "./types";

export function paginateShows(shows: Show[], page: number) {
  const total = shows.length;
  const totalPages = Math.max(1, Math.ceil(total / SHOWS_PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * SHOWS_PAGE_SIZE;
  const items = shows.slice(start, start + SHOWS_PAGE_SIZE);

  return { items, currentPage, totalPages, total };
}
