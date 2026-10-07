"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home", section: "home" },
  { href: "/#about", label: "About", section: "about" },
  { href: "/#faculty-excellence", label: "Faculty Excellence", section: "faculty-excellence", className: "nav__link--faculty" },
  { href: "/courses", label: "Courses", section: "courses" },
  { href: "/#gallery", label: "Gallery", section: "gallery" },
  { href: "/blog", label: "Blog", section: "blog" },
  { href: "/#admissions", label: "Enroll Now", section: "admissions", className: "nav__link--cta" },
  { href: "/#contact", label: "Contact", section: "contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
      if (!isHome) return;
      const y = window.scrollY + 120;
      document.querySelectorAll<HTMLElement>("section[id]").forEach((section) => {
        if (y >= section.offsetTop && y < section.offsetTop + section.offsetHeight) {
          setActiveSection(section.id);
        }
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  function isActive(item: (typeof NAV)[number]) {
    if (isHome) return item.section === activeSection;
    if (item.href === "/blog") return pathname.startsWith("/blog");
    if (item.href === "/courses") return pathname !== "/" && !pathname.startsWith("/privacy") && !pathname.startsWith("/blog");
    return false;
  }

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`} id="header">
      <nav className="nav container" aria-label="Main">
        <Link href="/" className="nav__logo">
          <Image src="/images/logo.webp" alt="Dragon Ryu Arts Academy logo" width={52} height={52} className="nav__logo-img" priority />
          <span className="nav__logo-text">
            Dragon Ryu
            <br />
            <small>Arts Academy</small>
          </span>
        </Link>
        <button
          className="nav__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`nav__menu${open ? " open" : ""}`} id="nav-menu">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav__link${item.className ? ` ${item.className}` : ""}${isActive(item) ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
