"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/db/supabase/server";

export async function logoutAction(): Promise<void> {
  const supabase = createClient(await cookies());

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[logout] auth error:", {
        code: error.code,
        message: error.message,
        status: error.status,
      });
    }
  } catch (err) {
    console.error("[logout] unexpected error:", err);
  }

  redirect("/login");
}
