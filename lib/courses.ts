// Course catalogue. Drives the home page course grid, the enquiry form
// options, and one keyword-targeted landing page per course
// (app/(site)/[course]/page.tsx). Copy is grounded in what the academy
// publishes about itself: no fees, timings or results are invented here.

export interface CourseFaq {
  q: string;
  a: string;
}

export interface Course {
  slug: string;
  name: string;
  icon: string;
  tag: string;
  cardTitle: string;
  cardText: string;
  label?: string;
  facultyId?: string;
  /** Gallery file names (lib/gallery.ts); first one is the cover. */
  images: string[];
  /** Alt text for the images above, same order. */
  imageAlts: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    secondaryKeywords: string[];
  };
  h1: string;
  intro: string[];
  takeaways: string[];
  whatIs: { heading: string; text: string[] };
  learn: string[];
  benefits: string[];
  whoFor: string;
  faqs: CourseFaq[];
  reference: { label: string; url: string };
  related: string[];
}

export const courses: Course[] = [
  {
    slug: "karate-classes-in-mannivakkam",
    name: "Karate",
    icon: "🥋",
    tag: "Martial Arts",
    cardTitle: "Karate",
    cardText: "Professional martial arts training building discipline, strength and confidence. All ages.",
    facultyId: "parthiban",
    images: ["karate-class.webp", "belt-grading.webp", "karate-outdoor.webp"],
    imageAlts: [
      "Students training at karate classes in Mannivakkam",
      "Karate students with certificates after a colour belt grading",
      "Outdoor karate group photo with the Indian flag",
    ],
    seo: {
      metaTitle: "Karate Classes in Mannivakkam: Best Since 2011",
      metaDescription:
        "Karate classes in Mannivakkam led by a 5th Dan Grand Master. 90+ black belts trained since 2011. Kids, teens and adults welcome. No admission fee. Call us.",
      focusKeyword: "karate classes in mannivakkam",
      secondaryKeywords: ["karate for kids chennai", "self defence classes", "black belt training", "martial arts academy"],
    },
    h1: "Karate Classes in Mannivakkam",
    intro: [
      "Dragon Ryu Arts Academy has run karate classes in Mannivakkam since 2011. Our dojo has produced 90+ black belt students, including 1st Dan and 2nd Dan graduates, and has trained more than 950 students.",
      "Classes are led by Renshi A. Parthiban, a 5th Dan Black Belt and Style Chief of Dragon Ryu International School of Karate. Children, teenagers and adults train in the same structured, belt-based system.",
    ],
    takeaways: [
      "Structured belt-based karate from white belt to black belt",
      "Head coach: 5th Dan Grand Master with 17 years of instruction",
      "Affiliated with KIO, TSKA and CDSKA",
      "Self-defence and women's safety training included",
      "Branches in Adhanur, Tambaram and Vandalur too",
    ],
    whatIs: {
      heading: "What is karate?",
      text: [
        "Karate is a Japanese striking martial art built on punches, kicks, blocks and stances. Students practise basics (kihon), set forms (kata) and controlled sparring (kumite).",
        "Progress is marked by coloured belts. Each grading tests technique, fitness and discipline before a student moves up.",
      ],
    },
    learn: [
      "Correct stances, punches, kicks and blocks",
      "Kata (forms) for each belt level",
      "Controlled sparring with safety equipment",
      "Practical self-defence and awareness",
      "Fitness, flexibility and stamina drills",
      "Dojo etiquette, respect and focus",
    ],
    benefits: [
      "Builds confidence and a calm, alert mind",
      "Improves strength, balance and coordination",
      "Teaches discipline that carries into school and work",
      "Gives children and women real self-defence skills",
      "Offers clear goals through belt gradings",
    ],
    whoFor:
      "Our karate batches welcome children, teenagers and adults. Beginners start with basics and grow at their own pace. Students who want to compete can train for district, state and national tournaments.",
    faqs: [
      {
        q: "What age can my child join karate classes in Mannivakkam?",
        a: "We train children, teenagers and adults. Call us and we will suggest the right batch for your child's age and fitness.",
      },
      {
        q: "How long does it take to earn a black belt?",
        a: "It depends on regular attendance and grading results. Our structured syllabus has helped 90+ students reach black belt.",
      },
      {
        q: "Is karate safe for young children?",
        a: "Yes. Beginners focus on basics, fitness and controlled drills. Sparring is introduced gradually with protective gear.",
      },
      {
        q: "Which associations is the academy affiliated with?",
        a: "We are affiliated with Karate India Organisation (KIO), Tamilnadu Sports Karate-Do Association (TSKA) and Chennai District Sports Karate Association (CDSKA).",
      },
    ],
    reference: { label: "Karate on Wikipedia", url: "https://en.wikipedia.org/wiki/Karate" },
    related: ["silambam-classes-in-mannivakkam", "yoga-classes-in-mannivakkam", "western-dance-classes-in-mannivakkam"],
  },
  {
    slug: "silambam-classes-in-mannivakkam",
    name: "Silambam",
    icon: "🪄",
    tag: "Traditional Martial Arts",
    cardTitle: "Silambam",
    cardText: "Professional Silambam staff training: the ancient Tamil martial art with modern coaching methods.",
    label: "Traditional",
    facultyId: "parthiban",
    images: ["karate-outdoor.webp", "community-event.webp", "academy-building.webp"],
    imageAlts: [
      "Martial arts students training outdoors for silambam classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Dragon Ryu Arts Academy building in Mannivakkam",
    ],
    seo: {
      metaTitle: "Silambam Classes in Mannivakkam | Best 2026",
      metaDescription:
        "Silambam classes in Mannivakkam: learn the ancient Tamil staff art with expert coaching, safe drills and modern methods. Kids and adults welcome. Enrol now.",
      focusKeyword: "silambam classes in mannivakkam",
      secondaryKeywords: ["silambam training chennai", "tamil martial art", "stick fighting classes", "silambam for kids"],
    },
    h1: "Silambam Classes in Mannivakkam",
    intro: [
      "Our silambam classes in Mannivakkam teach the ancient Tamil martial art of the bamboo staff. Students learn traditional footwork and spins with modern, safety-first coaching.",
      "Silambam sits alongside karate in our martial arts programme, so students build discipline, rhythm and body control in a proud local tradition.",
    ],
    takeaways: [
      "Traditional Tamil staff art taught with modern methods",
      "Footwork, spins and strikes learned step by step",
      "Builds rhythm, coordination and upper body strength",
      "Open to children, teens and adults",
      "Part of a martial arts academy running since 2011",
    ],
    whatIs: {
      heading: "What is silambam?",
      text: [
        "Silambam is a weapon-based martial art from Tamil Nadu that uses a long bamboo staff. It is known for fast spinning patterns, precise footwork and graceful movement.",
        "It has been practised for centuries and is still performed at festivals, competitions and cultural events across the state.",
      ],
    },
    learn: [
      "Safe grip, stance and basic staff handling",
      "Traditional footwork patterns (kaaladi)",
      "Single and double hand spinning techniques",
      "Striking and blocking combinations",
      "Performance routines for events and competitions",
    ],
    benefits: [
      "Connects students with Tamil heritage",
      "Develops hand-eye coordination and reflexes",
      "Strengthens shoulders, wrists and core",
      "Improves concentration and timing",
      "Builds stage confidence through demonstrations",
    ],
    whoFor:
      "Silambam suits children, teenagers and adults. Beginners start with basic handling and footwork before moving to faster spinning and sparring drills.",
    faqs: [
      {
        q: "Do I need my own staff for silambam classes in Mannivakkam?",
        a: "Talk to us before buying one. We will advise the right length and type for the student's height and level.",
      },
      {
        q: "Is silambam safe for children?",
        a: "Yes. Students begin with slow, controlled drills and only progress to faster work once their control is good.",
      },
      {
        q: "Can I learn silambam and karate together?",
        a: "Yes. Many students combine both, since footwork, timing and discipline carry over between the two arts.",
      },
      {
        q: "Are there performance opportunities?",
        a: "Our students take part in public demonstrations and events. The academy has conducted 10+ live demonstrations.",
      },
    ],
    reference: { label: "Silambam on Wikipedia", url: "https://en.wikipedia.org/wiki/Silambam" },
    related: ["karate-classes-in-mannivakkam", "yoga-classes-in-mannivakkam", "bharatanatyam-classes-in-mannivakkam"],
  },
  {
    slug: "yoga-classes-in-mannivakkam",
    name: "Yoga",
    icon: "🧘",
    tag: "Wellness",
    cardTitle: "Yoga",
    cardText: "Mind-body wellness through guided yoga sessions for flexibility and focus.",
    facultyId: "rajagopal",
    images: ["yoga-world-record.webp", "world-record-news.webp", "newspaper-coverage.webp"],
    imageAlts: [
      "Students from our yoga classes in Mannivakkam at a Yoga World Record event",
      "TT News coverage of the Nova World Record event",
      "Malai Murasu newspaper coverage of the academy's world record",
    ],
    seo: {
      metaTitle: "Yoga Classes in Mannivakkam | Best 30+ Years",
      metaDescription:
        "Yoga classes in Mannivakkam with a Yoga Aacharya of 30+ years. Asanas, breathing and focus for kids and adults, plus Yoga World Record events twice a year.",
      focusKeyword: "yoga classes in mannivakkam",
      secondaryKeywords: ["yoga for kids chennai", "yoga world record", "kids yoga classes", "yoga near tambaram"],
    },
    h1: "Yoga Classes in Mannivakkam",
    intro: [
      "Our yoga classes in Mannivakkam are guided by Kalaimamani B. Rajagopal, a Yoga Aacharya with over 30 years of experience and an external yoga examiner for Bharathidasan University.",
      "Students build flexibility, strength and focus. They can also take part in the Yoga World Record events the academy organises twice every year.",
    ],
    takeaways: [
      "Led by a Yoga Aacharya with 30+ years of experience",
      "Asanas, breathing and relaxation in every session",
      "Yoga World Record events held twice a year",
      "Group and solo record attempts for all ages",
      "Good for focus, posture and stress relief",
    ],
    whatIs: {
      heading: "What is yoga?",
      text: [
        "Yoga is an Indian practice that combines physical postures (asanas), breathing (pranayama) and relaxation. Regular practice improves flexibility, balance and mental calm.",
        "For children it supports posture and concentration. For adults it is a simple, low-impact way to stay fit.",
      ],
    },
    learn: [
      "Standing, seated and balancing asanas",
      "Breathing techniques (pranayama)",
      "Surya Namaskar sequences",
      "Relaxation and concentration practice",
      "Preparation for group and solo world record attempts",
    ],
    benefits: [
      "Improves flexibility and posture",
      "Builds core strength and balance",
      "Helps children focus in class",
      "Reduces stress for teens and adults",
      "Supports healthy habits for life",
    ],
    whoFor:
      "Yoga is suitable for children, teenagers, adults and seniors. Postures are adapted to each student's age and flexibility, so no prior experience is needed.",
    faqs: [
      {
        q: "Who teaches the yoga classes in Mannivakkam?",
        a: "Kalaimamani B. Rajagopal, a Yoga Aacharya with 30+ years of experience and mentor to multiple world record achievers.",
      },
      {
        q: "What are the Yoga World Record events?",
        a: "Twice a year the academy organises events where participants of all ages attempt group and individual yoga world records by holding asanas for a set duration.",
      },
      {
        q: "Can adults join yoga classes?",
        a: "Yes. Our yoga batches welcome adults as well as children and teenagers.",
      },
      {
        q: "Do I need any equipment?",
        a: "A yoga mat and comfortable clothing are enough to begin.",
      },
    ],
    reference: { label: "Yoga on Wikipedia", url: "https://en.wikipedia.org/wiki/Yoga" },
    related: ["karate-classes-in-mannivakkam", "bharatanatyam-classes-in-mannivakkam", "silambam-classes-in-mannivakkam"],
  },
  {
    slug: "bharatanatyam-classes-in-mannivakkam",
    name: "Bharatanatyam",
    icon: "🪷",
    tag: "Classical Dance",
    cardTitle: "Bharatanatyam",
    cardText: "Classical Bharatanatyam training covering adavus, mudras and expression with an M.F.A. teacher.",
    facultyId: "jeyalakshmi",
    images: ["bharatanatyam.webp", "community-event.webp", "academy-building.webp"],
    imageAlts: [
      "Students performing after bharatanatyam classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Dragon Ryu Arts Academy building in Mannivakkam",
    ],
    seo: {
      metaTitle: "Bharatanatyam Classes in Mannivakkam | Best",
      metaDescription:
        "Bharatanatyam classes in Mannivakkam with an M.F.A. teacher of 8 years. Learn adavus, mudras and abhinaya with stage performances. Kids and adults welcome.",
      focusKeyword: "bharatanatyam classes in mannivakkam",
      secondaryKeywords: ["bharatanatyam for kids", "classical dance classes chennai", "bharatham classes", "dance academy mannivakkam"],
    },
    h1: "Bharatanatyam Classes in Mannivakkam",
    intro: [
      "Our bharatanatyam classes in Mannivakkam are taught by Mrs. Jeyalakshmi Sivakumar, who holds an M.F.A. in Bharatanatyam and has 8 years of teaching experience.",
      "Students learn the classical foundations step by step and perform on stage at academy events.",
    ],
    takeaways: [
      "Teacher holds an M.F.A. in Bharatanatyam",
      "Titles include Natyamani and Kalaivalarmani",
      "Adavus, mudras and abhinaya taught in order",
      "Stage performances at academy events",
      "Classes for children and adults",
    ],
    whatIs: {
      heading: "What is Bharatanatyam?",
      text: [
        "Bharatanatyam is a classical dance form from Tamil Nadu. It combines precise footwork, hand gestures (mudras) and facial expression (abhinaya) to tell stories through dance.",
        "It is one of India's best known classical dance traditions and is performed worldwide.",
      ],
    },
    learn: [
      "Basic posture (aramandi) and adavus",
      "Hasta mudras (hand gestures)",
      "Rhythm and tala practice",
      "Abhinaya (expression) and storytelling",
      "Items for stage performances",
    ],
    benefits: [
      "Builds grace, posture and stamina",
      "Strengthens memory and rhythm",
      "Connects students with Indian culture",
      "Develops stage confidence",
      "Improves concentration and discipline",
    ],
    whoFor:
      "Bharatanatyam suits children, teenagers and adults. Beginners start with basic adavus, and progress to full dance items as their technique grows.",
    faqs: [
      {
        q: "Who teaches the bharatanatyam classes in Mannivakkam?",
        a: "Mrs. Jeyalakshmi Sivakumar, an M.F.A. in Bharatanatyam with 8 years of teaching and titles including Natyamani and Natya Tharagai.",
      },
      {
        q: "Do students perform on stage?",
        a: "Yes. Students perform at academy and community events once they are ready.",
      },
      {
        q: "What should a beginner wear?",
        a: "Comfortable practice clothes are fine at first. Your teacher will guide you on a practice saree or costume later.",
      },
      {
        q: "Can adults start Bharatanatyam?",
        a: "Yes. Adults are welcome to start from the basics.",
      },
    ],
    reference: { label: "Bharatanatyam on Wikipedia", url: "https://en.wikipedia.org/wiki/Bharatanatyam" },
    related: ["western-dance-classes-in-mannivakkam", "singing-classes-in-mannivakkam", "yoga-classes-in-mannivakkam"],
  },
  {
    slug: "western-dance-classes-in-mannivakkam",
    name: "Western Dance",
    icon: "💃",
    tag: "Performing Arts",
    cardTitle: "Western Dance",
    cardText: "Professional western dance training with energetic and confidence-building routines.",
    facultyId: "rico",
    images: ["community-event.webp", "award-ceremony.webp", "academy-building.webp"],
    imageAlts: [
      "Children at an academy event for western dance classes in Mannivakkam",
      "Student receiving trophies at an award ceremony",
      "Dragon Ryu Arts Academy building in Mannivakkam",
    ],
    seo: {
      metaTitle: "Western Dance Classes in Mannivakkam | Best",
      metaDescription:
        "Western dance classes in Mannivakkam with a choreographer featured on Vijay TV and Zee Tamil. Fun, high-energy routines for kids and adults. Book a seat now.",
      focusKeyword: "western dance classes in mannivakkam",
      secondaryKeywords: ["dance classes for kids chennai", "hip hop dance classes", "zumba classes", "choreography classes"],
    },
    h1: "Western Dance Classes in Mannivakkam",
    intro: [
      "Our western dance classes in Mannivakkam are led by Master RICO (Viknesh), a choreographer and stage director featured on Vijay TV, Zee Tamil and Raj TV.",
      "Students learn energetic routines that build fitness, rhythm and confidence, and perform at academy events.",
    ],
    takeaways: [
      "Choreographer featured on Vijay TV, Zee Tamil and Raj TV",
      "High-energy routines that build fitness",
      "Focus on rhythm, expression and teamwork",
      "Stage performances at academy events",
      "Batches for children and adults",
    ],
    whatIs: {
      heading: "What is western dance?",
      text: [
        "Western dance covers modern styles such as freestyle, hip hop and contemporary. Routines are set to popular music and focus on rhythm, energy and expression.",
        "It is a fun way for children and adults to stay active while learning to perform.",
      ],
    },
    learn: [
      "Warm-ups, grooves and basic steps",
      "Freestyle and hip hop movement",
      "Full choreographed routines",
      "Stage presence and expression",
      "Group formations and teamwork",
    ],
    benefits: [
      "Great cardio workout",
      "Improves coordination and memory",
      "Builds stage confidence",
      "Encourages teamwork and creativity",
      "Relieves stress in a fun way",
    ],
    whoFor:
      "Western dance suits children, teenagers and adults. No experience is needed and routines are adapted to each batch's level.",
    faqs: [
      {
        q: "Who teaches western dance classes in Mannivakkam?",
        a: "Master RICO (Viknesh), a choreographer, stage director and creative artist featured on Vijay TV, Zee Tamil and Raj TV.",
      },
      {
        q: "Does my child need dance experience?",
        a: "No. Beginners are welcome and start with basic steps and grooves.",
      },
      {
        q: "Do you offer Zumba?",
        a: "Our enquiry form lists Dance, Bharatham and Zumba together. Call us to check the current Zumba batch.",
      },
      {
        q: "Will students perform on stage?",
        a: "Yes. Students perform routines at academy events.",
      },
    ],
    reference: { label: "Hip hop dance on Wikipedia", url: "https://en.wikipedia.org/wiki/Hip-hop_dance" },
    related: ["bharatanatyam-classes-in-mannivakkam", "music-classes-in-mannivakkam", "karate-classes-in-mannivakkam"],
  },
  {
    slug: "drawing-classes-in-mannivakkam",
    name: "Drawing",
    icon: "🎨",
    tag: "Creative Arts",
    cardTitle: "Drawing Classes",
    cardText: "Creative drawing and art classes with professional guidance for budding artists.",
    facultyId: "lalitha",
    images: ["academy-building.webp", "community-event.webp", "award-ceremony.webp"],
    imageAlts: [
      "Dragon Ryu Arts Academy, venue for drawing classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Student receiving trophies at an award ceremony",
    ],
    seo: {
      metaTitle: "Drawing Classes in Mannivakkam | Best 2026",
      metaDescription:
        "Drawing classes in Mannivakkam with a fine arts specialist. Learn sketching, watercolour, colour pencil and Tanjore painting. Kids and adults welcome. Enrol.",
      focusKeyword: "drawing classes in mannivakkam",
      secondaryKeywords: ["art classes for kids chennai", "tanjore painting classes", "pencil sketching classes", "watercolour classes"],
    },
    h1: "Drawing Classes in Mannivakkam",
    intro: [
      "Our drawing classes in Mannivakkam are taught by Mrs. Lalitha, who holds a Diploma in Fine Arts and specialises in freehand drawing, model drawing and Tanjore painting.",
      "Students explore several mediums, build strong basics and grow their own creative style.",
    ],
    takeaways: [
      "Teacher holds a Diploma in Fine Arts",
      "Pencil, colour pencil and watercolour work",
      "Tanjore painting for advanced students",
      "Freehand and model drawing skills",
      "Classes for children and adults",
    ],
    whatIs: {
      heading: "What do drawing classes cover?",
      text: [
        "Drawing classes teach how to observe and represent shapes, light and shade on paper. Students start with lines and shapes, then move to shading, perspective and colour.",
        "Our syllabus also introduces Tanjore painting, a traditional South Indian art form known for rich colours and gold foil.",
      ],
    },
    learn: [
      "Lines, shapes and basic sketching",
      "Pencil shading and model drawing",
      "Colour pencil art",
      "Watercolour techniques",
      "Tanjore painting",
    ],
    benefits: [
      "Builds fine motor skills in young children",
      "Encourages creativity and self-expression",
      "Improves patience and concentration",
      "Supports school art and craft work",
      "A relaxing hobby for adults",
    ],
    whoFor:
      "Drawing classes suit young children, teenagers and adults. Beginners start with basic sketching while experienced students can work on painting and portfolio pieces.",
    faqs: [
      {
        q: "Who teaches drawing classes in Mannivakkam?",
        a: "Mrs. Lalitha, BBA and Diploma in Fine Arts, a specialist in freehand drawing, model drawing, Tanjore painting, watercolour and pencil sketching.",
      },
      {
        q: "What materials does my child need?",
        a: "Your teacher will share a simple materials list for the student's level when they join.",
      },
      {
        q: "Is Tanjore painting taught?",
        a: "Yes. Tanjore painting is part of the programme for students who are ready for it.",
      },
      {
        q: "Can adults join drawing classes?",
        a: "Yes. Adults are welcome, whether starting fresh or returning to art.",
      },
    ],
    reference: { label: "Tanjore painting on Wikipedia", url: "https://en.wikipedia.org/wiki/Thanjavur_painting" },
    related: ["handwriting-classes-in-mannivakkam", "abacus-classes-in-mannivakkam", "music-classes-in-mannivakkam"],
  },
  {
    slug: "abacus-classes-in-mannivakkam",
    name: "Abacus",
    icon: "🧮",
    tag: "Brain Development",
    cardTitle: "Abacus Coaching",
    cardText: "Professional abacus coaching: from memorising to mastering mathematical concepts.",
    facultyId: "sugapriya",
    images: ["academy-building.webp", "community-event.webp", "award-ceremony.webp"],
    imageAlts: [
      "Dragon Ryu Arts Academy, venue for abacus classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Student receiving trophies at an award ceremony",
    ],
    seo: {
      metaTitle: "Abacus Classes in Mannivakkam | Best 2026",
      metaDescription:
        "Abacus classes in Mannivakkam with a Master Abacus and Vedic Maths certified trainer. Build speed, accuracy and confidence in mental arithmetic. Enrol today.",
      focusKeyword: "abacus classes in mannivakkam",
      secondaryKeywords: ["vedic maths classes", "mental arithmetic for kids", "abacus coaching chennai", "brain development classes"],
    },
    h1: "Abacus Classes in Mannivakkam",
    intro: [
      "Our abacus classes in Mannivakkam are taught by Mrs. P. Sugapriya Mathankumar, who holds a Master Abacus diploma and an Advanced Vedic Mathematics certification.",
      "Children learn to calculate quickly and accurately, first on the abacus and then in their heads.",
    ],
    takeaways: [
      "Master Abacus and Advanced Vedic Maths certified trainer",
      "Level-by-level progression",
      "Builds speed and accuracy in calculation",
      "Improves concentration and memory",
      "Vedic Mathematics tricks for older students",
    ],
    whatIs: {
      heading: "What is abacus training?",
      text: [
        "The abacus is a bead frame used for calculation. Students first move beads by hand, then learn to picture the abacus in their mind and calculate mentally.",
        "This visual method builds number sense, speed and confidence with maths.",
      ],
    },
    learn: [
      "Bead values and finger techniques",
      "Addition and subtraction on the abacus",
      "Multiplication and division",
      "Mental (visualised) abacus calculation",
      "Vedic Mathematics shortcuts",
    ],
    benefits: [
      "Faster, more accurate arithmetic",
      "Better concentration and listening",
      "Stronger memory and visualisation",
      "More confidence in school maths",
      "Healthy competitive spirit",
    ],
    whoFor:
      "Abacus is mainly for school-age children. Older students and parents interested in Vedic Mathematics are welcome to ask about suitable batches.",
    faqs: [
      {
        q: "Who teaches abacus classes in Mannivakkam?",
        a: "Mrs. P. Sugapriya Mathankumar, MBA (Finance), B.Com, with a Master Abacus diploma and Advanced Vedic Mathematics certification.",
      },
      {
        q: "What age is best to start abacus?",
        a: "Most children start once they are comfortable with numbers. Call us and we will suggest the right level.",
      },
      {
        q: "Does abacus help with school maths?",
        a: "Abacus builds speed, accuracy and number sense, which supports everyday school maths.",
      },
      {
        q: "Do you teach Vedic Mathematics?",
        a: "Yes. Vedic Mathematics techniques are taught alongside abacus for students who are ready.",
      },
    ],
    reference: { label: "Abacus on Wikipedia", url: "https://en.wikipedia.org/wiki/Abacus" },
    related: ["handwriting-classes-in-mannivakkam", "spoken-english-classes-in-mannivakkam", "drawing-classes-in-mannivakkam"],
  },
  {
    slug: "spoken-english-classes-in-mannivakkam",
    name: "Spoken English & Phonics",
    icon: "📚",
    tag: "Languages",
    cardTitle: "English Spoken / Phonics",
    cardText: "Professional spoken English and phonics classes for confident communication.",
    facultyId: "leelavathi",
    images: ["academy-building.webp", "community-event.webp", "award-ceremony.webp"],
    imageAlts: [
      "Dragon Ryu Arts Academy, venue for spoken english classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Student receiving trophies at an award ceremony",
    ],
    seo: {
      metaTitle: "Spoken English Classes in Mannivakkam | Best",
      metaDescription:
        "Spoken English classes in Mannivakkam with phonics for young learners. A B.A. English teacher with 7 years of experience builds fluent, confident speakers.",
      focusKeyword: "spoken english classes in mannivakkam",
      secondaryKeywords: ["phonics classes for kids", "english speaking course chennai", "communication skills", "phonics chennai"],
    },
    h1: "Spoken English Classes in Mannivakkam",
    intro: [
      "Our spoken English classes in Mannivakkam help children and adults speak clearly and confidently. Young learners also build strong reading foundations through phonics.",
      "Classes are taught by Mrs. Leelavathi, who holds a B.A. in English and has 7 years of teaching experience.",
    ],
    takeaways: [
      "Phonics for early readers",
      "Speaking practice in every class",
      "Vocabulary, grammar and pronunciation",
      "Teacher with a B.A. in English and 7 years' experience",
      "Batches for children and adults",
    ],
    whatIs: {
      heading: "What is phonics?",
      text: [
        "Phonics teaches children the sounds that letters and letter groups make, so they can decode and read new words on their own.",
        "Spoken English builds on this with conversation, vocabulary and pronunciation practice so students can express themselves clearly.",
      ],
    },
    learn: [
      "Letter sounds and blending (phonics)",
      "Reading fluency",
      "Everyday conversation practice",
      "Pronunciation and vocabulary",
      "Public speaking and presentations",
    ],
    benefits: [
      "Stronger reading skills for young children",
      "Confidence in speaking at school and work",
      "Better grammar and vocabulary",
      "Clearer pronunciation",
      "Improved interview and stage confidence",
    ],
    whoFor:
      "Phonics is designed for young children learning to read. Spoken English batches suit school students and adults who want to communicate more confidently.",
    faqs: [
      {
        q: "Who teaches spoken english classes in Mannivakkam?",
        a: "Mrs. Leelavathi, B.A. English and D.P.Ed., with 7 years of experience building confidence through spoken English and phonics.",
      },
      {
        q: "What is the difference between phonics and spoken English?",
        a: "Phonics teaches young children to read by sound. Spoken English focuses on speaking fluently and confidently.",
      },
      {
        q: "Are there classes for adults?",
        a: "Yes. Adults can join spoken English batches.",
      },
      {
        q: "Do you teach other languages?",
        a: "Yes. We also offer Hindi classes and other language programmes.",
      },
    ],
    reference: { label: "Phonics on Wikipedia", url: "https://en.wikipedia.org/wiki/Phonics" },
    related: ["hindi-classes-in-mannivakkam", "handwriting-classes-in-mannivakkam", "abacus-classes-in-mannivakkam"],
  },
  {
    slug: "hindi-classes-in-mannivakkam",
    name: "Hindi",
    icon: "🇮🇳",
    tag: "Languages",
    cardTitle: "Hindi Spoken / Written",
    cardText: "Professional Hindi classes for all ages: spoken and written proficiency.",
    facultyId: "revathy",
    images: ["academy-building.webp", "community-event.webp", "award-ceremony.webp"],
    imageAlts: [
      "Dragon Ryu Arts Academy, venue for hindi classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Student receiving trophies at an award ceremony",
    ],
    seo: {
      metaTitle: "Hindi Classes in Mannivakkam | Best 10+ Years",
      metaDescription:
        "Hindi classes in Mannivakkam for reading, writing and speaking. Taught by a B.A. Hindi teacher with 10+ years of experience. Kids and adults welcome. Enrol.",
      focusKeyword: "hindi classes in mannivakkam",
      secondaryKeywords: ["spoken hindi classes", "hindi tuition chennai", "learn hindi for kids", "hindi writing classes"],
    },
    h1: "Hindi Classes in Mannivakkam",
    intro: [
      "Our hindi classes in Mannivakkam teach students to read, write and speak Hindi with confidence.",
      "Classes are taught by Mrs. Revathy Yuvaraj, who holds a B.A. in Hindi and a B.A. in English Literature and has 10+ years of teaching experience.",
    ],
    takeaways: [
      "Reading, writing and speaking covered",
      "Teacher with a B.A. in Hindi and 10+ years' experience",
      "Devanagari script from the basics",
      "Support for school Hindi",
      "Batches for children and adults",
    ],
    whatIs: {
      heading: "Why learn Hindi?",
      text: [
        "Hindi is one of the most widely spoken languages in India. Learning it helps with school exams, travel, work and communication across the country.",
        "Our classes start with the Devanagari script and build up to fluent reading, writing and conversation.",
      ],
    },
    learn: [
      "Devanagari letters and sounds",
      "Reading simple and longer texts",
      "Handwriting and spelling",
      "Grammar basics",
      "Everyday spoken Hindi",
    ],
    benefits: [
      "Better results in school Hindi",
      "Confidence speaking with Hindi speakers",
      "Useful for jobs and travel",
      "Strengthens overall language skills",
      "Builds cultural awareness",
    ],
    whoFor:
      "Hindi classes suit school students who want support with the subject, and adults who want to learn to speak or write Hindi.",
    faqs: [
      {
        q: "Who teaches hindi classes in Mannivakkam?",
        a: "Mrs. Revathy Yuvaraj, with a B.A. in Hindi, a B.A. in English Literature and 10+ years of teaching experience.",
      },
      {
        q: "Do you cover both spoken and written Hindi?",
        a: "Yes. Classes cover reading, writing and speaking.",
      },
      {
        q: "Can complete beginners join?",
        a: "Yes. Beginners start with the Devanagari script and simple words.",
      },
      {
        q: "Are there adult batches?",
        a: "Yes. Adults are welcome. Call us for current batch options.",
      },
    ],
    reference: { label: "Hindi on Wikipedia", url: "https://en.wikipedia.org/wiki/Hindi" },
    related: ["spoken-english-classes-in-mannivakkam", "handwriting-classes-in-mannivakkam", "abacus-classes-in-mannivakkam"],
  },
  {
    slug: "music-classes-in-mannivakkam",
    name: "Music: Keyboard, Guitar & Drums",
    icon: "🎹",
    tag: "Music",
    cardTitle: "Music: Keyboard / Guitar / Drums",
    cardText: "Music training on keyboard, guitar and drums with professional instructors.",
    facultyId: "karthick",
    images: ["academy-building.webp", "community-event.webp", "award-ceremony.webp"],
    imageAlts: [
      "Dragon Ryu Arts Academy, venue for music classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Student receiving trophies at an award ceremony",
    ],
    seo: {
      metaTitle: "Music Classes in Mannivakkam | Best 2026",
      metaDescription:
        "Music classes in Mannivakkam for keyboard, guitar and drums. Learn from a Trinity-certified composer with 10 years of teaching. Kids and adults. Enrol now.",
      focusKeyword: "music classes in mannivakkam",
      secondaryKeywords: ["keyboard classes chennai", "guitar classes for kids", "drums classes", "trinity music exams"],
    },
    h1: "Music Classes in Mannivakkam",
    intro: [
      "Our music classes in Mannivakkam cover keyboard, guitar and drums. They are taught by Master Karthick, a composer with 10 years of teaching and 7 years of studio experience.",
      "He holds London Trinity certification and has trained in keyboard, guitar, violin, drums, rhythm pad and flute.",
    ],
    takeaways: [
      "Keyboard, guitar and drums under one roof",
      "Trinity-certified instructor and composer",
      "10 years of teaching, 7 years in the studio",
      "Theory and practical playing together",
      "Classes for children and adults",
    ],
    whatIs: {
      heading: "Which instrument should I choose?",
      text: [
        "Keyboard is a great first instrument because it teaches melody, harmony and reading music together. Guitar suits students who want to accompany songs. Drums build rhythm and coordination.",
        "Not sure? Visit us and try each instrument before you decide.",
      ],
    },
    learn: [
      "Reading music and basic theory",
      "Scales, chords and rhythm",
      "Popular and devotional songs",
      "Playing with backing tracks",
      "Preparation for graded music exams",
    ],
    benefits: [
      "Improves memory and concentration",
      "Builds coordination and timing",
      "A creative outlet for stress",
      "Performance confidence",
      "A lifelong skill and hobby",
    ],
    whoFor:
      "Music classes suit children, teenagers and adults. Beginners start with basics on their chosen instrument and progress at their own pace.",
    faqs: [
      {
        q: "Which instruments do the music classes in Mannivakkam cover?",
        a: "Keyboard, guitar and drums. Our instructor has also trained in violin, rhythm pad and flute.",
      },
      {
        q: "Do I need my own instrument?",
        a: "Having one at home helps with practice. Ask us for advice before buying.",
      },
      {
        q: "Do you prepare students for music exams?",
        a: "Our instructor holds London Trinity certification. Ask us about exam preparation for your level.",
      },
      {
        q: "Do you teach singing too?",
        a: "Yes. We run separate vocal classes for singing.",
      },
    ],
    reference: { label: "Trinity College London", url: "https://www.trinitycollege.com/qualifications/music" },
    related: ["singing-classes-in-mannivakkam", "western-dance-classes-in-mannivakkam", "bharatanatyam-classes-in-mannivakkam"],
  },
  {
    slug: "singing-classes-in-mannivakkam",
    name: "Vocal",
    icon: "🎤",
    tag: "Music",
    cardTitle: "Vocal",
    cardText: "Voice training and vocal classes to develop singing skills and confidence.",
    images: ["academy-building.webp", "community-event.webp", "award-ceremony.webp"],
    imageAlts: [
      "Dragon Ryu Arts Academy, venue for singing classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Student receiving trophies at an award ceremony",
    ],
    seo: {
      metaTitle: "Singing Classes in Mannivakkam | Best 2026",
      metaDescription:
        "Singing classes in Mannivakkam for children and adults. Voice training, breathing, pitch and stage confidence in a friendly, supportive class. Book a seat.",
      focusKeyword: "singing classes in mannivakkam",
      secondaryKeywords: ["vocal classes chennai", "voice training for kids", "music academy mannivakkam", "learn to sing"],
    },
    h1: "Singing Classes in Mannivakkam",
    intro: [
      "Our singing classes in Mannivakkam help students find their voice. Vocal training covers breathing, pitch, rhythm and expression.",
      "Students build the confidence to sing at school, at home and on stage at academy events.",
    ],
    takeaways: [
      "Breathing, pitch and voice control",
      "Songs chosen to suit each student",
      "Stage confidence through performances",
      "Pairs well with keyboard and guitar lessons",
      "Classes for children and adults",
    ],
    whatIs: {
      heading: "What is vocal training?",
      text: [
        "Vocal training teaches you to use your voice well. It covers breathing, posture, pitch, tone and how to sing without strain.",
        "Regular practice helps students sing in tune and with more expression.",
      ],
    },
    learn: [
      "Breathing and posture for singing",
      "Warm-ups and voice exercises",
      "Pitch and rhythm training",
      "Learning and performing songs",
      "Microphone and stage basics",
    ],
    benefits: [
      "Clearer, stronger voice",
      "Better breathing and posture",
      "Improved listening skills",
      "Stage and speaking confidence",
      "A joyful creative hobby",
    ],
    whoFor:
      "Singing classes suit children, teenagers and adults of every level, from first-time singers to students preparing for performances.",
    faqs: [
      {
        q: "Who can join singing classes in Mannivakkam?",
        a: "Children, teenagers and adults. No experience is needed.",
      },
      {
        q: "Can I combine singing with an instrument?",
        a: "Yes. Many students pair vocal lessons with keyboard or guitar.",
      },
      {
        q: "Will students perform?",
        a: "Students who are ready can perform at academy events.",
      },
      {
        q: "How do I book a trial?",
        a: "Fill in the enquiry form or call 98844 48277.",
      },
    ],
    reference: { label: "Singing on Wikipedia", url: "https://en.wikipedia.org/wiki/Singing" },
    related: ["music-classes-in-mannivakkam", "bharatanatyam-classes-in-mannivakkam", "western-dance-classes-in-mannivakkam"],
  },
  {
    slug: "handwriting-classes-in-mannivakkam",
    name: "Handwriting",
    icon: "✍️",
    tag: "Academic",
    cardTitle: "Handwriting",
    cardText: "Structured handwriting improvement for neat, legible writing skills.",
    facultyId: "halimathul",
    images: ["academy-building.webp", "community-event.webp", "award-ceremony.webp"],
    imageAlts: [
      "Dragon Ryu Arts Academy, venue for handwriting classes in Mannivakkam",
      "Children at a community event organised by the academy",
      "Student receiving trophies at an award ceremony",
    ],
    seo: {
      metaTitle: "Handwriting Classes in Mannivakkam: Best 2026",
      metaDescription:
        "Handwriting classes in Mannivakkam for neat, fast, legible writing. A B.Ed. teacher skilled in English, Tamil, Arabic and calligraphy guides each student.",
      focusKeyword: "handwriting classes in mannivakkam",
      secondaryKeywords: ["handwriting improvement for kids", "calligraphy classes chennai", "cursive writing classes", "neat handwriting"],
    },
    h1: "Handwriting Classes in Mannivakkam",
    intro: [
      "Our handwriting classes in Mannivakkam help children write neatly, legibly and at a good speed.",
      "Classes are taught by Mrs. M. Halimathul Sahdiya, B.Ed. and B.A. in English, who specialises in English, Tamil, Arabic and calligraphy.",
    ],
    takeaways: [
      "Neat, legible and faster writing",
      "Correct pencil grip and posture",
      "Print and cursive styles",
      "Calligraphy for older students",
      "B.Ed. qualified teacher",
    ],
    whatIs: {
      heading: "Why does handwriting matter?",
      text: [
        "Clear handwriting helps children in every subject. Teachers can read their answers easily, and students write faster in exams.",
        "Good habits like correct grip, spacing and letter formation are easiest to build early.",
      ],
    },
    learn: [
      "Correct pencil grip and sitting posture",
      "Letter formation and sizing",
      "Spacing and alignment",
      "Cursive writing",
      "Calligraphy basics",
    ],
    benefits: [
      "Neater school work",
      "Faster writing in exams",
      "Better fine motor control",
      "More pride in their work",
      "Calm, focused practice habits",
    ],
    whoFor:
      "Handwriting classes are mainly for school children. Older students interested in calligraphy are welcome to ask about suitable batches.",
    faqs: [
      {
        q: "Who teaches handwriting classes in Mannivakkam?",
        a: "Mrs. M. Halimathul Sahdiya, B.Ed. and B.A. in English, specialising in English, Tamil, Arabic and calligraphy.",
      },
      {
        q: "Do you teach cursive writing?",
        a: "Yes. Students learn both print and cursive styles.",
      },
      {
        q: "Is calligraphy included?",
        a: "Calligraphy is introduced for students who are ready for it.",
      },
      {
        q: "How soon will I see improvement?",
        a: "It depends on regular practice. Most parents notice neater work as habits build.",
      },
    ],
    reference: { label: "Penmanship on Wikipedia", url: "https://en.wikipedia.org/wiki/Penmanship" },
    related: ["spoken-english-classes-in-mannivakkam", "abacus-classes-in-mannivakkam", "drawing-classes-in-mannivakkam"],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

// Options for the enquiry form, matching the original site's dropdown.
export const enquiryCourseOptions = [
  "Karate",
  "Silambam",
  "Dance / Bharatham / Zumba",
  "Drawing",
  "Abacus",
  "English Spoken / Phonics",
  "Hindi Spoken / Written",
  "Yoga",
  "Keyboard / Drums / Vocal",
  "Handwriting",
  "Summer Camp",
] as const;
