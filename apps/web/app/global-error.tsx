"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-zinc-100">
        <h1 className="text-2xl font-semibold tracking-tight">
          This page couldn&apos;t load
        </h1>
        <p className="max-w-md text-center text-sm text-zinc-400">
          A server error occurred. The team has been notified — try again in a
          moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
