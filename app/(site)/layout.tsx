import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./site.css";
import "./pages.css";
import { body, display } from "@/lib/fonts";
import { OG_IMAGE, SITE_NAME, SITE_URL, TITLE_SUFFIX } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/jsonld";
import JsonLd from "@/components/site/JsonLd";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SiteEffects from "@/components/site/SiteEffects";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s${TITLE_SUFFIX}`,
  },
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, images: [OG_IMAGE], locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="scene-3d" aria-hidden="true">
          <div className="orb orb--1" />
          <div className="orb orb--2" />
          <div className="orb orb--3" />
        </div>

        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppFloat />
        <SiteEffects />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
