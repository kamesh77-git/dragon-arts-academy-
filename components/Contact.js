import Card3D from "./Card3D";
import { MAPS_URL, whatsappLink } from "@/lib/data";

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container contact__grid">
        <div className="contact__info">
          <p className="section__eyebrow">Get in Touch</p>
          <h2 className="section__title">Contact Us</h2>
          <p className="contact__text">Visit us at Mannivakkam, call for course details, or message us on WhatsApp — we&apos;re happy to help.</p>
          <ul className="contact__list">
            <li>
              <span className="contact__icon">📍</span>
              <div>
                <strong>Location</strong>
                <p><a href={MAPS_URL} target="_blank" rel="noopener noreferrer">Dragon Ryu Arts Academy<br />Mannivakkam, Chennai</a></p>
              </div>
            </li>
            <li>
              <span className="contact__icon">📞</span>
              <div>
                <strong>Phone</strong>
                <p>
                  <a href="tel:+919884448277">98844 48277</a><br />
                  <a href="tel:+919884448377">98844 48377</a>
                </p>
              </div>
            </li>
            <li>
              <span className="contact__icon">💬</span>
              <div>
                <strong>WhatsApp</strong>
                <p><a href={whatsappLink("Hi Dragon Ryu Arts Academy, I have a question.")} target="_blank" rel="noopener noreferrer">Chat on WhatsApp — 98844 48277</a></p>
              </div>
            </li>
            <li>
              <span className="contact__icon">🌐</span>
              <div>
                <strong>Website</strong>
                <p>www.dragonryuartsacademy.com</p>
              </div>
            </li>
          </ul>
          <div className="contact__actions">
            <a href={whatsappLink("Hi Dragon Ryu Arts Academy, I would like to enquire.")} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            <a href={MAPS_URL} className="btn btn--outline" target="_blank" rel="noopener noreferrer">Get Directions</a>
          </div>
        </div>
        <Card3D className="contact__map">
          <iframe
            title="Dragon Ryu Arts Academy — Mannivakkam"
            src="https://maps.google.com/maps?q=Dragon+Ryu+Arts+Academy+Mannivakkam&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Card3D>
      </div>
    </section>
  );
}
