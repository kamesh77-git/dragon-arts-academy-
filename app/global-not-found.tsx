import type { Metadata } from "next";
import Link from "next/link";

import "./(site)/site.css";
import "./(site)/pages.css";
import { body, display } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Page not found | Dragon Ryu",
  description: "The page you are looking for does not exist.",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body>
        <main className="not-found">
          <p className="section__eyebrow">404</p>
          <h1 className="section__title">This page doesn&apos;t exist</h1>
          <p className="section__desc">The link may be old or mistyped. Try one of these instead:</p>
          <div className="hero__actions not-found__actions">
            <Link href="/" className="btn btn--primary">Home</Link>
            <Link href="/courses" className="btn btn--outline-dark">All Courses</Link>
            <Link href="/#admissions" className="btn btn--outline-dark">Enroll</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
