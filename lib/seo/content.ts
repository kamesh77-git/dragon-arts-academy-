import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

export function analyzeContent(
  blog: BlogPost
): RuleResult[] {

  const rules: RuleResult[] = [];

  const content = blog.content ?? "";

  const lower =
    content.toLowerCase();

  const focusKeyword =
    blog.focusKeyword?.toLowerCase() ?? "";

  const words = content
    .split(/\s+/)
    .filter(Boolean);

  const paragraphs = content
    .split(/\n\s*\n/)
    .filter(
      (paragraph) =>
        paragraph.trim().length > 0
    );

  // Linked headings ("### [Title](/url)") are measured by their visible
  // text, not the markdown link syntax around it.
  const headings = (content.match(/^#{2,6}\s.+$/gm) ?? []).map((h) =>
    h.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
  );

  // ==========================================
  // Word Count
  // ==========================================

  const wordCount = words.length;

  rules.push({
    id: "word-count",
    category: "Content",
    name: "Word Count",
    description:
      "Recommended minimum 2500 words.",
    priority: "Critical",
    earned:
      wordCount >= 2500
        ? 10
        : wordCount >= 2000
        ? 7
        : wordCount >= 1500
        ? 5
        : 0,
    total: 10,
    passed:
      wordCount >= 2500,
    value:
      wordCount.toString(),
    expected:
      "2500+",
    recommendation:
      "Expand the article.",
  });

  // ==========================================
  // Headings
  // ==========================================

  rules.push({
    id: "headings",
    category: "Content",
    name: "Sub Headings",
    description:
      "Use H2/H3 headings.",
    priority: "Medium",
    earned:
      headings.length >= 6
        ? 4
        : headings.length >= 3
        ? 2
        : 0,
    total: 4,
    passed:
      headings.length >= 6,
    value:
      headings.length.toString(),
    expected:
      "6+",
    recommendation:
      "Add more headings.",
  });

  // ==========================================
  // Heading Hierarchy
  // ==========================================

  // Body content starts below the page's H1 (rendered separately as the
  // title), so an implicit level-1 precedes the first heading here —
  // a skip is any heading more than one level deeper than the deepest
  // level seen so far.
  const skippedHeadings: string[] = [];
  let deepestLevelSoFar = 1;
  for (const heading of headings) {
    const level = heading.match(/^#+/)?.[0].length ?? 2;
    if (level > deepestLevelSoFar + 1) {
      skippedHeadings.push(heading.trim());
    }
    deepestLevelSoFar = Math.max(deepestLevelSoFar, level);
  }

  rules.push({
    id: "heading-hierarchy",
    category: "Content",
    name: "Heading Hierarchy",
    description:
      "Heading levels should not skip (e.g. H2 straight to H4).",
    priority: "Medium",
    earned:
      skippedHeadings.length === 0 ? 4 : 0,
    total: 4,
    passed:
      skippedHeadings.length === 0,
    value:
      skippedHeadings.length === 0
        ? "In order"
        : `${skippedHeadings.length} skip(s)`,
    expected:
      "No skipped levels",
    recommendation:
      skippedHeadings.length === 0
        ? "Heading levels are in order."
        : `Fix skipped heading level(s): ${skippedHeadings.slice(0, 3).join(", ")}`,
  });

  // ==========================================
  // Heading Length
  // ==========================================

  const longHeadings = headings.filter(
    (heading) => heading.replace(/^#+\s*/, "").trim().length >= 70
  );

  rules.push({
    id: "heading-length",
    category: "Content",
    name: "Heading Length",
    description:
      "Every H2-H6 heading must be under 70 characters.",
    priority: "Medium",
    earned:
      longHeadings.length === 0 ? 4 : 0,
    total: 4,
    passed:
      longHeadings.length === 0,
    value:
      `${longHeadings.length} over 70 chars`,
    expected:
      "0",
    recommendation:
      longHeadings.length === 0
        ? "All headings are under 70 characters."
        : `Shorten: ${longHeadings
            .slice(0, 3)
            .map((h) => h.replace(/^#+\s*/, "").trim())
            .join(", ")}`,
  });

  // ==========================================
  // Focus Keyword In Heading
  // ==========================================

  const keywordHeading =
    focusKeyword.length > 0 &&
    headings.some((heading) =>
      heading
        .toLowerCase()
        .includes(focusKeyword)
    );

  rules.push({
    id: "keyword-heading",
    category: "Content",
    name:
      "Keyword in Heading",
    description:
      "Focus keyword should appear in H2/H3.",
    priority: "High",
    earned:
      keywordHeading ? 4 : 0,
    total: 4,
    passed:
      keywordHeading,
    value:
      keywordHeading
        ? "Found"
        : "Missing",
    expected:
      "Present",
    recommendation:
      "Add keyword into headings.",
  });

  // ==========================================
  // Paragraph Length
  // ==========================================

  const longParagraphs =
    paragraphs.filter(
      (paragraph) =>
        paragraph
          .split(/\s+/)
          .length > 120
    ).length;

  rules.push({
    id: "paragraph-length",
    category: "Content",
    name:
      "Paragraph Length",
    description:
      "Paragraphs should stay below 120 words.",
    priority: "Medium",
    earned:
      longParagraphs === 0
        ? 4
        : 0,
    total: 4,
    passed:
      longParagraphs === 0,
    value:
      `${longParagraphs} long paragraphs`,
    expected:
      "0",
    recommendation:
      "Split long paragraphs.",
  });

  // ==========================================
  // No Em Dash
  // ==========================================

  const emDashCount =
    (content.match(/\u2014/g) ?? []).length;

  rules.push({
    id: "no-em-dash",
    category: "Content",
    name: "No Em Dash",
    description:
      "Avoid the em dash character anywhere in the content.",
    priority: "Medium",
    earned:
      emDashCount === 0 ? 3 : 0,
    total: 3,
    passed:
      emDashCount === 0,
    value:
      `${emDashCount} found`,
    expected:
      "0",
    recommendation:
      "Replace em dashes with a comma, colon, or a plain hyphen surrounded by spaces.",
  });

  // ==========================================
  // Conclusion
  // ==========================================

  const conclusion =
    lower.includes("## conclusion") ||
    lower.includes(
      "## final thoughts"
    );

  rules.push({
    id: "conclusion",
    category: "Content",
    name: "Conclusion",
    description:
      "Every article should end with a conclusion.",
    priority: "Low",
    earned:
      conclusion ? 2 : 0,
    total: 2,
    passed:
      conclusion,
    value:
      conclusion
        ? "Present"
        : "Missing",
    expected:
      "Present",
    recommendation:
      "Add conclusion.",
  });

  return rules;

}