// Who can open which part of /admin. Used by proxy.ts (front door) and by
// requireUser() inside every page and server action (the real check).

export type Role = "admin" | "staff" | "teacher";

// Path prefixes each non-admin role may open. Admin can open everything.
const ALLOWED: Record<Exclude<Role, "admin">, string[]> = {
  staff: ["/admin/leads", "/admin/account"],
  teacher: ["/admin/attendance", "/admin/students", "/admin/account"],
};

// Teachers can view students but not create or edit them.
const TEACHER_BLOCKED = ["/admin/students/new"];

export function homeFor(role: Role) {
  return role === "admin" ? "/admin" : role === "staff" ? "/admin/leads" : "/admin/attendance";
}

export function canAccess(role: Role, path: string) {
  if (role === "admin") return true;
  if (role === "teacher" && TEACHER_BLOCKED.some((p) => path === p || path.startsWith(`${p}/`))) return false;
  return ALLOWED[role].some((p) => path === p || path.startsWith(`${p}/`));
}

export function isRole(value: unknown): value is Role {
  return value === "admin" || value === "staff" || value === "teacher";
}
