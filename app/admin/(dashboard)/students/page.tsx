import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, eq, ilike, inArray, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { enrolments, students } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import { allowedCourses, attendanceRate, attendanceSummary, courseLabel, rollLabel } from "@/lib/attendance";
import { Card, PageHeader, buttonClass, inputClass, secondaryButtonClass } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Students" };

export default async function StudentsPage({ searchParams }: PageProps<"/admin/students">) {
  const user = await requireUser(["admin", "teacher"]);
  const allowed = await allowedCourses(user);
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const course = typeof sp.course === "string" && allowed.includes(sp.course) ? sp.course : "";
  const showInactive = sp.inactive === "1" && user.role === "admin";

  const courseFilter = course ? [course] : allowed;
  const roll = Number(q.replace(/^dr-?/i, ""));

  // Students with at least one enrolment in the visible arts (admins also see students with none).
  const enrolled = db
    .select({ id: enrolments.studentId })
    .from(enrolments)
    .where(inArray(enrolments.courseSlug, courseFilter.length ? courseFilter : ["-"]));

  const rows = await db
    .select()
    .from(students)
    .where(
      and(
        showInactive ? undefined : eq(students.active, true),
        user.role === "admin" && !course
          ? undefined
          : inArray(students.id, enrolled),
        q
          ? or(
              ilike(students.name, `%${q}%`),
              ilike(students.parentName, `%${q}%`),
              ilike(students.phone, `%${q}%`),
              Number.isInteger(roll) && roll > 0 ? eq(students.rollNo, roll) : sql`false`
            )
          : undefined
      )
    )
    .orderBy(asc(students.name))
    .limit(500);

  const ens = rows.length
    ? await db
        .select()
        .from(enrolments)
        .where(and(inArray(enrolments.studentId, rows.map((r) => r.id)), inArray(enrolments.courseSlug, allowed.length ? allowed : ["-"])))
    : [];
  const summary = await attendanceSummary(ens.map((e) => e.id));

  return (
    <>
      <PageHeader
        title="Students"
        subtitle={user.role === "teacher" ? "Students in the arts you teach." : `${rows.length} student${rows.length === 1 ? "" : "s"} shown`}
        actions={user.role === "admin" ? <Link href="/admin/students/new" className={buttonClass}>+ Add student</Link> : undefined}
      />

      <Card className="mb-4">
        <form method="get" className="flex flex-wrap items-end gap-3 p-4">
          <div className="min-w-56 flex-1">
            <label htmlFor="q" className="mb-1.5 block text-sm font-medium">Search</label>
            <input id="q" name="q" defaultValue={q} placeholder="Name, parent, phone or roll no (DR-0001)" className={inputClass} />
          </div>
          <div>
            <label htmlFor="course" className="mb-1.5 block text-sm font-medium">Art</label>
            <select id="course" name="course" defaultValue={course} className={inputClass}>
              <option value="">All {user.role === "teacher" ? "my " : ""}arts</option>
              {allowed.map((c) => <option key={c} value={c}>{courseLabel(c)}</option>)}
            </select>
          </div>
          {user.role === "admin" && (
            <label className="flex items-center gap-2 pb-2 text-sm">
              <input type="checkbox" name="inactive" value="1" defaultChecked={showInactive} /> Include inactive
            </label>
          )}
          <button className={secondaryButtonClass}>Filter</button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Roll no</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Parent / phone</th>
                  <th className="px-4 py-3">Arts &amp; attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((s) => {
                  const mine = ens.filter((e) => e.studentId === s.id);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{rollLabel(s.rollNo)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/students/${s.id}`} className="font-medium text-brand-700 hover:underline">{s.name}</Link>
                        {s.age ? <span className="text-slate-500">, {s.age}</span> : null}
                        {!s.active && <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600">inactive</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{s.parentName || "-"}{s.phone ? ` · ${s.phone}` : ""}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {mine.length === 0 && <span className="text-xs text-slate-400">No arts</span>}
                          {mine.map((e) => {
                            const rate = attendanceRate(summary.get(e.id));
                            return (
                              <span key={e.id} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${e.active ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500 line-through"}`}>
                                {courseLabel(e.courseSlug)}{e.batch ? ` · ${e.batch}` : ""}{rate !== null ? ` · ${rate}%` : ""}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
