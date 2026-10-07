"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import Markdown from "@/components/site/Markdown";
import { slugify } from "@/lib/slug";
import { estimatePostSeo } from "@/lib/seo/estimate";
import { buttonClass, inputClass, scoreColor, secondaryButtonClass } from "@/components/admin/ui";
import { savePost, type PostState } from "../actions";

interface Initial {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  quickAnswer: string;
  faqs: { q: string; a: string }[];
  coverImage: string;
  coverAlt: string;
  category: string;
  tags: string[];
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  status: "draft" | "published";
  publishedAt: string; // datetime-local, IST
}

interface Props {
  initial: Initial;
  siteUrl: string;
  titleSuffix: string;
  imageOptions: { src: string; label: string }[];
  authorOptions: string[];
  categoryOptions: string[];
}

const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

function Field({ label, hint, htmlFor, children, counter }: { label: string; hint?: string; htmlFor: string; children: React.ReactNode; counter?: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-800">{label}</label>
        {counter}
      </div>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <h2 className="border-b border-slate-100 px-5 py-3.5 font-semibold text-slate-900">{title}</h2>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

export default function PostEditor({ initial, siteUrl, titleSuffix, imageOptions, authorOptions, categoryOptions }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<PostState>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug.startsWith("new-post-") ? "" : initial.slug);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [content, setContent] = useState(initial.content);
  const [quickAnswer, setQuickAnswer] = useState(initial.quickAnswer);
  const [faqs, setFaqs] = useState(initial.faqs.length ? initial.faqs : [{ q: "", a: "" }]);
  const [coverImage, setCoverImage] = useState(initial.coverImage);
  const [coverAlt, setCoverAlt] = useState(initial.coverAlt);
  const [category, setCategory] = useState(initial.category);
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [authorName, setAuthorName] = useState(initial.authorName);
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [focusKeyword, setFocusKeyword] = useState(initial.focusKeyword);
  const [secondary, setSecondary] = useState(initial.secondaryKeywords.join(", "));
  const [status, setStatus] = useState(initial.status);
  const [publishedAt, setPublishedAt] = useState(initial.publishedAt);

  const effectiveSlug = slugify(slug || title);
  const today = new Date().toISOString().slice(0, 10);
  const realFaqs = faqs.filter((f) => f.q.trim() && f.a.trim());

  const audit = useMemo(
    () =>
      estimatePostSeo({
        slug: effectiveSlug,
        title,
        excerpt,
        content,
        quickAnswer,
        faqs: realFaqs,
        coverImage,
        coverAlt,
        authorName,
        metaTitle,
        metaDescription,
        focusKeyword: focusKeyword.trim().toLowerCase(),
        secondaryKeywords: list(secondary),
        publishedAt: publishedAt.slice(0, 10) || today,
        updatedAt: today,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectiveSlug, title, excerpt, content, quickAnswer, faqs, coverImage, coverAlt, authorName, metaTitle, metaDescription, focusKeyword, secondary, publishedAt]
  );
  const failing = audit.rules
    .filter((r) => !r.passed)
    .sort((a, b) => ["Critical", "High", "Medium", "Low"].indexOf(a.priority) - ["Critical", "High", "Medium", "Low"].indexOf(b.priority));

  const renderedTitle = `${metaTitle || title}${titleSuffix}`;
  const desc = metaDescription || excerpt;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  function save(nextStatus: "draft" | "published") {
    setResult(null);
    startTransition(async () => {
      const res = await savePost({
        id: initial.id,
        title,
        slug: effectiveSlug,
        excerpt,
        content,
        quickAnswer,
        faqs: realFaqs,
        coverImage,
        coverAlt,
        category,
        tags: list(tags),
        authorName,
        metaTitle,
        metaDescription,
        focusKeyword,
        secondaryKeywords: list(secondary),
        status: nextStatus,
        // The picker shows India time; send it with the IST offset.
        publishedAt: publishedAt ? `${publishedAt}:00+05:30` : "",
      });
      setResult(res);
      if (res?.ok) {
        setStatus(nextStatus);
        if (res.slug) setSlug(res.slug);
        router.refresh();
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-6">
        <Section title="Article">
          <Field label="Title (H1)" htmlFor="title" counter={<span className={`text-xs ${title.length < 70 ? "text-slate-500" : "text-amber-700"}`}>{title.length}/70</span>}>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} text-base font-medium`} />
          </Field>
          <Field label="URL slug" htmlFor="slug" hint={`${siteUrl}/blog/${effectiveSlug || "…"}  ·  leave blank to build it from the title`}>
            <input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(title)} className={inputClass} />
          </Field>
          <Field label="Excerpt" htmlFor="excerpt" hint="One or two sentences shown under the title and on blog cards.">
            <textarea id="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputClass} />
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
                {(["write", "preview"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-3 py-1 capitalize ${tab === t ? "bg-white font-semibold shadow-sm" : "text-slate-600"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500">{wordCount} words · Markdown</span>
            </div>
            {tab === "write" ? (
              <textarea
                id="content"
                aria-label="Article body (Markdown)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={28}
                className={`${inputClass} font-mono text-[13px] leading-6`}
                placeholder={"Start with an intro that uses the focus keyword.\n\n## A clear H2 heading\n\nShort paragraphs. Lists help:\n\n- point one\n- point two\n\n| Column | Column |\n| --- | --- |\n| cell | cell |\n\n[Link to a course](/karate-classes-in-mannivakkam)\n\n![Describe the image](/images/gallery/karate-class.webp)"}
              />
            ) : (
              <div className="prose-preview max-h-[720px] overflow-auto rounded-lg border border-slate-200 bg-white p-5">
                <Markdown>{content || "_Nothing to preview yet._"}</Markdown>
              </div>
            )}
            <p className="mt-1 text-xs text-slate-500">
              Use <code>## Heading</code>, <code>- lists</code>, <code>| tables |</code>, <code>[links](/path)</code> and <code>![alt text](/images/…)</code>. HTML is not rendered.
            </p>
          </div>
        </Section>

        <Section title="Answer engines (AEO / GEO)">
          <Field label="Quick answer" htmlFor="quickAnswer" hint="A direct 40 to 60 word answer to the post's main question. Shown in a box at the top and often quoted by Google and AI assistants." counter={<span className="text-xs text-slate-500">{quickAnswer.split(/\s+/).filter(Boolean).length} words</span>}>
            <textarea id="quickAnswer" rows={3} value={quickAnswer} onChange={(e) => setQuickAnswer(e.target.value)} className={inputClass} />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-800">FAQs <span className="font-normal text-slate-500">(added to the page and as FAQ schema)</span></p>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-3">
                  <input aria-label={`Question ${i + 1}`} placeholder="Question" value={f.q} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} className={`${inputClass} mb-2 font-medium`} />
                  <textarea aria-label={`Answer ${i + 1}`} placeholder="Answer (2 to 3 sentences)" rows={2} value={f.a} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} className={inputClass} />
                  {faqs.length > 1 && (
                    <button type="button" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="mt-1 text-xs text-red-600 hover:underline">Remove</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="mt-3 text-sm font-medium text-brand-700 hover:underline">+ Add FAQ</button>
          </div>
        </Section>

        <Section title="Search (SEO)">
          <Field label="Focus keyword" htmlFor="focusKeyword" hint="The main phrase this post should rank for. Use it in the title, slug, first paragraph and one H2.">
            <input id="focusKeyword" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Secondary keywords" htmlFor="secondary" hint="Comma separated. Four is ideal.">
            <input id="secondary" value={secondary} onChange={(e) => setSecondary(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Meta title" htmlFor="metaTitle" hint={`Leave blank to use the title. "${titleSuffix.trim()}" is added automatically.`} counter={<span className={`text-xs ${renderedTitle.length < 60 ? "text-emerald-700" : "text-amber-700"}`}>{renderedTitle.length} chars · under 60</span>}>
            <input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={title} className={inputClass} />
          </Field>
          <Field label="Meta description" htmlFor="metaDescription" hint="Leave blank to use the excerpt." counter={<span className={`text-xs ${desc.length >= 145 && desc.length <= 158 ? "text-emerald-700" : "text-amber-700"}`}>{desc.length} chars · 145 to 158</span>}>
            <textarea id="metaDescription" rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder={excerpt} className={inputClass} />
          </Field>
        </Section>

        <Section title="Image, category & author">
          <Field label="Cover image" htmlFor="coverImage" hint="Pick a site photo or paste an https:// image URL (WebP preferred).">
            <select aria-label="Choose a site photo" value={imageOptions.some((o) => o.src === coverImage) ? coverImage : ""} onChange={(e) => e.target.value && setCoverImage(e.target.value)} className={`${inputClass} mb-2`}>
              <option value="">Choose a site photo…</option>
              {imageOptions.map((o) => (
                <option key={o.src} value={o.src}>{o.label}</option>
              ))}
            </select>
            <input id="coverImage" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="/images/… or https://…" className={inputClass} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {coverImage && <img src={coverImage} alt="" className="mt-2 h-32 rounded-lg object-cover" />}
          </Field>
          <Field label="Cover image alt text" htmlFor="coverAlt" hint="Describe the photo. Including the focus keyword helps if it fits naturally.">
            <input id="coverAlt" value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} className={inputClass} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" htmlFor="category">
              <input id="category" list="category-options" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
              <datalist id="category-options">
                {categoryOptions.map((c) => <option key={c} value={c} />)}
              </datalist>
            </Field>
            <Field label="Author" htmlFor="authorName" hint="A named instructor builds trust (E-E-A-T).">
              <select id="authorName" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className={inputClass}>
                {[...new Set([authorName, ...authorOptions])].map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Tags" htmlFor="tags" hint="Comma separated, e.g. karate, kids, confidence. Tags also link the post to matching courses.">
            <input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
          </Field>
        </Section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{status}</span>
            {status === "published" && <a href={`/blog/${effectiveSlug}`} target="_blank" rel="noopener" className="text-sm font-medium text-brand-700 hover:underline">View ↗</a>}
          </div>
          <label htmlFor="publishedAt" className="mt-4 mb-1.5 block text-sm font-medium">Publish date (India time)</label>
          <input id="publishedAt" type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputClass} />
          <p className="mt-1 text-xs text-slate-500">Blank = now. A future date schedules the post.</p>
          <div className="mt-4 flex gap-2">
            <button type="button" disabled={pending} onClick={() => save("published")} className={`${buttonClass} flex-1`}>
              {pending ? "Saving…" : status === "published" ? "Update" : "Publish"}
            </button>
            <button type="button" disabled={pending} onClick={() => save("draft")} className={secondaryButtonClass}>
              {status === "published" ? "Unpublish" : "Save draft"}
            </button>
          </div>
          {result && <p role="status" className={`mt-3 text-sm ${result.ok ? "text-emerald-700" : "text-red-600"}`}>{result.message}</p>}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold ring-4 ${scoreColor(audit.overallScore)}`}>{audit.overallScore}</span>
            <div>
              <p className="font-semibold text-slate-900">Live SEO score</p>
              <p className="text-xs text-slate-500">{audit.passedRules}/{audit.rules.length} of the 69 rules pass. Updates as you type.</p>
            </div>
          </div>
          <ul className="mt-4 max-h-[420px] space-y-2.5 overflow-auto pr-1 text-sm">
            {failing.map((r) => (
              <li key={r.id} className="flex gap-2">
                <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${r.priority === "Critical" ? "bg-red-500" : r.priority === "High" ? "bg-orange-500" : r.priority === "Medium" ? "bg-amber-400" : "bg-slate-300"}`} />
                <span>
                  <span className="font-medium text-slate-800">{r.name}</span>
                  <span className="block text-xs text-slate-500">{r.recommendation} ({r.value})</span>
                </span>
              </li>
            ))}
            {failing.length === 0 && <li className="text-emerald-700">Every rule passes.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Google preview</p>
          <p className="truncate text-xs text-slate-600">{siteUrl.replace(/^https?:\/\//, "")}/blog/{effectiveSlug}</p>
          <p className="mt-0.5 line-clamp-1 text-lg text-[#1a0dab]">{renderedTitle}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{desc}</p>
        </div>
      </aside>
    </div>
  );
}
