import { AuthNav } from "./AuthNav";
import { HeaderBrand } from "./HeaderBrand";

export default function Header() {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <HeaderBrand />
        <AuthNav />
      </div>
    </header>
  );
}
