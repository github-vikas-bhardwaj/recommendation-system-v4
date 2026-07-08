const features = [
  {
    title: "Taste-aware AI",
    description:
      "Recommendations adapt to your watch history, ratings, and mood — not generic top-10 lists.",
    icon: "✦",
  },
  {
    title: "Movies & series",
    description:
      "One place for films and binge-worthy shows, with smart filters for runtime and tone.",
    icon: "▶",
  },
  {
    title: "Explainable picks",
    description:
      "Every suggestion comes with a short reason so you know why it fits tonight.",
    icon: "◎",
  },
  {
    title: "Private by design",
    description:
      "Your data stays behind the BFF. API keys and LLM calls never touch the browser.",
    icon: "◈",
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for viewers who are tired of scrolling
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            A recommendation engine that feels personal, fast, and trustworthy.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="card-surface group rounded-2xl p-6 transition hover:border-violet-400/25 hover:bg-white/[0.06]"
            >
              <span
                aria-hidden
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-lg text-violet-300 transition group-hover:bg-violet-500/25"
              >
                {feature.icon}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
