import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getShowById, listShows, type ListShowsResult } from "./queries";
import type { Show } from "./types";

export type { ListShowsResult };

export async function listShowsCached(
  query: string,
  page: number,
): Promise<ListShowsResult> {
  "use cache";
  cacheLife("hours");
  cacheTag("shows");

  return listShows({ query, page });
}

export async function getShowByIdCached(id: number): Promise<Show | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("shows");

  return getShowById(id);
}
