import Image from "next/image";
import Link from "next/link";

import { FULL_ADDRESS, KARATE_BRANCHES, MAPS_URL, PHONES, TAGLINE } from "@/lib/site";

const PROGRAM_LINKS = [
  { href: "/karate-classes-in-mannivakkam", label: "Karate" },
  { href: "/silambam-classes-in-mannivakkam", label: "Silambam" },
  { href: "/yoga-classes-in-mannivakkam", label: "Yoga" },
  { href: "/bharatanatyam-classes-in-mannivakkam", label: "Bharatanatyam" },
  { href: "/western-dance-classes-in-mannivakkam", label: "Western Dance" },
  { href: "/drawing-classes-in-mannivakkam", label: "Drawing" },
  { href: "/abacus-classes-in-mannivakkam", label: "Abacus" },
  { href: "/music-classes-in-mannivakkam", label: "Music" },
];

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link href="/" className="nav__logo">
            <Image src="/images/logo.webp" alt="Dragon Ryu Arts Academy logo" width={48} height={48} className="nav__logo-img nav__logo-img--footer" />
            <span className="nav__logo-text">
              Dragon Ryu
              <br />
              <small>Arts Academy</small>
            </span>
          </Link>
          <p>{TAGLINE} Mannivakkam, Chennai.</p>
        </div>
        <div className="footer__links">
          <h2 className="footer__heading">Quick Links</h2>
          <ul>
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/courses">All Courses</Link></li>
            <li><Link href="/#admissions">Summer Camp</Link></li>
            <li><Link href="/#gallery">Gallery</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/#admissions">Admissions</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer__links">
          <h2 className="footer__heading">Programs</h2>
          <ul>
            {PROGRAM_LINKS.map((p) => (
              <li key={p.href}><Link href={p.href}>{p.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="footer__contact">
          <h2 className="footer__heading">Contact</h2>
          {PHONES.map((p) => (
            <p key={p.tel}><a href={`tel:${p.tel}`}>{p.display}</a></p>
          ))}
          <p><a href={MAPS_URL} target="_blank" rel="noopener">{FULL_ADDRESS}</a></p>
        </div>
        <div className="footer__links footer__branch">
          <h2 className="footer__heading">Karate Branch</h2>
          <ul>
            {KARATE_BRANCHES.map((b) => (
              <li key={b.name}><a href={b.url} target="_blank" rel="noopener">{b.name}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer__bottom container">
        <p>&copy; {new Date().getFullYear()} Dragon Ryu Arts Academy. All rights reserved.</p>
      </div>
    </footer>
  );
}
