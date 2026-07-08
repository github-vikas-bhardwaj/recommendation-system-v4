"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { mapSignupAuthError } from "@/lib/auth/map-signup-auth-error";
import { createClient } from "@/lib/db/supabase/server";
import {
  mapSignupFieldErrors,
  parseSignupFormValues,
  type SignupActionState,
  signupFailureState,
  signupSchema,
} from "@/lib/schemas/signup";

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const values = parseSignupFormValues(formData);
  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    return signupFailureState(values, {
      fieldErrors: mapSignupFieldErrors(parsed.error),
    });
  }

  const supabase = createClient(await cookies());

  let data;
  let error;

  try {
    ({ data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName ?? "",
        },
      },
    }));
  } catch (err) {
    console.error("[signup] unexpected error:", err);
    return signupFailureState(values, {
      formError: "Something went wrong. Please try again.",
    });
  }

  if (error) {
    const mapped = mapSignupAuthError(error);
    return signupFailureState(values, mapped);
  }

  if (data.session) {
    redirect("/shows");
  }

  return {
    ok: true,
    emailConfirmationRequired: true,
    message: "Check your email to confirm your account before signing in.",
  };
}
