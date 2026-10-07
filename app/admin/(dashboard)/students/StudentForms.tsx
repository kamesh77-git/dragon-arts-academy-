"use client";

import { useActionState } from "react";

import type { AttendanceStatus } from "@/db/schema";
import { buttonClass, inputClass } from "@/components/admin/ui";
import { createStudent, markStudentDay, updateStudent, type FormState } from "./actions";

interface StudentValues {
  id?: string;
  name: string;
  parentName: string;
  phone: string;
  email: string;
  age: string;
  notes: string;
  active?: boolean;
}

function Status({ state }: { state: FormState }) {
  if (!state) return null;
  return <p role="status" className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>;
}

function Fields({ v }: { v: StudentValues }) {
  return (
    <>
      <div className="sm:col-span-2">
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Student name</label>
        <input id="name" name="name" defaultValue={v.name} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="parentName" className="mb-1.5 block text-sm font-medium">Parent / guardian</label>
        <input id="parentName" name="parentName" defaultValue={v.parentName} className={inputClass} />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">Phone</label>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" defaultValue={v.email} className={inputClass} />
      </div>
      <div>
        <label htmlFor="age" className="mb-1.5 block text-sm font-medium">Age</label>
        <input id="age" name="age" type="number" min={2} max={100} defaultValue={v.age} className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">Notes</label>
        <textarea id="notes" name="notes" rows={2} defaultValue={v.notes} className={inputClass} />
      </div>
    </>
  );
}

export function NewStudentForm({ values, leadId, courseOptions, defaultCourse }: { values: StudentValues; leadId: string; courseOptions: { slug: string; name: string }[]; defaultCourse: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createStudent, null);
  return (
    <form action={action} className="grid gap-4 p-5 sm:grid-cols-2">
      <input type="hidden" name="leadId" value={leadId} />
      <Fields v={values} />
      <div>
        <label htmlFor="course" className="mb-1.5 block text-sm font-medium">Art</label>
        <select id="course" name="course" defaultValue={defaultCourse} required className={inputClass}>
          <option value="">Choose an art…</option>
          {courseOptions.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="batch" className="mb-1.5 block text-sm font-medium">Batch</label>
        <input id="batch" name="batch" placeholder="e.g. Mon/Wed 5 pm" className={inputClass} />
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button className={buttonClass} disabled={pending}>{pending ? "Saving…" : "Add student"}</button>
        <Status state={state} />
      </div>
    </form>
  );
}

export function EditStudentForm({ values }: { values: StudentValues }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateStudent, null);
  return (
    <form action={action} className="grid gap-4 p-5 sm:grid-cols-2">
      <input type="hidden" name="id" value={values.id} />
      <Fields v={values} />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="hidden" name="active" value="off" />
        <input type="checkbox" name="active" value="on" defaultChecked={values.active} className="h-4 w-4" />
        Active student (inactive students are hidden from attendance)
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button className={buttonClass} disabled={pending}>{pending ? "Saving…" : "Save details"}</button>
        <Status state={state} />
      </div>
    </form>
  );
}

export function MarkDayForm({ studentId, enrolments, today }: { studentId: string; enrolments: { id: string; name: string }[]; today: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(markStudentDay, null);
  const statuses: { v: AttendanceStatus; l: string }[] = [
    { v: "present", l: "Present" },
    { v: "absent", l: "Absent" },
    { v: "late", l: "Late" },
    { v: "excused", l: "Excused" },
  ];
  return (
    <form action={action} className="grid gap-3 p-5">
      <input type="hidden" name="studentId" value={studentId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="mark-enrolment" className="mb-1.5 block text-sm font-medium">Art</label>
          <select id="mark-enrolment" name="enrolmentId" className={inputClass}>
            {enrolments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="mark-date" className="mb-1.5 block text-sm font-medium">Date</label>
          <input id="mark-date" name="date" type="date" defaultValue={today} max={today} required className={inputClass} />
        </div>
      </div>
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Status</legend>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s, i) => (
            <label key={s.v} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:font-semibold">
              <input type="radio" name="status" value={s.v} defaultChecked={i === 0} className="sr-only" />
              {s.l}
            </label>
          ))}
        </div>
      </fieldset>
      <input name="note" placeholder="Note (optional)" maxLength={300} className={inputClass} aria-label="Note" />
      <div className="flex items-center gap-3">
        <button className={buttonClass} disabled={pending}>{pending ? "Saving…" : "Save mark"}</button>
        <Status state={state} />
      </div>
    </form>
  );
}
