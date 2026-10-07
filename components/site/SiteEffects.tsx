"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Decorative interactions ported from the static site's main.js: card
// tilt, scroll reveal, and hero / logo parallax. Re-binds on navigation.
// Skipped entirely when the visitor prefers reduced motion.
export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Document, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn as EventListener);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener));
    };

    // 3D logo parallax
    const logo = document.getElementById("logo-3d");
    const logoInner = logo?.querySelector<HTMLElement>(".logo-3d__inner");
    if (logo && logoInner) {
      on(logo, "mousemove", (e) => {
        const r = logo.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        logoInner.style.animationPlayState = "paused";
        logoInner.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 20}deg) translateZ(20px)`;
      });
      on(logo, "mouseleave", () => {
        logoInner.style.animationPlayState = "running";
        logoInner.style.transform = "";
      });
    }

    // Hero stage parallax
    const hero = document.getElementById("hero-3d");
    if (hero) {
      on(document, "mousemove", (e) => {
        if (window.scrollY > window.innerHeight) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    }

    // "Orbit of Arts" hero: gentle 3D tilt toward the pointer
    const arts = document.getElementById("hero-arts");
    if (arts) {
      on(document, "mousemove", (e) => {
        if (window.scrollY > window.innerHeight) return;
        const r = arts.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        arts.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
      });
      on(document, "mouseleave", () => {
        arts.style.transform = "";
      });
    }

    // Card tilt
    document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
      on(card, "mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
        card.style.boxShadow = `0 20px 40px rgba(0,0,0,${0.12 + Math.abs(x) * 0.08})`;
      });
      on(card, "mouseleave", () => {
        card.style.transform = "";
        card.style.boxShadow = "";
      });
    });

    // Scroll reveal
    const reveal = document.querySelectorAll<HTMLElement>(".card-3d:not([data-tilt])");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0) rotateX(0)";
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveal.forEach((el, i) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: don't hide it
      el.style.opacity = "0";
      el.style.transform = "translateY(30px) rotateX(5deg)";
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
      observer.observe(el);
    });
    cleanups.push(() => observer.disconnect());

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
