import { AuthError } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { signupInitialState } from "@/lib/schemas/signup";

import { signupAction } from "./signup";
import { buildSignupFormData, RedirectError } from "./test-helpers";

const { redirect, signUp, createClient } = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new RedirectError(url);
  }),
  signUp: vi.fn(),
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

describe("signupAction", () => {
  beforeEach(() => {
    createClient.mockReturnValue({
      auth: { signUp },
    });
    signUp.mockResolvedValue({
      data: { user: { id: "user-1" }, session: null },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns field errors when validation fails", async () => {
    const formData = buildSignupFormData({
      firstName: "",
      email: "not-an-email",
      password: "short",
      confirmPassword: "different",
    });

    const result = await signupAction(signupInitialState, formData);

    expect(result).toMatchObject({
      ok: false,
      fieldErrors: {
        firstName: "First name is required",
        email: "Invalid email address",
      },
      values: {
        firstName: "",
        lastName: "Rivera",
        email: "not-an-email",
        password: "",
        confirmPassword: "",
      },
    });
    expect(signUp).not.toHaveBeenCalled();
  });

  it("returns a mapped field error when the email already exists", async () => {
    signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: new AuthError("User already registered", 400, "email_exists"),
    });

    const result = await signupAction(
      signupInitialState,
      buildSignupFormData(),
    );

    expect(result).toMatchObject({
      ok: false,
      fieldErrors: {
        email:
          "An account with this email already exists. Try signing in instead.",
      },
      values: {
        email: "you@example.com",
        password: "",
        confirmPassword: "",
      },
    });
  });

  it("returns a generic form error when sign-up throws", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    signUp.mockRejectedValue(new Error("network down"));

    const result = await signupAction(
      signupInitialState,
      buildSignupFormData(),
    );

    expect(result).toMatchObject({
      ok: false,
      formError: "Something went wrong. Please try again.",
    });
    expect(consoleError).toHaveBeenCalled();
  });

  it("redirects when Supabase returns a session", async () => {
    signUp.mockResolvedValue({
      data: { user: { id: "user-1" }, session: { access_token: "token" } },
      error: null,
    });

    await expect(
      signupAction(signupInitialState, buildSignupFormData()),
    ).rejects.toMatchObject({
      name: "RedirectError",
      url: "/shows",
    } satisfies Partial<RedirectError>);

    expect(signUp).toHaveBeenCalledWith({
      email: "you@example.com",
      password: "Password1!",
      options: {
        data: {
          first_name: "Alex",
          last_name: "Rivera",
        },
      },
    });
    expect(redirect).toHaveBeenCalledWith("/shows");
  });

  it("returns email confirmation state when no session is created", async () => {
    const result = await signupAction(
      signupInitialState,
      buildSignupFormData(),
    );

    expect(result).toEqual({
      ok: true,
      emailConfirmationRequired: true,
      message: "Check your email to confirm your account before signing in.",
    });
    expect(redirect).not.toHaveBeenCalled();
  });
});
