import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

export function analyzeLinks(
  blog: BlogPost
): RuleResult[] {

  const rules: RuleResult[] = [];

  // Image markdown ![alt](/src) also matches the link patterns below, so
  // images are stripped first; only real [text](href) links are counted.
  const content = (blog.content ?? "").replace(/!\[[^\]]*]\([^)]*\)/g, "");

  // ==========================================
  // Internal Links
  // ==========================================

  const internalLinks =
    content.match(
      /\]\((\/[^)]+)\)/g
    ) ?? [];

  rules.push({
    id: "internal-links",
    category: "Links",
    name: "Internal Links",
    description:
      "Internal links improve crawlability.",
    priority: "High",
    earned:
      internalLinks.length >= 5
        ? 5
        : internalLinks.length >= 3
        ? 3
        : internalLinks.length > 0
        ? 1
        : 0,
    total: 5,
    passed:
      internalLinks.length >= 5,
    value:
      internalLinks.length.toString(),
    expected:
      "5+",
    recommendation:
      "Add more internal links.",
  });

  // ==========================================
  // External Links
  // ==========================================

  const externalLinks =
    content.match(
      /\]\((https?:\/\/[^)]+)\)/g
    ) ?? [];

  rules.push({
    id: "external-links",
    category: "Links",
    name: "External Links",
    description:
      "External links improve trust.",
    priority: "Medium",
    earned:
      externalLinks.length >= 3
        ? 4
        : externalLinks.length >= 1
        ? 2
        : 0,
    total: 4,
    passed:
      externalLinks.length >= 3,
    value:
      externalLinks.length.toString(),
    expected:
      "3+",
    recommendation:
      "Reference authoritative websites.",
  });

  // ==========================================
  // Mixed Linking
  // ==========================================

  const mixed =
    internalLinks.length > 0 &&
    externalLinks.length > 0;

  rules.push({
    id: "mixed-links",
    category: "Links",
    name: "Balanced Linking",
    description:
      "Use both internal and external links.",
    priority: "Medium",
    earned:
      mixed ? 3 : 0,
    total: 3,
    passed:
      mixed,
    value:
      mixed
        ? "Balanced"
        : "Incomplete",
    expected:
      "Internal + External",
    recommendation:
      "Use both internal and external links.",
  });

  // ==========================================
  // Authority Links
  // ==========================================

  const authorityDomains = [
    "wikipedia.org",
    "google.com",
    "developers.google.com",
    "schema.org",
    "who.int",
    "unicef.org",
    "nih.gov",
    "cdc.gov",
    "gov.in",
    "india.gov.in",
    "edu",
    "org",
  ];

  const authorityCount =
    authorityDomains.filter(
      (domain) =>
        content.includes(domain)
    ).length;

  rules.push({
    id: "authority-links",
    category: "Links",
    name: "Authority Links",
    description:
      "Reference trusted sources.",
    priority: "Medium",
    earned:
      authorityCount >= 2
        ? 3
        : authorityCount === 1
        ? 2
        : 0,
    total: 3,
    passed:
      authorityCount >= 2,
    value:
      authorityCount.toString(),
    expected:
      "2+",
    recommendation:
      "Reference trusted websites.",
  });

  // ==========================================
  // Broken Placeholder Links
  // ==========================================

  const brokenLinks =
    content.match(
      /\]\(#\)/g
    ) ?? [];

  rules.push({
    id: "broken-links",
    category: "Links",
    name: "Broken Links",
    description:
      "Avoid placeholder links.",
    priority: "Critical",
    earned:
      brokenLinks.length === 0
        ? 5
        : 0,
    total: 5,
    passed:
      brokenLinks.length === 0,
    value:
      brokenLinks.length.toString(),
    expected:
      "0",
    recommendation:
      "Remove or fix placeholder links.",
  });

  return rules;

}