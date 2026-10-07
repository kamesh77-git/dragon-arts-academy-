export type SEOCategory =
  | "Keyword"
  | "Title"
  | "Metadata"
  | "Content"
  | "Media"
  | "Links"
  | "Technical"
  | "Schema"
  | "EEAT"
  | "AI";

export type SEOPriority =
  | "Critical"
  | "High"
  | "Medium"
  | "Low";

export interface RuleResult {
  id: string;

  category: SEOCategory;

  name: string;

  description: string;

  priority: SEOPriority;

  earned: number;

  total: number;

  passed: boolean;

  value: string;

  expected: string;

  recommendation: string;
}

export interface CategoryScore {
  category: SEOCategory;

  earned: number;

  total: number;

  percentage: number;

  rules: RuleResult[];
}

export interface SEOAudit {

  overallScore: number;

  earnedPoints: number;

  totalPoints: number;

  passedRules: number;

  failedRules: number;

  categoryScores: CategoryScore[];

  rules: RuleResult[];

}