import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { attendance, enrolments, students, users } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import { STATUSES, allowedCourses, attendanceRate, attendanceSummary, courseLabel, rollLabel, todayIST } from "@/lib/attendance";
import { courses } from "@/lib/courses";
import { Card, CardHeader, PageHeader, StatCard, buttonClass, inputClass, secondaryButtonClass } from "@/components/admin/ui";
import { addEnrolment, updateEnrolment } from "../actions";
import { EditStudentForm, MarkDayForm } from "../StudentForms";

export const metadata: Metadata = { title: "Student" };

const STATUS_STYLE = {
  present: "bg-emerald-100 text-emerald-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-amber-100 text-amber-800",
  excused: "bg-sky-100 text-sky-800",
} as const;

export default async function StudentPage({ params }: PageProps<"/admin/students/[id]">) {
  const user = await requireUser(["admin", "teacher"]);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const student = await db.query.students.findFirst({ where: eq(students.id, id) });
  if (!student) notFound();

  const allowed = await allowedCourses(user);
  const isAdmin = user.role === "admin";
  const allEnrolments = await db.select().from(enrolments).where(eq(enrolments.studentId, id));
  const visible = allEnrolments.filter((e) => allowed.includes(e.courseSlug));
  // Teachers may only open students in the arts they teach.
  if (!isAdmin && visible.length === 0) notFound();

  const summary = await attendanceSummary(visible.map((e) => e.id));
  const history = visible.length
    ? await db
        .select({
          date: attendance.date,
          status: attendance.status,
          note: attendance.note,
          courseSlug: enrolments.courseSlug,
          markedBy: users.name,
          markedByEmail: users.email,
        })
        .from(attendance)
        .innerJoin(enrolments, eq(enrolments.id, attendance.enrolmentId))
        .leftJoin(users, eq(users.id, attendance.markedBy))
        .where(and(inArray(attendance.enrolmentId, visible.map((e) => e.id))))
        .orderBy(desc(attendance.date))
        .limit(120)
    : [];

  const totals = { present: 0, absent: 0, late: 0, excused: 0 };
  for (const e of visible) {
    const c = summary.get(e.id);
    if (c) for (const k of Object.keys(totals) as (keyof typeof totals)[]) totals[k] += c[k];
  }
  const overall = attendanceRate(totals);
  const markable = visible.filter((e) => e.active).map((e) => ({ id: e.id, name: courseLabel(e.courseSlug) }));

  return (
    <>
      <PageHeader
        title={student.name}
        subtitle={`${rollLabel(student.rollNo)}${student.age ? ` · ${student.age} yrs` : ""}${student.active ? "" : " · inactive"}`}
        actions={
          <>
            {student.phone && <a href={`tel:${student.phone}`} className={secondaryButtonClass}>Call parent</a>}
            <Link href={isAdmin ? "/admin/students" : "/admin/attendance"} className={secondaryButtonClass}>← Back</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Attendance" value={overall === null ? "–" : `${overall}%`} hint="Present + late, excused not counted" />
        {STATUSES.map((s) => (
          <StatCard key={s.value} label={s.label} value={totals[s.value]} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Arts" />
            <ul className="divide-y divide-slate-100">
              {visible.length === 0 && <li className="px-5 py-4 text-sm text-slate-500">Not enrolled in any art yet.</li>}
              {visible.map((e) => {
                const c = summary.get(e.id);
                const rate = attendanceRate(c);
                return (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{courseLabel(e.courseSlug)} {!e.active && <span className="text-xs text-slate-400">(stopped)</span>}</p>
                      <p className="text-xs text-slate-500">{e.batch || "No batch"} · since {e.startedOn}{c ? ` · P ${c.present} · A ${c.absent} · L ${c.late} · E ${c.excused}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-slate-900">{rate === null ? "–" : `${rate}%`}</span>
                      {isAdmin && (
                        <form action={updateEnrolment} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={e.id} />
                          <input type="hidden" name="studentId" value={student.id} />
                          <input name="batch" defaultValue={e.batch} aria-label="Batch" placeholder="Batch" className="w-36 rounded border border-slate-300 px-2 py-1 text-xs" />
                          <input type="hidden" name="active" value={String(e.active)} />
                          <button className="text-xs font-medium text-brand-700 hover:underline">Save batch</button>
                          <button name="active" value={String(!e.active)} className="text-xs font-medium text-slate-500 hover:underline">
                            {e.active ? "Stop" : "Resume"}
                          </button>
                        </form>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            {isAdmin && (
              <form action={addEnrolment} className="flex flex-wrap items-end gap-3 border-t border-slate-100 px-5 py-4">
                <input type="hidden" name="studentId" value={student.id} />
                <div>
                  <label htmlFor="add-course" className="mb-1 block text-xs font-medium">Add an art</label>
                  <select id="add-course" name="course" required className={inputClass}>
                    {courses.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="add-batch" className="mb-1 block text-xs font-medium">Batch</label>
                  <input id="add-batch" name="batch" placeholder="e.g. Sat 10 am" className={inputClass} />
                </div>
                <button className={buttonClass}>Add</button>
              </form>
            )}
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title={`Attendance history (${history.length})`} />
            {history.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No attendance marked yet.</p>
            ) : (
              <div className="max-h-[520px] overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5">Date</th>
                      <th className="px-4 py-2.5">Art</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Note</th>
                      <th className="px-4 py-2.5">Marked by</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((h) => (
                      <tr key={`${h.date}-${h.courseSlug}`}>
                        <td className="px-4 py-2.5 whitespace-nowrap">{new Date(h.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="px-4 py-2.5">{courseLabel(h.courseSlug)}</td>
                        <td className="px-4 py-2.5"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[h.status]}`}>{h.status}</span></td>
                        <td className="px-4 py-2.5 text-slate-600">{h.note || ""}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{h.markedBy || h.markedByEmail || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {markable.length > 0 && (
            <Card>
              <CardHeader title="Mark attendance for this student" />
              <MarkDayForm studentId={student.id} enrolments={markable} today={todayIST()} />
            </Card>
          )}

          <Card>
            <CardHeader title="Details" />
            {isAdmin ? (
              <EditStudentForm
                values={{
                  id: student.id,
                  name: student.name,
                  parentName: student.parentName ?? "",
                  phone: student.phone ?? "",
                  email: student.email ?? "",
                  age: student.age ? String(student.age) : "",
                  notes: student.notes ?? "",
                  active: student.active,
                }}
              />
            ) : (
              <dl className="space-y-2 p-5 text-sm">
                <div><dt className="text-slate-500">Parent / guardian</dt><dd className="font-medium">{student.parentName || "-"}</dd></div>
                <div><dt className="text-slate-500">Phone</dt><dd className="font-medium">{student.phone || "-"}</dd></div>
              </dl>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
