"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { attendanceStatusEnum, enrolments, students, type AttendanceStatus } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import { allowedCourses, isIsoDate, saveMarks, todayIST } from "@/lib/attendance";
import { parseCsv } from "@/lib/csv";

const markSchema = z.object({
  course: z.string(),
  date: z.string().refine(isIsoDate, "Invalid date"),
  marks: z
    .array(
      z.object({
        enrolmentId: z.uuid(),
        status: z.enum(attendanceStatusEnum.enumValues),
        note: z.string().max(300).optional(),
      })
    )
    .max(500),
});

export type SaveResult = { ok: boolean; message: string };

export async function saveAttendance(input: z.input<typeof markSchema>): Promise<SaveResult> {
  const user = await requireUser(["admin", "teacher"]);
  const parsed = markSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { course, date, marks } = parsed.data;
  if (date > todayIST()) return { ok: false, message: "You can't mark attendance for a future date." };

  const allowed = await allowedCourses(user);
  if (!allowed.includes(course)) return { ok: false, message: "You don't teach this art." };

  const saved = await saveMarks(marks, date, user.id || null, [course]);
  revalidatePath("/admin/attendance");
  revalidatePath("/admin/students", "layout");
  return { ok: true, message: `Saved attendance for ${saved} student${saved === 1 ? "" : "s"}.` };
}

const STATUS_ALIASES: Record<string, AttendanceStatus> = {
  p: "present", present: "present", "1": "present", yes: "present", y: "present",
  a: "absent", absent: "absent", "0": "absent", no: "absent", n: "absent",
  l: "late", late: "late",
  e: "excused", excused: "excused", leave: "excused",
};

export type UploadResult = { ok: boolean; saved: number; skipped: number; errors: string[] } | null;

/**
 * CSV columns (header row required, any order): roll_no, status, and
 * optionally date (YYYY-MM-DD; falls back to the date picked on screen).
 * student_name and batch columns are ignored, so the downloaded template
 * can be filled in and uploaded as-is.
 */
export async function uploadAttendance(_prev: UploadResult, formData: FormData): Promise<UploadResult> {
  const user = await requireUser(["admin", "teacher"]);
  const course = String(formData.get("course") ?? "");
  const fallbackDate = String(formData.get("date") ?? "");
  const file = formData.get("file");

  const allowed = await allowedCourses(user);
  if (!allowed.includes(course)) return { ok: false, saved: 0, skipped: 0, errors: ["You don't teach this art."] };
  if (!(file instanceof File) || file.size === 0) return { ok: false, saved: 0, skipped: 0, errors: ["Choose a CSV file."] };
  if (file.size > 1_000_000) return { ok: false, saved: 0, skipped: 0, errors: ["File is too large (max 1 MB)."] };

  const rows = parseCsv(await file.text());
  if (rows.length < 2) return { ok: false, saved: 0, skipped: 0, errors: ["The file has no data rows."] };

  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, "_"));
  const col = (...names: string[]) => header.findIndex((h) => names.includes(h));
  const iRoll = col("roll_no", "roll", "rollno", "student_id", "id");
  const iStatus = col("status", "attendance", "mark");
  const iDate = col("date");
  if (iRoll < 0 || iStatus < 0) {
    return { ok: false, saved: 0, skipped: 0, errors: ["The header row needs roll_no and status columns. Download the template to start."] };
  }

  // Roll numbers in this course -> enrolment
  const roster = await db
    .select({ enrolmentId: enrolments.id, rollNo: students.rollNo })
    .from(enrolments)
    .innerJoin(students, eq(students.id, enrolments.studentId))
    .where(and(eq(enrolments.courseSlug, course), eq(enrolments.active, true)));
  const byRoll = new Map(roster.map((r) => [r.rollNo, r.enrolmentId]));

  const errors: string[] = [];
  const byDate = new Map<string, { enrolmentId: string; status: AttendanceStatus }[]>();
  let skipped = 0;
  const today = todayIST();

  rows.slice(1).forEach((r, idx) => {
    const line = idx + 2;
    const rollRaw = (r[iRoll] ?? "").trim();
    const statusRaw = (r[iStatus] ?? "").trim().toLowerCase();
    if (!statusRaw) {
      skipped++;
      return;
    }
    const rollNo = Number(rollRaw.replace(/^dr-?/i, ""));
    const enrolmentId = byRoll.get(rollNo);
    const status = STATUS_ALIASES[statusRaw];
    const date = iDate >= 0 && (r[iDate] ?? "").trim() ? (r[iDate] ?? "").trim() : fallbackDate;
    if (!enrolmentId) return void errors.push(`Line ${line}: roll number "${rollRaw}" is not a student in this art.`);
    if (!status) return void errors.push(`Line ${line}: status "${r[iStatus]}" should be P, A, L or E.`);
    if (!isIsoDate(date)) return void errors.push(`Line ${line}: date "${date}" should look like 2026-10-07.`);
    if (date > today) return void errors.push(`Line ${line}: ${date} is in the future.`);
    const list = byDate.get(date) ?? [];
    list.push({ enrolmentId, status });
    byDate.set(date, list);
  });

  let saved = 0;
  for (const [date, marks] of byDate) {
    saved += await saveMarks(marks, date, user.id || null, [course]);
  }
  revalidatePath("/admin/attendance");
  revalidatePath("/admin/students", "layout");
  return { ok: errors.length === 0, saved, skipped, errors: errors.slice(0, 20) };
}
