import "server-only";

import type { RecommendationsResponse } from "@/lib/api/generated/recommendations.response";
import { recommendationResponseSchema } from "@/lib/api/generated/recommendations.response.schema";
import { getAccessToken } from "@/lib/auth/get-access-token";
import { serverEnv } from "@/lib/env/server";

export type { RecommendationsResponse };

export class RecommendationApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "RecommendationAPiError";
  }
}

export async function fetchRecommendations(
  showIds: number[],
): Promise<RecommendationsResponse> {
  if (showIds.length === 0) {
    return recommendationResponseSchema.parse({
      recommendations: [],
    });
  }

  const accessToken = await getAccessToken();

  const response = await fetch(`${serverEnv.apiUrl}/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Api-Key": serverEnv.apiInternalSecret,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ showIds }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new RecommendationApiError(
      `Recommendations API failed (${response.status})`,
      response.status,
    );
  }

  const data: unknown = await response.json();
  return recommendationResponseSchema.parse(data);
}
