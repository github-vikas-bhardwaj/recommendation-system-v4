import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Expose deploy target to the client so Sentry stays production-only in the browser.
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? "",
    NEXT_PUBLIC_APP_ENV: process.env.APP_ENV ?? "local",
  },
  images: {
    // Next.js 16 may request q=75 in srcset even when quality={100} is set on <Image>.
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.tvmaze.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const uploadSourceMaps = Boolean(sentryOrg && sentryProject && sentryAuthToken);

export default withSentryConfig(nextConfig, {
  org: sentryOrg,
  project: sentryProject,
  authToken: sentryAuthToken,
  silent: !process.env.CI,
  widenClientFileUpload: uploadSourceMaps,
  sourcemaps: {
    disable: !uploadSourceMaps,
  },
  // Avoid ad-blockers for client reports (optional tunnel).
  tunnelRoute: "/monitoring",
});
