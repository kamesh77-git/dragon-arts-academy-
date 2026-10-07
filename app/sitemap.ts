import type { MetadataRoute } from "next";

import { getAllSeoPages } from "@/lib/page-seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

function abs(src: string) {
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllSeoPages();
  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
      lastModified: p.updatedAt,
      changeFrequency: (p.kind === "post" ? "yearly" : "monthly") as "yearly" | "monthly",
      priority: p.path === "/" ? 1 : p.path === "/courses" ? 0.9 : p.kind === "post" ? 0.6 : 0.8,
      images: [abs(p.coverImage)],
    })),
    {
      url: `${SITE_URL}/privacy-policy`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
