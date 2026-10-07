// Imports content/blog/*.md into the posts table (upsert by slug) and
// publishes them. Safe to re-run. Usage: npm run blog:seed [-- --check]
// --check only prints each post's estimated 69-rule SEO score.
import { config } from "dotenv";
config({ path: ".env.local" });

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

async function main() {
  const { estimatePostSeo } = await import("../lib/seo/estimate");
  const checkOnly = process.argv.includes("--check");
  const dir = "content/blog";
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();

  const today = new Date().toISOString().slice(0, 10);
  const parsed = await Promise.all(
    files.map(async (file, i) => {
      const { data, content } = matter(await readFile(path.join(dir, file), "utf8"));
      // Stagger publish dates a few days apart, newest first in file order.
      const publishedAt = new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000);
      return { file, data, content: content.trim(), publishedAt };
    })
  );

  for (const p of parsed) {
    const d = p.data;
    const audit = estimatePostSeo({
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      content: p.content,
      quickAnswer: d.quickAnswer ?? "",
      faqs: d.faqs ?? [],
      coverImage: d.coverImage ?? "",
      coverAlt: d.coverAlt ?? "",
      authorName: d.authorName,
      metaTitle: d.metaTitle ?? "",
      metaDescription: d.metaDescription ?? "",
      focusKeyword: d.focusKeyword ?? "",
      secondaryKeywords: d.secondaryKeywords ?? [],
      publishedAt: p.publishedAt.toISOString().slice(0, 10),
      updatedAt: today,
    });
    const fails = audit.rules.filter((r) => !r.passed).map((r) => `${r.id}(${r.value})`);
    console.log(`${String(audit.overallScore).padStart(3)}  ${p.file}  ${fails.join(", ")}`);
  }
  if (checkOnly) process.exit(0);

  const [{ db }, { posts }] = await Promise.all([import("../db"), import("../db/schema")]);
  for (const p of parsed) {
    const d = p.data;
    const values = {
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      content: p.content,
      quickAnswer: d.quickAnswer ?? null,
      faqs: d.faqs ?? [],
      coverImage: d.coverImage ?? null,
      coverAlt: d.coverAlt ?? null,
      category: d.category ?? "Guides",
      tags: d.tags ?? [],
      authorName: d.authorName ?? "Dragon Ryu Arts Academy",
      metaTitle: d.metaTitle ?? null,
      metaDescription: d.metaDescription ?? null,
      focusKeyword: d.focusKeyword ?? null,
      secondaryKeywords: d.secondaryKeywords ?? [],
      status: "published" as const,
      publishedAt: p.publishedAt,
      updatedAt: new Date(),
    };
    await db.insert(posts).values(values).onConflictDoUpdate({ target: posts.slug, set: values });
  }
  console.log(`Seeded ${parsed.length} posts.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
