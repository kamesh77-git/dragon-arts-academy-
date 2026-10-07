import { BlogPost } from "@/types/blog";
import { RuleResult } from "./types";

export function analyzeMedia(
  blog: BlogPost
): RuleResult[] {

  const rules: RuleResult[] = [];

  const content =
    blog.content ?? "";

  const lower =
    content.toLowerCase();

  const keyword =
    blog.focusKeyword?.toLowerCase() ?? "";

  // ==========================================
  // Cover Image
  // ==========================================

  const hasCover =
    Boolean(blog.coverImage);

  rules.push({
    id: "cover-image",
    category: "Media",
    name: "Cover Image",
    description:
      "Every blog should have a cover image.",
    priority: "Critical",
    earned: hasCover ? 3 : 0,
    total: 3,
    passed: hasCover,
    value:
      hasCover ? "Present" : "Missing",
    expected:
      "Cover image",
    recommendation:
      "Add a featured image.",
  });

  // ==========================================
  // Images
  // ==========================================

  const images =
    content.match(
      /!\[[^\]]*]\([^)]*\)/g
    ) ?? [];

  rules.push({
    id: "image-count",
    category: "Media",
    name: "Images",
    description:
      "Use images inside the article.",
    priority: "Medium",
    earned:
      images.length >= 3
        ? 3
        : images.length >= 1
        ? 2
        : 0,
    total: 3,
    passed:
      images.length >= 3,
    value:
      images.length.toString(),
    expected:
      "3+",
    recommendation:
      "Add more images.",
  });

  // ==========================================
  // ALT Text
  // ==========================================

  const missingAlt =
    images.filter((image) =>
      image.startsWith("![]")
    );

  rules.push({
    id: "image-alt",
    category: "Media",
    name: "ALT Text",
    description:
      "Every image should contain ALT text.",
    priority: "Critical",
    earned:
      missingAlt.length === 0 &&
      images.length > 0
        ? 3
        : 0,
    total: 3,
    passed:
      missingAlt.length === 0 &&
      images.length > 0,
    value:
      `${missingAlt.length} missing`,
    expected:
      "0",
    recommendation:
      "Add ALT text to every image.",
  });

  // ==========================================
  // Keyword In ALT
  // ==========================================

  const keywordAlt =
    keyword.length > 0 &&
    images.some((image) =>
      image
        .toLowerCase()
        .includes(keyword)
    );

  rules.push({
    id: "keyword-alt",
    category: "Media",
    name:
      "Keyword in ALT",
    description:
      "ALT text should contain the focus keyword.",
    priority: "High",
    earned:
      keywordAlt ? 3 : 0,
    total: 3,
    passed:
      keywordAlt,
    value:
      keywordAlt
        ? "Found"
        : "Missing",
    expected:
      "Present",
    recommendation:
      "Use the focus keyword in at least one image ALT text.",
  });

  // ==========================================
  // Video
  // ==========================================

  const hasVideo =
    Boolean(blog.video) ||
    lower.includes("youtube.com") ||
    lower.includes("youtu.be") ||
    lower.includes("<video");

  rules.push({
    id: "video",
    category: "Media",
    name: "Video",
    description:
      "Adding a video improves engagement.",
    priority: "Low",
    earned:
      hasVideo ? 2 : 0,
    total: 2,
    passed:
      hasVideo,
    value:
      hasVideo
        ? "Present"
        : "Missing",
    expected:
      "Embedded video",
    recommendation:
      "Embed a relevant video.",
  });

  // ==========================================
  // Gallery
  // ==========================================

  const galleryCount =
    blog.gallery?.length ?? 0;

  rules.push({
    id: "gallery",
    category: "Media",
    name: "Gallery",
    description:
      "Additional gallery images help SEO.",
    priority: "Low",
    earned:
      galleryCount >= 3
        ? 2
        : galleryCount > 0
        ? 1
        : 0,
    total: 2,
    passed:
      galleryCount >= 3,
    value:
      galleryCount.toString(),
    expected:
      "3+",
    recommendation:
      "Add more gallery images.",
  });

  // ==========================================
  // Image File Format
  // ==========================================

  const webpImages =
    images.filter((image) =>
      image.includes(".webp")
    ).length;

  rules.push({
    id: "webp",
    category: "Media",
    name: "Modern Images",
    description:
      "Prefer WebP images for better performance.",
    priority: "Low",
    earned:
      images.length === 0
        ? 0
        : webpImages === images.length
        ? 2
        : 1,
    total: 2,
    passed:
      images.length > 0 &&
      webpImages === images.length,
    value:
      `${webpImages}/${images.length}`,
    expected:
      "All WebP",
    recommendation:
      "Convert images to WebP.",
  });

  return rules;

}