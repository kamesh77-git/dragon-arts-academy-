"use client";

import { useActionState } from "react";

import { changePassword, type PasswordState } from "./actions";
import { buttonClass, inputClass } from "@/components/admin/ui";

export default function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, null);

  return (
    <form action={action} className="max-w-md space-y-4 p-5">
      <div>
        <label htmlFor="current" className="mb-1.5 block text-sm font-medium">Current password</label>
        <input id="current" name="current" type="password" required autoComplete="current-password" className={inputClass} />
      </div>
      <div>
        <label htmlFor="next" className="mb-1.5 block text-sm font-medium">New password</label>
        <input id="next" name="next" type="password" minLength={8} required autoComplete="new-password" className={inputClass} />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" minLength={8} required autoComplete="new-password" className={inputClass} />
      </div>
      <div className="flex items-center gap-3">
        <button className={buttonClass} disabled={pending}>{pending ? "Saving…" : "Change password"}</button>
        {state && <p role="status" className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>}
      </div>
    </form>
  );
}
