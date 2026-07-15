import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { fetchRecommendations } from "@/lib/api/recommendations";

import {
  type CachedRecommendation,
  readRecommendationCache,
  writeRecommendationCache,
} from "./cache";
import { watchHistoryFingerprint } from "./fingerprint";

export type ResolveRecommendationsResult = {
  recommendations: CachedRecommendation[];
  source: "cache" | "api";
};

/**
 * Returns cached recommendations when the watch-history fingerprint matches;
 * otherwise calls FastAPI and rewrites the cache.
 */
export async function resolveRecommendations(
  supabase: SupabaseClient,
  userId: string,
  watchedShowIds: number[],
): Promise<ResolveRecommendationsResult> {
  const fingerprint = watchHistoryFingerprint(watchedShowIds);

  if (watchedShowIds.length === 0) {
    return { recommendations: [], source: "cache" };
  }

  const cached = await readRecommendationCache(supabase, userId);
  if (cached && cached.fingerprint === fingerprint) {
    return { recommendations: cached.recommendations, source: "cache" };
  }

  const result = await fetchRecommendations(watchedShowIds);
  const recommendations = result.recommendations.map((item) => ({
    showId: item.showId,
    score: item.score,
  }));

  await writeRecommendationCache(
    supabase,
    userId,
    fingerprint,
    recommendations,
  );

  return { recommendations, source: "api" };
}
