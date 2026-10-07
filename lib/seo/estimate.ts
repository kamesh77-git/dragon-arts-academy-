import type { BlogPost } from "@/types/blog";
import { SITE_URL } from "@/lib/site";
import { analyzeBlog } from "./analyzer";

// Live score for the blog editor, computed in the browser from the form
// fields. It mirrors how the post page renders (H1, quick answer, body,
// FAQ, related links) so it lands close to the real audit, which runs on
// the published page.

export interface DraftPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  quickAnswer: string;
  faqs: { q: string; a: string }[];
  coverImage: string;
  coverAlt: string;
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  publishedAt: string;
  updatedAt: string;
}

export function estimatePostSeo(d: DraftPost) {
  const faqMd = d.faqs.length
    ? `\n\n## Frequently asked questions\n\n${d.faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}`
    : "";
  const cover = d.coverImage ? `![${d.coverAlt}](${d.coverImage})\n\n` : "";
  // The page also renders "Related classes" links in the sidebar.
  const sidebar = "\n\n[Courses](/courses) [Admissions](/#admissions)";
  const content = `# ${d.title}\n\n${d.excerpt}\n\n${cover}${d.quickAnswer ? `Quick answer\n\n${d.quickAnswer}\n\n` : ""}${d.content}${faqMd}\n\nAbout the author: ${d.authorName}. Dragon Ryu Arts Academy, Mannivakkam. Contact us on WhatsApp.${sidebar}`;
  const images = [...content.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)].map((m) => m[1]);

  const input: BlogPost = {
    slug: `/blog/${d.slug}`,
    title: d.title,
    description: d.metaDescription || d.excerpt,
    author: d.authorName,
    publishedAt: d.publishedAt,
    updatedAt: d.updatedAt,
    category: "Blog",
    tags: [],
    featured: false,
    coverImage: d.coverImage,
    gallery: images,
    content,
    readingTime: "",
    wordCount: content.split(/\s+/).filter(Boolean).length,
    metaTitle: d.metaTitle || d.title,
    metaDescription: d.metaDescription || d.excerpt,
    focusKeyword: d.focusKeyword,
    secondaryKeywords: d.secondaryKeywords,
    canonicalUrl: `${SITE_URL}/blog/${d.slug}`,
    robots: "index,follow",
    openGraphImage: d.coverImage,
    twitterCard: "summary_large_image",
    articleSchema: true,
    faqSchema: d.faqs.length > 0,
    breadcrumbSchema: true,
    organizationSchema: true,
    courseSchema: false,
  };
  return analyzeBlog(input);
}
