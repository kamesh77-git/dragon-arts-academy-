import { SITE_URL } from "@/lib/data";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${SITE_URL}/images/gallery/academy-building.png`,
        `${SITE_URL}/images/gallery/karate-class.png`,
        `${SITE_URL}/images/gallery/yoga-world-record.png`,
      ],
    },
  ];
}
