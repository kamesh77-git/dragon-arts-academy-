"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Card3D from "./Card3D";
import { galleryItems } from "@/lib/data";

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <>
      <section className="section gallery" id="gallery">
        <div className="container">
          <div className="section__header">
            <p className="section__eyebrow">Life at the Academy</p>
            <h2 className="section__title">Gallery</h2>
            <p className="section__desc">Training moments across martial arts, dance, drawing, abacus and language classes.</p>
          </div>
          <div className="gallery__grid">
            {galleryItems.map((g, i) => (
              <Card3D
                as="button"
                type="button"
                index={i}
                key={g.src}
                className={`gallery__item${g.size ? ` gallery__item--${g.size}` : ""}`}
                onClick={() => setSelected(g)}
              >
                <Image
                  className="gallery__img"
                  src={`/images/gallery/${g.src}.png`}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      <div className="lightbox" hidden={!selected} onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
        <button className="lightbox__close" aria-label="Close" onClick={() => setSelected(null)}>&times;</button>
        {selected && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="lightbox__img" src={`/images/gallery/${selected.src}.png`} alt={selected.alt} />
        )}
        <p className="lightbox__caption">{selected?.caption}</p>
      </div>
    </>
  );
}
