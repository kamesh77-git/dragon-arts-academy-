import Image from "next/image";
import Link from "next/link";

import AdmissionsSection from "@/components/site/AdmissionsSection";
import CourseCard from "@/components/site/CourseCard";
import JsonLd from "@/components/site/JsonLd";
import { courses } from "@/lib/courses";
import { getFaculty } from "@/lib/faculty";
import { galleryImage } from "@/lib/gallery";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/jsonld";
import { buildMetadata, getPageSeo } from "@/lib/page-seo";
import { FOUNDED_YEAR, PHONES, SITE_URL, STATS } from "@/lib/site";

export const revalidate = 3600;

export function generateMetadata() {
  return buildMetadata("/courses");
}

const groups = [
  { title: "Martial arts & wellness", tags: ["Martial Arts", "Traditional Martial Arts", "Wellness"] },
  { title: "Dance & music", tags: ["Classical Dance", "Performing Arts", "Music"] },
  { title: "Creative & academic skills", tags: ["Creative Arts", "Brain Development", "Academic"] },
  { title: "Languages", tags: ["Languages"] },
];

const coursesFaqs = [
  {
    q: "Which courses in Mannivakkam are best for young children?",
    a: "Abacus, handwriting, phonics, drawing, karate and dance are popular first choices. Call us and we will suggest courses that suit your child's age and interests.",
  },
  {
    q: "Can my child join more than one course?",
    a: "Yes. With 14+ programs under one roof, many students combine a martial art or dance with an academic skill such as abacus or handwriting.",
  },
  {
    q: "Do you have courses for adults?",
    a: "Yes. Karate, silambam, yoga, dance, music, drawing, spoken English and Hindi all welcome adults.",
  },
  {
    q: "How do I find batch timings and fees?",
    a: `Call ${PHONES[0].display} or send an enquiry. Admissions are open and there is no admission fee.`,
  },
];

const photos = [
  { file: "karate-class.webp", alt: "Karate students training at one of our courses in Mannivakkam" },
  { file: "bharatanatyam.webp", alt: "Bharatanatyam dance performance by academy students" },
  { file: "yoga-world-record.webp", alt: "Students at the academy's Yoga World Record event" },
].map((p) => ({ ...galleryImage(p.file), alt: p.alt }));

export default async function CoursesPage() {
  const seo = await getPageSeo("/courses");

  return (
    <main className="course-page">
      <section className="course-hero">
        <div className="hero__bg" />
        <div className="container course-hero__inner">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-current="page">Courses</li>
            </ol>
          </nav>
          <p className="hero__eyebrow">Our Programs</p>
          <h1 className="course-hero__title">Courses in Mannivakkam for Kids &amp; Adults</h1>
          <p className="course-hero__lead">
            Dragon Ryu Arts Academy offers {STATS.programs} courses in Mannivakkam under one roof: martial arts, yoga, classical and western dance, music, drawing, abacus, handwriting and languages. Pick a course below to see what students learn, who teaches it and how to join.
          </p>
        </div>
      </section>

      <section className="section course-body">
        <div className="container prose prose--narrow">
          <figure className="prose__figure">
            <Image src={photos[0].src} alt={photos[0].alt} width={photos[0].width} height={photos[0].height} priority sizes="(max-width: 900px) 92vw, 760px" />
            <figcaption>{photos[0].caption}</figcaption>
          </figure>
          <h2>Summary</h2>
          <ul>
            <li>{STATS.programs} courses for children from about 3 years, teenagers and adults</li>
            <li>Qualified instructors for every art, including a 5th Dan karate Grand Master</li>
            <li>One campus in Mannivakkam, plus karate branches in Adhanur, Tambaram and Vandalur</li>
            <li>Admissions open with no admission fee</li>
          </ul>

          <h2>All courses in Mannivakkam at a glance</h2>
          <table>
            <thead>
              <tr><th scope="col">Course</th><th scope="col">Category</th><th scope="col">Instructor</th></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.slug}>
                  <th scope="row"><Link href={`/${c.slug}`}>{c.name}</Link></th>
                  <td>{c.tag}</td>
                  <td>{(c.facultyId && getFaculty(c.facultyId)?.name) || "Dragon Ryu faculty"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {groups.map((g) => {
        const list = courses.filter((c) => g.tags.includes(c.tag));
        if (!list.length) return null;
        return (
          <section key={g.title} className="section courses courses--grouped">
            <div className="container">
              <h2 className="section__title">{g.title}</h2>
              <div className="courses__grid">
                {list.map((c) => (
                  <CourseCard key={c.slug} course={c} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="section">
        <div className="container prose prose--narrow">
          <h2>Why choose our courses in Mannivakkam</h2>
          <p>
            Dragon Ryu Arts Academy has taught students in Mannivakkam since {FOUNDED_YEAR}. Our karate programme alone has produced {STATS.blackBelts} black belts, and our students take part in performances, gradings and Yoga World Record events.
          </p>
          <figure className="prose__figure">
            <Image src={photos[1].src} alt={photos[1].alt} width={photos[1].width} height={photos[1].height} sizes="(max-width: 900px) 92vw, 760px" />
            <figcaption>{photos[1].caption}</figcaption>
          </figure>

          <h2>Frequently asked questions</h2>
          {coursesFaqs.map((f) => (
            <div key={f.q} className="prose__faq">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <figure className="prose__figure">
            <Image src={photos[2].src} alt={photos[2].alt} width={photos[2].width} height={photos[2].height} sizes="(max-width: 900px) 92vw, 760px" />
            <figcaption>{photos[2].caption}</figcaption>
          </figure>

          <h2>Sources and further reading</h2>
          <ul>
            <li><a href="https://en.wikipedia.org/wiki/Karate" target="_blank" rel="noopener">Karate on Wikipedia</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Silambam" target="_blank" rel="noopener">Silambam on Wikipedia</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Bharatanatyam" target="_blank" rel="noopener">Bharatanatyam on Wikipedia</a></li>
          </ul>

          <h2>Final thoughts</h2>
          <p>
            Whether your child wants to move, create, perform or think faster, our courses in Mannivakkam have a class for them. Adults are welcome too. Send an enquiry below to book a seat.
          </p>
        </div>
      </section>

      <AdmissionsSection />

      <JsonLd
        data={[
          webPageSchema({ path: "/courses", name: seo.metaTitle, description: seo.metaDescription, dateModified: seo.updatedAt }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Courses", path: "/courses" },
          ]),
          faqSchema(coursesFaqs),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: courses.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/${c.slug}`,
              name: `${c.name} classes`,
            })),
          },
        ]}
      />
    </main>
  );
}
