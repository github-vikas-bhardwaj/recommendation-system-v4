import { AuthError } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { loginInitialState } from "@/lib/schemas/login";

import { loginAction } from "./login";
import { buildLoginFormData, RedirectError } from "./test-helpers";

const { redirect, signInWithPassword, createClient } = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new RedirectError(url);
  }),
  signInWithPassword: vi.fn(),
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

describe("loginAction", () => {
  beforeEach(() => {
    createClient.mockReturnValue({
      auth: { signInWithPassword },
    });
    signInWithPassword.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns field errors when validation fails", async () => {
    const formData = buildLoginFormData({
      email: "not-an-email",
      password: "",
    });

    const result = await loginAction(loginInitialState, formData);

    expect(result).toMatchObject({
      ok: false,
      fieldErrors: {
        email: "Invalid email address",
        password: "Password is required",
      },
      values: {
        email: "not-an-email",
        password: "",
      },
    });
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("returns a mapped form error when Supabase rejects credentials", async () => {
    signInWithPassword.mockResolvedValue({
      error: new AuthError(
        "Invalid login credentials",
        400,
        "invalid_credentials",
      ),
    });

    const result = await loginAction(loginInitialState, buildLoginFormData());

    expect(result).toMatchObject({
      ok: false,
      formError: "Invalid email or password.",
      values: {
        email: "you@example.com",
        password: "",
      },
    });
  });

  it("returns a generic form error when sign-in throws", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    signInWithPassword.mockRejectedValue(new Error("network down"));

    const result = await loginAction(loginInitialState, buildLoginFormData());

    expect(result).toMatchObject({
      ok: false,
      formError: "Something went wrong. Please try again.",
    });
    expect(consoleError).toHaveBeenCalled();
  });

  it("redirects to the default page after successful login", async () => {
    await expect(
      loginAction(loginInitialState, buildLoginFormData()),
    ).rejects.toMatchObject({
      name: "RedirectError",
      url: "/shows",
    } satisfies Partial<RedirectError>);

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "you@example.com",
      password: "Password1!",
    });
    expect(redirect).toHaveBeenCalledWith("/shows");
  });

  it("redirects to a safe next path after successful login", async () => {
    await expect(
      loginAction(
        loginInitialState,
        buildLoginFormData({ next: "/recommendations" }),
      ),
    ).rejects.toMatchObject({
      name: "RedirectError",
      url: "/recommendations",
    } satisfies Partial<RedirectError>);

    expect(redirect).toHaveBeenCalledWith("/recommendations");
  });

  it("falls back to the default page for unsafe next values", async () => {
    await expect(
      loginAction(
        loginInitialState,
        buildLoginFormData({ next: "https://evil.com" }),
      ),
    ).rejects.toMatchObject({
      name: "RedirectError",
      url: "/shows",
    } satisfies Partial<RedirectError>);

    expect(redirect).toHaveBeenCalledWith("/shows");
  });
});
