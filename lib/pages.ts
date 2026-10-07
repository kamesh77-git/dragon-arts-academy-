import { courses } from "./courses";
import { getFaculty } from "./faculty";
import { CONTENT_PUBLISHED, CONTENT_UPDATED, SITE_NAME } from "./site";

// Every public page that carries its own SEO. The defaults here ship in
// code; the admin can override title / description / keywords per page
// (stored in the page_seo table, merged by lib/page-seo.ts).

export interface SitePage {
  path: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  coverImage: string;
}

const staticPages: SitePage[] = [
  {
    path: "/",
    name: "Home",
    metaTitle: "Arts Academy in Mannivakkam: Best 14+ Arts",
    metaDescription:
      "Arts academy in Mannivakkam, Chennai since 2011. Karate, silambam, yoga, dance, drawing, abacus, music and languages for ages 3 to adult. No admission fee.",
    focusKeyword: "arts academy in mannivakkam",
    secondaryKeywords: ["karate classes in mannivakkam", "dance classes chennai", "abacus classes", "summer camp mannivakkam"],
    author: SITE_NAME,
    publishedAt: CONTENT_PUBLISHED,
    updatedAt: CONTENT_UPDATED,
    coverImage: "/images/og-default.jpg",
  },
  {
    path: "/courses",
    name: "All Courses",
    metaTitle: "Courses in Mannivakkam: Best 14+ Arts & Skills",
    metaDescription:
      "Courses in Mannivakkam for kids and adults: karate, silambam, yoga, Bharatanatyam, western dance, drawing, abacus, music, Hindi and spoken English. Enrol.",
    focusKeyword: "courses in mannivakkam",
    secondaryKeywords: ["kids activities mannivakkam", "after school classes chennai", "martial arts classes", "hobby classes chennai"],
    author: SITE_NAME,
    publishedAt: CONTENT_PUBLISHED,
    updatedAt: CONTENT_UPDATED,
    coverImage: "/images/og-default.jpg",
  },
  {
    path: "/blog",
    name: "Blog",
    metaTitle: "Kids Activity Tips: Best Parent Guides 2026",
    metaDescription:
      "Kids activity tips from Dragon Ryu Arts Academy, Mannivakkam: guides on karate, dance, yoga, abacus and more to help parents pick the right class for a child.",
    focusKeyword: "kids activity tips",
    secondaryKeywords: ["parenting tips chennai", "after school activities", "martial arts for kids", "child development"],
    author: SITE_NAME,
    publishedAt: CONTENT_PUBLISHED,
    updatedAt: CONTENT_UPDATED,
    coverImage: "/images/og-default.jpg",
  },
];

const coursePages: SitePage[] = courses.map((c) => ({
  path: `/${c.slug}`,
  name: c.name,
  ...c.seo,
  author: (c.facultyId && getFaculty(c.facultyId)?.name) || SITE_NAME,
  publishedAt: CONTENT_PUBLISHED,
  updatedAt: CONTENT_UPDATED,
  coverImage: `/images/gallery/${c.images[0]}`,
}));

export const sitePages: SitePage[] = [...staticPages, ...coursePages];

export function getSitePage(path: string) {
  return sitePages.find((p) => p.path === path);
}
