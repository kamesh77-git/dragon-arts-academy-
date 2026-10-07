import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { estimatePostSeo } from "@/lib/seo/estimate";
import { isoDate } from "@/lib/blog";
import { Card, PageHeader, ScoreBadge, buttonClass, formatDateTime } from "@/components/admin/ui";
import { createPost } from "./actions";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const rows = await db.select().from(posts).orderBy(desc(posts.updatedAt));

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle="Write and publish articles. Each post is scored against the same 69 SEO rules as the rest of the site."
        actions={
          <form action={createPost}>
            <button className={buttonClass}>+ New post</button>
          </form>
        }
      />
      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">No posts yet. Click “New post” to write the first one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Post</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">SEO</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((p) => {
                  const score = estimatePostSeo({
                    ...p,
                    quickAnswer: p.quickAnswer ?? "",
                    coverImage: p.coverImage ?? "",
                    coverAlt: p.coverAlt ?? "",
                    metaTitle: p.metaTitle ?? "",
                    metaDescription: p.metaDescription ?? "",
                    focusKeyword: p.focusKeyword ?? "",
                    publishedAt: isoDate(p.publishedAt ?? p.createdAt),
                    updatedAt: isoDate(p.updatedAt),
                  }).overallScore;
                  const scheduled = p.status === "published" && p.publishedAt && p.publishedAt > new Date();
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/blog/${p.id}`} className="font-medium text-brand-700 hover:underline">{p.title}</Link>
                        <p className="text-xs text-slate-500">/blog/{p.slug} · {p.category}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.status === "published" ? (scheduled ? "bg-sky-100 text-sky-800" : "bg-emerald-100 text-emerald-800") : "bg-slate-200 text-slate-700"}`}>
                          {scheduled ? "scheduled" : p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center"><ScoreBadge score={score} /></td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDateTime(p.updatedAt)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {p.status === "published" && !scheduled && (
                          <>
                            <a href={`/blog/${p.slug}`} target="_blank" rel="noopener" className="font-medium text-brand-700 hover:underline">View ↗</a>
                            <span className="mx-2 text-slate-300">|</span>
                            <Link href={`/admin/seo/audit?path=${encodeURIComponent(`/blog/${p.slug}`)}`} className="font-medium text-brand-700 hover:underline">Audit</Link>
                            <span className="mx-2 text-slate-300">|</span>
                          </>
                        )}
                        <Link href={`/admin/blog/${p.id}`} className="font-medium text-brand-700 hover:underline">Edit</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
