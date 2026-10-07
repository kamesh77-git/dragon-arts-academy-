/* eslint-disable @next/next/no-img-element -- cover may be an external URL */
import Link from "next/link";

import type { Post } from "@/db/schema";
import { formatPostDate, isoDate, readingMinutes } from "@/lib/blog";

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const date = post.publishedAt ?? post.createdAt;
  return (
    <article className={`post-card card-3d${featured ? " post-card--featured" : ""}`} data-tilt={featured ? undefined : true}>
      {post.coverImage && (
        <div className="post-card__media">
          <img src={post.coverImage} alt={post.coverAlt ?? ""} loading={featured ? "eager" : "lazy"} decoding="async" />
        </div>
      )}
      <div className="post-card__body">
        <p className="post-card__meta">
          <span className="post-card__cat">{post.category}</span>
          <time dateTime={isoDate(date)}>{formatPostDate(date)}</time>
          <span>{readingMinutes(post.content)} min read</span>
        </p>
        <h3 className="post-card__title">
          <Link href={`/blog/${post.slug}`} className="course-card__link">{post.title}</Link>
        </h3>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <span className="post-card__more" aria-hidden="true">Read article →</span>
      </div>
    </article>
  );
}
