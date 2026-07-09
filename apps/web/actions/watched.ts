"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { getOptionalUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/db/supabase/server";

const showIdSchema = z.number().int().positive();

export type SetWatchedActionResult =
  { ok: true } | { ok: false; error: string };

export async function setWatchedAction(
  showId: number,
  watched: boolean,
): Promise<SetWatchedActionResult> {
  const parsedShowId = showIdSchema.safeParse(showId);

  if (!parsedShowId.success) {
    return { ok: false, error: "Invalid show." };
  }

  const user = await getOptionalUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const supabase = createClient(await cookies());
  const validShowId = parsedShowId.data;

  const { error } = watched
    ? await supabase.from("user_watched").upsert(
        {
          user_id: user.id,
          show_id: validShowId,
        },
        { onConflict: "user_id,show_id", ignoreDuplicates: true },
      )
    : await supabase.from("user_watched").delete().eq("show_id", validShowId);

  if (error) {
    console.error("[setWatchedAction]", error.message);
    return { ok: false, error: "Could not update watched status." };
  }

  revalidatePath("/shows");
  revalidatePath("/recommendations");
  revalidatePath(`/shows/${validShowId}`);

  return { ok: true };
}

export async function unwatchShowAction(showId: number): Promise<void> {
  await setWatchedAction(showId, false);
}

export async function watchShowAction(showId: number): Promise<void> {
  await setWatchedAction(showId, true);
}
