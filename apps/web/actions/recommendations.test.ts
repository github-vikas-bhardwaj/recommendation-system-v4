import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  createClient,
  cookies,
  getOptionalUser,
  getWatchedShowIds,
  resolveRecommendations,
  getShowsByIds,
} = vi.hoisted(() => ({
  createClient: vi.fn(),
  cookies: vi.fn(async () => ({})),
  getOptionalUser: vi.fn(),
  getWatchedShowIds: vi.fn(),
  resolveRecommendations: vi.fn(),
  getShowsByIds: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies,
}));

vi.mock("@/lib/auth/require-user", () => ({
  getOptionalUser,
}));

vi.mock("@/lib/db/supabase/server", () => ({
  createClient,
}));

vi.mock("@/lib/watched/queries", () => ({
  getWatchedShowIds,
}));

vi.mock("@/lib/recommendations/resolve", () => ({
  resolveRecommendations,
}));

vi.mock("@/lib/shows/queries", () => ({
  getShowsByIds,
}));

import { getRecommendationsAction } from "./recommendations";

describe("getRecommendationsAction", () => {
  beforeEach(() => {
    getOptionalUser.mockResolvedValue({ id: "user-123" });
    createClient.mockReturnValue({});
    getWatchedShowIds.mockResolvedValue(new Set([1, 2]));
    resolveRecommendations.mockResolvedValue({
      recommendations: [{ showId: 10, score: 91 }],
      source: "cache",
    });
    getShowsByIds.mockResolvedValue([
      {
        id: 10,
        name: "Show Ten",
        type: "Scripted",
        language: "English",
        genres: ["Drama"],
        status: "Ended",
        premiered: "2020-01-01",
        ended: null,
        weight: 90,
        image: { original: null },
        summary: "Summary",
      },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthorized when signed out", async () => {
    getOptionalUser.mockResolvedValue(null);

    await expect(getRecommendationsAction()).resolves.toEqual({
      ok: false,
      error: "You must be signed in.",
    });
  });

  it("returns empty items when there is no watch history", async () => {
    getWatchedShowIds.mockResolvedValue(new Set());

    await expect(getRecommendationsAction()).resolves.toEqual({
      ok: true,
      items: [],
      source: "cache",
    });
    expect(resolveRecommendations).not.toHaveBeenCalled();
  });

  it("returns shows with scores from the resolver", async () => {
    const result = await getRecommendationsAction();

    expect(result).toEqual({
      ok: true,
      source: "cache",
      items: [
        expect.objectContaining({
          score: 91,
          show: expect.objectContaining({ id: 10, name: "Show Ten" }),
        }),
      ],
    });
    expect(resolveRecommendations).toHaveBeenCalled();
    expect(getShowsByIds).toHaveBeenCalledWith([10]);
  });
});
