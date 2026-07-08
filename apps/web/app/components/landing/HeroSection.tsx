import { ButtonLink } from "../ui/ButtonLink";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
      <div
        aria-hidden
        className="animate-pulse-glow pointer-events-none absolute top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-widest text-violet-200 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            GenAI movie &amp; show picks
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="text-gradient">Discover what to watch</span>
            <br />
            <span className="text-white">before the credits roll</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            ReelMind learns your taste — mood, genre, pacing, and hidden gems —
            then recommends films and series you&apos;ll actually finish.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/signup">Start for free</ButtonLink>
            <ButtonLink href="/login" variant="secondary">
              I already have an account
            </ButtonLink>
          </div>
        </div>

        <div className="animate-float relative mx-auto mt-16 max-w-4xl">
          <div className="card-surface overflow-hidden rounded-3xl p-1 shadow-2xl shadow-violet-950/50">
            <div className="rounded-[1.35rem] bg-linear-to-br from-zinc-900 via-zinc-950 to-violet-950 p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">
                  Tonight&apos;s picks for you
                </span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                  AI curated
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Midnight in Paris",
                    meta: "Romantic · Whimsical · 94% match",
                    tone: "from-violet-600/40 to-fuchsia-600/20",
                  },
                  {
                    title: "Severance",
                    meta: "Thriller · Slow burn · 91% match",
                    tone: "from-indigo-600/40 to-blue-600/20",
                  },
                  {
                    title: "Past Lives",
                    meta: "Drama · Emotional · 89% match",
                    tone: "from-amber-600/30 to-orange-600/20",
                  },
                ].map((item) => (
                  <article
                    key={item.title}
                    className="card-surface rounded-2xl p-4 transition hover:border-violet-400/30"
                  >
                    <div
                      className={`mb-4 h-28 rounded-xl bg-linear-to-br ${item.tone}`}
                    />
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{item.meta}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
