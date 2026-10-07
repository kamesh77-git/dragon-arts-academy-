import { RuleResult } from "./types";

export interface ScoreSummary {
  earnedPoints: number;
  totalPoints: number;
  overallScore: number;
  passedRules: number;
  failedRules: number;
}

export function calculateScore(
  rules: RuleResult[]
): ScoreSummary {

  const earnedPoints =
    rules.reduce(
      (total, rule) =>
        total + rule.earned,
      0
    );

  const totalPoints =
    rules.reduce(
      (total, rule) =>
        total + rule.total,
      0
    );

  const overallScore =
    totalPoints === 0
      ? 0
      : Math.round(
          (earnedPoints /
            totalPoints) *
            100
        );

  const passedRules =
    rules.filter(
      (rule) =>
        rule.passed
    ).length;

  const failedRules =
    rules.length -
    passedRules;

  return {

    earnedPoints,

    totalPoints,

    overallScore,

    passedRules,

    failedRules,

  };

}

export type SEOStatus =
  | "Excellent"
  | "Good"
  | "Needs Improvement"
  | "Critical";

export function getSeoStatus(
  score: number
): SEOStatus {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs Improvement";
  return "Critical";
}