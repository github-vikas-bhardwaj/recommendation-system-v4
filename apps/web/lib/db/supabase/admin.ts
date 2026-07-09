import "server-only";

import { createClient } from "@supabase/supabase-js";

import { publicEnv } from "@/lib/env/public";
import { required } from "@/lib/env/required";

/**
 * Service-role Supabase client for server-only catalog reads (bypasses RLS).
 * Never import from client components or use for user_watched / auth.
 */
export function createAdminClient() {
  return createClient(
    publicEnv.supabase.url,
    required("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
