import { required } from "./required";

function supabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return key;
}

/** Safe for client components (NEXT_PUBLIC_* only). */
export const publicEnv = {
  appUrl: required("NEXT_PUBLIC_APP_URL"),
  supabase: {
    url: required("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: supabaseAnonKey(),
  },
} as const;
