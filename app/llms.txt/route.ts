import { getPublishedPosts } from "@/lib/blog";
import { courses } from "@/lib/courses";
import { getFaculty } from "@/lib/faculty";
import { AFFILIATIONS, FOUNDED_YEAR, KARATE_BRANCHES, PHONES, SITE_NAME, SITE_URL, STATS } from "@/lib/site";

// Markdown summary for LLMs and AI answer engines (llmstxt.org). Built
// from the same data as the pages so it can't drift out of sync.
export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts();
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> Multi-arts academy in Mannivakkam, Chennai, Tamil Nadu, India, founded in ${FOUNDED_YEAR}. ${STATS.programs} programs for children (from about 3 years), teenagers and adults: martial arts, yoga, dance, music, drawing, abacus, handwriting and languages.`,
    "",
    `- ${STATS.blackBelts} black belt students and ${STATS.studentsTrained} students trained in karate`,
    `- Affiliations: ${AFFILIATIONS.join("; ")}`,
    "- Organises Yoga World Record events twice a year",
    `- Phone / WhatsApp: ${PHONES.map((p) => p.display).join(", ")}`,
    `- Karate branches: ${KARATE_BRANCHES.map((b) => b.name.replace(" Karate Class", "")).join(", ")}`,
    "- Admissions open, no admission fee",
    "",
    "## Courses",
    "",
    ...courses.map((c) => {
      const teacher = c.facultyId ? getFaculty(c.facultyId)?.name : undefined;
      return `- [${c.name} classes](${SITE_URL}/${c.slug}): ${c.cardText}${teacher ? ` Instructor: ${teacher}.` : ""}`;
    }),
    "",
    ...(posts.length
      ? ["## Blog", "", ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`), ""]
      : []),
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): about the academy, founder, faculty, gallery, admissions and contact`,
    `- [All courses](${SITE_URL}/courses)`,
    `- [Blog](${SITE_URL}/blog)`,
    `- [Admissions](${SITE_URL}/#admissions)`,
    "",
    "## Optional",
    "",
    `- [Full content for LLMs](${SITE_URL}/llms-full.txt): every course page and blog post as plain markdown`,
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
