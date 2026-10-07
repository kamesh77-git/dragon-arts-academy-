import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

export function analyzeTechnical(
  blog: BlogPost
): RuleResult[] {

  const rules: RuleResult[] = [];

  const canonical =
    blog.canonicalUrl ?? "";

  const robots =
    blog.robots ?? "";

  const slug =
    blog.slug ?? "";

  // ==========================================
  // Robots
  // ==========================================

  const robotsOK =
    robots === "index,follow";

  rules.push({
    id: "robots-tag",
    category: "Technical",
    name: "Robots Tag",
    description:
      "Robots should be index,follow.",
    priority: "High",
    earned:
      robotsOK ? 3 : 0,
    total: 3,
    passed:
      robotsOK,
    value:
      robots || "Missing",
    expected:
      "index,follow",
    recommendation:
      "Use index,follow for public pages.",
  });

  // ==========================================
  // SEO Friendly URL
  // ==========================================

  const slugOK =
    slug === slug.toLowerCase() &&
    !slug.includes("_") &&
    !slug.includes(" ");

  rules.push({
    id: "seo-url",
    category: "Technical",
    name: "SEO Friendly URL",
    description:
      "URLs should be lowercase and hyphenated.",
    priority: "Medium",
    earned:
      slugOK ? 3 : 0,
    total: 3,
    passed:
      slugOK,
    value:
      slug,
    expected:
      "lowercase-hyphen-url",
    recommendation:
      "Use lowercase words separated by hyphens.",
  });

  // ==========================================
  // HTTPS
  // ==========================================

  const https =
    canonical.startsWith("https://");

  rules.push({
    id: "https",
    category: "Technical",
    name: "HTTPS",
    description:
      "Canonical URL should use HTTPS.",
    priority: "High",
    earned:
      https ? 2 : 0,
    total: 2,
    passed:
      https,
    value:
      https ? "HTTPS" : "Not HTTPS",
    expected:
      "https://",
    recommendation:
      "Use HTTPS URLs.",
  });

  return rules;

}
