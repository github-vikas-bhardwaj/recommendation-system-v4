import { Year } from "./Year";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl text-center sm:text-left">
        <Year />
      </div>
    </footer>
  );
}
