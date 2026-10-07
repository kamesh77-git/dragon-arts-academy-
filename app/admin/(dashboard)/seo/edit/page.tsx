import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPageSeo } from "@/lib/page-seo";
import { getSitePage } from "@/lib/pages";
import { SITE_URL, TITLE_SUFFIX } from "@/lib/site";
import { PageHeader, buttonClass, secondaryButtonClass } from "@/components/admin/ui";
import { resetPageSeo } from "../actions";
import SeoForm from "./SeoForm";
import { requireUser } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit page SEO" };

export default async function EditSeoPage({ searchParams }: PageProps<"/admin/seo/edit">) {
  await requireUser(["admin"]);
  const { path } = await searchParams;
  if (typeof path !== "string" || !getSitePage(path)) notFound();
  const seo = await getPageSeo(path);

  return (
    <>
      <PageHeader
        title={`Edit SEO: ${seo.name}`}
        subtitle={seo.hasOverride ? `${path} · using your saved values` : `${path} · using the built-in defaults`}
        actions={
          <>
            <Link href={`/admin/seo/audit?path=${encodeURIComponent(path)}`} className={buttonClass}>Run audit</Link>
            <Link href="/admin/seo" className={secondaryButtonClass}>← All pages</Link>
          </>
        }
      />
      <SeoForm
        key={`${seo.metaTitle}|${seo.metaDescription}|${seo.focusKeyword}`}
        path={path}
        titleSuffix={TITLE_SUFFIX}
        siteUrl={SITE_URL}
        initial={{
          metaTitle: seo.metaTitle,
          metaDescription: seo.metaDescription,
          focusKeyword: seo.focusKeyword,
          secondaryKeywords: seo.secondaryKeywords.join(", "),
        }}
      />
      {seo.hasOverride && (
        <form action={resetPageSeo} className="mt-6">
          <input type="hidden" name="path" value={path} />
          <button className="text-sm text-slate-500 underline hover:text-red-600">Reset to built-in defaults</button>
        </form>
      )}
    </>
  );
}
