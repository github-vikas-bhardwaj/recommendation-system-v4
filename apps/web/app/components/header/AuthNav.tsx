import { getOptionalUser } from "@/lib/auth/require-user";

import { LogoutButton } from "../auth/LogoutButton";
import { NavLink } from "./NavLink";

export async function AuthNav() {
  const user = await getOptionalUser();
  return (
    <nav aria-label="Account" className="flex items-center gap-1">
      {user ? (
        <>
          <NavLink href="/shows">Shows</NavLink>
          <NavLink href="/recommendations">Recommendations</NavLink>
          <LogoutButton />
        </>
      ) : (
        <>
          <NavLink href="/login">Login</NavLink>
          <NavLink href="/signup">Sign up</NavLink>
        </>
      )}
    </nav>
  );
}
