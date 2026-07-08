export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl text-center sm:text-left">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} ReelMind. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
