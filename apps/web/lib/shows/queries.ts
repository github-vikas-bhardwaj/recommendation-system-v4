import "server-only";

import { createAdminClient } from "@/lib/db/supabase/admin";

import { mapShowRow, type ShowRow } from "./map-row";
import type { Show } from "./types";
import { SHOWS_PAGE_SIZE } from "./types";

export type ListShowsResult = {
  items: Show[];
  currentPage: number;
  totalPages: number;
  total: number;
};

export class ShowsQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShowsQueryError";
  }
}

function escapeIlike(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

function buildSearchFilter(query: string): string {
  const escaped = escapeIlike(query.trim());
  return `name.ilike.%${escaped}%,summary.ilike.%${escaped}%`;
}

function getSupabase() {
  return createAdminClient();
}

export async function getShowById(id: number): Promise<Show | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("shows")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new ShowsQueryError(error.message);
  }

  if (!data) {
    return null;
  }

  return mapShowRow(data as ShowRow);
}

/** Fetch shows by IDs, preserving the input order (missing IDs are skipped). */
export async function getShowsByIds(ids: number[]): Promise<Show[]> {
  if (ids.length === 0) {
    return [];
  }

  const uniqueIds = [...new Set(ids)];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("shows")
    .select("*")
    .in("id", uniqueIds);

  if (error) {
    throw new ShowsQueryError(error.message);
  }

  const byId = new Map(
    (data ?? []).map((row) => {
      const show = mapShowRow(row as ShowRow);
      return [show.id, show] as const;
    }),
  );

  return ids.flatMap((id) => {
    const show = byId.get(id);
    return show ? [show] : [];
  });
}

type ListShowsOptions = {
  query?: string;
  page?: number;
  pageSize?: number;
};

export async function listShows({
  query = "",
  page = 1,
  pageSize = SHOWS_PAGE_SIZE,
}: ListShowsOptions = {}): Promise<ListShowsResult> {
  const supabase = getSupabase();
  const normalizedQuery = query.trim();
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let request = supabase
    .from("shows")
    .select("*", { count: "exact" })
    .order("weight", { ascending: false })
    .order("name", { ascending: true });

  if (normalizedQuery) {
    request = request.or(buildSearchFilter(normalizedQuery));
  }

  const { data, error, count } = await request.range(from, to);

  if (error) {
    throw new ShowsQueryError(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(safePage, totalPages);

  return {
    items: (data ?? []).map((row) => mapShowRow(row as ShowRow)),
    currentPage,
    totalPages,
    total,
  };
}
