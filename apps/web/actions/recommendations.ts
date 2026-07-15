"use server";

import { cookies } from "next/headers";

import { getOptionalUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/db/supabase/server";
import { resolveRecommendations } from "@/lib/recommendations/resolve";
import { getShowsByIds } from "@/lib/shows/queries";
import type { Show } from "@/lib/shows/types";
import { getWatchedShowIds } from "@/lib/watched/queries";

export type RecommendedShowItem = {
  show: Show;
  score: number;
};

export type GetRecommendationsActionResult =
  | { ok: true; items: RecommendedShowItem[]; source: "cache" | "api" }
  | { ok: false; error: string };

export async function getRecommendationsAction(): Promise<GetRecommendationsActionResult> {
  const user = await getOptionalUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const watchedShowIds = [...(await getWatchedShowIds())];

  if (watchedShowIds.length === 0) {
    return { ok: true, items: [], source: "cache" };
  }

  try {
    const supabase = createClient(await cookies());
    const { recommendations, source } = await resolveRecommendations(
      supabase,
      user.id,
      watchedShowIds,
    );

    const shows = await getShowsByIds(
      recommendations.map((item) => item.showId),
    );
    const scoreById = new Map(
      recommendations.map((item) => [item.showId, item.score]),
    );

    const items = shows.flatMap((show) => {
      const score = scoreById.get(show.id);
      if (score == null) return [];
      return [{ show, score }];
    });

    return { ok: true, items, source };
  } catch (error) {
    console.error("[getRecommendationsAction]", error);
    return {
      ok: false,
      error: "Could not load recommendations. Try again in a moment.",
    };
  }
}
