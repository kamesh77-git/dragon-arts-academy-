import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { leadStatusEnum, leads, type LeadStatus } from "@/db/schema";
import { Card, PageHeader, StatusBadge, formatDateTime } from "@/components/admin/ui";
import { requireUser } from "@/lib/admin";

export const metadata: Metadata = { title: "Enquiries" };

const FILTERS: ("all" | LeadStatus)[] = ["all", ...leadStatusEnum.enumValues];

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireUser(["admin", "staff"]);
  const { status: raw } = await searchParams;
  const status = FILTERS.includes(raw as LeadStatus) ? (raw as LeadStatus | "all") : "all";

  const [rows, counts] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(status === "all" ? undefined : eq(leads.status, status))
      .orderBy(desc(leads.createdAt))
      .limit(200),
    db.select({ status: leads.status, value: count() }).from(leads).groupBy(leads.status),
  ]);
  const countFor = (s: (typeof FILTERS)[number]) =>
    s === "all" ? counts.reduce((n, c) => n + c.value, 0) : counts.find((c) => c.status === s)?.value ?? 0;

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Every enrollment enquiry submitted on the website. The visitor is also sent to WhatsApp." />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/leads" : `/admin/leads?status=${f}`}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize ring-1 transition ${
              status === f ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {f} <span className="opacity-70">({countFor(f)})</span>
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">No enquiries {status === "all" ? "yet" : `marked ${status}`}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${l.id}`} className="font-medium text-brand-700 hover:underline">{l.studentName}</Link>
                      {l.age ? <span className="text-slate-500">, {l.age}</span> : null}
                    </td>
                    <td className="px-4 py-3">{l.course || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><a href={`tel:${l.phone}`} className="hover:underline">{l.phone}</a></td>
                    <td className="px-4 py-3">{l.parentName || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDateTime(l.createdAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
