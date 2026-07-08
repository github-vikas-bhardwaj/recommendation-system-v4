import Link from "next/link";

export function HeaderBrand() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-amber-400 text-sm font-bold text-white shadow-lg shadow-violet-900/50 transition group-hover:scale-105"
      >
        R
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-wide text-white">
          ReelMind
        </span>
        <span className="text-xs text-zinc-500">AI recommendations</span>
      </span>
    </Link>
  );
}
