import { AuthError } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";

import { mapLoginAuthError } from "./map-login-auth-error";

describe("mapLoginAuthError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps invalid_credentials to a generic form error", () => {
    const error = new AuthError(
      "Invalid login credentials",
      400,
      "invalid_credentials",
    );

    expect(mapLoginAuthError(error)).toEqual({
      formError: "Invalid email or password.",
    });
  });

  it("maps email_not_confirmed to a confirmation message", () => {
    const error = new AuthError(
      "Email not confirmed",
      400,
      "email_not_confirmed",
    );

    expect(mapLoginAuthError(error)).toEqual({
      formError:
        "Please confirm your email before signing in. Check your inbox for the confirmation link.",
    });
  });

  it("maps user_banned to a support message", () => {
    const error = new AuthError("User banned", 403, "user_banned");

    expect(mapLoginAuthError(error)).toEqual({
      formError: "This account has been disabled. Contact support.",
    });
  });

  it("maps rate limit errors", () => {
    const error = new AuthError(
      "Too many requests",
      429,
      "over_request_rate_limit",
    );

    expect(mapLoginAuthError(error)).toEqual({
      formError: "Too many attempts. Please wait a few minutes and try again.",
    });
  });

  it("maps unknown errors to a generic message and logs details", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const error = new AuthError("Something broke", 500, "unexpected_failure");

    expect(mapLoginAuthError(error)).toEqual({
      formError: "Unable to sign in. Please try again.",
    });
    expect(consoleError).toHaveBeenCalledWith("[login] auth error:", {
      code: "unexpected_failure",
      message: "Something broke",
      status: 500,
    });
  });
});
