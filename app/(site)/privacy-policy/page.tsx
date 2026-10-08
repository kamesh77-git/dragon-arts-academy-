import type { Metadata } from "next";
import Link from "next/link";

import { PHONES, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects and uses the details you share through our enquiry form, WhatsApp and phone.`,
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="course-page">
      <section className="course-hero course-hero--short">
        <div className="hero__bg" />
        <div className="container course-hero__inner">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Privacy Policy</li>
            </ol>
          </nav>
          <h1 className="course-hero__title">Privacy Policy</h1>
        </div>
      </section>
      <section className="section">
        <div className="container prose prose--narrow">
          <h2>What we collect</h2>
          <p>
            When you send an enrollment enquiry we collect the details you enter: student name, age, preferred course, parent or guardian name, phone number, and optionally your email address and a message.
          </p>
          <h2>How we use it</h2>
          <p>
            We use these details only to respond to your enquiry, discuss batches and admissions, and keep a record of enquiries. The form also opens WhatsApp with your message so you can send it to us directly.
          </p>
          <h2>Children&apos;s information</h2>
          <p>
            Many of our students are under 18. Enquiries for a child should be made by a parent or guardian, who provides their name on the form.
          </p>
          <h2>Cookies and advertising</h2>
          <p>
            We use the Meta Pixel (Facebook and Instagram) to understand which of our ads lead to visits and enquiries, and to show our ads to people likely to be interested. It records pages viewed and whether an enquiry was sent, not the details you type into the form. You can control ad personalisation in your Facebook and Instagram ad settings, or block it with your browser&apos;s privacy settings.
          </p>
          <h2>Sharing</h2>
          <p>We do not sell or share your details with third parties for marketing.</p>
          <h2>Your choices</h2>
          <p>
            To update or delete the details you have sent us, call <a href={`tel:${PHONES[0].tel}`}>{PHONES[0].display}</a> and we will take care of it.
          </p>
        </div>
      </section>
    </main>
  );
}
