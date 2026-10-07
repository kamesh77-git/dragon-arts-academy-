import Link from "next/link";

import AdmissionsSection from "@/components/site/AdmissionsSection";
import CourseCard from "@/components/site/CourseCard";
import Gallery from "@/components/site/Gallery";
import HeroArts from "@/components/site/HeroArts";
import GoogleReviews from "@/components/site/GoogleReviews";
import JsonLd from "@/components/site/JsonLd";
import { courses } from "@/lib/courses";
import { faculty } from "@/lib/faculty";
import { gallery } from "@/lib/gallery";
import { getGoogleReviews } from "@/lib/google-reviews";
import { faqSchema, webPageSchema } from "@/lib/jsonld";
import { buildMetadata, getPageSeo } from "@/lib/page-seo";
import {
  AFFILIATIONS,
  FOUNDED_YEAR,
  FULL_ADDRESS,
  KARATE_BRANCHES,
  MAPS_EMBED,
  MAPS_URL,
  PHONES,
  STATS,
  WHATSAPP_ENQUIRY,
  whatsappLink,
} from "@/lib/site";

export const revalidate = 3600;

export function generateMetadata() {
  return buildMetadata("/");
}

const AFFILIATION_ICONS = ["🏅", "🏆", "🛡️"];

const homeFaqs = [
  {
    q: "Why choose Dragon Ryu as your arts academy in Mannivakkam?",
    a: "Since 2011 we have trained 950+ students and 90+ black belts, with qualified faculty for every art and 14+ programs under one roof, so siblings can learn together.",
  },
  {
    q: "Where is Dragon Ryu Arts Academy located?",
    a: "Our main campus is in Mannivakkam, Chennai. We also run karate classes in Adhanur, Tambaram and Vandalur.",
  },
  {
    q: "Which courses does the academy offer?",
    a: "Karate, Silambam, Yoga, Bharatanatyam, Western Dance, Drawing, Abacus, Spoken English and Phonics, Hindi, Keyboard, Guitar, Drums, Vocal, Handwriting and Craft.",
  },
  {
    q: "What ages do you teach?",
    a: "We teach children from about 3 years, teenagers and adults. Each course has batches suited to different ages and levels.",
  },
  {
    q: "Is there an admission fee?",
    a: "Admissions are currently open with no admission fee. Call us for course fees and batch timings.",
  },
  {
    q: "How do I enrol?",
    a: `Fill in the enquiry form on this page, message us on WhatsApp, or call ${PHONES[0].display}. We will help you choose a batch and arrange a visit.`,
  },
];

export default async function HomePage() {
  const [seo, reviews] = await Promise.all([getPageSeo("/"), getGoogleReviews()]);

  return (
    <main>
      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero__bg" />
        <div className="hero__3d-stage" id="hero-3d" aria-hidden="true">
          <div className="float-cube float-cube--1" />
          <div className="float-cube float-cube--2" />
          <div className="float-ring" />
          <div className="float-star float-star--1">✦</div>
          <div className="float-star float-star--2">✦</div>
        </div>
        <div className="container hero__grid">
          <div className="hero__content">
            <p className="hero__eyebrow">Multiple Arts in One Place</p>
            <h1 className="hero__title">
              Dragon Ryu
              <br />
              <span>Arts Academy</span>
            </h1>
            <p className="hero__subtitle">
              Strong body &amp; sharp mind. The arts academy in Mannivakkam for professional training in martial arts, dance, drawing, abacus, languages, music and more, for all ages.
            </p>
            <div className="hero__actions">
              <Link href="#admissions" className="btn btn--primary">Book Your Seat</Link>
              <Link href="/courses" className="btn btn--outline">View Courses</Link>
              <a href={WHATSAPP_ENQUIRY} className="btn btn--whatsapp" target="_blank" rel="noopener">WhatsApp Us</a>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <strong>{STATS.programs}</strong>
                <span>Arts &amp; Programs</span>
              </div>
              <div className="hero__stat">
                <strong>All</strong>
                <span>Age Groups Welcome</span>
              </div>
              <div className="hero__stat">
                <strong>AC</strong>
                <span>Comfortable Classrooms</span>
              </div>
            </div>
          </div>
          <div className="hero__logo-wrap">
            <HeroArts />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section about" id="about">
        <div className="container about__grid">
          <div className="about__content">
            <p className="section__eyebrow">About Us</p>
            <h2 className="section__title">Where Arts, Discipline &amp; Learning Unite</h2>
            <p className="about__text">
              Since {FOUNDED_YEAR}, Dragon Ryu Arts Academy has been committed to developing skilled martial artists and responsible individuals. The academy has produced {STATS.blackBelts} Black Belt students, including 1st Dan and 2nd Dan graduates, and has trained more than {STATS.studentsTrained.replace("+", "")} students.
            </p>
            <p className="about__text">
              Our academy has also conducted {STATS.demonstrations} live karate demonstrations at public events and organized self-defense and women&apos;s safety awareness programs, along with children&apos;s safety and social awareness initiatives. We are dedicated to building discipline, confidence, leadership, and community service through martial arts.
            </p>
            <ul className="about__features">
              <li>
                <span className="about__feature-icon" aria-hidden="true">🥋</span>
                <div>
                  <strong><Link href="/karate-classes-in-mannivakkam">Karate</Link> &amp; <Link href="/silambam-classes-in-mannivakkam">Silambam</Link></strong>
                  <p>Professional karate, Silambam, and self-defense training with discipline-led coaching</p>
                </div>
              </li>
              <li>
                <span className="about__feature-icon" aria-hidden="true">🎖️</span>
                <div>
                  <strong>Legacy &amp; Impact</strong>
                  <p>{STATS.blackBelts} Black Belt students, {STATS.studentsTrained} students trained, and {STATS.demonstrations} public demonstrations</p>
                </div>
              </li>
              <li>
                <span className="about__feature-icon" aria-hidden="true">🌟</span>
                <div>
                  <strong>Leadership &amp; Community</strong>
                  <p>Focused on confidence, leadership, social awareness, and service through the arts</p>
                </div>
              </li>
            </ul>
            <div className="about__text">
              <h3 className="about__subheading">Affiliations</h3>
              <ul className="about__features">
                {AFFILIATIONS.map((a, i) => (
                  <li key={a}>
                    <span className="about__feature-icon" aria-hidden="true">{AFFILIATION_ICONS[i]}</span>
                    <div><strong>{a}</strong></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="yoga-record__panel" id="yoga-world-record">
            <p className="section__eyebrow">Yoga World Record Initiative</p>
            <h2 className="section__title">Health, Unity &amp; Social Awareness</h2>
            <p className="section__desc">
              At Dragon Ryu Arts Academy, we proudly organize Yoga World Record Events twice every year to promote health, unity, and social awareness. Participants of all age groups come together to set both Group Yoga World Records and Individual (Solo) Yoga World Records by performing yoga asanas for a designated duration.
            </p>
            <ul className="about__features">
              <li>
                <span className="about__feature-icon" aria-hidden="true">🧘</span>
                <div>
                  <strong>Twice Every Year</strong>
                  <p>Organized with a focus on fitness, discipline, and unity</p>
                </div>
              </li>
              <li>
                <span className="about__feature-icon" aria-hidden="true">🌍</span>
                <div>
                  <strong>All Age Groups Welcome</strong>
                  <p>Everyone gets the opportunity to participate in group and solo world-record attempts</p>
                </div>
              </li>
              <li>
                <span className="about__feature-icon" aria-hidden="true">🤝</span>
                <div>
                  <strong>Community Impact</strong>
                  <p>These events inspire physical fitness, national unity, and awareness for important social causes</p>
                </div>
              </li>
            </ul>
            <p className="yoga-record__more">
              <Link href="/yoga-classes-in-mannivakkam">Explore our yoga classes →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section about-founder" id="about-founder">
        <div className="container">
          <div className="section__header">
            <p className="section__eyebrow">About Us</p>
            <h2 className="section__title">About the Founder</h2>
            <p className="section__desc">A visionary leader shaping confident, disciplined, and creative learners.</p>
          </div>
          <div className="founder-card card-3d">
            <p className="founder-card__name">
              <strong>Mrs. S. RENUGADEVI</strong>
              <br />
              <strong>FOUNDER &amp; HEAD, Dragon Ryu Arts Academy</strong>
            </p>
            <p>
              She is the visionary Founder and Head of Dragon Ryu Arts Academy, a premier institution dedicated to nurturing excellence in martial arts, performing arts, language development, and holistic education. She holds a Master&apos;s Degree in Biotechnology and believes that true education extends beyond academics. Driven by her passion for empowering young minds, she combines knowledge, discipline, and values to help students become confident, responsible, and successful individuals.
            </p>
            <p>
              In 2023, she successfully earned her Karate Black Belt, marking an important milestone in her martial arts journey. She has also represented her skills in international karate tournaments, gaining valuable experience and continuously striving for excellence. With a clear vision of creating an academy where every student can discover their hidden potential, she founded Dragon Ryu Arts Academy.
            </p>
            <p>
              Today, the academy offers a wide range of programs, including Karate, Silambam, Yoga, Bharatanatyam, Western Dance, Drawing, Spoken English, Phonics, Hindi, Keyboard, Drums, Abacus, and Craft, providing a platform for students to grow physically, mentally, creatively, and socially.
            </p>
            <p className="founder-card__quote">
              &ldquo;Every child has the power to achieve greatness. With discipline, dedication, and the right guidance, success becomes a way of life.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="section faculty" id="faculty-excellence">
        <div className="container">
          <div className="section__header">
            <p className="section__eyebrow">Faculty Excellence</p>
            <h2 className="section__title">Meet Our Dedicated Mentors</h2>
            <p className="section__desc">
              Expert faculty members leading Yoga, Drawing, Karate, English, Hindi, Music, Handwriting, Bharatham, Abacus, and Western Dance with passion and experience.
            </p>
          </div>
          <div className="courses__grid">
            {faculty.map((f) => (
              <article key={f.id} className="course-card card-3d" data-tilt>
                <div className="course-card__icon" aria-hidden="true">{f.icon}</div>
                <h3>{f.name}</h3>
                <p>{f.bio}</p>
                <span className="course-card__tag">Handling: {f.handles}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="section courses" id="courses">
        <div className="container">
          <div className="section__header">
            <p className="section__eyebrow">Our Programs</p>
            <h2 className="section__title">Courses &amp; Professional Training</h2>
            <p className="section__desc">Choose your art. Every program includes professional coaching and structured learning paths.</p>
          </div>
          <div className="courses__grid">
            {courses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
          <p className="courses__all">
            <Link href="/courses" className="btn btn--primary">See all courses</Link>
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section gallery" id="gallery">
        <div className="container">
          <div className="section__header">
            <p className="section__eyebrow">Life at the Academy</p>
            <h2 className="section__title">Gallery</h2>
            <p className="section__desc">Training moments across martial arts, dance, drawing, abacus and language classes.</p>
          </div>
          <Gallery images={gallery} />
        </div>
      </section>

      <GoogleReviews data={reviews} />

      <AdmissionsSection />

      {/* Facts (GEO: a quotable summary AI assistants can cite) */}
      <section className="section facts" id="at-a-glance">
        <div className="container">
          <div className="section__header">
            <p className="section__eyebrow">Quick Summary</p>
            <h2 className="section__title">Dragon Ryu Arts Academy at a Glance</h2>
            <p className="section__desc">Key facts about the arts academy in Mannivakkam, reviewed {new Date(seo.updatedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}.</p>
          </div>
          <div className="prose facts__table">
            <table>
              <thead>
                <tr><th scope="col">Fact</th><th scope="col">Details</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Founded</th><td>{FOUNDED_YEAR}</td></tr>
                <tr><th scope="row">Location</th><td>{FULL_ADDRESS}. Karate branches in {KARATE_BRANCHES.map((b) => b.name.replace(" Karate Class", "")).join(", ")}</td></tr>
                <tr><th scope="row">Programs</th><td>{STATS.programs}: {courses.map((c) => c.name.replace("Music: ", "")).join(", ")}, Craft</td></tr>
                <tr><th scope="row">Ages</th><td>Children from about 3 years, teenagers and adults</td></tr>
                <tr><th scope="row">Karate record</th><td>{STATS.blackBelts} black belts (incl. 1st and 2nd Dan), {STATS.studentsTrained} students trained, {STATS.demonstrations} public demonstrations</td></tr>
                <tr><th scope="row">Affiliations</th><td>{AFFILIATIONS.join("; ")}</td></tr>
                <tr><th scope="row">Founder &amp; Head</th><td>Mrs. S. Renugadevi</td></tr>
                <tr><th scope="row">Events</th><td>Yoga World Record events twice a year</td></tr>
                <tr><th scope="row">Admission fee</th><td>None at present (admissions open)</td></tr>
                <tr><th scope="row">Contact</th><td>{PHONES.map((p) => p.display).join(" / ")} (call or WhatsApp)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="container faq__inner">
          <div className="section__header">
            <p className="section__eyebrow">Good to Know</p>
            <h2 className="section__title">Frequently Asked Questions</h2>
          </div>
          <div className="faq__list">
            {homeFaqs.map((f) => (
              <details key={f.q} className="faq__item">
                <summary><h3>{f.q}</h3></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact" id="contact">
        <div className="container contact__grid">
          <div className="contact__info">
            <p className="section__eyebrow">Get in Touch</p>
            <h2 className="section__title">Contact Us</h2>
            <p className="contact__text">Visit us at Mannivakkam, call for course details, or message us on WhatsApp. We&apos;re happy to help.</p>
            <ul className="contact__list">
              <li>
                <span className="contact__icon" aria-hidden="true">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>
                    <a href={MAPS_URL} target="_blank" rel="noopener">
                      Dragon Ryu Arts Academy
                      <br />
                      {FULL_ADDRESS}
                    </a>
                  </p>
                </div>
              </li>
              <li>
                <span className="contact__icon" aria-hidden="true">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>
                    {PHONES.map((p, i) => (
                      <span key={p.tel}>
                        {i > 0 && <br />}
                        <a href={`tel:${p.tel}`}>{p.display}</a>
                      </span>
                    ))}
                  </p>
                </div>
              </li>
              <li>
                <span className="contact__icon" aria-hidden="true">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p>
                    <a href={whatsappLink("Hi Dragon Ryu Arts Academy, I have a question.")} target="_blank" rel="noopener">
                      Chat on WhatsApp: {PHONES[0].display}
                    </a>
                  </p>
                </div>
              </li>
              <li>
                <span className="contact__icon" aria-hidden="true">🌐</span>
                <div>
                  <strong>Website</strong>
                  <p>www.dragonryuartsacademy.com</p>
                </div>
              </li>
            </ul>
            <div className="contact__actions">
              <a href={whatsappLink("Hi Dragon Ryu Arts Academy, I would like to enquire.")} className="btn btn--whatsapp" target="_blank" rel="noopener">WhatsApp Us</a>
              <a href={MAPS_URL} className="btn btn--outline" target="_blank" rel="noopener">Get Directions</a>
            </div>
          </div>
          <div className="contact__map card-3d">
            <iframe title="Dragon Ryu Arts Academy, Mannivakkam on Google Maps" src={MAPS_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          webPageSchema({ path: "/", name: seo.metaTitle, description: seo.metaDescription, dateModified: seo.updatedAt }),
          faqSchema(homeFaqs),
        ]}
      />
    </main>
  );
}
