import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSitePage } from "@/lib/pages";
import { auditPage } from "@/lib/seo/audit";
import type { RuleResult, SEOPriority } from "@/lib/seo/types";
import { Card, CardHeader, PageHeader, ScoreBadge, buttonClass, scoreColor, secondaryButtonClass } from "@/components/admin/ui";

export const metadata: Metadata = { title: "SEO audit" };

const PRIORITY_ORDER: SEOPriority[] = ["Critical", "High", "Medium", "Low"];
const PRIORITY_STYLE: Record<SEOPriority, string> = {
  Critical: "bg-red-100 text-red-800",
  High: "bg-orange-100 text-orange-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-slate-100 text-slate-700",
};

function RuleRow({ rule }: { rule: RuleResult }) {
  return (
    <tr className="align-top">
      <td className="px-4 py-3">
        <p className="font-medium text-slate-900">{rule.name}</p>
        <p className="text-xs text-slate-500">{rule.description}</p>
      </td>
      <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLE[rule.priority]}`}>{rule.priority}</span></td>
      <td className="px-4 py-3 text-slate-600">{rule.value}</td>
      <td className="px-4 py-3 text-slate-500">{rule.expected}</td>
      <td className="px-4 py-3 text-center font-semibold">{rule.earned}/{rule.total}</td>
      <td className="px-4 py-3 text-center">
        {rule.passed ? <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">PASS</span> : <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">FAIL</span>}
      </td>
    </tr>
  );
}

export default async function SeoAuditPage({ searchParams }: PageProps<"/admin/seo/audit">) {
  const { path } = await searchParams;
  if (typeof path !== "string" || !getSitePage(path)) notFound();

  const { seo, audit, status, input, schemaTypes, error } = await auditPage(path);
  const failing = audit.rules
    .filter((r) => !r.passed)
    .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority) || b.total - a.total);
  const imageCount = (input.content.match(/!\[[^\]]*]\([^)]*\)/g) ?? []).length;

  return (
    <>
      <PageHeader
        title={`SEO audit: ${seo.name}`}
        subtitle={path}
        actions={
          <>
            <a href={path} target="_blank" rel="noopener" className={secondaryButtonClass}>View page ↗</a>
            <Link href={`/admin/seo/edit?path=${encodeURIComponent(path)}`} className={buttonClass}>Edit meta & keywords</Link>
            <Link href="/admin/seo" className={secondaryButtonClass}>← All pages</Link>
          </>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}. Scores below may be incomplete.</p>}

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Overall score</p>
          <p className={`mx-auto mt-3 flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold ring-8 ${scoreColor(audit.overallScore)}`}>{audit.overallScore}</p>
          <p className="mt-3 font-semibold text-slate-900">{status}</p>
          <p className="text-sm text-slate-500">{audit.passedRules} passed · {audit.failedRules} failed · {audit.rules.length} rules</p>
          <p className="text-sm text-slate-500">{audit.earnedPoints} of {audit.totalPoints} points</p>
        </Card>

        <Card>
          <CardHeader title="By category" />
          <div className="grid gap-x-8 gap-y-3 p-5 sm:grid-cols-2">
            {audit.categoryScores.map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{c.category}</span>
                  <span className="text-slate-500">{c.earned}/{c.total}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${c.percentage >= 75 ? "bg-brand-500" : c.percentage >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader title={`Fix these first (${failing.length})`} />
          {failing.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">Every rule passes. 🎉</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {failing.map((r) => (
                <li key={r.id} className="flex items-start gap-3 px-5 py-3 text-sm">
                  <span className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLE[r.priority]}`}>{r.priority}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{r.name} <span className="text-xs font-normal text-slate-400">· {r.category} · {r.total} pts</span></p>
                    <p className="text-slate-600">{r.recommendation}</p>
                    <p className="text-xs text-slate-400">Now: {r.value} · Target: {r.expected}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="What the audit read" />
          <dl className="space-y-3 p-5 text-sm">
            <div><dt className="text-slate-500">Meta title</dt><dd className="font-medium">{seo.metaTitle}</dd></div>
            <div><dt className="text-slate-500">Meta description</dt><dd>{seo.metaDescription}</dd></div>
            <div><dt className="text-slate-500">Focus keyword</dt><dd className="font-medium">{seo.focusKeyword}</dd></div>
            <div><dt className="text-slate-500">H1</dt><dd>{input.title || "-"}</dd></div>
            <div><dt className="text-slate-500">Words / images</dt><dd>{input.wordCount} words · {imageCount} images</dd></div>
            <div><dt className="text-slate-500">Canonical</dt><dd className="break-all">{input.canonicalUrl || "-"}</dd></div>
            <div><dt className="text-slate-500">Schema found</dt><dd>{schemaTypes.join(", ") || "None"}</dd></div>
          </dl>
          {input.canonicalUrl?.startsWith("http://") && (
            <p className="mx-5 mb-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              The HTTPS rule fails on local dev because the site runs on http://localhost. It passes once deployed on https.
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <CardHeader title="All 69 rules" />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Rule</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Current</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3 text-center">Points</th>
                <th className="px-4 py-3 text-center">Result</th>
              </tr>
            </thead>
            {audit.categoryScores.map((c) => (
              <tbody key={c.category} className="divide-y divide-slate-100 border-t border-slate-200">
                <tr className="bg-slate-50/60">
                  <th colSpan={6} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {c.category} · {c.earned}/{c.total} <ScoreBadge score={c.percentage} />
                  </th>
                </tr>
                {c.rules.map((r) => (
                  <RuleRow key={r.id} rule={r} />
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Card>
    </>
  );
}
