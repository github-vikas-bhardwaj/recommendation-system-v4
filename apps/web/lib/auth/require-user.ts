import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/lib/auth/routes";
import { createClient } from "@/lib/db/supabase/server";

export async function getOptionalUser(): Promise<User | null> {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(): Promise<User> {
  const user = await getOptionalUser();

  if (!user) {
    redirect(AUTH_ROUTES.login);
  }

  return user;
}
