type ShowsSearchBarProps = {
  defaultQuery?: string;
};

export function ShowsSearchBar({ defaultQuery = "" }: ShowsSearchBarProps) {
  return (
    <form action="/shows" method="get" className="w-full">
      <label htmlFor="shows-search" className="sr-only">
        Search shows
      </label>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500"
        >
          ⌕
        </span>
        <input
          id="shows-search"
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="Search movies and shows…"
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pr-28 pl-11 text-sm text-white transition placeholder:text-zinc-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
        >
          Search
        </button>
      </div>
    </form>
  );
}
