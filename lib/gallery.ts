export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  layout?: "wide" | "tall";
}

export const gallery: GalleryImage[] = [
  { src: "/images/gallery/academy-building.webp", alt: "Campus of Dragon Ryu, the arts academy in Mannivakkam", caption: "Dragon Ryu Arts Academy, Mannivakkam campus", width: 1024, height: 682, layout: "wide" },
  { src: "/images/gallery/bharatanatyam.webp", alt: "Bharatanatyam dance performance by academy students", caption: "Bharatanatyam performance at Dragon Ryu Arts Academy", width: 1024, height: 682, layout: "wide" },
  { src: "/images/gallery/karate-outdoor.webp", alt: "Outdoor karate group photo with the Indian flag", caption: "Outdoor karate training with students", width: 1024, height: 512 },
  { src: "/images/gallery/karate-class.webp", alt: "Large karate class practising on turf", caption: "Karate class in session", width: 1024, height: 576 },
  { src: "/images/gallery/belt-grading.webp", alt: "Karate students holding certificates at belt grading", caption: "Karate colour belt grading ceremony", width: 1024, height: 576 },
  { src: "/images/gallery/community-event.webp", alt: "Children at a community event organised by the academy", caption: "Community event at the academy", width: 1024, height: 831 },
  { src: "/images/gallery/yoga-world-record.webp", alt: "Academy students at the Yoga World Record Drug Free Tamil Nadu event", caption: "Yoga World Record: Drug Free Tamil Nadu awareness, UBAC recognition", width: 1024, height: 682, layout: "wide" },
  { src: "/images/gallery/world-record-news.webp", alt: "TT News coverage of the Nova World Record event", caption: "Nova World Record: 30 Dragon Ryu Arts Academy students participated", width: 1024, height: 574, layout: "tall" },
  { src: "/images/gallery/award-ceremony.webp", alt: "Student receiving a bicycle and trophies at an award ceremony", caption: "National level award ceremony and prize distribution", width: 1024, height: 768 },
  { src: "/images/gallery/newspaper-coverage.webp", alt: "Malai Murasu newspaper coverage of the academy's world record", caption: "Malai Murasu coverage of the Republic Day world record event", width: 547, height: 1020, layout: "wide" },
];

export function galleryImage(file: string) {
  const img = gallery.find((g) => g.src.endsWith(`/${file}`));
  if (!img) throw new Error(`Unknown gallery image: ${file}`);
  return img;
}
