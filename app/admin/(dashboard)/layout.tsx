import type { ReactNode } from "react";
import { count, eq } from "drizzle-orm";

import { signOut } from "@/auth";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import Sidebar from "@/components/admin/Sidebar";

// Admin pages read live data per request and are auth-gated.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const newLeads =
    user.role === "teacher"
      ? 0
      : (await db.select({ value: count() }).from(leads).where(eq(leads.status, "new")))[0].value;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-6 bg-gradient-to-b from-navy to-[#0b3d47] p-5 text-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.webp" alt="" width={40} height={40} className="h-10 w-10" />
          <div className="leading-tight">
            <p className="font-display text-lg font-bold">Dragon Ryu</p>
            <p className="text-xs uppercase tracking-wider text-white/60">{user.role === "admin" ? "Admin" : user.role === "staff" ? "Staff" : "Teacher"}</p>
          </div>
        </div>
        <Sidebar role={user.role} newLeads={newLeads} />
        <div className="mt-auto space-y-3 border-t border-white/10 pt-4 text-sm">
          <a href="/" target="_blank" rel="noopener" className="block text-white/70 hover:text-white">↗ View website</a>
          <p className="truncate text-white/50" title={user.email ?? ""}>{user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button className="text-white/70 hover:text-white">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8">{children}</main>
    </div>
  );
}
