import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic check only: bounce visitors with no session cookie away from
 * signed-in areas. Real authorization happens on the server (src/lib/auth/session.ts).
 */
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/enroll/:path*",
    "/subscribe/:path*",
    "/learn/:path*",
    "/billing/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
