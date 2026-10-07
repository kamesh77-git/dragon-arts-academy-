import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { pageSeo, type Post } from "@/db/schema";
import { getPublishedPost, getPublishedPosts, isoDate } from "./blog";
import { getSitePage, sitePages, type SitePage } from "./pages";
import { OG_IMAGE, SITE_NAME, SITE_URL, TITLE_SUFFIX } from "./site";

export type ResolvedPageSeo = SitePage & {
  hasOverride: boolean;
  kind: "page" | "post";
  postId?: string;
};

export function postToSitePage(post: Post): SitePage {
  return {
    path: `/blog/${post.slug}`,
    name: post.title,
    metaTitle: post.metaTitle || post.title,
    metaDescription: post.metaDescription || post.excerpt,
    focusKeyword: post.focusKeyword ?? "",
    secondaryKeywords: post.secondaryKeywords,
    author: post.authorName,
    publishedAt: isoDate(post.publishedAt ?? post.createdAt),
    updatedAt: isoDate(post.updatedAt),
    coverImage: post.coverImage || OG_IMAGE,
  };
}

/** Every SEO-managed URL: the static registry plus published blog posts. */
export async function getAllSeoPages(): Promise<(SitePage & { kind: "page" | "post" })[]> {
  const live = await getPublishedPosts();
  return [
    ...sitePages.map((p) => ({ ...p, kind: "page" as const })),
    ...live.map((p) => ({ ...postToSitePage(p), kind: "post" as const })),
  ];
}

export async function seoPageExists(path: string) {
  if (getSitePage(path)) return true;
  const slug = path.match(/^\/blog\/([^/]+)$/)?.[1];
  return slug ? Boolean(await getPublishedPost(slug)) : false;
}

// Code defaults merged with any admin override (static pages), or the
// post's own SEO fields (blog). Fails open to the defaults if the
// database is unreachable.
export async function getPageSeo(path: string): Promise<ResolvedPageSeo> {
  const slug = path.match(/^\/blog\/([^/]+)$/)?.[1];
  if (slug) {
    const post = await getPublishedPost(slug);
    if (!post) throw new Error(`No published post at ${path}`);
    return { ...postToSitePage(post), hasOverride: false, kind: "post", postId: post.id };
  }

  const page = getSitePage(path);
  if (!page) throw new Error(`No SEO defaults registered for ${path}`);

  try {
    const row = await db.query.pageSeo.findFirst({ where: eq(pageSeo.path, path) });
    if (!row) return { ...page, hasOverride: false, kind: "page" };
    return {
      ...page,
      metaTitle: row.metaTitle || page.metaTitle,
      metaDescription: row.metaDescription || page.metaDescription,
      focusKeyword: row.focusKeyword || page.focusKeyword,
      secondaryKeywords: row.secondaryKeywords?.length ? row.secondaryKeywords : page.secondaryKeywords,
      updatedAt: row.updatedAt.toISOString().slice(0, 10),
      hasOverride: true,
      kind: "page",
    };
  } catch (err) {
    console.error(`[page-seo] falling back to defaults for ${path}:`, err);
    return { ...page, hasOverride: false, kind: "page" };
  }
}

export async function buildMetadata(path: string): Promise<Metadata> {
  const seo = await getPageSeo(path);
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const image = seo.coverImage || OG_IMAGE;
  const isPost = seo.kind === "post";

  return {
    // Absolute rather than relying on the layout's title template, which
    // doesn't apply to the page in the layout's own segment (the home page).
    title: { absolute: `${seo.metaTitle}${TITLE_SUFFIX}` },
    description: seo.metaDescription,
    keywords: [seo.focusKeyword, ...seo.secondaryKeywords].filter(Boolean),
    authors: [{ name: seo.author }],
    alternates: {
      canonical: url,
      types: { "application/rss+xml": [{ url: `${SITE_URL}/blog/rss.xml`, title: `${SITE_NAME} blog` }] },
    },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      type: isPost ? "article" : "website",
      url,
      siteName: SITE_NAME,
      title: seo.metaTitle,
      description: seo.metaDescription,
      locale: "en_IN",
      images: [{ url: image, alt: seo.metaTitle }],
      ...(isPost ? { publishedTime: seo.publishedAt, modifiedTime: seo.updatedAt, authors: [seo.author] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [image],
    },
  };
}
