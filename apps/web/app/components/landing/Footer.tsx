import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} ReelMind. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex gap-6 text-sm text-zinc-500">
          <Link href="/login" className="transition hover:text-zinc-300">
            Login
          </Link>
          <Link href="/signup" className="transition hover:text-zinc-300">
            Sign up
          </Link>
          <Link href="/health" className="transition hover:text-zinc-300">
            Status
          </Link>
        </nav>
      </div>
    </footer>
  );
}
