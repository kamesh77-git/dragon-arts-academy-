"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { whatsappLink } from "@/lib/data";

export default function Hero() {
  const stage = useRef(null);
  const logo = useRef(null);
  const logoInner = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (window.scrollY > window.innerHeight || !stage.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      stage.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  const onLogoMove = (e) => {
    const r = logo.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const el = logoInner.current;
    el.style.animationPlayState = "paused";
    el.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 20}deg) translateZ(20px)`;
  };
  const onLogoLeave = () => {
    logoInner.current.style.animationPlayState = "running";
    logoInner.current.style.transform = "";
  };

  return (
    <section className="hero" id="home">
      <div className="hero__bg"></div>
      <div className="hero__3d-stage" ref={stage}>
        <div className="float-cube float-cube--1"></div>
        <div className="float-cube float-cube--2"></div>
        <div className="float-ring"></div>
        <div className="float-star float-star--1">✦</div>
        <div className="float-star float-star--2">✦</div>
      </div>
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="hero__eyebrow">Multiple Arts in One Place</p>
          <h1 className="hero__title">Dragon Ryu<br /><span>Arts Academy</span></h1>
          <p className="hero__subtitle">
            Strong body &amp; sharp mind — professional training in martial arts, dance, drawing,
            abacus, languages, music and more for all ages at Mannivakkam.
          </p>
          <div className="hero__actions">
            <a href="#admissions" className="btn btn--primary">Book Your Seat</a>
            <a href="#courses" className="btn btn--outline">View Courses</a>
            <a href={whatsappLink("Hi Dragon Ryu Arts Academy, I would like to enquire about admissions.")} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><strong>14+</strong><span>Arts &amp; Programs</span></div>
            <div className="hero__stat"><strong>All</strong><span>Age Groups Welcome</span></div>
            <div className="hero__stat"><strong>AC</strong><span>Comfortable Classrooms</span></div>
          </div>
        </div>
        <div className="hero__logo-wrap">
          <div className="logo-3d" ref={logo} onMouseMove={onLogoMove} onMouseLeave={onLogoLeave}>
            <div className="logo-3d__inner" ref={logoInner}>
              <Image src="/images/logo.png" alt="Dragon Ryu Arts Academy Logo" width={400} height={400} className="logo-3d__img" priority />
            </div>
            <div className="logo-3d__glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
