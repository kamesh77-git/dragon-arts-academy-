import Link from "next/link";

import AdmissionsSection from "@/components/site/AdmissionsSection";
import JsonLd from "@/components/site/JsonLd";
import PostCard from "@/components/site/PostCard";
import { getPublishedPosts } from "@/lib/blog";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/jsonld";
import { buildMetadata, getPageSeo } from "@/lib/page-seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export function generateMetadata() {
  return buildMetadata("/blog");
}

const blogFaqs = [
  {
    q: "Who writes these kids activity tips?",
    a: "The Dragon Ryu Arts Academy team in Mannivakkam, drawing on our experience teaching 14+ arts to children and adults since 2011.",
  },
  {
    q: "Where can my child try the activities in these articles?",
    a: "At our Mannivakkam campus. See all courses, or call 98844 48277 to book a visit. Admissions are open with no admission fee.",
  },
  {
    q: "Can I suggest a topic?",
    a: "Yes. Message us on WhatsApp with the question you would like answered and we will consider it for a future article.",
  },
];

export default async function BlogIndexPage() {
  const [seo, posts] = await Promise.all([getPageSeo("/blog"), getPublishedPosts()]);
  const [featured, ...rest] = posts;
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <main className="course-page">
      <section className="course-hero">
        <div className="hero__bg" />
        <div className="container course-hero__inner">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Blog</li>
            </ol>
          </nav>
          <p className="hero__eyebrow">The Dragon Ryu Blog</p>
          <h1 className="course-hero__title">Kids Activity Tips &amp; Guides for Parents</h1>
          <p className="course-hero__lead">
            Practical kids activity tips from our instructors in Mannivakkam: how to choose a class, what each art teaches, and how to help your child stay motivated.
          </p>
          {categories.length > 1 && (
            <ul className="chip-list" aria-label="Topics">
              {categories.map((c) => (
                <li key={c} className="chip">{c}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="section__desc">New articles are on their way. Check back soon.</p>
          ) : (
            <>
              <h2 className="section__title blog-list__title">Latest kids activity tips</h2>
              {featured && <PostCard post={featured} featured />}
              {rest.length > 0 && (
                <>
                  <h2 className="section__title blog-list__title">More articles</h2>
                  <div className="post-grid">
                    {rest.map((p) => (
                      <PostCard key={p.id} post={p} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section faq">
        <div className="container faq__inner">
          <div className="section__header">
            <p className="section__eyebrow">About this blog</p>
            <h2 className="section__title">Frequently Asked Questions</h2>
          </div>
          <div className="faq__list">
            {blogFaqs.map((f) => (
              <details key={f.q} className="faq__item">
                <summary><h3>{f.q}</h3></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <AdmissionsSection />

      <JsonLd
        data={[
          webPageSchema({ path: "/blog", name: seo.metaTitle, description: seo.metaDescription, dateModified: seo.updatedAt }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          faqSchema(blogFaqs),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${SITE_URL}/blog#blog`,
            name: `${SITE_NAME} Blog`,
            url: `${SITE_URL}/blog`,
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${SITE_URL}/blog/${p.slug}`,
              datePublished: (p.publishedAt ?? p.createdAt).toISOString(),
            })),
          },
        ]}
      />
    </main>
  );
}
