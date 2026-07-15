import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import { watchHistoryFingerprint } from "./fingerprint";

describe("watchHistoryFingerprint", () => {
  it("is order-independent", () => {
    expect(watchHistoryFingerprint([3, 1, 2])).toBe(
      watchHistoryFingerprint([1, 2, 3]),
    );
  });

  it("hashes the canonical sorted id list", () => {
    const expected = createHash("sha256").update("1,2,9").digest("hex");
    expect(watchHistoryFingerprint([9, 1, 2])).toBe(expected);
  });

  it("changes when the watch set changes", () => {
    expect(watchHistoryFingerprint([1, 2])).not.toBe(
      watchHistoryFingerprint([1, 2, 3]),
    );
  });
});
