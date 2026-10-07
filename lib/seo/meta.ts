import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";
import { TITLE_SUFFIX } from "@/lib/site";

export function analyzeMeta(
  blog: BlogPost
): RuleResult[] {
  const rules: RuleResult[] = [];

  const metaTitle =
    blog.metaTitle?.trim() ?? "";

  const metaDescription =
    blog.metaDescription?.trim() ?? "";

  const canonical =
    blog.canonicalUrl?.trim() ?? "";

  const robots =
    blog.robots?.trim() ?? "";

  const focusKeyword =
    blog.focusKeyword?.toLowerCase() ?? "";

  const slug =
    blog.slug ?? "";

  // ==========================================
  // Meta Title Exists
  // ==========================================

  rules.push({
    id: "meta-title-exists",
    category: "Metadata",
    name: "Meta Title",
    description:
      "Meta title should exist.",
    priority: "Critical",
    earned:
      metaTitle.length > 0 ? 2 : 0,
    total: 2,
    passed:
      metaTitle.length > 0,
    value:
      metaTitle || "Missing",
    expected:
      "Meta title",
    recommendation:
      "Add a meta title.",
  });

  // ==========================================
  // Meta Title Length
  // ==========================================

  // The site layout appends TITLE_SUFFIX (" | Dragon Ryu") to every page's
  // <title> via its title template, so the string that actually renders in a
  // SERP is longer than the raw metaTitle field alone — that rendered length
  // is what needs to stay under 60, not just the field itself.
  const SITE_TITLE_SUFFIX_LENGTH = TITLE_SUFFIX.length;

  const rawTitleLength =
    metaTitle.length;

  const renderedTitleLength =
    rawTitleLength > 0
      ? rawTitleLength + SITE_TITLE_SUFFIX_LENGTH
      : 0;

  const titleOK =
    renderedTitleLength > 0 &&
    renderedTitleLength < 60;

  rules.push({
    id: "meta-title-length",
    category: "Metadata",
    name:
      "Meta Title Length",
    description:
      `Rendered title (metaTitle + "${TITLE_SUFFIX}") must be under 60 characters.`,
    priority: "Medium",
    earned:
      titleOK ? 2 : 0,
    total: 2,
    passed:
      titleOK,
    value:
      `${renderedTitleLength} characters`,
    expected:
      "<60",
    recommendation:
      "Shorten the meta title so it stays under 60 characters including the site suffix.",
  });

  // ==========================================
  // Meta Description Exists
  // ==========================================

  rules.push({
    id: "meta-description",
    category: "Metadata",
    name:
      "Meta Description",
    description:
      "Meta description should exist.",
    priority: "Critical",
    earned:
      metaDescription.length > 0
        ? 2
        : 0,
    total: 2,
    passed:
      metaDescription.length > 0,
    value:
      metaDescription ||
      "Missing",
    expected:
      "Meta description",
    recommendation:
      "Write a meta description.",
  });

  // ==========================================
  // Meta Description Length
  // ==========================================

  const metaLength =
    metaDescription.length;

  const metaOK =
    metaLength >= 145 &&
    metaLength <= 158;

  rules.push({
    id: "meta-description-length",
    category: "Metadata",
    name:
      "Meta Description Length",
    description:
      "Must be 145-158 characters.",
    priority: "Medium",
    earned:
      metaOK ? 2 : 0,
    total: 2,
    passed:
      metaOK,
    value:
      `${metaLength} characters`,
    expected:
      "145-158",
    recommendation:
      "Adjust meta description length to 145-158 characters.",
  });

  // ==========================================
  // Keyword in Meta
  // ==========================================

  const keywordFound =
    focusKeyword.length > 0 &&
    metaDescription
      .toLowerCase()
      .includes(focusKeyword);

  rules.push({
    id: "meta-keyword",
    category: "Metadata",
    name:
      "Keyword in Meta",
    description:
      "Focus keyword appears in meta description.",
    priority: "High",
    earned:
      keywordFound ? 2 : 0,
    total: 2,
    passed:
      keywordFound,
    value:
      keywordFound
        ? "Found"
        : "Missing",
    expected:
      "Keyword included",
    recommendation:
      "Include the focus keyword in the meta description.",
  });

  // ==========================================
  // Canonical URL
  // ==========================================

  rules.push({
    id: "canonical",
    category: "Metadata",
    name:
      "Canonical URL",
    description:
      "Canonical URL should exist.",
    priority: "High",
    earned:
      canonical.length > 0
        ? 2
        : 0,
    total: 2,
    passed:
      canonical.length > 0,
    value:
      canonical || "Missing",
    expected:
      "Canonical URL",
    recommendation:
      "Add a canonical URL.",
  });

  // ==========================================
  // URL Length
  // ==========================================

  const urlLength =
    slug.length;

  const urlOK =
    urlLength <= 75;

  rules.push({
    id: "url-length",
    category: "Metadata",
    name:
      "URL Length",
    description:
      "Slug should be under 75 characters.",
    priority: "Low",
    earned:
      urlOK ? 2 : 0,
    total: 2,
    passed:
      urlOK,
    value:
      `${urlLength} characters`,
    expected:
      "<=75",
    recommendation:
      "Shorten the URL.",
  });

  // ==========================================
  // Robots Tag
  // ==========================================

  const robotsOK =
    robots.length > 0;

  rules.push({
    id: "robots",
    category: "Metadata",
    name:
      "Robots Meta",
    description:
      "Robots tag should exist.",
    priority: "Low",
    earned:
      robotsOK ? 2 : 0,
    total: 2,
    passed:
      robotsOK,
    value:
      robots || "Missing",
    expected:
      "index,follow",
    recommendation:
      "Specify robots directives.",
  });

  // ==========================================
  // Open Graph Image
  // ==========================================

  const ogImage =
    blog.openGraphImage ?? "";

  rules.push({
    id: "og-image",
    category: "Metadata",
    name:
      "Open Graph Image",
    description:
      "Open Graph image should exist.",
    priority: "Medium",
    earned:
      ogImage.length > 0 ? 2 : 0,
    total: 2,
    passed:
      ogImage.length > 0,
    value:
      ogImage || "Missing",
    expected:
      "Image",
    recommendation:
      "Add an Open Graph image.",
  });

  // ==========================================
  // Twitter Card
  // ==========================================

  const twitter =
    blog.twitterCard ?? "";

  rules.push({
    id: "twitter-card",
    category: "Metadata",
    name:
      "Twitter Card",
    description:
      "Twitter card image should exist.",
    priority: "Low",
    earned:
      twitter.length > 0 ? 2 : 0,
    total: 2,
    passed:
      twitter.length > 0,
    value:
      twitter || "Missing",
    expected:
      "Twitter image",
    recommendation:
      "Add a Twitter card image.",
  });

  return rules;
}