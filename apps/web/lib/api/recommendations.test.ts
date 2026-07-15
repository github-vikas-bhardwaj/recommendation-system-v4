import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { getAccessToken } = vi.hoisted(() => ({
  getAccessToken: vi.fn(async () => "test-token"),
}));

vi.mock("@/lib/auth/get-access-token", () => ({
  getAccessToken,
}));

import {
  fetchRecommendations,
  RecommendationApiError,
} from "./recommendations";

describe("fetchRecommendations", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("returns an empty list when showIds is empty", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchRecommendations([])).resolves.toEqual({
      recommendations: [],
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(getAccessToken).not.toHaveBeenCalled();
  });

  it("POSTs showIds with internal key and bearer token", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        recommendations: [
          { showId: 10, score: 98 },
          { showId: 20, score: 91 },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchRecommendations([1, 2])).resolves.toEqual({
      recommendations: [
        { showId: 10, score: 98 },
        { showId: 20, score: 91 },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/recommendations",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Internal-Api-Key": "test-internal-secret",
          Authorization: "Bearer test-token",
        }),
        body: JSON.stringify({ showIds: [1, 2] }),
      }),
    );
  });

  it("throws RecommendationApiError when the API responds with an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 401 })),
    );

    await expect(fetchRecommendations([1])).rejects.toBeInstanceOf(
      RecommendationApiError,
    );
  });
});
