import { Suspense } from "react";

import { Year } from "./Year";

function YearFallback() {
  return (
    <p className="text-sm text-zinc-500">© … ReelMind. All rights reserved.</p>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl text-center sm:text-left">
        <Suspense fallback={<YearFallback />}>
          <Year />
        </Suspense>
      </div>
    </footer>
  );
}
