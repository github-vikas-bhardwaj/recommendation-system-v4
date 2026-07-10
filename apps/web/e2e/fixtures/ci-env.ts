import { hasE2eCredentials } from "./test-user";

export function hasRealSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    return false;
  }

  if (url.includes("example.supabase.co")) {
    return false;
  }

  if (
    anonKey.includes("placeholder") ||
    serviceRoleKey.includes("placeholder")
  ) {
    return false;
  }

  return true;
}

export function canRunAuthenticatedE2e(): boolean {
  return hasE2eCredentials() && hasRealSupabase();
}
