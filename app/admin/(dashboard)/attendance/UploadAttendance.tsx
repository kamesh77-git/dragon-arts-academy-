"use client";

import { useActionState } from "react";

import { buttonClass, inputClass } from "@/components/admin/ui";
import { uploadAttendance, type UploadResult } from "./actions";

export default function UploadAttendance({ course, date, templateHref }: { course: string; date: string; templateHref: string }) {
  const [state, action, pending] = useActionState<UploadResult, FormData>(uploadAttendance, null);

  return (
    <form action={action} className="space-y-4 p-5">
      <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
        <li><a href={templateHref} className="font-medium text-brand-700 hover:underline">Download the CSV template</a> for this art and date.</li>
        <li>Fill the <strong>status</strong> column with P, A, L or E (Excel or Google Sheets is fine). Change the date column to upload several days at once.</li>
        <li>Upload it here. Blank status rows are skipped; existing marks for the same day are updated.</li>
      </ol>
      <input type="hidden" name="course" value={course} />
      <input type="hidden" name="date" value={date} />
      <input type="file" name="file" accept=".csv,text/csv" required aria-label="Attendance CSV file" className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-brand-700`} />
      <button className={buttonClass} disabled={pending}>{pending ? "Uploading…" : "Upload attendance"}</button>
      {state && (
        <div role="status" className={`rounded-lg px-4 py-3 text-sm ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
          <p className="font-medium">Saved {state.saved} mark{state.saved === 1 ? "" : "s"}{state.skipped ? `, skipped ${state.skipped} blank row${state.skipped === 1 ? "" : "s"}` : ""}.</p>
          {state.errors.length > 0 && (
            <ul className="mt-2 list-disc space-y-0.5 pl-5">
              {state.errors.map((e) => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
