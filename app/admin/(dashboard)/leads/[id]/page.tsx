import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { leadStatusEnum, leads } from "@/db/schema";
import { Card, CardHeader, PageHeader, StatusBadge, buttonClass, formatDateTime, inputClass, secondaryButtonClass } from "@/components/admin/ui";
import { updateLead } from "../actions";

export const metadata: Metadata = { title: "Enquiry" };

export default async function LeadDetailPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, id) });
  if (!lead) notFound();

  const digits = lead.phone.replace(/\D/g, "");
  const waNumber = digits.length === 10 ? `91${digits}` : digits;
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, this is Dragon Ryu Arts Academy replying to your enquiry for ${lead.studentName}.`)}`;

  const rows: [string, string | number | null][] = [
    ["Student", lead.studentName],
    ["Age", lead.age],
    ["Course", lead.course],
    ["Parent / guardian", lead.parentName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Submitted from", lead.sourcePath],
    ["Received", formatDateTime(lead.createdAt)],
  ];

  return (
    <>
      <PageHeader
        title={lead.studentName}
        subtitle={<>Enquiry received {formatDateTime(lead.createdAt)} · <StatusBadge status={lead.status} /></>}
        actions={
          <>
            <a href={`tel:${lead.phone}`} className={secondaryButtonClass}>Call</a>
            <a href={waHref} target="_blank" rel="noopener" className={buttonClass}>Reply on WhatsApp</a>
            <Link href="/admin/leads" className={secondaryButtonClass}>← All enquiries</Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader title="Details" />
          <dl className="divide-y divide-slate-100">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
                <dt className="text-slate-500">{k}</dt>
                <dd className="col-span-2 font-medium text-slate-900">{v ?? "-"}</dd>
              </div>
            ))}
            <div className="px-5 py-4 text-sm">
              <dt className="text-slate-500">Message</dt>
              <dd className="mt-1 whitespace-pre-wrap text-slate-900">{lead.message || "-"}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader title="Follow-up" />
          <form action={updateLead} className="space-y-4 p-5">
            <input type="hidden" name="id" value={lead.id} />
            <div>
              <label htmlFor="status" className="mb-1.5 block text-sm font-medium">Status</label>
              <select id="status" name="status" defaultValue={lead.status} className={`${inputClass} capitalize`}>
                {leadStatusEnum.enumValues.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">Notes</label>
              <textarea id="notes" name="notes" rows={6} defaultValue={lead.notes ?? ""} className={inputClass} placeholder="Called on…, visiting Saturday, prefers evening batch…" />
            </div>
            <button className={buttonClass}>Save</button>
            <p className="text-xs text-slate-500">Last updated {formatDateTime(lead.updatedAt)}</p>
          </form>
        </Card>
      </div>
    </>
  );
}
