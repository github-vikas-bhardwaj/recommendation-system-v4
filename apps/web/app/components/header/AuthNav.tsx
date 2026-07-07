import { NavLink } from "./NavLink";

export function AuthNav() {
  return (
    <nav aria-label="Account" className="flex items-center gap-1">
      <NavLink href="/shows">Shows</NavLink>
      <NavLink href="/recommendations">Recommendations</NavLink>
      <NavLink href="/login">Login</NavLink>
      <NavLink href="/signup">Sign up</NavLink>
      <NavLink href="/logout">Logout</NavLink>
    </nav>
  );
}
