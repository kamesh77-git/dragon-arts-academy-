import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

export function analyzeKeyword(
  blog: BlogPost
): RuleResult[] {
  const rules: RuleResult[] = [];

  const focusKeyword =
    blog.focusKeyword?.trim() ?? "";

  const secondaryKeywords: string[] =
    blog.secondaryKeywords ?? [];

  const content =
    blog.content?.toLowerCase() ?? "";

  const meta =
    blog.metaDescription?.toLowerCase() ?? "";

  const slug =
    blog.slug?.toLowerCase() ?? "";

  // ============================================
  // Focus Keyword Exists
  // ============================================

  rules.push({
    id: "focus-keyword",
    category: "Keyword",
    name: "Focus Keyword",
    description:
      "Focus keyword must be provided.",
    priority: "Critical",
    earned: focusKeyword ? 2 : 0,
    total: 2,
    passed: Boolean(focusKeyword),
    value:
      focusKeyword || "Missing",
    expected:
      "One focus keyword",
    recommendation:
      "Add a focus keyword.",
  });

  // ============================================
  // Secondary Keywords
  // ============================================

  rules.push({
    id: "secondary-keywords",
    category: "Keyword",
    name: "Secondary Keywords",
    description:
      "Add up to four secondary keywords.",
    priority: "Medium",
    earned:
      secondaryKeywords.length >= 4
        ? 2
        : secondaryKeywords.length > 0
        ? 1
        : 0,
    total: 2,
    passed:
      secondaryKeywords.length >= 4,
    value:
      secondaryKeywords.length > 0
        ? secondaryKeywords.join(", ")
        : "None",
    expected:
      "4 keywords",
    recommendation:
      "Add four secondary keywords.",
  });

  // ============================================
  // Focus Keyword in Meta Description
  // ============================================

  const keywordInMeta =
    focusKeyword.length > 0 &&
    meta.includes(
      focusKeyword.toLowerCase()
    );

  rules.push({
    id: "keyword-meta",
    category: "Keyword",
    name: "Keyword in Meta Description",
    description:
      "Focus keyword should appear in meta description.",
    priority: "High",
    earned:
      keywordInMeta ? 3 : 0,
    total: 3,
    passed:
      keywordInMeta,
    value:
      keywordInMeta
        ? "Found"
        : "Missing",
    expected:
      "Keyword present",
    recommendation:
      "Include the focus keyword in the meta description.",
  });

  // ============================================
  // Focus Keyword in URL
  // ============================================

  const keywordSlug =
    focusKeyword
      .replace(/\s+/g, "-")
      .toLowerCase();

  const keywordInSlug =
    keywordSlug.length > 0 &&
    slug.includes(keywordSlug);

  rules.push({
    id: "keyword-url",
    category: "Keyword",
    name: "Keyword in URL",
    description:
      "Focus keyword should appear in URL.",
    priority: "High",
    earned:
      keywordInSlug ? 3 : 0,
    total: 3,
    passed:
      keywordInSlug,
    value:
      keywordInSlug
        ? "Found"
        : "Missing",
    expected:
      "Keyword present",
    recommendation:
      "Include the focus keyword in the URL.",
  });

  // ============================================
  // Keyword in First 10%
  // ============================================

  const first10Percent =
    content.substring(
      0,
      Math.floor(
        content.length * 0.1
      )
    );

  const keywordEarly =
    focusKeyword.length > 0 &&
    first10Percent.includes(
      focusKeyword.toLowerCase()
    );

  rules.push({
    id: "keyword-first-10",
    category: "Keyword",
    name:
      "Keyword in First 10% of Content",
    description:
      "Focus keyword should appear in the introduction.",
    priority: "Critical",
    earned:
      keywordEarly ? 4 : 0,
    total: 4,
    passed:
      keywordEarly,
    value:
      keywordEarly
        ? "Found"
        : "Missing",
    expected:
      "Keyword in first 10%",
    recommendation:
      "Mention the focus keyword in the introduction.",
  });

  // ============================================
  // Keyword Density
  // ============================================

  const words: string[] =
    content
      .split(/\s+/)
      .filter(
        (word: string) =>
          word.trim().length > 0
      );

  const occurrences =
    focusKeyword.length > 0
      ? content.split(
          focusKeyword.toLowerCase()
        ).length - 1
      : 0;

  const density =
    words.length > 0
      ? (occurrences /
          words.length) *
        100
      : 0;

  const densityRounded =
    density.toFixed(2);

  const densityOK =
    density >= 1 &&
    density <= 2.5;

  rules.push({
    id: "keyword-density",
    category: "Keyword",
    name: "Keyword Density",
    description:
      "Recommended keyword density is between 1% and 2.5%.",
    priority: "Medium",
    earned:
      densityOK ? 5 : 0,
    total: 5,
    passed:
      densityOK,
    value:
      `${densityRounded}%`,
    expected:
      "1% - 2.5%",
    recommendation:
      "Adjust keyword usage throughout the content.",
  });

  // ============================================
  // Keyword Stuffing
  // ============================================

  const stuffing =
    density > 2.5;

  rules.push({
    id: "keyword-stuffing",
    category: "Keyword",
    name: "Keyword Stuffing",
    description:
      "Avoid excessive repetition of the focus keyword.",
    priority: "High",
    earned:
      stuffing ? 0 : 3,
    total: 3,
    passed:
      !stuffing,
    value:
      `${densityRounded}%`,
    expected:
      "< 2.5%",
    recommendation:
      "Reduce repeated use of the focus keyword.",
  });

  return rules;
}