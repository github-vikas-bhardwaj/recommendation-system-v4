import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Show } from "./types";

const { createClient, cookies } = vi.hoisted(() => ({
  createClient: vi.fn(),
  cookies: vi.fn(async () => ({})),
}));

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies,
}));

vi.mock("@/lib/db/supabase/server", () => ({
  createClient,
}));

import { getShowById, listShows, ShowsQueryError } from "./queries";

const sampleRow = {
  id: 1,
  name: "Under the Dome",
  type: "Scripted",
  language: "English",
  genres: ["Drama", "Science-Fiction", "Thriller"],
  status: "Ended",
  premiered: "2013-06-24T00:00:00.000Z",
  ended: "2015-09-10T00:00:00.000Z",
  weight: 99,
  image:
    "https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg",
  summary: "<p>Under the Dome summary.</p>",
};

const sampleShow: Show = {
  id: 1,
  name: "Under the Dome",
  type: "Scripted",
  language: "English",
  genres: ["Drama", "Science-Fiction", "Thriller"],
  status: "Ended",
  premiered: "2013-06-24",
  ended: "2015-09-10",
  weight: 99,
  image: {
    original:
      "https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg",
  },
  summary: "<p>Under the Dome summary.</p>",
};

function createListQueryMock(result: {
  data: (typeof sampleRow)[] | null;
  error: { message: string } | null;
  count: number | null;
}) {
  const chain = {
    select: vi.fn(),
    order: vi.fn(),
    or: vi.fn(),
    range: vi.fn(),
  };

  chain.select.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.or.mockReturnValue(chain);
  chain.range.mockResolvedValue(result);

  return chain;
}

describe("getShowById", () => {
  beforeEach(() => {
    createClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: sampleRow,
              error: null,
            }),
          })),
        })),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("maps a database row to the Show type", async () => {
    await expect(getShowById(1)).resolves.toEqual(sampleShow);
  });

  it("returns null when the show does not exist", async () => {
    createClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          })),
        })),
      })),
    });

    await expect(getShowById(999)).resolves.toBeNull();
  });

  it("throws ShowsQueryError when Supabase returns an error", async () => {
    createClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "permission denied" },
            }),
          })),
        })),
      })),
    });

    await expect(getShowById(1)).rejects.toBeInstanceOf(ShowsQueryError);
  });
});

describe("listShows", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated shows from Supabase", async () => {
    const listQuery = createListQueryMock({
      data: [sampleRow],
      error: null,
      count: 1,
    });

    createClient.mockReturnValue({
      from: vi.fn(() => listQuery),
    });

    await expect(listShows({ page: 1 })).resolves.toEqual({
      items: [sampleShow],
      currentPage: 1,
      totalPages: 1,
      total: 1,
    });

    expect(listQuery.select).toHaveBeenCalledWith("*", { count: "exact" });
    expect(listQuery.range).toHaveBeenCalledWith(0, 29);
  });

  it("applies a search filter when query is provided", async () => {
    const listQuery = createListQueryMock({
      data: [sampleRow],
      error: null,
      count: 1,
    });

    createClient.mockReturnValue({
      from: vi.fn(() => listQuery),
    });

    await listShows({ query: "dome", page: 1 });

    expect(listQuery.or).toHaveBeenCalledWith(
      "name.ilike.%dome%,summary.ilike.%dome%",
    );
  });

  it("throws ShowsQueryError when Supabase returns an error", async () => {
    const listQuery = createListQueryMock({
      data: null,
      error: { message: "permission denied" },
      count: null,
    });

    createClient.mockReturnValue({
      from: vi.fn(() => listQuery),
    });

    await expect(listShows()).rejects.toBeInstanceOf(ShowsQueryError);
  });
});
