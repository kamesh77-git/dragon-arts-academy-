export interface FacultyMember {
  id: string;
  name: string;
  icon: string;
  bio: string;
  handles: string;
}

export const faculty: FacultyMember[] = [
  {
    id: "parthiban",
    name: "Renshi A. Parthiban",
    icon: "🥋",
    bio: "Grand Master in Karate. He is a 5th Dan Black Belt and serves as the Chief Examiner & Technical Director and Style Chief of Dragon Ryu International School of Karate. With 17 years of experience in martial arts instruction and leadership, he is committed to promoting discipline, self-confidence, and technical excellence while training students to achieve the highest standards in karate.",
    handles: "Karate",
  },
  {
    id: "rajagopal",
    name: "Kalaimamani B. Rajagopal",
    icon: "🧘",
    bio: "Yoga Aacharya with over 30 years of experience, external yoga examiner for Bharathidasan University, and mentor behind 200+ NSS events and multiple world-record achievers.",
    handles: "Yoga",
  },
  {
    id: "lalitha",
    name: "Mrs. Lalitha",
    icon: "🎨",
    bio: "BBA, Diploma in Fine Arts. Specialist in freehand drawing, model drawing, Tanjore painting, watercolor, color pencil art, and pencil sketching.",
    handles: "Drawing",
  },
  {
    id: "leelavathi",
    name: "Mrs. Leelavathi",
    icon: "📚",
    bio: "Dedicated educator with 7 years of experience, B.A. in English and D.P.Ed., passionate about building confidence and communication through spoken English and phonics.",
    handles: "Spoken English / Phonics",
  },
  {
    id: "revathy",
    name: "Mrs. Revathy Yuvaraj",
    icon: "🇮🇳",
    bio: "Experienced Hindi instructor with 10+ years of teaching experience, holding B.A. in English Literature and B.A. in Hindi with a strong focus on reading, writing, and communication.",
    handles: "Hindi",
  },
  {
    id: "karthick",
    name: "Master Karthick",
    icon: "🎹",
    bio: "Accomplished music instructor and composer with 10 years of teaching experience and 7 years of studio experience, including London Trinity certification and training in keyboard, guitar, violin, drums, rhythm pad, and flute.",
    handles: "Music (Keyboard, Guitar, Drums)",
  },
  {
    id: "halimathul",
    name: "Mrs. M. Halimathul Sahdiya",
    icon: "✍️",
    bio: "Dedicated educator with B.Ed. and B.A. in English, specializing in English, Tamil, Arabic, and calligraphy with a focus on student development and confidence-building.",
    handles: "Handwriting",
  },
  {
    id: "jeyalakshmi",
    name: "Mrs. Jeyalakshmi Sivakumar",
    icon: "💃",
    bio: "Classical Bharatanatyam teacher with 8 years of instruction experience, M.F.A. in Bharatanatyam, and prestigious titles including Natyamani, Natya Tharagai, Natya Samrayagi, and Kalaivalarmani.",
    handles: "Bharatanatyam",
  },
  {
    id: "sugapriya",
    name: "Mrs. P. Sugapriya Mathankumar",
    icon: "🧮",
    bio: "Experienced Abacus and Vedic Mathematics instructor with MBA in Finance, B.Com, Master Abacus diploma, and Advanced Vedic Mathematics certification focused on mental arithmetic and confidence-building.",
    handles: "Abacus",
  },
  {
    id: "rico",
    name: "Master RICO (Viknesh)",
    icon: "🎭",
    bio: "Talented choreographer, stage director, and creative artist with expertise in dance, fashion choreography, show direction, video editing, scriptwriting, and acting. Featured on Vijay TV, Zee Tamil, and Raj TV.",
    handles: "Western Dance",
  },
];

export function getFaculty(id: string) {
  return faculty.find((f) => f.id === id);
}
