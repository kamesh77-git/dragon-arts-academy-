export default function manifest() {
  return {
    name: "Dragon Ryu Arts Academy",
    short_name: "Dragon Ryu",
    description: "Multiple arts in one place — karate, Silambam, yoga, dance, drawing, abacus, languages and music in Mannivakkam, Chennai.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d9488",
    icons: [{ src: "/images/logo.png", sizes: "563x558", type: "image/png", purpose: "any" }],
  };
}
