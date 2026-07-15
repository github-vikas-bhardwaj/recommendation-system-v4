import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export type CachedRecommendation = {
  showId: number;
  score: number;
};

export type RecommendationCache = {
  fingerprint: string;
  recommendations: CachedRecommendation[];
};

const cachedRecommendationSchema = z.object({
  showId: z.number().int().positive(),
  score: z.number().int().min(0).max(100),
});

const recommendationsJsonSchema = z.array(cachedRecommendationSchema);

type RecommendationCacheRow = {
  history_fingerprint: string;
  recommendations: unknown;
};

export class RecommendationCacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecommendationCacheError";
  }
}

export async function readRecommendationCache(
  supabase: SupabaseClient,
  userId: string,
): Promise<RecommendationCache | null> {
  const { data, error } = await supabase
    .from("user_recommendations")
    .select("history_fingerprint, recommendations")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new RecommendationCacheError(error.message);
  }

  if (!data) {
    return null;
  }

  const row = data as RecommendationCacheRow;
  const parsed = recommendationsJsonSchema.safeParse(row.recommendations);

  if (!parsed.success) {
    throw new RecommendationCacheError("Invalid recommendation cache payload.");
  }

  return {
    fingerprint: row.history_fingerprint,
    recommendations: parsed.data,
  };
}

export async function writeRecommendationCache(
  supabase: SupabaseClient,
  userId: string,
  fingerprint: string,
  recommendations: CachedRecommendation[],
): Promise<void> {
  const { error } = await supabase.from("user_recommendations").upsert(
    {
      user_id: userId,
      history_fingerprint: fingerprint,
      recommendations,
      computed_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new RecommendationCacheError(error.message);
  }
}
