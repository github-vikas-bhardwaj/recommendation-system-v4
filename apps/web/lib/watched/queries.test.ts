import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { createClient, cookies } = vi.hoisted(() => ({
  createClient: vi.fn(),
  cookies: vi.fn(async () => ({})),
}));

vi.mock("next/headers", () => ({
  cookies,
}));

vi.mock("@/lib/db/supabase/server", () => ({
  createClient,
}));

import { getWatchedShowIds, listWatchedShows } from "./queries";

const sampleRow = {
  id: 1,
  name: "Under the Dome",
  type: "Scripted",
  language: "English",
  genres: ["Drama"],
  status: "Ended",
  premiered: "2013-06-24T00:00:00.000Z",
  ended: "2015-09-10T00:00:00.000Z",
  weight: 99,
  image:
    "https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg",
  summary: "<p>Summary</p>",
};

describe("getWatchedShowIds", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns watched show ids", async () => {
    createClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({
          data: [{ show_id: 1 }, { show_id: 9 }],
          error: null,
        }),
      })),
    });

    await expect(getWatchedShowIds()).resolves.toEqual(new Set([1, 9]));
  });
});

describe("listWatchedShows", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("maps joined show rows", async () => {
    const order = vi.fn().mockResolvedValue({
      data: [{ show_id: 1, shows: sampleRow }],
      error: null,
    });
    const select = vi.fn(() => ({ order }));
    createClient.mockReturnValue({
      from: vi.fn(() => ({ select })),
    });

    const shows = await listWatchedShows();

    expect(shows).toHaveLength(1);
    expect(shows[0]?.name).toBe("Under the Dome");
    expect(select).toHaveBeenCalledWith("show_id, shows(*)");
  });
});
