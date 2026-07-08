import type { AuthError } from "@supabase/supabase-js";

import type { LoginField } from "@/lib/schemas/login";

export function mapLoginAuthError(error: AuthError): {
  fieldErrors?: Partial<Record<LoginField, string>>;
  formError?: string;
} {
  switch (error.code) {
    case "invalid_credentials":
      return {
        formError: "Invalid email or password.",
      };

    case "email_not_confirmed":
      return {
        formError:
          "Please confirm your email before signing in. Check your inbox for the confirmation link.",
      };

    case "user_banned":
      return {
        formError: "This account has been disabled. Contact support.",
      };

    case "over_request_rate_limit":
      return {
        formError:
          "Too many attempts. Please wait a few minutes and try again.",
      };

    default:
      console.error("[login] auth error:", {
        code: error.code,
        message: error.message,
        status: error.status,
      });
      return {
        formError: "Unable to sign in. Please try again.",
      };
  }
}
