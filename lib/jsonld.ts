import type { Post } from "@/db/schema";
import type { Course } from "./courses";
import { faculty, getFaculty } from "./faculty";
import {
  ADDRESS,
  KARATE_BRANCHES,
  AFFILIATIONS,
  FOUNDED_YEAR,
  FOUNDER,
  MAPS_URL,
  PHONES,
  SITE_NAME,
  SITE_URL,
} from "./site";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.webp`,
    image: `${SITE_URL}/images/gallery/academy-building.webp`,
    description:
      "Multi-arts academy in Mannivakkam, Chennai offering karate, silambam, yoga, dance, drawing, abacus, music and language classes for children and adults.",
    telephone: PHONES[0].tel,
    foundingDate: String(FOUNDED_YEAR),
    founder: { "@type": "Person", name: FOUNDER.name },
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      postalCode: ADDRESS.postalCode,
      addressLocality: ADDRESS.locality,
      addressRegion: ADDRESS.region,
      addressCountry: ADDRESS.country,
    },
    areaServed: ["Mannivakkam", "Tambaram", "Vandalur", "Adhanur", "Chennai"],
    hasMap: MAPS_URL,
    memberOf: AFFILIATIONS.map((name) => ({ "@type": "Organization", name })),
    slogan: "Strong body & sharp mind",
    knowsAbout: [
      "Karate", "Silambam", "Yoga", "Bharatanatyam", "Western dance", "Drawing", "Tanjore painting",
      "Abacus", "Vedic Mathematics", "Spoken English", "Phonics", "Hindi", "Keyboard", "Guitar", "Drums",
      "Singing", "Handwriting", "Calligraphy", "Self-defence",
    ],
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: faculty.length },
    employee: faculty.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: `${f.handles} instructor`,
      description: f.bio,
      worksFor: { "@id": ORG_ID },
    })),
    subOrganization: KARATE_BRANCHES.map((b) => ({ "@type": "SportsActivityLocation", name: b.name, hasMap: b.url })),
    contactPoint: PHONES.map((p) => ({
      "@type": "ContactPoint",
      telephone: p.tel,
      contactType: "admissions",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: "Dragon Ryu",
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

export function blogPostingSchema(post: Post, opts: { description: string; wordCount: number }) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage ? new URL(post.coverImage, SITE_URL).toString() : `${SITE_URL}/images/og-default.jpg`;
  const authorIsOrg = post.authorName === SITE_NAME;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: opts.description,
    image: [image],
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: authorIsOrg ? { "@id": ORG_ID } : { "@type": "Person", name: post.authorName, worksFor: { "@id": ORG_ID } },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    articleSection: post.category,
    keywords: [post.focusKeyword, ...post.tags].filter(Boolean).join(", "),
    wordCount: opts.wordCount,
    inLanguage: "en-IN",
  };
}

export function webPageSchema(opts: { path: string; name: string; description: string; dateModified: string }) {
  const url = `${SITE_URL}${opts.path === "/" ? "" : opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    dateModified: opts.dateModified,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function courseSchema(course: Course, description: string) {
  const teacher = course.facultyId ? getFaculty(course.facultyId) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${course.name} classes`,
    description,
    url: `${SITE_URL}/${course.slug}`,
    provider: { "@id": ORG_ID, "@type": "EducationalOrganization", name: SITE_NAME, sameAs: SITE_URL },
    inLanguage: "en-IN",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: { "@type": "Place", name: SITE_NAME, address: `${ADDRESS.locality}, ${ADDRESS.city}` },
      ...(teacher ? { instructor: { "@type": "Person", name: teacher.name } } : {}),
    },
  };
}
