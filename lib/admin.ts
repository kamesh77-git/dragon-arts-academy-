import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { homeFor, isRole, type Role } from "@/lib/rbac";

// Re-checks the session inside admin pages and server actions (proxy.ts
// is only the front door). Pass the roles allowed; omit for any signed-in
// team member.
export async function requireUser(roles?: Role[]) {
  const session = await auth();
  const user = session?.user;
  if (!user || !isRole(user.role)) redirect("/admin/login");
  if (roles && !roles.includes(user.role)) redirect(homeFor(user.role));
  return { ...user, role: user.role };
}
