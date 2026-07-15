import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { readRecommendationCache, writeRecommendationCache } from "./cache";

describe("recommendation cache", () => {
  const maybeSingle = vi.fn();
  const upsert = vi.fn();
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select, upsert }));

  const supabase = { from } as never;

  beforeEach(() => {
    vi.clearAllMocks();
    from.mockReturnValue({ select, upsert });
    select.mockReturnValue({ eq });
    eq.mockReturnValue({ maybeSingle });
  });

  it("returns null when no cache row exists", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });

    await expect(
      readRecommendationCache(supabase, "user-1"),
    ).resolves.toBeNull();
  });

  it("reads fingerprint and recommendations", async () => {
    maybeSingle.mockResolvedValue({
      data: {
        history_fingerprint: "abc",
        recommendations: [{ showId: 10, score: 88 }],
      },
      error: null,
    });

    await expect(readRecommendationCache(supabase, "user-1")).resolves.toEqual({
      fingerprint: "abc",
      recommendations: [{ showId: 10, score: 88 }],
    });
  });

  it("upserts cache for the user", async () => {
    upsert.mockResolvedValue({ error: null });

    await writeRecommendationCache(supabase, "user-1", "fp", [
      { showId: 5, score: 91 },
    ]);

    expect(from).toHaveBeenCalledWith("user_recommendations");
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        history_fingerprint: "fp",
        recommendations: [{ showId: 5, score: 91 }],
      }),
      { onConflict: "user_id" },
    );
  });
});
