export const AUTH_ROUTES = {
  root: "/",
  login: "/login",
  signup: "/signup",
  defaultAfterLogin: "/shows",
} as const;

/** Paths that require a logged-in user (prefix match). */
export const PROTECTED_PATH_PREFIXES = ["/shows", "/recommendations"] as const;

/** Paths only for guests — logged-in users get redirected away. */
export const GUEST_ONLY_PATH_PREFIXES = ["/login", "/signup", "/"] as const;

export function pathnameMatchesPrefix(
  pathname: string,
  prefixes: readonly string[],
): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isProtectedPath(pathname: string): boolean {
  return pathnameMatchesPrefix(pathname, PROTECTED_PATH_PREFIXES);
}

export function isGuestOnlyPath(pathname: string): boolean {
  return pathnameMatchesPrefix(pathname, GUEST_ONLY_PATH_PREFIXES);
}

export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return AUTH_ROUTES.defaultAfterLogin;
  }
  return next;
}
