import type { AuthError } from "@supabase/supabase-js";

import type { SignupField } from "@/lib/schemas/signup";

type SignupAuthErrorResult = {
  fieldErrors?: Partial<Record<SignupField, string>>;
  formError?: string;
};

export function mapSignupAuthError(error: AuthError): SignupAuthErrorResult {
  switch (error.code) {
    case "email_exists":
    case "user_already_exists":
      return {
        fieldErrors: {
          email:
            "An account with this email already exists. Try signing in instead.",
        },
      };

    case "weak_password":
      return {
        fieldErrors: {
          password: "Password is too weak. Choose a stronger password.",
        },
      };

    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return {
        formError:
          "Too many attempts. Please wait a few minutes and try again.",
      };

    case "signup_disabled":
      return {
        formError: "Sign up is currently unavailable. Please try again later.",
      };

    default:
      console.error("[signup] auth error:", {
        code: error.code,
        message: error.message,
        status: error.status,
      });
      return {
        formError: "Unable to create your account. Please try again.",
      };
  }
}
