import { Cormorant_Garamond, Outfit, Pacifico } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, keywords } from "@/lib/data";

const display = Cormorant_Garamond({
  subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"],
  variable: "--nf-display", display: "swap",
});
const body = Outfit({
  subsets: ["latin"], weight: ["300", "400", "500", "600", "700"],
  variable: "--nf-body", display: "swap",
});
const script = Pacifico({
  subsets: ["latin"], weight: "400", variable: "--nf-script", display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dragon Ryu Arts Academy | Karate, Yoga, Dance & Arts in Mannivakkam, Chennai",
    template: "%s | Dragon Ryu Arts Academy",
  },
  description: SITE_DESCRIPTION,
  keywords,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: false },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    title: "Dragon Ryu Arts Academy — Multiple Arts in One Place",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dragon Ryu Arts Academy — Multiple Arts in One Place",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Mannivakkam, Chennai",
  },
  // verification: { google: "ADD_GOOGLE_SEARCH_CONSOLE_TOKEN" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d9488",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
