import { ButtonLink } from "../ui/ButtonLink";

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-linear-to-br from-violet-950/80 via-zinc-950 to-zinc-950 px-8 py-14 text-center sm:px-16">
          <div
            aria-hidden
            className="animate-shimmer pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent bg-size-[200%_100%]"
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready for your next favorite watch?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Join ReelMind and let AI do the browsing. Your perfect pick is
              closer than you think.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href="/signup">Create free account</ButtonLink>
              <ButtonLink href="/login" variant="ghost">
                Log in
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
