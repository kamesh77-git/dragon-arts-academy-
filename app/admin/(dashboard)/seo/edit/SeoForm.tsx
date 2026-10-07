"use client";

import { useActionState, useState } from "react";

import { savePageSeo, type SaveState } from "../actions";
import { buttonClass, inputClass } from "@/components/admin/ui";

interface Props {
  path: string;
  titleSuffix: string;
  siteUrl: string;
  initial: { metaTitle: string; metaDescription: string; focusKeyword: string; secondaryKeywords: string };
}

function Counter({ value, ok, label }: { value: number; ok: boolean; label: string }) {
  return <span className={`text-xs ${ok ? "text-emerald-700" : "text-amber-700"}`}>{value} chars · {label}</span>;
}

export default function SeoForm({ path, titleSuffix, siteUrl, initial }: Props) {
  const [state, action, pending] = useActionState<SaveState, FormData>(savePageSeo, null);
  const [title, setTitle] = useState(initial.metaTitle);
  const [desc, setDesc] = useState(initial.metaDescription);
  const [keyword, setKeyword] = useState(initial.focusKeyword);

  const rendered = `${title}${titleSuffix}`;
  const kw = keyword.trim().toLowerCase();
  const checks = [
    { ok: rendered.length < 60, text: "Title under 60 characters (with site name)" },
    { ok: desc.length >= 145 && desc.length <= 158, text: "Description 145 to 158 characters" },
    { ok: !!kw && title.toLowerCase().includes(kw), text: "Focus keyword in title" },
    { ok: !!kw && title.toLowerCase().startsWith(kw), text: "Title starts with the focus keyword" },
    { ok: !!kw && desc.toLowerCase().includes(kw), text: "Focus keyword in description" },
    { ok: /\d/.test(title), text: "Number in title" },
    { ok: /\bbest\b/i.test(title), text: "Power / sentiment word in title (e.g. best)" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <form action={action} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="path" value={path} />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="metaTitle" className="text-sm font-medium">Meta title</label>
            <Counter value={rendered.length} ok={rendered.length < 60} label="target under 60 incl. site name" />
          </div>
          <input id="metaTitle" name="metaTitle" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
          <p className="mt-1 text-xs text-slate-500">&ldquo;{titleSuffix.trim()}&rdquo; is added automatically.</p>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="metaDescription" className="text-sm font-medium">Meta description</label>
            <Counter value={desc.length} ok={desc.length >= 145 && desc.length <= 158} label="target 145 to 158" />
          </div>
          <textarea id="metaDescription" name="metaDescription" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="focusKeyword" className="mb-1.5 block text-sm font-medium">Focus keyword</label>
          <input id="focusKeyword" name="focusKeyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} className={inputClass} required />
          <p className="mt-1 text-xs text-slate-500">The main search phrase this page should rank for. Changing it does not change the page text, so pick one the page already uses.</p>
        </div>
        <div>
          <label htmlFor="secondaryKeywords" className="mb-1.5 block text-sm font-medium">Secondary keywords</label>
          <input id="secondaryKeywords" name="secondaryKeywords" defaultValue={initial.secondaryKeywords} className={inputClass} />
          <p className="mt-1 text-xs text-slate-500">Comma separated. Four is ideal.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className={buttonClass} disabled={pending}>{pending ? "Saving…" : "Save"}</button>
          {state && <p role="status" className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.message}</p>}
        </div>
      </form>

      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Google preview</p>
          <p className="truncate text-xs text-slate-600">{siteUrl.replace(/^https?:\/\//, "")}{path === "/" ? "" : path}</p>
          <p className="mt-0.5 line-clamp-1 text-lg text-[#1a0dab]">{rendered}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{desc}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">Quick checks</p>
          <ul className="space-y-2 text-sm">
            {checks.map((c) => (
              <li key={c.text} className="flex gap-2">
                <span aria-hidden="true" className={c.ok ? "text-emerald-600" : "text-amber-600"}>{c.ok ? "✓" : "!"}</span>
                <span className={c.ok ? "text-slate-700" : "text-slate-500"}>{c.text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Save, then open the audit for the full 69-rule score.</p>
        </div>
      </div>
    </div>
  );
}
