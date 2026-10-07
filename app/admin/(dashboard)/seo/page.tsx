import type { Metadata } from "next";
import Link from "next/link";

import { auditAllPages } from "@/lib/seo/audit";
import { Card, PageHeader, ScoreBadge, StatCard } from "@/components/admin/ui";
import { requireUser } from "@/lib/admin";

export const metadata: Metadata = { title: "SEO" };

export default async function SeoDashboard() {
  await requireUser(["admin"]);
  const audits = await auditAllPages();
  const avg = Math.round(audits.reduce((s, a) => s + a.audit.overallScore, 0) / Math.max(audits.length, 1));
  const excellent = audits.filter((a) => a.audit.overallScore >= 90).length;

  // Rules failing on the most pages: where a single fix helps most.
  const failCounts = new Map<string, { name: string; category: string; pages: number; recommendation: string }>();
  for (const a of audits) {
    for (const r of a.audit.rules) {
      if (r.passed) continue;
      const entry = failCounts.get(r.id) ?? { name: r.name, category: r.category, pages: 0, recommendation: r.recommendation };
      entry.pages += 1;
      failCounts.set(r.id, entry);
    }
  }
  const topFails = [...failCounts.values()].sort((a, b) => b.pages - a.pages).slice(0, 8);

  return (
    <>
      <PageHeader
        title="SEO"
        subtitle="Each page is scored live against the 69-rule engine (keyword, title, meta, content, media, links, technical, schema, E-E-A-T, AI/AEO)."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Average score" value={<ScoreBadge score={avg} />} hint={`${audits.length} pages audited`} />
        <StatCard label="Excellent (90+)" value={excellent} />
        <StatCard label="Need work (<75)" value={audits.filter((a) => a.audit.overallScore < 75).length} />
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Focus keyword</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Rules passed</th>
                <th className="px-4 py-3">Words</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {audits.map((a) => (
                <tr key={a.path} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{a.seo.name}{a.seo.hasOverride && <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-700">edited</span>}</p>
                    <p className="text-xs text-slate-500">{a.path}</p>
                    {a.error && <p className="text-xs text-red-600">{a.error}</p>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{a.seo.focusKeyword}</td>
                  <td className="px-4 py-3 text-center"><ScoreBadge score={a.audit.overallScore} /></td>
                  <td className="px-4 py-3 text-center text-slate-600">{a.audit.passedRules}/{a.audit.rules.length}</td>
                  <td className="px-4 py-3 text-slate-600">{a.input.wordCount}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <Link href={`/admin/seo/audit?path=${encodeURIComponent(a.path)}`} className="font-medium text-brand-700 hover:underline">Audit</Link>
                    <span className="mx-2 text-slate-300">|</span>
                    <Link href={`/admin/seo/edit?path=${encodeURIComponent(a.path)}`} className="font-medium text-brand-700 hover:underline">Edit meta</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {topFails.length > 0 && (
        <Card className="mt-6">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Most common issues</h2>
            <p className="text-xs text-slate-500">Rules failing on the most pages</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {topFails.map((f) => (
              <li key={f.name} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{f.name} <span className="text-xs font-normal text-slate-400">· {f.category}</span></p>
                  <p className="text-slate-500">{f.recommendation}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">{f.pages} pages</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
