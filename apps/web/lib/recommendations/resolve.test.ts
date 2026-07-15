import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const {
  fetchRecommendations,
  readRecommendationCache,
  writeRecommendationCache,
} = vi.hoisted(() => ({
  fetchRecommendations: vi.fn(),
  readRecommendationCache: vi.fn(),
  writeRecommendationCache: vi.fn(),
}));

vi.mock("@/lib/api/recommendations", () => ({
  fetchRecommendations,
}));

vi.mock("./cache", async () => {
  const actual = await vi.importActual<typeof import("./cache")>("./cache");
  return {
    ...actual,
    readRecommendationCache,
    writeRecommendationCache,
  };
});

import { watchHistoryFingerprint } from "./fingerprint";
import { resolveRecommendations } from "./resolve";

describe("resolveRecommendations", () => {
  const supabase = {} as never;

  beforeEach(() => {
    vi.clearAllMocks();
    writeRecommendationCache.mockResolvedValue(undefined);
  });

  it("returns cache when fingerprint matches", async () => {
    const watched = [2, 1];
    const fingerprint = watchHistoryFingerprint(watched);
    readRecommendationCache.mockResolvedValue({
      fingerprint,
      recommendations: [{ showId: 99, score: 80 }],
    });

    const result = await resolveRecommendations(supabase, "user-1", watched);

    expect(result).toEqual({
      recommendations: [{ showId: 99, score: 80 }],
      source: "cache",
    });
    expect(fetchRecommendations).not.toHaveBeenCalled();
    expect(writeRecommendationCache).not.toHaveBeenCalled();
  });

  it("calls the API and rewrites cache on miss", async () => {
    readRecommendationCache.mockResolvedValue({
      fingerprint: "old-fingerprint",
      recommendations: [{ showId: 1, score: 50 }],
    });
    fetchRecommendations.mockResolvedValue({
      recommendations: [{ showId: 42, score: 95 }],
    });

    const watched = [7, 8];
    const result = await resolveRecommendations(supabase, "user-1", watched);

    expect(result).toEqual({
      recommendations: [{ showId: 42, score: 95 }],
      source: "api",
    });
    expect(fetchRecommendations).toHaveBeenCalledWith(watched);
    expect(writeRecommendationCache).toHaveBeenCalledWith(
      supabase,
      "user-1",
      watchHistoryFingerprint(watched),
      [{ showId: 42, score: 95 }],
    );
  });

  it("calls the API when there is no cache row", async () => {
    readRecommendationCache.mockResolvedValue(null);
    fetchRecommendations.mockResolvedValue({
      recommendations: [{ showId: 3, score: 70 }],
    });

    const result = await resolveRecommendations(supabase, "user-1", [1]);

    expect(result.source).toBe("api");
    expect(fetchRecommendations).toHaveBeenCalled();
  });
});
