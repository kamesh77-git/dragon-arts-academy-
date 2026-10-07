"use client";

import { useState } from "react";

// Long reviews start clamped with a toggle; short ones show in full.
export default function ReviewText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 280;
  return (
    <>
      <p className={`review-card__text${long && !open ? " review-card__text--clamped" : ""}`}>{text}</p>
      {long && (
        <button type="button" className="review-card__more" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </>
  );
}
