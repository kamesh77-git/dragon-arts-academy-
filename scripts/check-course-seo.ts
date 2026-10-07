// Quick pre-flight on course SEO fields against the length/keyword rules
// in lib/seo (title < 60 incl. suffix, description 145-158 chars).
import { courses } from "../lib/courses";
import { TITLE_SUFFIX } from "../lib/site";

for (const c of courses) {
  const { metaTitle: t, metaDescription: d, focusKeyword: kw } = c.seo;
  const issues = [
    t.length + TITLE_SUFFIX.length >= 60 && `title ${t.length + TITLE_SUFFIX.length}`,
    (d.length < 145 || d.length > 158) && `desc ${d.length}`,
    !t.toLowerCase().startsWith(kw) && "kw-not-first",
    !d.toLowerCase().includes(kw) && "kw-not-in-desc",
    !c.slug.includes(kw.replace(/ /g, "-")) && "kw-not-in-slug",
    !/\d/.test(t) && "no-number",
  ].filter(Boolean);
  console.log(issues.length ? "FIX" : " ok", c.slug, issues.join(", "));
}
