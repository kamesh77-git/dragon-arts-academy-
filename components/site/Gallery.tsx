"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { GalleryImage } from "@/lib/gallery";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <div className="gallery__grid">
        {images.map((img) => (
          <button
            key={img.src}
            type="button"
            className={`gallery__item card-3d${img.layout ? ` gallery__item--${img.layout}` : ""}`}
            onClick={() => setActive(img)}
            aria-label={`View photo: ${img.caption}`}
          >
            <Image
              className="gallery__img"
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

      <div
        className="lightbox"
        hidden={!active}
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        onClick={(e) => e.target === e.currentTarget && setActive(null)}
      >
        <button className="lightbox__close" aria-label="Close" onClick={() => setActive(null)}>
          &times;
        </button>
        {active && (
          <>
            <Image className="lightbox__img" src={active.src} alt={active.alt} width={active.width} height={active.height} />
            <p className="lightbox__caption">{active.caption}</p>
          </>
        )}
      </div>
    </>
  );
}
