import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

// Re-checks the session inside admin pages and server actions (proxy.ts
// is only the front door). Pass "admin" for owner-only areas like Team.
export async function requireUser(role?: "admin") {
  const session = await auth();
  const user = session?.user;
  if (!user?.role) redirect("/admin/login");
  if (role === "admin" && user.role !== "admin") redirect("/admin");
  return user;
}
