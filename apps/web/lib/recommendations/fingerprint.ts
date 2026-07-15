import { createHash } from "node:crypto";

/** Canonical fingerprint of a watch set (order-independent). */
export function watchHistoryFingerprint(showIds: Iterable<number>): string {
  const canonical = [...showIds].sort((a, b) => a - b).join(",");
  return createHash("sha256").update(canonical).digest("hex");
}
