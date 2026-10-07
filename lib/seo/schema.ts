import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

export function analyzeSchema(
  blog: BlogPost
): RuleResult[] {

  const rules: RuleResult[] = [];

  // ==========================================
  // Article Schema
  // ==========================================

  rules.push({
    id: "article-schema",
    category: "Schema",
    name: "Page Schema",
    description:
      "Every page should declare its main entity (WebPage, Article or Course).",
    priority: "Critical",
    earned:
      blog.articleSchema ? 5 : 0,
    total: 5,
    passed:
      Boolean(blog.articleSchema),
    value:
      blog.articleSchema
        ? "Present"
        : "Missing",
    expected:
      "WebPage / Article / Course schema",
    recommendation:
      "Add WebPage, Article or Course JSON-LD schema.",
  });

  // ==========================================
  // FAQ Schema
  // ==========================================

  rules.push({
    id: "faq-schema",
    category: "Schema",
    name: "FAQ Schema",
    description:
      "FAQ schema helps rich search results.",
    priority: "High",
    earned:
      blog.faqSchema ? 4 : 0,
    total: 4,
    passed:
      Boolean(blog.faqSchema),
    value:
      blog.faqSchema
        ? "Present"
        : "Missing",
    expected:
      "FAQ Schema",
    recommendation:
      "Generate FAQ schema.",
  });

  // ==========================================
  // Breadcrumb Schema
  // ==========================================

  rules.push({
    id: "breadcrumb-schema",
    category: "Schema",
    name: "Breadcrumb Schema",
    description:
      "Breadcrumb schema improves navigation.",
    priority: "Medium",
    earned:
      blog.breadcrumbSchema ? 3 : 0,
    total: 3,
    passed:
      Boolean(blog.breadcrumbSchema),
    value:
      blog.breadcrumbSchema
        ? "Present"
        : "Missing",
    expected:
      "Breadcrumb Schema",
    recommendation:
      "Add Breadcrumb schema.",
  });

  // ==========================================
  // Organization Schema
  // ==========================================

  rules.push({
    id: "organization-schema",
    category: "Schema",
    name: "Organization Schema",
    description:
      "Organization schema identifies your brand.",
    priority: "Medium",
    earned:
      blog.organizationSchema ? 3 : 0,
    total: 3,
    passed:
      Boolean(blog.organizationSchema),
    value:
      blog.organizationSchema
        ? "Present"
        : "Missing",
    expected:
      "Organization Schema",
    recommendation:
      "Add Organization schema.",
  });

  // ==========================================
  // Course Schema (the academy's equivalent of Product schema)
  // ==========================================

  rules.push({
    id: "course-schema",
    category: "Schema",
    name: "Course Schema",
    description:
      "Course pages should include Course schema.",
    priority: "Low",
    earned:
      blog.courseSchema ? 2 : 0,
    total: 2,
    passed:
      Boolean(blog.courseSchema),
    value:
      blog.courseSchema
        ? "Present"
        : "Missing",
    expected:
      "Course Schema",
    recommendation:
      "Add Course schema to course pages.",
  });

  // ==========================================
  // Combined Schema Coverage
  // ==========================================

  const schemaCount = [
    blog.articleSchema,
    blog.faqSchema,
    blog.breadcrumbSchema,
    blog.organizationSchema,
    blog.courseSchema,
  ].filter(Boolean).length;

  rules.push({
    id: "schema-coverage",
    category: "Schema",
    name: "Schema Coverage",
    description:
      "Overall structured data coverage.",
    priority: "Medium",
    earned:
      schemaCount >= 4
        ? 3
        : schemaCount >= 2
        ? 2
        : schemaCount >= 1
        ? 1
        : 0,
    total: 3,
    passed:
      schemaCount >= 4,
    value:
      `${schemaCount}/5`,
    expected:
      "4+ schema types",
    recommendation:
      "Increase structured data coverage.",
  });

  return rules;

}