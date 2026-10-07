import { auth } from "@/auth";
import { allowedCourses, courseLabel, isIsoDate, rollLabel, roster, todayIST } from "@/lib/attendance";
import { toCsv } from "@/lib/csv";
import { isRole } from "@/lib/rbac";

// CSV template for bulk attendance: the roster for one art (and optional
// batch) with an empty status column to fill in P / A / L / E.
export async function GET(req: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user || !isRole(user.role) || (user.role !== "admin" && user.role !== "teacher")) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(req.url);
  const course = url.searchParams.get("course") ?? "";
  const batch = url.searchParams.get("batch") || undefined;
  const dateParam = url.searchParams.get("date");
  const date = isIsoDate(dateParam) ? dateParam : todayIST();

  const allowed = await allowedCourses({ id: user.id, role: user.role });
  if (!allowed.includes(course)) return new Response("Forbidden", { status: 403 });

  const rows = await roster(course, date, batch);
  const csv = toCsv([
    ["roll_no", "student_name", "batch", "date", "status"],
    ...rows.map((r) => [rollLabel(r.rollNo), r.name, r.batch, date, r.status ? r.status[0].toUpperCase() : ""]),
  ]);
  const filename = `attendance-${courseLabel(course).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${date}.csv`;
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
