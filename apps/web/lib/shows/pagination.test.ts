import { describe, expect, it } from "vitest";

import { getPaginationRange } from "./pagination";

describe("getPaginationRange", () => {
  it("returns an empty array for a single page", () => {
    expect(getPaginationRange(1, 1)).toEqual([]);
  });

  it("returns all pages when total pages is small", () => {
    expect(getPaginationRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses distant pages with ellipses", () => {
    expect(getPaginationRange(6, 413)).toEqual([
      1,
      "ellipsis",
      5,
      6,
      7,
      "ellipsis",
      413,
    ]);
  });

  it("shows nearby pages at the start", () => {
    expect(getPaginationRange(2, 413)).toEqual([1, 2, 3, "ellipsis", 413]);
  });

  it("shows nearby pages at the end", () => {
    expect(getPaginationRange(412, 413)).toEqual([
      1,
      "ellipsis",
      411,
      412,
      413,
    ]);
  });
});
