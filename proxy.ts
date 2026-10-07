import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { canAccess, homeFor, isRole } from "@/lib/rbac";

// Gates /admin: signed-in team members only, and each role only sees its
// own areas (lib/rbac.ts). Pages and actions re-check with requireUser().
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return;

  const role = req.auth?.user?.role;
  if (!isRole(role)) {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  if (!canAccess(role, pathname)) {
    return NextResponse.redirect(new URL(homeFor(role), req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
