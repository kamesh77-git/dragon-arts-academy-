// Single source for business facts used across pages, metadata and
// JSON-LD. Everything here comes from the academy's own published site.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dragonryuartsacademy.com").replace(/\/$/, "");

export const SITE_NAME = "Dragon Ryu Arts Academy";
export const SHORT_NAME = "Dragon Ryu";

// Appended to every page <title> by the site layout's title template.
// The SEO engine (lib/seo/meta.ts) counts it toward the 60-char limit.
export const TITLE_SUFFIX = ` | ${SHORT_NAME}`;

export const TAGLINE = "Strong body & sharp mind. Multiple arts in one place.";

export const FOUNDED_YEAR = 2011;

export const PHONES = [
  { display: "98844 48277", tel: "+919884448277" },
  { display: "98844 48377", tel: "+919884448377" },
] as const;

export const WHATSAPP_NUMBER = "919884448277";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_ENQUIRY = whatsappLink(
  "Hi Dragon Ryu Arts Academy, I would like to enquire about admissions."
);

// From the academy's own Google Maps listing.
export const ADDRESS = {
  street: "1st Floor, 8, Mannivakkam Main Road, Mannivakkam Extension",
  postalCode: "600048",
  locality: "Mannivakkam",
  city: "Chennai",
  region: "Tamil Nadu",
  country: "IN",
};

export const MAPS_URL = "https://maps.app.goo.gl/FexJw4eyxXr1nZsJ8?g_st=aw";

export const FULL_ADDRESS = `${ADDRESS.street}, Chennai, Tamil Nadu ${ADDRESS.postalCode}`;
export const MAPS_EMBED = "https://maps.google.com/maps?q=Dragon+Ryu+Arts+Academy+Mannivakkam&output=embed";

export const KARATE_BRANCHES = [
  { name: "Adhanur Karate Class", url: "https://goo.gl/maps/H8ghxMPGeYaheDGs6?g_st=aw" },
  { name: "Tambaram Karate Class", url: "https://maps.google.com/?q=12.923955,80.105377" },
  { name: "Vandalur Karate Class", url: "https://maps.app.goo.gl/3vWyiv22xKVNxwsF7?g_st=aw" },
] as const;

export const AFFILIATIONS = [
  "Karate India Organisation (KIO)",
  "Tamilnadu Sports Karate-Do Association (TSKA), India",
  "Chennai District Sports Karate Association (CDSKA)",
] as const;

export const STATS = {
  blackBelts: "90+",
  studentsTrained: "950+",
  demonstrations: "10+",
  programs: "14+",
} as const;

export const FOUNDER = {
  name: "Mrs. S. Renugadevi",
  role: "Founder & Head",
};

export const OG_IMAGE = "/images/og-default.jpg";

// Date the current version of the site content was published / last
// reviewed. Shown as page dates (E-E-A-T) and used in the sitemap.
export const CONTENT_PUBLISHED = "2026-10-07";
export const CONTENT_UPDATED = "2026-10-07";
