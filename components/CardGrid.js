import Card3D from "./Card3D";
import { courses, faculty } from "@/lib/data";

export function Faculty() {
  return (
    <section className="section faculty" id="faculty-excellence">
      <div className="container">
        <div className="section__header">
          <p className="section__eyebrow">Faculty Excellence</p>
          <h2 className="section__title">Meet Our Dedicated Mentors</h2>
          <p className="section__desc">
            Expert faculty members leading Yoga, Drawing, Karate, English, Hindi, Music, Handwriting,
            Bharatham, Abacus, and Western Dance with passion and experience.
          </p>
        </div>
        <div className="courses__grid">
          {faculty.map((f) => (
            <Card3D as="article" tilt className="course-card" key={f.name}>
              <div className="course-card__icon">{f.icon}</div>
              <h3>{f.name}</h3>
              <p>{f.text}</p>
              <span className="course-card__tag">{f.tag}</span>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Courses() {
  return (
    <section className="section courses" id="courses">
      <div className="container">
        <div className="section__header">
          <p className="section__eyebrow">Our Programs</p>
          <h2 className="section__title">Courses &amp; Professional Training</h2>
          <p className="section__desc">Choose your art — every program includes professional coaching and structured learning paths.</p>
        </div>
        <div className="courses__grid">
          {courses.map((c) => (
            <Card3D as="article" tilt className={`course-card${c.featured ? " course-card--featured" : ""}`} key={c.name}>
              {c.label && <span className="course-card__label">{c.label}</span>}
              <div className="course-card__icon">{c.icon}</div>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
              <span className="course-card__tag">{c.tag}</span>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
