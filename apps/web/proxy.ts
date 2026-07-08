import { type NextRequest, NextResponse } from "next/server";

import {
  AUTH_ROUTES,
  isGuestOnlyPath,
  isProtectedPath,
} from "@/lib/auth/routes";
import { updateSession } from "@/lib/db/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = AUTH_ROUTES.login;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isGuestOnlyPath(pathname)) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = AUTH_ROUTES.defaultAfterLogin;
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and images.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
