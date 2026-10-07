import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

export function analyzeEEAT(
  blog: BlogPost
): RuleResult[] {

  const rules: RuleResult[] = [];

  const content =
    blog.content.toLowerCase();

  // ==========================================
  // Author
  // ==========================================

  const hasAuthor =
    blog.author.trim().length > 0;

  rules.push({
    id: "author",
    category: "EEAT",
    name: "Author Information",
    description:
      "Every article should have an author.",
    priority: "Critical",
    earned: hasAuthor ? 4 : 0,
    total: 4,
    passed: hasAuthor,
    value:
      hasAuthor
        ? blog.author
        : "Missing",
    expected:
      "Author Name",
    recommendation:
      "Add an author.",
  });

  // ==========================================
  // Published Date
  // ==========================================

  const hasPublished =
    blog.publishedAt.length > 0;

  rules.push({
    id: "published-date",
    category: "EEAT",
    name: "Published Date",
    description:
      "Publication date improves trust.",
    priority: "Medium",
    earned:
      hasPublished ? 2 : 0,
    total: 2,
    passed:
      hasPublished,
    value:
      hasPublished
        ? blog.publishedAt
        : "Missing",
    expected:
      "Published date",
    recommendation:
      "Add a publication date.",
  });

  // ==========================================
  // Updated Date
  // ==========================================

  const hasUpdated =
    Boolean(blog.updatedAt);

  rules.push({
    id: "updated-date",
    category: "EEAT",
    name: "Updated Date",
    description:
      "Fresh content performs better.",
    priority: "Medium",
    earned:
      hasUpdated ? 2 : 0,
    total: 2,
    passed:
      hasUpdated,
    value:
      hasUpdated
        ? blog.updatedAt!
        : "Missing",
    expected:
      "Updated date",
    recommendation:
      "Maintain an updated date.",
  });

  // ==========================================
  // References
  // ==========================================

  const references =
    content.includes("references") ||
    content.includes("sources");

  rules.push({
    id: "references",
    category: "EEAT",
    name: "References",
    description:
      "Cite trusted references.",
    priority: "High",
    earned:
      references ? 4 : 0,
    total: 4,
    passed:
      references,
    value:
      references
        ? "Present"
        : "Missing",
    expected:
      "Reference section",
    recommendation:
      "Add references or sources.",
  });

  // ==========================================
  // Contact Information
  // ==========================================

  const contact =
    content.includes("contact");

  rules.push({
    id: "contact",
    category: "EEAT",
    name: "Contact Information",
    description:
      "Contact information increases trust.",
    priority: "Low",
    earned:
      contact ? 2 : 0,
    total: 2,
    passed:
      contact,
    value:
      contact
        ? "Present"
        : "Missing",
    expected:
      "Contact section",
    recommendation:
      "Include contact details or support information.",
  });

  // ==========================================
  // Brand Mention
  // ==========================================

  const brand =
    content.includes("dragon ryu");

  rules.push({
    id: "brand",
    category: "EEAT",
    name: "Brand Mention",
    description:
      "Mention your brand naturally in the content.",
    priority: "Low",
    earned:
      brand ? 2 : 0,
    total: 2,
    passed:
      brand,
    value:
      brand
        ? "Present"
        : "Missing",
    expected:
      "Brand mentioned",
    recommendation:
      "Mention Dragon Ryu Arts Academy where appropriate.",
  });

  // ==========================================
  // Experience Signals
  // ==========================================

  const experience =
    content.includes("our experience") ||
    content.includes("we tested") ||
    content.includes("we recommend") ||
    content.includes("our team");

  rules.push({
    id: "experience",
    category: "EEAT",
    name: "Experience Signals",
    description:
      "Show first-hand knowledge or experience.",
    priority: "High",
    earned:
      experience ? 4 : 0,
    total: 4,
    passed:
      experience,
    value:
      experience
        ? "Present"
        : "Missing",
    expected:
      "Experience statements",
    recommendation:
      "Include first-hand experience where applicable.",
  });

  return rules;

}