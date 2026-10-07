"use client";

import { useActionState } from "react";

import { addTeamMember, type TeamState } from "./actions";
import { buttonClass, inputClass } from "@/components/admin/ui";

export default function AddMemberForm() {
  const [state, action, pending] = useActionState<TeamState, FormData>(addTeamMember, null);

  return (
    <form action={action} className="grid gap-4 p-5 sm:grid-cols-2">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
        <input id="name" name="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="role" className="mb-1.5 block text-sm font-medium">Role</label>
        <select id="role" name="role" defaultValue="staff" className={inputClass}>
          <option value="staff">Staff: enquiries and SEO</option>
          <option value="admin">Admin: everything, incl. team</option>
        </select>
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Temporary password</label>
        <input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" className={inputClass} />
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button className={buttonClass} disabled={pending}>{pending ? "Adding…" : "Add team member"}</button>
        {state && <p role="status" className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>}
      </div>
    </form>
  );
}
