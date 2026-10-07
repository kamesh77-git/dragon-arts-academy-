import { and, desc, eq, lte, ne } from "drizzle-orm";
import GithubSlugger from "github-slugger";

import { db } from "@/db";
import { posts, type Post } from "@/db/schema";

export { slugify } from "./slug";

// Public blog queries. All fail open (empty / null) so the public site and
// the build keep working if the database is briefly unreachable.

function isLive() {
  return and(eq(posts.status, "published"), lte(posts.publishedAt, new Date()));
}

export async function getPublishedPosts(limit = 100): Promise<Post[]> {
  try {
    return await db.select().from(posts).where(isLive()).orderBy(desc(posts.publishedAt)).limit(limit);
  } catch (err) {
    console.error("[blog] getPublishedPosts failed:", err);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  try {
    const [post] = await db.select().from(posts).where(and(isLive(), eq(posts.slug, slug))).limit(1);
    return post ?? null;
  } catch (err) {
    console.error("[blog] getPublishedPost failed:", err);
    return null;
  }
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  try {
    const sameCategory = await db
      .select()
      .from(posts)
      .where(and(isLive(), ne(posts.id, post.id), eq(posts.category, post.category)))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);
    if (sameCategory.length >= limit) return sameCategory;
    const others = await db
      .select()
      .from(posts)
      .where(and(isLive(), ne(posts.id, post.id), ne(posts.category, post.category)))
      .orderBy(desc(posts.publishedAt))
      .limit(limit - sameCategory.length);
    return [...sameCategory, ...others];
  } catch {
    return [];
  }
}

export function readingMinutes(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** H2 headings with the same ids rehype-slug gives them, for the table of contents. */
export function extractHeadings(markdown: string) {
  const slugger = new GithubSlugger();
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = m[1].replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
    return { text, id: slugger.slug(text) };
  });
}


export function formatPostDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
}

export function isoDate(d: Date | string) {
  return new Date(d).toISOString().slice(0, 10);
}
