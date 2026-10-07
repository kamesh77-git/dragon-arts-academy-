import EnquiryForm from "./EnquiryForm";
import { MAPS_URL, PHONES, STATS } from "@/lib/site";

export default function AdmissionsSection({ defaultCourse }: { defaultCourse?: string }) {
  return (
    <section className="section admissions" id="admissions">
      <div className="container admissions__grid">
        <div className="admissions__info">
          <p className="section__eyebrow">Join Us</p>
          <h2 className="section__title">Admissions &amp; Enrollment</h2>
          <div className="admissions__promo card-3d">
            <h3>Admissions Open</h3>
            <p className="admissions__promo-highlight">NO ADMISSION FEES</p>
            <p>New batches starting. Contact us to reserve your seat today.</p>
          </div>
          <p className="admissions__text">
            Ready to begin? Fill out the form or message us on WhatsApp. Our team will contact you to schedule a visit to our Mannivakkam campus.
          </p>
          <div className="admissions__steps">
            <div className="admissions__step">
              <span>01</span>
              <div>
                <strong>Visit or Call</strong>
                <p>Reach us at {PHONES[0].display} or visit our Mannivakkam location</p>
              </div>
            </div>
            <div className="admissions__step">
              <span>02</span>
              <div>
                <strong>Choose Your Program</strong>
                <p>Select from {STATS.programs} arts and training programs</p>
              </div>
            </div>
            <div className="admissions__step">
              <span>03</span>
              <div>
                <strong>Start Training</strong>
                <p>Begin your journey: strong body &amp; sharp mind!</p>
              </div>
            </div>
          </div>
          <div className="admissions__contact card-3d">
            <h4>Contact Numbers</h4>
            <p>
              {PHONES.map((p, i) => (
                <span key={p.tel}>
                  {i > 0 && " | "}
                  <a href={`tel:${p.tel}`}>{p.display}</a>
                </span>
              ))}
            </p>
            <p>
              <a href={MAPS_URL} target="_blank" rel="noopener">📍 Find us on Google Maps, Mannivakkam</a>
            </p>
          </div>
        </div>
        <EnquiryForm defaultCourse={defaultCourse} />
      </div>
    </section>
  );
}
