"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { submitLead } from "@/app/(site)/actions";
import { enquiryCourseOptions } from "@/lib/courses";
import { PHONES, whatsappLink } from "@/lib/site";

export default function EnquiryForm({ defaultCourse = "" }: { defaultCourse?: string }) {
  const pathname = usePathname();
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    const data = {
      studentName: get("student-name"),
      age: get("age"),
      course: get("course"),
      parentName: get("parent-name"),
      phone: get("phone"),
      email: get("email"),
      message: get("message"),
      website: get("website"),
    };

    // Open WhatsApp synchronously inside the submit handler so popup
    // blockers treat it as user-initiated; saving the lead runs alongside.
    const text = [
      "Enrollment Inquiry",
      "",
      `Student Name: ${data.studentName || "Not provided"}`,
      `Age: ${data.age || "Not provided"}`,
      `Preferred Course: ${data.course || "Not provided"}`,
      `Parent / Guardian Name: ${data.parentName || "Not provided"}`,
      `Phone: ${data.phone || "Not provided"}`,
      `Email: ${data.email || "Not provided"}`,
      `Message: ${data.message || "No additional message"}`,
    ].join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");

    void submitLead({
      ...data,
      age: data.age || undefined,
      sourcePath: pathname,
    });

    setDone(true);
    form.reset();
  }

  return (
    <>
      <form className="admissions__form card-3d" id="admission-form" onSubmit={handleSubmit}>
        <h3>Enrollment Inquiry</h3>
        <div className="form__group">
          <label htmlFor="student-name">Student Full Name</label>
          <input type="text" id="student-name" name="student-name" required placeholder="Enter full name" autoComplete="name" />
        </div>
        <div className="form__row">
          <div className="form__group">
            <label htmlFor="age">Age</label>
            <input type="number" id="age" name="age" min={3} max={80} required placeholder="Age" />
          </div>
          <div className="form__group">
            <label htmlFor="course">Preferred Course</label>
            <select id="course" name="course" required defaultValue={defaultCourse}>
              <option value="">Select a course</option>
              {enquiryCourseOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
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
            <input type="tel" id="phone" name="phone" required placeholder={PHONES[0].display} autoComplete="tel" />
          </div>
          <div className="form__group">
            <label htmlFor="email">Email (optional)</label>
            <input type="email" id="email" name="email" placeholder="you@email.com" autoComplete="email" />
          </div>
        </div>
        <div className="form__group">
          <label htmlFor="message">Message (optional)</label>
          <textarea id="message" name="message" rows={3} placeholder="Any questions or preferred start date" />
        </div>
        <div className="form__hp" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" className="btn btn--primary btn--full">Submit Inquiry</button>
        <p className="form__note">Your inquiry will be sent directly to WhatsApp for a faster response.</p>
      </form>

      <div className="modal" hidden={!done} role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && setDone(false)}>
        <div className="modal__content">
          <span className="modal__icon">✓</span>
          <h3>Inquiry Submitted!</h3>
          <p>
            Thank you for your interest in Dragon Ryu Arts Academy. We will contact you soon. For faster response, message us on WhatsApp at {PHONES[0].display}.
          </p>
          <button className="btn btn--primary" onClick={() => setDone(false)}>Got it</button>
        </div>
      </div>
    </>
  );
}
