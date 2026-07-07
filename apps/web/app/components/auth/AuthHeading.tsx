type AuthHeadingProps = {
  title: string;
  description: string;
};

export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <header className="mb-8 text-center">
      <p className="mb-3 text-xs font-medium tracking-widest text-violet-300 uppercase">
        ReelMind
      </p>
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </header>
  );
}
