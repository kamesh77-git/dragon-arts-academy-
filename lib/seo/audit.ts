import "server-only";

import { headers } from "next/headers";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

import type { BlogPost } from "@/types/blog";
import { getAllSeoPages, getPageSeo, type ResolvedPageSeo } from "@/lib/page-seo";
import { analyzeBlog } from "./analyzer";
import { getSeoStatus } from "./score";
import type { SEOAudit } from "./types";

// Runs the 69-rule engine against what a page actually renders: the live
// HTML is fetched from this same deployment, its <main> converted to
// markdown (the format the rules were written for), and the head tags /
// JSON-LD read straight from the response. Nothing is hand-maintained, so
// the score can't drift from the real page.

export interface PageAudit {
  path: string;
  seo: ResolvedPageSeo;
  audit: SEOAudit;
  status: ReturnType<typeof getSeoStatus>;
  input: BlogPost;
  schemaTypes: string[];
  error?: string;
}

const turndown = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
turndown.use(gfm);
turndown.remove(["script", "style", "noscript", "iframe", "form"]);

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3031";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function attr(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function decode(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function extractSchemaTypes(html: string): string[] {
  const types = new Set<string>();
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      for (const t of [data["@type"]].flat()) if (typeof t === "string") types.add(t);
    } catch {
      // ignore malformed blocks; the audit reports what it can read
    }
  }
  return [...types];
}

// next/image rewrites src to /_next/image?url=<original>; point the
// markdown back at the original file so file-format rules see .webp etc.
function unwrapNextImage(src: string) {
  const m = src.match(/\/_next\/image\?url=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : src;
}

export async function auditPage(path: string, origin?: string): Promise<PageAudit> {
  const seo = await getPageSeo(path);
  const base = origin ?? (await getOrigin());

  let html = "";
  let error: string | undefined;
  try {
    const res = await fetch(`${base}${path}`, { cache: "no-store", headers: { "x-seo-audit": "1" } });
    if (!res.ok) error = `Page returned HTTP ${res.status}`;
    html = await res.text();
  } catch (err) {
    error = `Could not fetch page: ${(err as Error).message}`;
  }

  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  const content = turndown
    .turndown(main)
    .replace(/!\[([^\]]*)]\(([^)]+)\)/g, (_, alt, src) => `![${alt}](${unwrapNextImage(decode(src))})`);

  const images = [...content.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)].map((m) => m[1]);
  const schemaTypes = extractSchemaTypes(html);
  const has = (...t: string[]) => t.some((x) => schemaTypes.includes(x));

  // Only the index/follow directives matter to the rule; extras like
  // max-image-preview are fine and shouldn't fail it.
  const robots =
    attr(html, /<meta name="robots" content="([^"]*)"/)
      .split(",")
      .map((t) => t.trim())
      .filter((t) => /^(no)?(index|follow)$/.test(t))
      .join(",") || "index,follow";
  const h1 = decode(attr(html, /<h1[^>]*>([\s\S]*?)<\/h1>/).replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ");

  const input: BlogPost = {
    slug: path,
    title: h1,
    description: seo.metaDescription,
    author: seo.author,
    publishedAt: seo.publishedAt,
    updatedAt: seo.updatedAt,
    category: "Page",
    tags: [],
    featured: false,
    coverImage: decode(attr(html, /<meta property="og:image" content="([^"]*)"/)),
    gallery: images,
    content,
    readingTime: "",
    wordCount: content.split(/\s+/).filter(Boolean).length,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    focusKeyword: seo.focusKeyword,
    secondaryKeywords: seo.secondaryKeywords,
    canonicalUrl: attr(html, /<link rel="canonical" href="([^"]*)"/),
    robots,
    openGraphImage: decode(attr(html, /<meta property="og:image" content="([^"]*)"/)),
    twitterCard: attr(html, /<meta name="twitter:card" content="([^"]*)"/),
    articleSchema: has("WebPage", "Article", "BlogPosting", "Course", "AboutPage"),
    faqSchema: has("FAQPage"),
    breadcrumbSchema: has("BreadcrumbList"),
    organizationSchema: has("Organization", "EducationalOrganization", "LocalBusiness"),
    courseSchema: has("Course"),
  };

  const audit = analyzeBlog(input);
  return { path, seo, audit, status: getSeoStatus(audit.overallScore), input, schemaTypes, error };
}

export async function auditAllPages(): Promise<PageAudit[]> {
  const origin = await getOrigin();
  const pages = await getAllSeoPages();
  return Promise.all(pages.map((p) => auditPage(p.path, origin)));
}
