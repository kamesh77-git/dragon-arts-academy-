/* eslint-disable @next/next/no-img-element -- cover may be an external URL */
import Link from "next/link";
import { notFound } from "next/navigation";

import AdmissionsSection from "@/components/site/AdmissionsSection";
import JsonLd from "@/components/site/JsonLd";
import Markdown from "@/components/site/Markdown";
import PostCard from "@/components/site/PostCard";
import Toc from "@/components/site/Toc";
import { courses } from "@/lib/courses";
import { extractHeadings, formatPostDate, getPublishedPost, getPublishedPosts, getRelatedPosts, isoDate, readingMinutes } from "@/lib/blog";
import { faculty } from "@/lib/faculty";
import { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/page-seo";
import { PHONES, SITE_NAME, WHATSAPP_ENQUIRY } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return buildMetadata(`/blog/${slug}`);
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const headings = [
    ...extractHeadings(post.content),
    ...(post.faqs.length ? [{ id: "faq", text: "Frequently asked questions" }] : []),
  ];
  const published = post.publishedAt ?? post.createdAt;
  const wasUpdated = isoDate(post.updatedAt) !== isoDate(published);
  const description = post.metaDescription || post.excerpt;
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  // Link the post to the courses it talks about (tags or title mention the art).
  const haystack = `${post.title} ${post.tags.join(" ")} ${post.category}`.toLowerCase();
  const relatedCourses = courses.filter((c) => haystack.includes(c.name.split(/[ :&]/)[0].toLowerCase())).slice(0, 4);
  const asideCourses = relatedCourses.length ? relatedCourses : courses.slice(0, 4);
  const authorProfile = faculty.find((f) => f.name === post.authorName);

  return (
    <main className="course-page blog-post">
      <section className="course-hero">
        <div className="hero__bg" />
        <div className="container course-hero__inner">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li aria-current="page">{post.title}</li>
            </ol>
          </nav>
          <p className="hero__eyebrow">{post.category}</p>
          <h1 className="course-hero__title">{post.title}</h1>
          <p className="course-hero__lead">{post.excerpt}</p>
          <p className="course-hero__meta">
            By {post.authorName} · Published <time dateTime={isoDate(published)}>{formatPostDate(published)}</time>
            {wasUpdated && <> · Updated <time dateTime={isoDate(post.updatedAt)}>{formatPostDate(post.updatedAt)}</time></>}
            {" · "}{readingMinutes(post.content)} min read
          </p>
        </div>
      </section>

      <article className="section course-body">
        <div className="container course-body__grid course-body__grid--toc">
          <Toc items={headings} />

          <div className="prose">
            {post.coverImage && (
              <figure className="prose__figure">
                <img src={post.coverImage} alt={post.coverAlt ?? ""} fetchPriority="high" />
              </figure>
            )}

            {post.quickAnswer && (
              <div className="answer-box">
                <p className="answer-box__label">Quick answer</p>
                <p>{post.quickAnswer}</p>
              </div>
            )}

            <Markdown>{post.content}</Markdown>

            {post.faqs.length > 0 && (
              <>
                <h2 id="faq">Frequently asked questions</h2>
                {post.faqs.map((f) => (
                  <div key={f.q} className="prose__faq">
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </>
            )}

            <aside className="author-box" aria-label="About the author">
              <p className="author-box__label">About the author</p>
              <p className="author-box__name">{post.authorName}</p>
              <p>
                {authorProfile
                  ? authorProfile.bio
                  : `${SITE_NAME} is a multi-arts academy in Mannivakkam, Chennai, teaching 14+ arts since 2011 to children and adults.`}
              </p>
            </aside>
          </div>

          <aside className="course-aside" aria-label="Classes and related reading">
            <div className="course-aside__card card-3d">
              <h2>Try a class</h2>
              <p>Talk to us about batches and timings in Mannivakkam.</p>
              <a href={`tel:${PHONES[0].tel}`} className="btn btn--primary btn--full">Call {PHONES[0].display}</a>
              <a href={WHATSAPP_ENQUIRY} className="btn btn--whatsapp btn--full" target="_blank" rel="noopener">WhatsApp Us</a>
            </div>
            <div className="course-aside__card card-3d">
              <h2>Related classes</h2>
              <ul>
                {asideCourses.map((c) => (
                  <li key={c.slug}><Link href={`/${c.slug}`}>{c.icon} {c.name} classes</Link></li>
                ))}
                <li><Link href="/courses">View all courses →</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section related-posts">
          <div className="container">
            <h2 className="section__title blog-list__title">Keep reading</h2>
            <div className="post-grid">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <AdmissionsSection />

      <JsonLd
        data={[
          blogPostingSchema(post, { description, wordCount }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          ...(post.faqs.length ? [faqSchema(post.faqs)] : []),
        ]}
      />
    </main>
  );
}
