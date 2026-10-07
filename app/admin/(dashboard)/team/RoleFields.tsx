"use client";

import { useState } from "react";

type Role = "admin" | "staff" | "teacher";

const ROLE_HELP: Record<Role, string> = {
  admin: "Everything, including team, blog and SEO",
  staff: "Enquiries only",
  teacher: "Attendance and students for the ticked arts",
};

// Role picker that reveals the arts checkboxes when "Teacher" is chosen.
export default function RoleFields({
  defaultRole = "staff",
  defaultCourses = [],
  courseOptions,
  compact = false,
}: {
  defaultRole?: Role;
  defaultCourses?: string[];
  courseOptions: { slug: string; name: string }[];
  compact?: boolean;
}) {
  const [role, setRole] = useState<Role>(defaultRole);
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <select
        name="role"
        aria-label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className={compact ? "rounded border border-slate-300 px-2 py-1 text-sm" : "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"}
      >
        <option value="staff">Staff</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>
      {!compact && <p className="text-xs text-slate-500">{ROLE_HELP[role]}</p>}
      {role === "teacher" && (
        <fieldset className="rounded-lg border border-slate-200 p-3">
          <legend className="px-1 text-xs font-medium text-slate-600">Arts handled</legend>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {courseOptions.map((c) => (
              <label key={c.slug} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="courses" value={c.slug} defaultChecked={defaultCourses.includes(c.slug)} className="h-4 w-4" />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
