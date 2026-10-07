"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import { slugify } from "@/lib/slug";

export type PostState = { ok: boolean; message: string; slug?: string } | null;

const postSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(3, "Title is required").max(200),
  slug: z.string().trim().max(160),
  excerpt: z.string().trim().max(400),
  content: z.string().max(100_000),
  quickAnswer: z.string().trim().max(800),
  faqs: z
    .array(z.object({ q: z.string().trim().max(300), a: z.string().trim().max(1500) }))
    .max(12)
    .transform((list) => list.filter((f) => f.q && f.a)),
  coverImage: z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || v.startsWith("/") || /^https:\/\//.test(v), "Cover image must be a /path or an https:// URL"),
  coverAlt: z.string().trim().max(300),
  category: z.string().trim().min(1).max(80),
  tags: z.array(z.string().trim().max(60)).max(15),
  authorName: z.string().trim().min(1).max(200),
  metaTitle: z.string().trim().max(200),
  metaDescription: z.string().trim().max(400),
  focusKeyword: z.string().trim().max(160),
  secondaryKeywords: z.array(z.string().trim().max(120)).max(8),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().trim(),
});

export type PostInput = z.input<typeof postSchema>;

function revalidatePost(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");
  revalidatePath("/blog/rss.xml");
}

export async function createPost() {
  await requireUser(["admin"]);
  const base = `new-post-${Date.now().toString(36)}`;
  const [row] = await db
    .insert(posts)
    .values({ slug: base, title: "Untitled post", status: "draft" })
    .returning({ id: posts.id });
  redirect(`/admin/blog/${row.id}`);
}

export async function savePost(input: PostInput): Promise<PostState> {
  await requireUser(["admin"]);
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  const d = parsed.data;

  const slug = slugify(d.slug || d.title);
  if (!slug) return { ok: false, message: "Slug can't be empty" };
  const clash = await db.query.posts.findFirst({ where: and(eq(posts.slug, slug), ne(posts.id, d.id)) });
  if (clash) return { ok: false, message: `Another post already uses /blog/${slug}` };

  const existing = await db.query.posts.findFirst({ where: eq(posts.id, d.id) });
  if (!existing) return { ok: false, message: "Post not found" };

  let publishedAt = d.publishedAt ? new Date(d.publishedAt) : null;
  if (publishedAt && Number.isNaN(publishedAt.getTime())) return { ok: false, message: "Invalid publish date" };
  if (d.status === "published" && !publishedAt) publishedAt = new Date();

  await db
    .update(posts)
    .set({
      title: d.title,
      slug,
      excerpt: d.excerpt,
      content: d.content,
      quickAnswer: d.quickAnswer || null,
      faqs: d.faqs,
      coverImage: d.coverImage || null,
      coverAlt: d.coverAlt || null,
      category: d.category,
      tags: d.tags.filter(Boolean),
      authorName: d.authorName,
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
      focusKeyword: d.focusKeyword.toLowerCase() || null,
      secondaryKeywords: d.secondaryKeywords.filter(Boolean),
      status: d.status,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, d.id));

  revalidatePost(slug);
  if (existing.slug !== slug) revalidatePost(existing.slug);
  revalidatePath("/admin/blog");

  return {
    ok: true,
    slug,
    message: d.status === "published" ? "Saved and published." : "Draft saved.",
  };
}

export async function deletePost(formData: FormData) {
  await requireUser(["admin"]);
  const id = z.uuid().parse(formData.get("id"));
  const [row] = await db.delete(posts).where(eq(posts.id, id)).returning({ slug: posts.slug });
  if (row) revalidatePost(row.slug);
  redirect("/admin/blog");
}
