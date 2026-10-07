/* eslint-disable @next/next/no-img-element -- post images can be any URL with unknown dimensions */
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

// Renders admin-written blog markdown. Raw HTML in the markdown is NOT
// rendered (react-markdown's default), so a post can't inject scripts.
const components: Components = {
  a({ href = "", children }) {
    if (href.startsWith("/") || href.startsWith("#")) return <Link href={href}>{children}</Link>;
    return (
      <a href={href} target="_blank" rel="noopener">
        {children}
      </a>
    );
  },
  img({ src, alt }) {
    if (typeof src !== "string" || !src) return null;
    return (
      <span className="prose__figure prose__figure--inline">
        <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
        {alt && <span className="prose__caption">{alt}</span>}
      </span>
    );
  },
  table({ children }) {
    return (
      <div className="prose__table-wrap">
        <table>{children}</table>
      </div>
    );
  },
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose__body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
