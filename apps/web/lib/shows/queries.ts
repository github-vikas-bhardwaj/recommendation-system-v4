import "server-only";

import { cookies } from "next/headers";

import { createClient } from "@/lib/db/supabase/server";

import { getShowImageSrc, toDateString } from "./format";
import type { Show } from "./types";
import { SHOWS_PAGE_SIZE } from "./types";

type ShowRow = {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[] | null;
  status: string;
  premiered: string | null;
  ended: string | null;
  weight: number;
  image: string | null;
  summary: string;
};

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

function mapShowRow(row: ShowRow): Show {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    language: row.language,
    genres: row.genres ?? [],
    status: row.status,
    premiered: toDateString(row.premiered) ?? "",
    ended: toDateString(row.ended),
    weight: row.weight,
    image: { original: getShowImageSrc(row.image) },
    summary: row.summary,
  };
}

function escapeIlike(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

function buildSearchFilter(query: string): string {
  const escaped = escapeIlike(query.trim());
  return `name.ilike.%${escaped}%,summary.ilike.%${escaped}%`;
}

async function getSupabase() {
  return createClient(await cookies());
}

export async function getShowById(id: number): Promise<Show | null> {
  const supabase = await getSupabase();
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
  const supabase = await getSupabase();
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
