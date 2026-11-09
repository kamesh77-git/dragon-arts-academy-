"use client";

import { useEffect, useState } from "react";
import Card3D from "./Card3D";
import { MAPS_URL, courseOptions, whatsappLink } from "@/lib/data";

export default function Admissions() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const onKey = (e) => e.key === "Escape" && setDone(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [done]);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form));
    const courseLabel = form.elements.course.selectedOptions[0]?.text || "";
    const v = (x, fallback = "Not provided") => (x || "").toString().trim() || fallback;
    const msg = [
      "Enrollment Inquiry",
      "",
      "Student Name: " + v(f["student-name"]),
      "Age: " + v(f.age),
      "Preferred Course: " + v(courseLabel),
      "Parent / Guardian Name: " + v(f["parent-name"]),
      "Phone: " + v(f.phone),
      "Email: " + v(f.email),
      "Message: " + v(f.message, "No additional message"),
    ].join("\n");
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
    setDone(true);
    form.reset();
  };

  return (
    <>
      <section className="section admissions" id="admissions">
        <div className="container admissions__grid">
          <div className="admissions__info">
            <p className="section__eyebrow">Join Us</p>
            <h2 className="section__title">Admissions &amp; Enrollment</h2>
            <Card3D className="admissions__promo">
              <h3>Admissions Open</h3>
              <p className="admissions__promo-highlight">NO ADMISSION FEES</p>
              <p>New batches starting — contact us to reserve your seat today.</p>
            </Card3D>
            <p className="admissions__text">
              Ready to begin? Fill out the form or message us on WhatsApp. Our team will contact
              you to schedule a visit to our Mannivakkam campus.
            </p>
            <div className="admissions__steps">
              {[
                ["01", "Visit or Call", "Reach us at 98844 48277 or visit our Mannivakkam location"],
                ["02", "Choose Your Program", "Select from 14+ arts and training programs"],
                ["03", "Start Training", "Begin your journey — strong body & sharp mind!"],
              ].map(([n, t, d]) => (
                <div className="admissions__step" key={n}>
                  <span>{n}</span>
                  <div><strong>{t}</strong><p>{d}</p></div>
                </div>
              ))}
            </div>
            <Card3D className="admissions__contact">
              <h4>Contact Numbers</h4>
              <p><a href="tel:+919884448277">98844 48277</a> | <a href="tel:+919884448377">98844 48377</a></p>
              <p><a href={MAPS_URL} target="_blank" rel="noopener noreferrer">📍 Find us on Google Maps — Mannivakkam</a></p>
            </Card3D>
          </div>

          <Card3D as="form" className="admissions__form" onSubmit={onSubmit}>
            <h3>Enrollment Inquiry</h3>
            <div className="form__group">
              <label htmlFor="student-name">Student Full Name</label>
              <input type="text" id="student-name" name="student-name" required placeholder="Enter full name" />
            </div>
            <div className="form__row">
              <div className="form__group">
                <label htmlFor="age">Age</label>
                <input type="number" id="age" name="age" min="3" max="80" required placeholder="Age" />
              </div>
              <div className="form__group">
                <label htmlFor="course">Preferred Course</label>
                <select id="course" name="course" required defaultValue="">
                  <option value="">Select a course</option>
                  {courseOptions.map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form__group">
              <label htmlFor="parent-name">Parent / Guardian Name</label>
              <input type="text" id="parent-name" name="parent-name" placeholder="If student is under 18" />
            </div>
            <div className="form__row">
              <div className="form__group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required placeholder="98844 48277" />
              </div>
              <div className="form__group">
                <label htmlFor="email">Email (optional)</label>
                <input type="email" id="email" name="email" placeholder="you@email.com" />
              </div>
            </div>
            <div className="form__group">
              <label htmlFor="message">Message (optional)</label>
              <textarea id="message" name="message" rows={3} placeholder="Any questions or preferred start date"></textarea>
            </div>
            <button type="submit" className="btn btn--primary btn--full">Submit Inquiry</button>
            <p className="form__note">Your inquiry will be sent directly to WhatsApp for a faster response.</p>
          </Card3D>
        </div>
      </section>

      <div className="modal" hidden={!done} onClick={(e) => e.target === e.currentTarget && setDone(false)}>
        <div className="modal__content">
          <span className="modal__icon">✓</span>
          <h3>Inquiry Submitted!</h3>
          <p>Thank you for your interest in Dragon Ryu Arts Academy. We will contact you soon. For faster response, message us on WhatsApp at 98844 48277.</p>
          <button className="btn btn--primary" onClick={() => setDone(false)}>Got it</button>
        </div>
      </div>
    </>
  );
}
