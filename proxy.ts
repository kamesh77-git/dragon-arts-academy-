import { NextResponse } from "next/server";

import { auth } from "@/auth";

// Gates everything under /admin (except the login page) behind a signed-in
// team member. Page-level checks still re-verify; this is the front door.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return;

  const role = req.auth?.user?.role;
  if (role !== "admin" && role !== "staff") {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
