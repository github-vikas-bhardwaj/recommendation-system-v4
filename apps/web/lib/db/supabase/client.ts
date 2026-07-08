import { createBrowserClient } from "@supabase/ssr";

import { publicEnv } from "@/lib/env/public";

export const createClient = () => {
  const { url, anonKey } = publicEnv.supabase;
  return createBrowserClient(url, anonKey);
};
