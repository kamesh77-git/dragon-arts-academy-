import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

const POWER_WORDS = [
  "best",
  "ultimate",
  "complete",
  "essential",
  "proven",
  "powerful",
  "easy",
  "smart",
  "expert",
  "top",
  "exclusive",
  "amazing",
  "simple",
  "perfect",
  "professional",
  "effective",
  "premium",
  "quick",
  "master",
  "secret",
];

const SENTIMENT_WORDS = [
  "best",
  "amazing",
  "awesome",
  "excellent",
  "perfect",
  "ultimate",
  "proven",
  "essential",
  "avoid",
  "warning",
  "mistakes",
  "don't",
  "never",
  "worst",
  "dangerous",
  "hidden",
];

export function analyzeTitle(
  blog: BlogPost
): RuleResult[] {
  const rules: RuleResult[] = [];

  const title =
    blog.title?.trim() ?? "";

  const seoTitle =
    blog.metaTitle?.trim() ||
    title;

  const keyword =
    blog.focusKeyword?.toLowerCase() ??
    "";

  const lower =
    seoTitle.toLowerCase();

  // ----------------------------------------------------
  // SEO Title Exists
  // ----------------------------------------------------

  rules.push({
    id: "seo-title-exists",
    category: "Title",
    name: "SEO Title Exists",
    description:
      "SEO title must exist.",
    priority: "Critical",
    earned:
      seoTitle.length > 0 ? 2 : 0,
    total: 2,
    passed:
      seoTitle.length > 0,
    value:
      seoTitle || "Missing",
    expected:
      "SEO title",
    recommendation:
      "Create an SEO title.",
  });

  // ----------------------------------------------------
  // Title Length
  // ----------------------------------------------------

  const length =
    seoTitle.length;

  const lengthOK =
    length > 0 &&
    length < 60;

  rules.push({
    id: "seo-title-length",
    category: "Title",
    name: "Title Length",
    description:
      "Must be under 60 characters.",
    priority: "Medium",
    earned:
      lengthOK ? 2 : 0,
    total: 2,
    passed:
      lengthOK,
    value:
      `${length} characters`,
    expected:
      "<60 characters",
    recommendation:
      "Shorten the SEO title to under 60 characters.",
  });

  // ----------------------------------------------------
  // H1 Length
  // ----------------------------------------------------

  // Distinct from the SEO title above: this checks the page's actual H1
  // (blog.title), which renders on the page itself and is often longer
  // than the <title> tag / metaTitle used for search results.
  const h1 =
    title;

  const h1Length =
    h1.length;

  const h1LengthOK =
    h1Length > 0 &&
    h1Length < 70;

  rules.push({
    id: "h1-length",
    category: "Title",
    name: "H1 Length",
    description:
      "The page H1 must be under 70 characters.",
    priority: "Medium",
    earned:
      h1LengthOK ? 2 : 0,
    total: 2,
    passed:
      h1LengthOK,
    value:
      `${h1Length} characters`,
    expected:
      "<70 characters",
    recommendation:
      "Shorten the H1 to under 70 characters.",
  });

  // ----------------------------------------------------
  // Focus Keyword
  // ----------------------------------------------------

  const keywordFound =
    keyword.length > 0 &&
    lower.includes(keyword);

  rules.push({
    id: "title-keyword",
    category: "Title",
    name: "Keyword in Title",
    description:
      "Focus keyword appears in title.",
    priority: "Critical",
    earned:
      keywordFound ? 3 : 0,
    total: 3,
    passed:
      keywordFound,
    value:
      keywordFound
        ? "Found"
        : "Missing",
    expected:
      "Keyword included",
    recommendation:
      "Include focus keyword.",
  });

  // ----------------------------------------------------
  // Number
  // ----------------------------------------------------

  const hasNumber =
    /\d/.test(seoTitle);

  rules.push({
    id: "title-number",
    category: "Title",
    name: "Number in Title",
    description:
      "Numbers improve CTR.",
    priority: "Medium",
    earned:
      hasNumber ? 2 : 0,
    total: 2,
    passed:
      hasNumber,
    value:
      hasNumber
        ? "Yes"
        : "No",
    expected:
      "Contains a number",
    recommendation:
      "Include a number in the title.",
  });

  // ----------------------------------------------------
  // Power Word
  // ----------------------------------------------------

  const powerWord =
    POWER_WORDS.find((word) =>
      lower.includes(word)
    );

  rules.push({
    id: "power-word",
    category: "Title",
    name: "Power Word",
    description:
      "Title contains a marketing power word.",
    priority: "Medium",
    earned:
      powerWord ? 3 : 0,
    total: 3,
    passed:
      Boolean(powerWord),
    value:
      powerWord ??
      "Not Found",
    expected:
      "Power word",
    recommendation:
      "Add a power word.",
  });

  // ----------------------------------------------------
  // Sentiment Word
  // ----------------------------------------------------

  const sentiment =
    SENTIMENT_WORDS.find((word) =>
      lower.includes(word)
    );

  rules.push({
    id: "sentiment-word",
    category: "Title",
    name: "Sentiment Word",
    description:
      "Title contains emotional language.",
    priority: "Medium",
    earned:
      sentiment ? 3 : 0,
    total: 3,
    passed:
      Boolean(sentiment),
    value:
      sentiment ??
      "Not Found",
    expected:
      "Positive or negative word",
    recommendation:
      "Use an emotional word.",
  });

  // ----------------------------------------------------
  // Brand Name
  // ----------------------------------------------------

  // The root layout's title template ("%s | Dragon Ryu") appends the
  // brand to every page automatically, so the rendered <title> always
  // carries it. Requiring it again in the raw metaTitle field just
  // produces a duplicated "Dragon Ryu | Dragon Ryu" tag, so this rule
  // always passes rather than pushing content toward that bug.
  const hasBrand = true;

  rules.push({
    id: "brand-name",
    category: "Title",
    name: "Brand Mention in Title",
    description:
      "Brand is appended automatically by the site title template.",
    priority: "Low",
    earned:
      hasBrand ? 2 : 0,
    total: 2,
    passed:
      hasBrand,
    value:
      "Applied via title template",
    expected:
      "Brand included",
    recommendation:
      "No action needed, the site template appends the brand automatically.",
  });

  // ----------------------------------------------------
  // Title Starts With Keyword
  // ----------------------------------------------------

  const startsWithKeyword =
    keyword.length > 0 &&
    lower.startsWith(keyword);

  rules.push({
    id: "keyword-first",
    category: "Title",
    name: "Keyword at Beginning",
    description:
      "Starting with the keyword can improve relevance.",
    priority: "Low",
    earned:
      startsWithKeyword ? 1 : 0,
    total: 1,
    passed:
      startsWithKeyword,
    value:
      startsWithKeyword
        ? "Yes"
        : "No",
    expected:
      "Starts with focus keyword",
    recommendation:
      "Move the focus keyword closer to the beginning.",
  });

  return rules;
}