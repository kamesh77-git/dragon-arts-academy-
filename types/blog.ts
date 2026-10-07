export interface BlogPost {
  // ==========================================
  // Identity
  // ==========================================

  slug: string;

  // ==========================================
  // Basic Information
  // ==========================================

  title: string;
  description: string;
  author: string;

  // ==========================================
  // Dates
  // ==========================================

  publishedAt: string;
  updatedAt?: string;

  // ==========================================
  // Classification
  // ==========================================

  category: string;
  tags: string[];

  featured: boolean;
  draft?: boolean;

  // ==========================================
  // Media
  // ==========================================

  coverImage: string;

  gallery?: string[];

  video?: string;

  // ==========================================
  // Content
  // ==========================================

  content: string;

  readingTime: string;

  wordCount: number;

  // ==========================================
  // SEO
  // ==========================================

  metaTitle?: string;

  metaDescription?: string;

  focusKeyword?: string;

  secondaryKeywords?: string[];

  canonicalUrl?: string;

  robots?: string;

  seoTitle?: string;

  seoSlug?: string;

  // ==========================================
  // Social
  // ==========================================

  openGraphImage?: string;

  twitterCard?: string;

  // ==========================================
  // Structured Data
  // ==========================================

  articleSchema?: boolean;

  faqSchema?: boolean;

  breadcrumbSchema?: boolean;

  organizationSchema?: boolean;

  courseSchema?: boolean;

  // ==========================================
  // AI / GEO / AEO
  // ==========================================

  eeatScore?: number;

  aiScore?: number;

  geoScore?: number;

  aeoScore?: number;

  // ==========================================
  // Audit Results
  // ==========================================

  seoScore?: number;

  seoStatus?:
    | "Excellent"
    | "Good"
    | "Needs Improvement"
    | "Critical";
}