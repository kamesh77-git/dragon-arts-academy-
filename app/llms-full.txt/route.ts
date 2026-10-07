import { getPublishedPosts } from "@/lib/blog";
import { courses } from "@/lib/courses";
import { faculty, getFaculty } from "@/lib/faculty";
import { AFFILIATIONS, FOUNDED_YEAR, FOUNDER, PHONES, SITE_NAME, SITE_URL, STATS } from "@/lib/site";

// Full-text companion to /llms.txt: the substance of every course page and
// blog post in one markdown document, so AI assistants can answer
// questions about the academy accurately and cite the right URL.
export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts();
  const out: string[] = [
    `# ${SITE_NAME}: full content`,
    "",
    `${SITE_NAME} is a multi-arts academy in Mannivakkam, Chennai, Tamil Nadu, India, founded in ${FOUNDED_YEAR} by ${FOUNDER.name} (${FOUNDER.role}). It teaches ${STATS.programs} arts to children (from about 3 years), teenagers and adults. Its karate programme has produced ${STATS.blackBelts} black belts and trained ${STATS.studentsTrained} students. Affiliations: ${AFFILIATIONS.join("; ")}. Contact: ${PHONES.map((p) => p.display).join(", ")}. Website: ${SITE_URL}`,
    "",
    "## Faculty",
    "",
    ...faculty.map((f) => `- **${f.name}** (${f.handles}): ${f.bio}`),
    "",
  ];

  for (const c of courses) {
    const teacher = c.facultyId ? getFaculty(c.facultyId) : undefined;
    out.push(
      `## ${c.h1}`,
      "",
      `URL: ${SITE_URL}/${c.slug}`,
      "",
      ...c.intro.flatMap((p) => [p, ""]),
      ...(teacher ? [`Instructor: ${teacher.name}.`, ""] : []),
      `### ${c.whatIs.heading}`,
      "",
      ...c.whatIs.text.flatMap((p) => [p, ""]),
      "### What students learn",
      "",
      ...c.learn.map((l) => `- ${l}`),
      "",
      "### Benefits",
      "",
      ...c.benefits.map((b) => `- ${b}`),
      "",
      `### Who can join`,
      "",
      c.whoFor,
      "",
      "### FAQs",
      "",
      ...c.faqs.flatMap((f) => [`**${f.q}** ${f.a}`, ""])
    );
  }

  for (const p of posts) {
    out.push(
      `## ${p.title}`,
      "",
      `URL: ${SITE_URL}/blog/${p.slug} · By ${p.authorName} · ${(p.publishedAt ?? p.createdAt).toISOString().slice(0, 10)}`,
      "",
      ...(p.quickAnswer ? [`> ${p.quickAnswer}`, ""] : []),
      // Demote the post's own headings one level so the document stays well-formed.
      p.content.replace(/^(#{2,5}) /gm, "#$1 "),
      "",
      ...(p.faqs.length ? ["### FAQs", "", ...p.faqs.flatMap((f) => [`**${f.q}** ${f.a}`, ""])] : [])
    );
  }

  return new Response(out.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
