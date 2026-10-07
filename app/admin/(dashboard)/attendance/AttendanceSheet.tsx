"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import type { AttendanceStatus } from "@/db/schema";
import { buttonClass, secondaryButtonClass } from "@/components/admin/ui";
import { saveAttendance, type SaveResult } from "./actions";

interface Row {
  enrolmentId: string;
  studentId: string;
  roll: string;
  name: string;
  batch: string;
  status: AttendanceStatus | null;
  note: string | null;
}

const OPTIONS: { value: AttendanceStatus; short: string; label: string; on: string }[] = [
  { value: "present", short: "P", label: "Present", on: "bg-emerald-600 text-white ring-emerald-600" },
  { value: "absent", short: "A", label: "Absent", on: "bg-red-600 text-white ring-red-600" },
  { value: "late", short: "L", label: "Late", on: "bg-amber-500 text-white ring-amber-500" },
  { value: "excused", short: "E", label: "Excused", on: "bg-sky-600 text-white ring-sky-600" },
];

export default function AttendanceSheet({ course, date, rows }: { course: string; date: string; rows: Row[] }) {
  const initial = useMemo(() => Object.fromEntries(rows.map((r) => [r.enrolmentId, r.status])), [rows]);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus | null>>(initial);
  const [notes, setNotes] = useState<Record<string, string>>(Object.fromEntries(rows.map((r) => [r.enrolmentId, r.note ?? ""])));
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();

  const counts = OPTIONS.map((o) => ({ ...o, n: Object.values(marks).filter((m) => m === o.value).length }));
  const unmarked = rows.filter((r) => !marks[r.enrolmentId]).length;
  const dirty = rows.some((r) => marks[r.enrolmentId] !== initial[r.enrolmentId] || (notes[r.enrolmentId] ?? "") !== (r.note ?? ""));

  function setAll(status: AttendanceStatus) {
    setMarks(Object.fromEntries(rows.map((r) => [r.enrolmentId, status])));
  }

  function save() {
    setResult(null);
    startTransition(async () => {
      const res = await saveAttendance({
        course,
        date,
        marks: rows
          .filter((r) => marks[r.enrolmentId])
          .map((r) => ({ enrolmentId: r.enrolmentId, status: marks[r.enrolmentId]!, note: notes[r.enrolmentId] || undefined })),
      });
      setResult(res);
    });
  }

  if (rows.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-slate-500">No active students in this art{date ? "" : ""} yet. Ask the admin to add students under Students.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
        <div className="flex flex-wrap gap-2 text-xs">
          {counts.map((c) => (
            <span key={c.value} className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{c.label}: {c.n}</span>
          ))}
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-500">Not marked: {unmarked}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setAll("present")} className={secondaryButtonClass}>Mark all present</button>
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {rows.map((r) => (
          <li key={r.enrolmentId} className="flex flex-wrap items-center gap-3 px-5 py-3">
            <div className="min-w-0 flex-1 basis-56">
              <Link href={`/admin/students/${r.studentId}`} className="font-medium text-slate-900 hover:text-brand-700 hover:underline">{r.name}</Link>
              <p className="text-xs text-slate-500">{r.roll}{r.batch ? ` · ${r.batch}` : ""}</p>
            </div>
            <div role="radiogroup" aria-label={`Attendance for ${r.name}`} className="flex gap-1.5">
              {OPTIONS.map((o) => {
                const on = marks[r.enrolmentId] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    title={o.label}
                    onClick={() => setMarks({ ...marks, [r.enrolmentId]: on ? null : o.value })}
                    className={`h-9 w-9 rounded-lg text-sm font-bold ring-1 transition ${on ? o.on : "bg-white text-slate-500 ring-slate-300 hover:bg-slate-50"}`}
                  >
                    {o.short}
                  </button>
                );
              })}
            </div>
            <input
              aria-label={`Note for ${r.name}`}
              placeholder="Note (optional)"
              value={notes[r.enrolmentId] ?? ""}
              onChange={(e) => setNotes({ ...notes, [r.enrolmentId]: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm sm:w-56"
              maxLength={300}
            />
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
        <button type="button" onClick={save} disabled={pending || !dirty} className={buttonClass}>
          {pending ? "Saving…" : "Save attendance"}
        </button>
        {dirty && !pending && <span className="text-xs text-amber-700">Unsaved changes</span>}
        {result && <p role="status" className={`text-sm ${result.ok ? "text-emerald-700" : "text-red-600"}`}>{result.message}</p>}
        <span className="ml-auto text-xs text-slate-500">P present · A absent · L late · E excused. Click again to clear.</span>
      </div>
    </div>
  );
}
