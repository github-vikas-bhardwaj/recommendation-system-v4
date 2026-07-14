import "server-only";

import { cookies } from "next/headers";

import { createClient } from "@/lib/db/supabase/server";

export class AccessTokenError extends Error {
  constructor() {
    super("Missing access token!");
    this.name = "AccessTokenError";
  }
}

export async function getAccessToken(): Promise<string> {
  const supabase = createClient(await cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) {
    throw new AccessTokenError();
  }
  return token;
}
