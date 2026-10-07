import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

export function analyzeAI(
  blog: BlogPost
): RuleResult[] {

  const rules: RuleResult[] = [];

  const content =
    blog.content.toLowerCase();

  // ==========================================
  // FAQ
  // ==========================================

  const faq =
    content.includes("faq") ||
    content.includes("frequently asked");

  rules.push({
    id: "ai-faq",
    category: "AI",
    name: "FAQ Section",
    description:
      "FAQ improves AI answer generation.",
    priority: "High",
    earned: faq ? 5 : 0,
    total: 5,
    passed: faq,
    value:
      faq ? "Present" : "Missing",
    expected:
      "FAQ Section",
    recommendation:
      "Add a Frequently Asked Questions section.",
  });

  // ==========================================
  // Lists
  // ==========================================

  const lists =
    (content.match(
      /^(\-|\*|\d+\.)\s/gm
    ) ?? []).length;

  rules.push({
    id: "ai-lists",
    category: "AI",
    name: "Lists",
    description:
      "Lists are easier for AI systems to extract.",
    priority: "Medium",
    earned:
      lists >= 5
        ? 4
        : lists >= 2
        ? 2
        : 0,
    total: 4,
    passed:
      lists >= 5,
    value:
      lists.toString(),
    expected:
      "5+",
    recommendation:
      "Use more ordered and unordered lists.",
  });

  // ==========================================
  // Tables
  // ==========================================

  const tables =
    (content.match(/\|/g) ?? []).length;

  rules.push({
    id: "ai-tables",
    category: "AI",
    name: "Tables",
    description:
      "Tables improve structured understanding.",
    priority: "Medium",
    earned:
      tables > 10 ? 3 : 0,
    total: 3,
    passed:
      tables > 10,
    value:
      tables > 0
        ? "Present"
        : "Missing",
    expected:
      "Table",
    recommendation:
      "Add comparison or specification tables.",
  });

  // ==========================================
  // Short Answer Blocks
  // ==========================================

  const answerBlocks =
    content.includes("what is") ||
    content.includes("how to") ||
    content.includes("why") ||
    content.includes("benefits");

  rules.push({
    id: "ai-answer-blocks",
    category: "AI",
    name: "Answer Blocks",
    description:
      "Clear question-answer sections help AI retrieval.",
    priority: "High",
    earned:
      answerBlocks ? 4 : 0,
    total: 4,
    passed:
      answerBlocks,
    value:
      answerBlocks
        ? "Present"
        : "Missing",
    expected:
      "Question & Answer sections",
    recommendation:
      "Add concise answer blocks.",
  });

  // ==========================================
  // Entity Mentions
  // ==========================================

  const entities = [
    "karate",
    "martial arts",
    "dance",
    "yoga",
    "children",
    "students",
    "mannivakkam",
    "chennai",
  ];

  const entityCount =
    entities.filter((entity) =>
      content.includes(entity)
    ).length;

  rules.push({
    id: "ai-entities",
    category: "AI",
    name: "Entity Coverage",
    description:
      "Recognized entities improve AI understanding.",
    priority: "Medium",
    earned:
      entityCount >= 5
        ? 4
        : entityCount >= 3
        ? 2
        : 0,
    total: 4,
    passed:
      entityCount >= 5,
    value:
      `${entityCount} entities`,
    expected:
      "5+",
    recommendation:
      "Mention important entities naturally.",
  });

  // ==========================================
  // Readability
  // ==========================================

  const sentences =
    content
      .split(/[.!?]/)
      .filter(Boolean);

  const averageSentenceLength =
    sentences.length === 0
      ? 0
      : content.split(/\s+/).length /
        sentences.length;

  const readability =
    averageSentenceLength <= 20;

  rules.push({
    id: "ai-readability",
    category: "AI",
    name: "Sentence Length",
    description:
      "Shorter sentences improve AI comprehension.",
    priority: "Low",
    earned:
      readability ? 3 : 0,
    total: 3,
    passed:
      readability,
    value:
      averageSentenceLength.toFixed(1),
    expected:
      "<20 words",
    recommendation:
      "Reduce average sentence length.",
  });

  // ==========================================
  // Summary Section
  // ==========================================

  const summary =
    content.includes("summary") ||
    content.includes("key takeaways");

  rules.push({
    id: "ai-summary",
    category: "AI",
    name: "Summary",
    description:
      "Summaries improve AI retrieval.",
    priority: "Low",
    earned:
      summary ? 2 : 0,
    total: 2,
    passed:
      summary,
    value:
      summary
        ? "Present"
        : "Missing",
    expected:
      "Summary",
    recommendation:
      "Add a summary or key takeaways section.",
  });

  return rules;

}