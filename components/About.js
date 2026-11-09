import Card3D from "./Card3D";

function Features({ items }) {
  return (
    <ul className="about__features">
      {items.map(([icon, title, text]) => (
        <li key={title}>
          <span className="about__feature-icon">{icon}</span>
          <div>
            <strong>{title}</strong>
            {text && <p>{text}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <>
      <section className="section about" id="about">
        <div className="container about__grid">
          <div className="about__content">
            <p className="section__eyebrow">About Us</p>
            <h2 className="section__title">Where Arts, Discipline &amp; Learning Unite</h2>
            <p className="about__text">
              Since 2011, Dragon Ryu Arts Academy has been committed to developing skilled martial
              artists and responsible individuals. Established in 2011, the academy has produced
              90+ Black Belt students, including 1st Dan and 2nd Dan graduates, and has trained
              more than 950 students.
            </p>
            <p className="about__text">
              Our academy has also conducted 10+ live karate demonstrations at public events and
              organized self-defense and women’s safety awareness programs, along with children’s
              safety and social awareness initiatives. We are dedicated to building discipline,
              confidence, leadership, and community service through martial arts.
            </p>
            <Features
              items={[
                ["🥋", "Karate & Silambam", "Professional karate, Silambam, and self-defense training with discipline-led coaching"],
                ["🎖️", "Legacy & Impact", "90+ Black Belt students, 950+ students trained, and 10+ public demonstrations"],
                ["🌟", "Leadership & Community", "Focused on confidence, leadership, social awareness, and service through the arts"],
              ]}
            />
            <div className="about__text">
              <strong>Affiliations</strong>
              <Features
                items={[
                  ["🏅", "Karate India Organisation (KIO)"],
                  ["🏆", "Tamilnadu Sports Karate-Do Association (TSKA), India"],
                  ["🛡️", "Chennai District Sports Karate Association (CDSKA)"],
                ]}
              />
            </div>
          </div>

          <div className="yoga-record__panel" id="yoga-world-record">
            <p className="section__eyebrow">Yoga World Record Initiative</p>
            <h2 className="section__title">Health, Unity &amp; Social Awareness</h2>
            <p className="section__desc">
              At Dragon Ryu Arts Academy, we proudly organize Yoga World Record Events twice every year to
              promote health, unity, and social awareness. Participants of all age groups come together to
              set both Group Yoga World Records and Individual (Solo) Yoga World Records by performing yoga
              asanas for a designated duration.
            </p>
            <Features
              items={[
                ["🧘", "Twice Every Year", "Organized with a focus on fitness, discipline, and unity"],
                ["🌍", "All Age Groups Welcome", "Everyone gets the opportunity to participate in group and solo world-record attempts"],
                ["🤝", "Community Impact", "These events inspire physical fitness, national unity, and awareness for important social causes"],
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section about-founder" id="about-founder">
        <div className="container">
          <div className="section__header">
            <p className="section__eyebrow">About Us</p>
            <h2 className="section__title">About the Founder</h2>
            <p className="section__desc">A visionary leader shaping confident, disciplined, and creative learners.</p>
          </div>
          <Card3D
            className="founder-card"
            style={{ padding: "2rem", background: "rgba(255,255,255,0.95)", borderRadius: "1.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.12)", color: "#000" }}
          >
            <p style={{ color: "#000", fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.75rem" }}>
              <strong style={{ color: "#000" }}>Mrs. S. RENUGADEVI</strong><br />
              <strong style={{ color: "#000" }}>FOUNDER &amp; HEAD – Dragon Ryu Arts Academy</strong>
            </p>
            <p style={{ color: "#000", lineHeight: 1.8, marginBottom: "1rem" }}>
              She is the visionary Founder and Head of Dragon Ryu Arts Academy, a premier institution dedicated to nurturing excellence in martial arts, performing arts, language development, and holistic education. She holds a Master’s Degree in Biotechnology and believes that true education extends beyond academics. Driven by her passion for empowering young minds, she combines knowledge, discipline, and values to help students become confident, responsible, and successful individuals.
            </p>
            <p style={{ color: "#000", lineHeight: 1.8, marginBottom: "1rem" }}>
              In 2023, she successfully earned her Karate Black Belt, marking an important milestone in her martial arts journey. She has also represented her skills in international karate tournaments, gaining valuable experience and continuously striving for excellence. With a clear vision of creating an academy where every student can discover their hidden potential, she founded Dragon Ryu Arts Academy.
            </p>
            <p style={{ color: "#000", lineHeight: 1.8, marginBottom: "1rem" }}>
              Today, the academy offers a wide range of programs, including Karate, Silambam, Yoga, Bharatanatyam, Western Dance, Drawing, Spoken English, Phonics, Hindi, Keyboard, Drums, Abacus, and Craft, providing a platform for students to grow physically, mentally, creatively, and socially.
            </p>
            <p style={{ color: "#000", lineHeight: 1.8, fontWeight: 700, marginTop: "1.25rem" }}>
              “Every child has the power to achieve greatness. With discipline, dedication, and the right guidance, success becomes a way of life.”
            </p>
          </Card3D>
        </div>
      </section>
    </>
  );
}
