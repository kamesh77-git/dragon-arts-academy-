import {
  SITE_URL, SITE_NAME, SITE_DESCRIPTION, PHONES, MAPS_URL, GOOGLE_PROFILE_URL, courses, faculty,
} from "./data";

const orgId = `${SITE_URL}/#organization`;

const address = {
  "@type": "PostalAddress",
  addressLocality: "Mannivakkam",
  addressRegion: "Tamil Nadu",
  addressCountry: "IN",
};

const branches = [
  { name: "Adhanur Karate Class", url: "https://goo.gl/maps/H8ghxMPGeYaheDGs6?g_st=aw", locality: "Adhanur" },
  { name: "Tambaram Karate Class", url: "https://maps.google.com/?q=12.923955,80.105377", locality: "Tambaram", geo: [12.923955, 80.105377] },
  { name: "Vandalur Karate Class", url: "https://maps.app.goo.gl/3vWyiv22xKVNxwsF7?g_st=aw", locality: "Vandalur" },
];

export function buildSchema() {
  const organization = {
    "@type": ["EducationalOrganization", "SportsActivityLocation", "LocalBusiness"],
    "@id": orgId,
    name: SITE_NAME,
    alternateName: ["Dragon Ryu Arts Academy Mannivakkam", "Dragon Ryu International School of Karate"],
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png`, width: 563, height: 558 },
    image: [`${SITE_URL}/images/gallery/academy-building.png`, `${SITE_URL}/images/gallery/karate-class.png`],
    telephone: PHONES[0],
    contactPoint: PHONES.map((telephone) => ({
      "@type": "ContactPoint", telephone, contactType: "admissions",
      areaServed: "IN", availableLanguage: ["English", "Tamil", "Hindi"],
    })),
    address,
    hasMap: MAPS_URL,
    sameAs: [GOOGLE_PROFILE_URL],
    areaServed: ["Mannivakkam", "Chennai", "Tambaram", "Vandalur", "Adhanur"].map((n) => ({ "@type": "Place", name: n })),
    foundingDate: "2011",
    priceRange: "No admission fees",
    founder: { "@id": `${SITE_URL}/#founder` },
    employee: faculty.map((f) => ({ "@type": "Person", name: f.name, description: f.text, jobTitle: f.tag.replace("Handling — ", "") + " Instructor" })),
    memberOf: [
      "Karate India Organisation (KIO)",
      "Tamilnadu Sports Karate-Do Association (TSKA)",
      "Chennai District Sports Karate Association (CDSKA)",
    ].map((name) => ({ "@type": "Organization", name })),
    department: branches.map((b) => ({
      "@type": ["SportsActivityLocation", "LocalBusiness"],
      name: `${SITE_NAME} — ${b.name}`,
      parentOrganization: { "@id": orgId },
      hasMap: b.url,
      telephone: PHONES[0],
      address: { "@type": "PostalAddress", addressLocality: b.locality, addressRegion: "Tamil Nadu", addressCountry: "IN" },
      ...(b.geo && { geo: { "@type": "GeoCoordinates", latitude: b.geo[0], longitude: b.geo[1] } }),
    })),
    potentialAction: {
      "@type": "ReserveAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/#admissions`, actionPlatform: "http://schema.org/DesktopWebPlatform" },
      result: { "@type": "Reservation", name: "Book a seat" },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Courses & Professional Training",
      itemListElement: courses.map((c) => ({
        "@type": "Offer",
        price: "0", priceCurrency: "INR",
        description: "No admission fees",
        itemOffered: { "@type": "Course", name: c.name, description: c.text, provider: { "@id": orgId } },
      })),
    },
  };

  const founder = {
    "@type": "Person",
    "@id": `${SITE_URL}/#founder`,
    name: "S. Renugadevi",
    honorificPrefix: "Mrs.",
    jobTitle: "Founder & Head",
    worksFor: { "@id": orgId },
    description:
      "Founder and Head of Dragon Ryu Arts Academy, holder of a Master’s degree in Biotechnology and a Karate Black Belt (2023).",
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en-IN",
    publisher: { "@id": orgId },
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: `${SITE_NAME} | Karate, Yoga, Dance & Arts in Mannivakkam, Chennai`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": orgId },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}/images/gallery/academy-building.png` },
    inLanguage: "en-IN",
  };

  const sections = [
    ["Home", "#home"], ["About", "#about"], ["Faculty Excellence", "#faculty-excellence"],
    ["Courses", "#courses"], ["Gallery", "#gallery"], ["Admissions", "#admissions"], ["Contact", "#contact"],
  ];
  const nav = {
    "@type": "SiteNavigationElement",
    "@id": `${SITE_URL}/#navigation`,
    hasPart: sections.map(([name, hash]) => ({ "@type": "WebPageElement", name, url: SITE_URL + "/" + hash })),
  };

  const courseList = {
    "@type": "ItemList",
    name: "Courses at Dragon Ryu Arts Academy",
    itemListElement: courses.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, description: c.text })),
  };

  return { "@context": "https://schema.org", "@graph": [organization, founder, website, webpage, nav, courseList] };
}
