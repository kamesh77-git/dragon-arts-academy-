import type { Metadata } from "next";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import { Card, CardHeader, PageHeader, formatDateTime } from "@/components/admin/ui";
import AddMemberForm from "./AddMemberForm";
import RoleFields from "./RoleFields";
import { courses } from "@/lib/courses";
import { removeTeamMember, updateRole } from "./actions";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const me = await requireUser(["admin"]);
  const team = await db.select().from(users).orderBy(asc(users.createdAt));
  const courseOptions = courses.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <>
      <PageHeader title="Team" subtitle="People who can sign in. Admin: everything. Staff: enquiries only. Teacher: attendance and students for their arts." />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Person</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Added</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {team.map((u) => {
                const isMe = u.id === me.id;
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{u.name || "-"}{isMe && <span className="ml-2 text-xs text-slate-400">(you)</span>}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {isMe ? (
                        <span className="capitalize">{u.role}</span>
                      ) : (
                        <form action={updateRole} className="flex flex-wrap items-start gap-2">
                          <input type="hidden" name="id" value={u.id} />
                          <RoleFields compact defaultRole={u.role} defaultCourses={u.courses} courseOptions={courseOptions} />
                          <button className="py-1 text-xs font-medium text-brand-700 hover:underline">Update</button>
                        </form>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(u.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {!isMe && (
                        <form action={removeTeamMember}>
                          <input type="hidden" name="id" value={u.id} />
                          <button className="text-xs font-medium text-red-600 hover:underline">Remove</button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Add a team member" />
        <AddMemberForm courseOptions={courseOptions} />
      </Card>
    </>
  );
}
