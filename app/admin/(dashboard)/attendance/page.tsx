import type { Metadata } from "next";

import { requireUser } from "@/lib/admin";
import { allowedCourses, batchesFor, courseLabel, isIsoDate, rollLabel, roster, todayIST } from "@/lib/attendance";
import { Card, CardHeader, PageHeader, buttonClass, inputClass } from "@/components/admin/ui";
import AttendanceSheet from "./AttendanceSheet";
import UploadAttendance from "./UploadAttendance";

export const metadata: Metadata = { title: "Attendance" };

export default async function AttendancePage({ searchParams }: PageProps<"/admin/attendance">) {
  const user = await requireUser(["admin", "teacher"]);
  const allowed = await allowedCourses(user);
  const sp = await searchParams;

  if (allowed.length === 0) {
    return (
      <>
        <PageHeader title="Attendance" />
        <Card className="p-8 text-center text-sm text-slate-600">
          No arts are assigned to your account yet. Ask the admin to assign your arts under Team.
        </Card>
      </>
    );
  }

  const course = typeof sp.course === "string" && allowed.includes(sp.course) ? sp.course : allowed[0];
  const today = todayIST();
  const date = isIsoDate(sp.date) && sp.date <= today ? sp.date : today;
  const batches = await batchesFor(course);
  const batch = typeof sp.batch === "string" && batches.includes(sp.batch) ? sp.batch : "";
  const rows = await roster(course, date, batch || undefined);

  const qs = new URLSearchParams({ course, date, ...(batch ? { batch } : {}) });

  return (
    <>
      <PageHeader title="Attendance" subtitle="Mark each student present, absent, late or excused, or upload a CSV." />

      <Card className="mb-6">
        <form method="get" className="flex flex-wrap items-end gap-4 p-5">
          <div>
            <label htmlFor="course" className="mb-1.5 block text-sm font-medium">Art</label>
            <select id="course" name="course" defaultValue={course} className={inputClass}>
              {allowed.map((c) => <option key={c} value={c}>{courseLabel(c)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="batch" className="mb-1.5 block text-sm font-medium">Batch</label>
            <select id="batch" name="batch" defaultValue={batch} className={inputClass}>
              <option value="">All batches</option>
              {batches.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium">Date</label>
            <input id="date" name="date" type="date" defaultValue={date} max={today} className={inputClass} />
          </div>
          <button className={buttonClass}>Show students</button>
        </form>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden">
          <CardHeader title={`${courseLabel(course)}${batch ? ` · ${batch}` : ""} · ${new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}`} />
          <AttendanceSheet
            key={`${course}|${batch}|${date}`}
            course={course}
            date={date}
            rows={rows.map((r) => ({
              enrolmentId: r.enrolmentId,
              studentId: r.studentId,
              roll: rollLabel(r.rollNo),
              name: r.name,
              batch: r.batch,
              status: r.status,
              note: r.note,
            }))}
          />
        </Card>

        <Card className="self-start">
          <CardHeader title="Upload attendance (CSV)" />
          <UploadAttendance course={course} date={date} templateHref={`/admin/attendance/template?${qs}`} />
        </Card>
      </div>
    </>
  );
}
