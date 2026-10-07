import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdmissionsSection from "@/components/site/AdmissionsSection";
import { GoogleRatingBadge } from "@/components/site/GoogleReviews";
import JsonLd from "@/components/site/JsonLd";
import Toc from "@/components/site/Toc";
import { courses, getCourse } from "@/lib/courses";
import { getFaculty } from "@/lib/faculty";
import { galleryImage } from "@/lib/gallery";
import { getGoogleReviews } from "@/lib/google-reviews";
import { breadcrumbSchema, courseSchema, faqSchema, webPageSchema } from "@/lib/jsonld";
import { buildMetadata, getPageSeo } from "@/lib/page-seo";
import { AFFILIATIONS, FOUNDED_YEAR, FULL_ADDRESS, PHONES, STATS, WHATSAPP_ENQUIRY } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[course]">) {
  const { course } = await params;
  if (!getCourse(course)) return {};
  return buildMetadata(`/${course}`);
}

// Maps a course to the closest option in the enquiry form dropdown.
const ENQUIRY_OPTION: Record<string, string> = {
  Karate: "Karate",
  Silambam: "Silambam",
  Yoga: "Yoga",
  Bharatanatyam: "Dance / Bharatham / Zumba",
  "Western Dance": "Dance / Bharatham / Zumba",
  Drawing: "Drawing",
  Abacus: "Abacus",
  "Spoken English & Phonics": "English Spoken / Phonics",
  Hindi: "Hindi Spoken / Written",
  "Music: Keyboard, Guitar & Drums": "Keyboard / Drums / Vocal",
  Vocal: "Keyboard / Drums / Vocal",
  Handwriting: "Handwriting",
};

// "Spoken English Classes in Mannivakkam" -> "spoken English classes in Mannivakkam"
// for use mid-sentence, keeping proper nouns capitalised.
const PROPER_NOUNS = new Set(["Mannivakkam", "English", "Hindi", "Bharatanatyam"]);
function inSentence(title: string) {
  return title
    .split(" ")
    .map((w) => (PROPER_NOUNS.has(w) ? w : w.toLowerCase()))
    .join(" ");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function CoursePage({ params }: PageProps<"/[course]">) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const path = `/${course.slug}`;
  const [seo, reviews] = await Promise.all([getPageSeo(path), getGoogleReviews()]);
  const teacher = course.facultyId ? getFaculty(course.facultyId) : undefined;
  const images = course.images.map((file, i) => ({ ...galleryImage(file), alt: course.imageAlts[i] }));
  const related = course.related.map((s) => getCourse(s)).filter((c) => c !== undefined);
  const phrase = inSentence(course.h1);
  const quickAnswer = `Dragon Ryu Arts Academy runs ${phrase} for children, teenagers and adults${teacher ? `, led by ${teacher.name}` : ""}. The academy has taught 14+ arts in Mannivakkam, Chennai since ${FOUNDED_YEAR}. Admissions are open with no admission fee: call ${PHONES[0].display} or send an enquiry to book a seat.`;
  const toc = [
    { id: "key-takeaways", text: "Key takeaways" },
    { id: "at-a-glance", text: "At a glance" },
    { id: "about-the-art", text: course.whatIs.heading },
    { id: "what-you-learn", text: "What you will learn" },
    { id: "benefits", text: "Benefits" },
    { id: "who-can-join", text: "Who can join" },
    ...(teacher ? [{ id: "instructor", text: "Your instructor" }] : []),
    { id: "why-us", text: "Why Dragon Ryu" },
    { id: "how-to-join", text: "How to join" },
    { id: "faq", text: "FAQs" },
  ];

  return (
    <main className="course-page">
      <section className="course-hero">
        <div className="hero__bg" />
        <div className="container course-hero__inner">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/courses">Courses</Link></li>
              <li aria-current="page">{course.name}</li>
            </ol>
          </nav>
          <p className="hero__eyebrow">{course.tag}</p>
          <h1 className="course-hero__title">{course.h1}</h1>
          {course.intro.map((p) => (
            <p key={p} className="course-hero__lead">{p}</p>
          ))}
          <p className="course-hero__meta">
            By {seo.author} · Updated <time dateTime={seo.updatedAt}>{formatDate(seo.updatedAt)}</time>
          </p>
          <div className="hero__actions">
            <Link href="#admissions" className="btn btn--primary">Book Your Seat</Link>
            <a href={WHATSAPP_ENQUIRY} className="btn btn--whatsapp" target="_blank" rel="noopener">WhatsApp Us</a>
          </div>
        </div>
      </section>

      <article className="section course-body">
        <div className="container course-body__grid course-body__grid--toc">
          <Toc items={toc} />
          <div className="prose">
            <figure className="prose__figure">
              <Image src={images[0].src} alt={images[0].alt} width={images[0].width} height={images[0].height} priority sizes="(max-width: 900px) 92vw, 720px" />
              <figcaption>{images[0].caption}</figcaption>
            </figure>

            <div className="answer-box">
              <p className="answer-box__label">Quick answer</p>
              <p>{quickAnswer}</p>
            </div>

            <h2 id="key-takeaways">Key takeaways</h2>
            <ul>
              {course.takeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            <h2 id="at-a-glance">{course.h1} at a glance</h2>
            <table>
              <thead>
                <tr><th scope="col">Detail</th><th scope="col">{course.name} classes</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Who it is for</th><td>Children, teenagers and adults</td></tr>
                <tr><th scope="row">Instructor</th><td>{teacher ? teacher.name : "Dragon Ryu faculty"}</td></tr>
                <tr><th scope="row">Location</th><td>{FULL_ADDRESS}</td></tr>
                <tr><th scope="row">Admission fee</th><td>No admission fee (admissions open)</td></tr>
                <tr><th scope="row">Batch timings</th><td>Call {PHONES[0].display} for current batches</td></tr>
              </tbody>
            </table>

            <h2 id="about-the-art">{course.whatIs.heading}</h2>
            {course.whatIs.text.map((p) => (
              <p key={p}>{p}</p>
            ))}

            <h2 id="what-you-learn">What you will learn</h2>
            <ul>
              {course.learn.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>

            <h2 id="benefits">Benefits of {phrase}</h2>
            <ul>
              {course.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <figure className="prose__figure">
              <Image src={images[1].src} alt={images[1].alt} width={images[1].width} height={images[1].height} sizes="(max-width: 900px) 92vw, 720px" />
              <figcaption>{images[1].caption}</figcaption>
            </figure>

            <h2 id="who-can-join">Who can join</h2>
            <p>{course.whoFor}</p>

            {teacher && (
              <>
                <h2 id="instructor">Meet your instructor</h2>
                <h3>{teacher.name}</h3>
                <p>{teacher.name} leads our {phrase}.</p>
                <p>{teacher.bio}</p>
              </>
            )}

            <h2 id="why-us">Why choose our {phrase}</h2>
            <p>
              Dragon Ryu Arts Academy has taught students in Mannivakkam since {FOUNDED_YEAR}. Our team has trained {STATS.studentsTrained} students across {STATS.programs} arts, in comfortable air-conditioned classrooms.
            </p>
            <ul>
              <li>Experienced, qualified faculty for every art</li>
              <li>{STATS.programs} programs under one roof, so siblings can learn together</li>
              <li>Regular performances, gradings and world record events</li>
              <li>Martial arts affiliated with {AFFILIATIONS.map((a) => a.match(/\(([^)]+)\)/)?.[1] ?? a).join(", ")}</li>
            </ul>
            <figure className="prose__figure">
              <Image src={images[2].src} alt={images[2].alt} width={images[2].width} height={images[2].height} sizes="(max-width: 900px) 92vw, 720px" />
              <figcaption>{images[2].caption}</figcaption>
            </figure>

            <h2 id="how-to-join">How to join</h2>
            <p>Joining our {phrase} takes three simple steps.</p>
            <ol>
              <li>Call {PHONES[0].display} or <Link href="#admissions">send an enquiry</Link>.</li>
              <li>Visit our Mannivakkam campus and meet the instructor.</li>
              <li>Pick a batch that fits your schedule and start learning.</li>
            </ol>
            <p>We recommend a short visit first so the instructor can suggest the right level.</p>

            <h2 id="faq">Frequently asked questions</h2>
            {course.faqs.map((f) => (
              <div key={f.q} className="prose__faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <h2 id="sources">Sources and further reading</h2>
            <ul>
              <li><a href={course.reference.url} target="_blank" rel="noopener">{course.reference.label}</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Chennai" target="_blank" rel="noopener">Chennai on Wikipedia</a></li>
              <li><a href="https://www.google.com/maps/search/Dragon+Ryu+Arts+Academy+Mannivakkam" target="_blank" rel="noopener">Dragon Ryu Arts Academy on Google Maps</a></li>
            </ul>

            <h2 id="final-thoughts">Final thoughts</h2>
            <p>
              Our {phrase} give students skill, confidence and discipline in a friendly setting. Admissions are open with no admission fee. Contact us today to book a seat.
            </p>
          </div>

          <aside className="course-aside" aria-label="More courses">
            <div className="course-aside__card card-3d">
              <h2>Plan a visit</h2>
              <p>Talk to us about batches and timings.</p>
              {reviews && <GoogleRatingBadge data={reviews} />}
              <a href={`tel:${PHONES[0].tel}`} className="btn btn--primary btn--full">Call {PHONES[0].display}</a>
              <a href={WHATSAPP_ENQUIRY} className="btn btn--whatsapp btn--full" target="_blank" rel="noopener">WhatsApp Us</a>
            </div>
            <div className="course-aside__card card-3d">
              <h2>Related courses</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/${r.slug}`}>{r.icon} {r.name} classes</Link>
                  </li>
                ))}
                <li><Link href="/courses">View all courses →</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </article>

      <AdmissionsSection defaultCourse={ENQUIRY_OPTION[course.name] ?? ""} />

      <JsonLd
        data={[
          webPageSchema({ path, name: seo.metaTitle, description: seo.metaDescription, dateModified: seo.updatedAt }),
          courseSchema(course, seo.metaDescription),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Courses", path: "/courses" },
            { name: course.name, path },
          ]),
          faqSchema(course.faqs),
        ]}
      />
    </main>
  );
}
