import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { faculty } from "@/lib/faculty";
import { gallery } from "@/lib/gallery";
import { SITE_NAME, SITE_URL, TITLE_SUFFIX } from "@/lib/site";
import { PageHeader, secondaryButtonClass } from "@/components/admin/ui";
import { deletePost } from "../actions";
import DeletePostForm from "./DeletePostForm";
import PostEditor from "./PostEditor";
import { requireUser } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit post" };

function toLocalInput(d: Date | null) {
  if (!d) return "";
  // datetime-local wants local time without a zone; show IST.
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 16);
}

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  await requireUser(["admin"]);
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  if (!post) notFound();

  const categories = await db.selectDistinct({ c: posts.category }).from(posts);

  return (
    <>
      <PageHeader
        title={post.title}
        subtitle={`/blog/${post.slug}`}
        actions={<Link href="/admin/blog" className={secondaryButtonClass}>← All posts</Link>}
      />
      <PostEditor
        siteUrl={SITE_URL}
        titleSuffix={TITLE_SUFFIX}
        imageOptions={[{ src: "/images/og-default.jpg", label: "Karate class (wide banner)" }, ...gallery.map((g) => ({ src: g.src, label: g.caption }))]}
        authorOptions={[SITE_NAME, ...faculty.map((f) => f.name)]}
        categoryOptions={[...new Set(["Guides", "Martial Arts", "Dance & Music", "Learning Skills", "Parenting", "Academy News", ...categories.map((c) => c.c)])]}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          quickAnswer: post.quickAnswer ?? "",
          faqs: post.faqs,
          coverImage: post.coverImage ?? "",
          coverAlt: post.coverAlt ?? "",
          category: post.category,
          tags: post.tags,
          authorName: post.authorName,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          focusKeyword: post.focusKeyword ?? "",
          secondaryKeywords: post.secondaryKeywords,
          status: post.status,
          publishedAt: toLocalInput(post.publishedAt),
        }}
      />
      <DeletePostForm id={post.id} action={deletePost} />
    </>
  );
}
