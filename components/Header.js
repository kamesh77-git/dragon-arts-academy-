"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const y = window.scrollY + 120;
      for (const s of sections) {
        if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
          setActive("#" + s.id);
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`} id="header">
      <nav className="nav container">
        <a href="#home" className="nav__logo">
          <Image src="/images/logo.png" alt="Dragon Ryu Arts Academy" width={52} height={52} className="nav__logo-img" priority />
          <span className="nav__logo-text">Dragon Ryu<br /><small>Arts Academy</small></span>
        </a>
        <button className="nav__toggle" aria-label="Open menu" onClick={() => setOpen((o) => !o)}>
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav__menu${open ? " open" : ""}`}>
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`nav__link${l.className ? " " + l.className : ""}${active === l.href ? " active" : ""}`}
                onClick={() => { setOpen(false); setActive(l.href); }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
