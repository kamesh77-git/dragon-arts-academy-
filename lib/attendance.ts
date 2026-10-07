import "server-only";

import { and, asc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { attendance, enrolments, students, users, type AttendanceStatus } from "@/db/schema";
import { courses, getCourse } from "@/lib/courses";
import type { Role } from "@/lib/rbac";

export const STATUSES: { value: AttendanceStatus; label: string; short: string }[] = [
  { value: "present", label: "Present", short: "P" },
  { value: "absent", label: "Absent", short: "A" },
  { value: "late", label: "Late", short: "L" },
  { value: "excused", label: "Excused", short: "E" },
];

export function rollLabel(n: number) {
  return `DR-${String(n).padStart(4, "0")}`;
}

export function courseLabel(slug: string) {
  return getCourse(slug)?.name ?? slug;
}

/** Today's date in India as YYYY-MM-DD. */
export function todayIST() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isIsoDate(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
}

/** Course slugs this person may take attendance for. Admin: all. */
export async function allowedCourses(user: { id: string; role: Role }): Promise<string[]> {
  if (user.role === "admin") return courses.map((c) => c.slug);
  if (user.role !== "teacher" || !user.id) return [];
  const row = await db.query.users.findFirst({ where: eq(users.id, user.id), columns: { courses: true } });
  const valid = new Set(courses.map((c) => c.slug));
  return (row?.courses ?? []).filter((s) => valid.has(s));
}

export async function batchesFor(courseSlug: string) {
  const rows = await db
    .selectDistinct({ batch: enrolments.batch })
    .from(enrolments)
    .where(and(eq(enrolments.courseSlug, courseSlug), eq(enrolments.active, true)))
    .orderBy(asc(enrolments.batch));
  return rows.map((r) => r.batch).filter(Boolean);
}

/** Active students in a course (optionally one batch) with their mark for a date. */
export async function roster(courseSlug: string, date: string, batch?: string) {
  const rows = await db
    .select({
      enrolmentId: enrolments.id,
      batch: enrolments.batch,
      studentId: students.id,
      rollNo: students.rollNo,
      name: students.name,
      status: attendance.status,
      note: attendance.note,
    })
    .from(enrolments)
    .innerJoin(students, eq(students.id, enrolments.studentId))
    .leftJoin(attendance, and(eq(attendance.enrolmentId, enrolments.id), eq(attendance.date, date)))
    .where(
      and(
        eq(enrolments.courseSlug, courseSlug),
        eq(enrolments.active, true),
        eq(students.active, true),
        batch ? eq(enrolments.batch, batch) : undefined
      )
    )
    .orderBy(asc(enrolments.batch), asc(students.name));
  return rows;
}

/** Present / absent / late / excused counts per enrolment. */
export async function attendanceSummary(enrolmentIds: string[]) {
  if (enrolmentIds.length === 0) return new Map<string, Record<AttendanceStatus, number>>();
  const rows = await db
    .select({ enrolmentId: attendance.enrolmentId, status: attendance.status, n: sql<number>`count(*)::int` })
    .from(attendance)
    .where(inArray(attendance.enrolmentId, enrolmentIds))
    .groupBy(attendance.enrolmentId, attendance.status);
  const map = new Map<string, Record<AttendanceStatus, number>>();
  for (const r of rows) {
    const entry = map.get(r.enrolmentId) ?? { present: 0, absent: 0, late: 0, excused: 0 };
    entry[r.status] = r.n;
    map.set(r.enrolmentId, entry);
  }
  return map;
}

/** Share of classes attended (present or late), ignoring excused days. */
export function attendanceRate(c?: Record<AttendanceStatus, number>) {
  if (!c) return null;
  const counted = c.present + c.late + c.absent;
  return counted === 0 ? null : Math.round(((c.present + c.late) / counted) * 100);
}

/** Saves marks; enrolments outside the allowed courses are ignored. */
export async function saveMarks(
  marks: { enrolmentId: string; status: AttendanceStatus; note?: string | null }[],
  date: string,
  markedBy: string | null,
  allowed: string[]
) {
  if (marks.length === 0) return 0;
  const ids = [...new Set(marks.map((m) => m.enrolmentId))];
  const ok = await db
    .select({ id: enrolments.id })
    .from(enrolments)
    .where(and(inArray(enrolments.id, ids), inArray(enrolments.courseSlug, allowed.length ? allowed : ["-"])));
  const okIds = new Set(ok.map((r) => r.id));
  const values = marks
    .filter((m) => okIds.has(m.enrolmentId))
    .map((m) => ({ enrolmentId: m.enrolmentId, date, status: m.status, note: m.note || null, markedBy, markedAt: new Date() }));
  if (values.length === 0) return 0;
  await db
    .insert(attendance)
    .values(values)
    .onConflictDoUpdate({
      target: [attendance.enrolmentId, attendance.date],
      set: {
        status: sql`excluded.status`,
        note: sql`excluded.note`,
        markedBy: sql`excluded.marked_by`,
        markedAt: sql`excluded.marked_at`,
      },
    });
  return values.length;
}
