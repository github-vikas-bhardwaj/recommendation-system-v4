import type { Show } from "./types";
import { SHOWS_PAGE_SIZE } from "./types";

export type PaginationItem = number | "ellipsis";

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  if (totalPages <= 1) return [];

  const totalVisible = siblingCount * 2 + 5;
  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PaginationItem[] = [];
  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  items.push(1);

  if (showLeftEllipsis) {
    items.push("ellipsis");
  } else {
    for (let page = 2; page < leftSibling; page += 1) {
      items.push(page);
    }
  }

  for (let page = leftSibling; page <= rightSibling; page += 1) {
    if (page !== 1 && page !== totalPages) {
      items.push(page);
    }
  }

  if (showRightEllipsis) {
    items.push("ellipsis");
  } else {
    for (let page = rightSibling + 1; page < totalPages; page += 1) {
      items.push(page);
    }
  }

  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
}

export function paginateShows(shows: Show[], page: number) {
  const total = shows.length;
  const totalPages = Math.max(1, Math.ceil(total / SHOWS_PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * SHOWS_PAGE_SIZE;
  const items = shows.slice(start, start + SHOWS_PAGE_SIZE);

  return { items, currentPage, totalPages, total };
}
