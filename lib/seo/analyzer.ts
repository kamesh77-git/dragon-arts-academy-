import { BlogPost } from "@/types/blog";

import { analyzeKeyword } from "./keyword";
import { analyzeTitle } from "./title";
import { analyzeMeta } from "./meta";
import { analyzeContent } from "./content";
import { analyzeMedia } from "./media";
import { analyzeLinks } from "./links";
import { analyzeTechnical } from "./technical";
import { analyzeSchema } from "./schema";
import { analyzeEEAT } from "./eeat";
import { analyzeAI } from "./ai";

import { calculateScore } from "./score";

import {
  RuleResult,
  CategoryScore,
  SEOAudit,
  SEOCategory,
} from "./types";

export function analyzeBlog(
  blog: BlogPost
): SEOAudit {

  const rules: RuleResult[] = [

    ...analyzeKeyword(blog),

    ...analyzeTitle(blog),

    ...analyzeMeta(blog),

    ...analyzeContent(blog),

    ...analyzeMedia(blog),

    ...analyzeLinks(blog),

    ...analyzeTechnical(blog),

    ...analyzeSchema(blog),

    ...analyzeEEAT(blog),

    ...analyzeAI(blog),

  ];

  const summary =
    calculateScore(rules);

  const categories: SEOCategory[] = [

    "Keyword",

    "Title",

    "Metadata",

    "Content",

    "Media",

    "Links",

    "Technical",

    "Schema",

    "EEAT",

    "AI",

  ];

  const categoryScores: CategoryScore[] =
    categories.map((category) => {

      const categoryRules =
        rules.filter(
          (rule) =>
            rule.category === category
        );

      const earned =
        categoryRules.reduce(
          (sum, rule) =>
            sum + rule.earned,
          0
        );

      const total =
        categoryRules.reduce(
          (sum, rule) =>
            sum + rule.total,
          0
        );

      return {

        category,

        earned,

        total,

        percentage:
          total === 0
            ? 0
            : Math.round(
                (earned / total) * 100
              ),

        rules: categoryRules,

      };

    });

  return {

    overallScore:
      summary.overallScore,

    earnedPoints:
      summary.earnedPoints,

    totalPoints:
      summary.totalPoints,

    passedRules:
      summary.passedRules,

    failedRules:
      summary.failedRules,

    categoryScores,

    rules,

  };

}