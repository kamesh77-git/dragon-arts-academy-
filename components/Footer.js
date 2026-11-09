import Image from "next/image";
import { MAPS_URL, whatsappLink } from "@/lib/data";

const ext = { target: "_blank", rel: "noopener noreferrer" };

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <a href="#home" className="nav__logo">
              <Image src="/images/logo.png" alt="Dragon Ryu Arts Academy" width={48} height={48} className="nav__logo-img nav__logo-img--footer" />
              <span className="nav__logo-text">Dragon Ryu<br /><small>Arts Academy</small></span>
            </a>
            <p>Strong body &amp; sharp mind — multiple arts in one place at Mannivakkam, Chennai.</p>
          </div>
          <div className="footer__links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#admissions">Admissions</a></li>
            </ul>
          </div>
          <div className="footer__links">
            <h4>Programs</h4>
            <ul>
              <li><a href="#courses">Karate &amp; Silambam</a></li>
              <li><a href="#courses">Dance &amp; Yoga</a></li>
              <li><a href="#courses">Drawing &amp; Abacus</a></li>
              <li><a href="#courses">Languages</a></li>
              <li><a href="#courses">Music</a></li>
            </ul>
          </div>
          <div className="footer__contact">
            <h4>Contact</h4>
            <p><a href="tel:+919884448277">98844 48277</a></p>
            <p><a href="tel:+919884448377">98844 48377</a></p>
            <p><a href={MAPS_URL} {...ext}>Mannivakkam, Chennai</a></p>
          </div>
          <div className="footer__links footer__branch">
            <h4>Karate Branch</h4>
            <ul>
              <li><a href="https://goo.gl/maps/H8ghxMPGeYaheDGs6?g_st=aw" {...ext}>Adhanur Karate Class</a></li>
              <li><a href="https://maps.google.com/?q=12.923955,80.105377" {...ext}>Tambaram Karate Class</a></li>
              <li><a href="https://maps.app.goo.gl/3vWyiv22xKVNxwsF7?g_st=aw" {...ext}>Vandalur Karate Class</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom container">
          <p>&copy; 2026 Dragon Ryu Arts Academy. All rights reserved.</p>
        </div>
      </footer>

      <a href={whatsappLink("Hi Dragon Ryu Arts Academy, I would like to enquire about admissions.")} className="whatsapp-float" {...ext} aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="whatsapp-float__pulse"></span>
      </a>
    </>
  );
}
