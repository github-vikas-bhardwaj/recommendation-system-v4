import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { logoutAction } from "./logout";
import { RedirectError } from "./test-helpers";

const { redirect, signOut, createClient } = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new RedirectError(url);
  }),
  signOut: vi.fn(),
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({})),
}));

vi.mock("@/lib/db/supabase/server", () => ({
  createClient,
}));

describe("logoutAction", () => {
  beforeEach(() => {
    createClient.mockReturnValue({
      auth: { signOut },
    });
    signOut.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("signs out and redirects to login", async () => {
    await expect(logoutAction()).rejects.toMatchObject({
      name: "RedirectError",
      url: "/login",
    } satisfies Partial<RedirectError>);

    expect(signOut).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("still redirects when signOut returns an error", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    signOut.mockResolvedValue({
      error: { code: "unexpected", message: "failed", status: 500 },
    });

    await expect(logoutAction()).rejects.toMatchObject({
      name: "RedirectError",
      url: "/login",
    } satisfies Partial<RedirectError>);

    expect(consoleError).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("still redirects when signOut throws", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    signOut.mockRejectedValue(new Error("network down"));

    await expect(logoutAction()).rejects.toMatchObject({
      name: "RedirectError",
      url: "/login",
    } satisfies Partial<RedirectError>);

    expect(consoleError).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
