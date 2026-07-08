"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { mapLoginAuthError } from "@/lib/auth/map-login-auth-error";
import { safeNextPath } from "@/lib/auth/routes";
import { createClient } from "@/lib/db/supabase/server";
import {
  type LoginActionState,
  loginFailureState,
  loginSchema,
  mapLoginFieldErrors,
  parseLoginFormValues,
} from "@/lib/schemas/login";

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const values = parseLoginFormValues(formData);
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return loginFailureState(values, {
      fieldErrors: mapLoginFieldErrors(parsed.error),
    });
  }

  const supabase = createClient(await cookies());

  let error;

  try {
    ({ error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    }));
  } catch (err) {
    console.error("[login] unexpected error:", err);
    return loginFailureState(values, {
      formError: "Something went wrong. Please try again.",
    });
  }

  if (error) {
    return loginFailureState(values, mapLoginAuthError(error));
  }

  const next = safeNextPath(String(formData.get("next") ?? ""));
  // after successful signInWithPassword:
  redirect(next);
}
