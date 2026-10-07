import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import { leads } from "@/db/schema";
import { auditAllPages } from "@/lib/seo/audit";
import { Card, CardHeader, PageHeader, ScoreBadge, StatCard, StatusBadge, formatDateTime } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverview() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [[{ value: newCount }], [{ value: monthCount }], [{ value: enrolledCount }], recent, audits] = await Promise.all([
    db.select({ value: count() }).from(leads).where(eq(leads.status, "new")),
    db.select({ value: count() }).from(leads).where(gte(leads.createdAt, monthStart)),
    db.select({ value: count() }).from(leads).where(eq(leads.status, "enrolled")),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6),
    auditAllPages(),
  ]);

  const avgScore = Math.round(audits.reduce((s, a) => s + a.audit.overallScore, 0) / Math.max(audits.length, 1));
  const weakest = [...audits].sort((a, b) => a.audit.overallScore - b.audit.overallScore).slice(0, 5);

  return (
    <>
      <PageHeader title="Overview" subtitle="Enquiries from the website and the health of every page's SEO." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New enquiries" value={newCount} hint="Waiting for a call back" />
        <StatCard label="Enquiries this month" value={monthCount} />
        <StatCard label="Marked enrolled" value={enrolledCount} hint="All time" />
        <StatCard label="Average SEO score" value={<ScoreBadge score={avgScore} />} hint={`${audits.length} pages · 69 rules each`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Latest enquiries" actions={<Link href="/admin/leads" className="text-sm font-medium text-brand-600 hover:underline">View all</Link>} />
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">No enquiries yet. They appear here when someone submits the website form.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads/${l.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{l.studentName}{l.age ? `, ${l.age}` : ""}</p>
                      <p className="truncate text-xs text-slate-500">{l.course || "No course chosen"} · {formatDateTime(l.createdAt)}</p>
                    </div>
                    <StatusBadge status={l.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Pages needing SEO work" actions={<Link href="/admin/seo" className="text-sm font-medium text-brand-600 hover:underline">All pages</Link>} />
          <ul className="divide-y divide-slate-100">
            {weakest.map((a) => (
              <li key={a.path}>
                <Link href={`/admin/seo/audit?path=${encodeURIComponent(a.path)}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{a.seo.name}</p>
                    <p className="truncate text-xs text-slate-500">{a.audit.failedRules} of {a.audit.rules.length} rules failing</p>
                  </div>
                  <ScoreBadge score={a.audit.overallScore} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
