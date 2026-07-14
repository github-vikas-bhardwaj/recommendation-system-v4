import * as Sentry from "@sentry/nextjs";

import { isSentryEnabled } from "@/lib/monitoring/is-sentry-enabled";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0,
  enabled: isSentryEnabled(dsn),
});
