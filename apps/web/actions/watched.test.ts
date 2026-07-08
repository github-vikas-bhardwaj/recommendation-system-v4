import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createClient, cookies, getOptionalUser, revalidatePath } = vi.hoisted(
  () => ({
    createClient: vi.fn(),
    cookies: vi.fn(async () => ({})),
    getOptionalUser: vi.fn(),
    revalidatePath: vi.fn(),
  }),
);

vi.mock("next/headers", () => ({
  cookies,
}));

vi.mock("next/cache", () => ({
  revalidatePath,
}));

vi.mock("@/lib/auth/require-user", () => ({
  getOptionalUser,
}));

vi.mock("@/lib/db/supabase/server", () => ({
  createClient,
}));

import { setWatchedAction } from "./watched";

describe("setWatchedAction", () => {
  const upsert = vi.fn();
  const deleteEq = vi.fn();
  const deleteQuery = vi.fn(() => ({ eq: deleteEq }));
  const from = vi.fn((table: string) => {
    if (table === "user_watched") {
      return {
        upsert,
        delete: deleteQuery,
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  beforeEach(() => {
    getOptionalUser.mockResolvedValue({ id: "user-123" });
    createClient.mockReturnValue({ from });
    upsert.mockResolvedValue({ error: null });
    deleteEq.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("marks a show as watched for the signed-in user", async () => {
    const result = await setWatchedAction(7, true);

    expect(result).toEqual({ ok: true });
    expect(upsert).toHaveBeenCalledWith(
      { user_id: "user-123", show_id: 7 },
      { onConflict: "user_id,show_id", ignoreDuplicates: true },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/shows");
    expect(revalidatePath).toHaveBeenCalledWith("/recommendations");
    expect(revalidatePath).toHaveBeenCalledWith("/shows/7");
  });

  it("removes a watched show for the signed-in user", async () => {
    const result = await setWatchedAction(7, false);

    expect(result).toEqual({ ok: true });
    expect(deleteQuery).toHaveBeenCalled();
    expect(deleteEq).toHaveBeenCalledWith("show_id", 7);
  });

  it("rejects invalid show ids", async () => {
    const result = await setWatchedAction(-1, true);

    expect(result).toEqual({ ok: false, error: "Invalid show." });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("requires authentication", async () => {
    getOptionalUser.mockResolvedValue(null);

    const result = await setWatchedAction(7, true);

    expect(result).toEqual({ ok: false, error: "You must be signed in." });
    expect(upsert).not.toHaveBeenCalled();
  });
});
