"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { attendanceStatusEnum, enrolments, leads, students } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import { allowedCourses, isIsoDate, saveMarks, todayIST } from "@/lib/attendance";
import { courses } from "@/lib/courses";

export type FormState = { ok: boolean; message: string } | null;

const courseSlug = z.string().refine((s) => courses.some((c) => c.slug === s), "Choose an art");
const optional = (max: number) => z.string().trim().max(max).transform((v) => v || null);

const studentFields = z.object({
  name: z.string().trim().min(2, "Enter the student's name").max(255),
  parentName: optional(255),
  phone: optional(30),
  email: z.union([z.literal(""), z.email().max(255)]).transform((v) => v || null),
  age: z.union([z.literal(""), z.coerce.number().int().min(2).max(100)]).transform((v) => (v === "" ? null : v)),
  notes: optional(2000),
});

export async function createStudent(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser(["admin"]);
  const parsed = studentFields
    .extend({ course: courseSlug, batch: z.string().trim().max(120), leadId: z.union([z.literal(""), z.uuid()]) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { course, batch, leadId, ...fields } = parsed.data;

  const [student] = await db
    .insert(students)
    .values({ ...fields, leadId: leadId || null })
    .returning({ id: students.id });
  await db.insert(enrolments).values({ studentId: student.id, courseSlug: course, batch });
  if (leadId) {
    await db.update(leads).set({ status: "enrolled", updatedAt: new Date() }).where(eq(leads.id, leadId));
    revalidatePath("/admin/leads", "layout");
  }
  revalidatePath("/admin/students");
  redirect(`/admin/students/${student.id}`);
}

export async function updateStudent(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser(["admin"]);
  const parsed = studentFields
    .extend({ id: z.uuid(), active: z.enum(["on", "off"]).optional() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { id, active, ...fields } = parsed.data;
  await db.update(students).set({ ...fields, active: active === "on" }).where(eq(students.id, id));
  revalidatePath(`/admin/students/${id}`);
  revalidatePath("/admin/students");
  return { ok: true, message: "Saved." };
}

export async function addEnrolment(formData: FormData) {
  await requireUser(["admin"]);
  const { studentId, course, batch } = z
    .object({ studentId: z.uuid(), course: courseSlug, batch: z.string().trim().max(120) })
    .parse(Object.fromEntries(formData));
  await db
    .insert(enrolments)
    .values({ studentId, courseSlug: course, batch })
    .onConflictDoUpdate({ target: [enrolments.studentId, enrolments.courseSlug], set: { batch, active: true } });
  revalidatePath(`/admin/students/${studentId}`);
}

export async function updateEnrolment(formData: FormData) {
  await requireUser(["admin"]);
  const { id, studentId, batch, active } = z
    .object({ id: z.uuid(), studentId: z.uuid(), batch: z.string().trim().max(120), active: z.enum(["true", "false"]) })
    .parse(Object.fromEntries(formData));
  await db
    .update(enrolments)
    .set({ batch, active: active === "true" })
    .where(and(eq(enrolments.id, id), eq(enrolments.studentId, studentId)));
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/admin/attendance");
}

/** Mark one student's attendance for one day (from the student page). */
export async function markStudentDay(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser(["admin", "teacher"]);
  const parsed = z
    .object({
      studentId: z.uuid(),
      enrolmentId: z.uuid(),
      date: z.string().refine(isIsoDate, "Pick a date"),
      status: z.enum(attendanceStatusEnum.enumValues),
      note: z.string().trim().max(300),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  if (d.date > todayIST()) return { ok: false, message: "You can't mark a future date." };

  const saved = await saveMarks([{ enrolmentId: d.enrolmentId, status: d.status, note: d.note }], d.date, user.id || null, await allowedCourses(user));
  if (!saved) return { ok: false, message: "You can't mark attendance for this art." };
  revalidatePath(`/admin/students/${d.studentId}`);
  revalidatePath("/admin/attendance");
  return { ok: true, message: `Marked ${d.status} for ${d.date}.` };
}
