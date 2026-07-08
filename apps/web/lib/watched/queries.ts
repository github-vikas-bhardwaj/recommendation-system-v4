import "server-only";

import { cookies } from "next/headers";

import { createClient } from "@/lib/db/supabase/server";
import { mapShowRow, type ShowRow } from "@/lib/shows/map-row";
import type { Show } from "@/lib/shows/types";

type WatchedShowRow = {
  show_id: number;
  shows: ShowRow | ShowRow[] | null;
};

export class WatchedQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WatchedQueryError";
  }
}

async function getSupabase() {
  return createClient(await cookies());
}

function extractShowRow(value: WatchedShowRow["shows"]): ShowRow | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getWatchedShowIds(): Promise<Set<number>> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.from("user_watched").select("show_id");

  if (error) {
    throw new WatchedQueryError(error.message);
  }

  return new Set((data ?? []).map((row) => row.show_id));
}

export async function isShowWatched(showId: number): Promise<boolean> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("user_watched")
    .select("show_id")
    .eq("show_id", showId)
    .maybeSingle();

  if (error) {
    throw new WatchedQueryError(error.message);
  }

  return data != null;
}

export async function listWatchedShows(): Promise<Show[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("user_watched")
    .select("show_id, shows(*)")
    .order("watched_at", { ascending: false });

  if (error) {
    throw new WatchedQueryError(error.message);
  }

  return ((data as WatchedShowRow[] | null) ?? [])
    .map((row) => extractShowRow(row.shows))
    .filter((row): row is ShowRow => row != null)
    .map(mapShowRow);
}
