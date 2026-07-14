/**
 * Sentry is on only for production deploys with a DSN configured.
 * - Vercel: VERCEL_ENV === "production" (Preview stays off even if APP_ENV=production)
 * - Non-Vercel: APP_ENV / NEXT_PUBLIC_APP_ENV === "production"
 */
export function isSentryEnabled(dsn: string | undefined): boolean {
  if (!dsn) {
    return false;
  }

  const vercelEnv =
    process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (vercelEnv) {
    return vercelEnv === "production";
  }

  return (
    process.env.APP_ENV === "production" ||
    process.env.NEXT_PUBLIC_APP_ENV === "production"
  );
}
