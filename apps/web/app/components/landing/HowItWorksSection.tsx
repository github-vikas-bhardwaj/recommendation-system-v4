const steps = [
  {
    step: "01",
    title: "Create your profile",
    description:
      "Sign up and tell us what you love — genres, directors, pacing.",
  },
  {
    step: "02",
    title: "Get smart picks",
    description:
      "Our GenAI engine ranks titles against your taste and current mood.",
  },
  {
    step: "03",
    title: "Watch & refine",
    description:
      "Rate what you watch. Every reaction makes the next pick sharper.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <p className="text-sm font-medium tracking-widest text-violet-300 uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From signup to spotlight in three steps
            </h2>
            <p className="mt-4 text-zinc-400">
              No endless catalogs. Just a focused flow that gets you to the
              right title faster.
            </p>
          </div>
          <ol className="grid flex-1 gap-6 lg:max-w-2xl">
            {steps.map((item) => (
              <li
                key={item.step}
                className="card-surface flex gap-5 rounded-2xl p-6"
              >
                <span className="text-gradient text-2xl font-bold">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
