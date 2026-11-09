"use client";

import { useEffect, useRef } from "react";

/** Wrapper that adds the 3D tilt (tilt) or scroll-reveal (default) behaviour. */
export default function Card3D({ as: Tag = "div", tilt = false, className = "", index = 0, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || tilt) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px) rotateX(5deg)";
    el.style.transitionDelay = (index % 4) * 0.08 + "s";
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0) rotateX(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [tilt, index]);

  const handlers = tilt
    ? {
        onMouseMove: (e) => {
          const el = ref.current;
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
          el.style.boxShadow = `0 20px 40px rgba(0,0,0,${0.12 + Math.abs(x) * 0.08})`;
        },
        onMouseLeave: () => {
          ref.current.style.transform = "";
          ref.current.style.boxShadow = "";
        },
      }
    : {};

  return (
    <Tag ref={ref} className={`card-3d ${className}`.trim()} {...handlers} {...rest}>
      {children}
    </Tag>
  );
}
