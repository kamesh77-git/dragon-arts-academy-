export const WHATSAPP_NUMBER = "919884448277";
export const MAPS_URL = "https://maps.app.goo.gl/FexJw4eyxXr1nZsJ8?g_st=aw";

export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#faculty-excellence", label: "Faculty Excellence", className: "nav__link--faculty" },
  { href: "#courses", label: "Courses" },
  { href: "#gallery", label: "Gallery" },
  { href: "#admissions", label: "Enroll Now", className: "nav__link--cta" },
  { href: "#contact", label: "Contact" },
];

export const faculty = [
  { icon: "🥋", name: "Renshi A. PARTHIBAN", tag: "Handling — Karate", text: "Grand Master in Karate. He is a 5th Dan Black Belt and serves as the Chief Examiner & Technical Director and Style Chief of Dragon Ryu International School of Karate. With 17 years of experience in martial arts instruction and leadership, he is committed to promoting discipline, self-confidence, and technical excellence while training students to achieve the highest standards in karate." },
  { icon: "🧘", name: "Kalaimamani B. Rajagopal", tag: "Handling — Yoga", text: "Yoga Aacharya with over 30 years of experience, external yoga examiner for Bharathidasan University, and mentor behind 200+ NSS events and multiple world-record achievers." },
  { icon: "🎨", name: "Mrs. Lalitha", tag: "Handling — Drawing", text: "BBA, Diploma in Fine Arts specialist in freehand drawing, model drawing, Tanjore painting, watercolor, color pencil art, and pencil sketching." },
  { icon: "📚", name: "Mrs. Leelavathi", tag: "Handling — Spoken English / Phonics", text: "Dedicated educator with 7 years of experience, B.A. in English and D.P.Ed., passionate about building confidence and communication through spoken English and phonics." },
  { icon: "🇮🇳", name: "Mrs. Revathy Yuvaraj", tag: "Handling — Hindi", text: "Experienced Hindi instructor with 10+ years of teaching experience, holding B.A. in English Literature and B.A. in Hindi with a strong focus on reading, writing, and communication." },
  { icon: "🎹", name: "Master Karthick", tag: "Handling — Music (Keyboard, Guitar, Drums)", text: "Accomplished music instructor and composer with 10 years of teaching experience and 7 years of studio experience, including London Trinity certification and training in keyboard, guitar, violin, drums, rhythm pad, and flute." },
  { icon: "✍️", name: "Mrs. M. Halimathul Sahdiya", tag: "Handling — Handwriting", text: "Dedicated educator with B.Ed. and B.A. in English, specializing in English, Tamil, Arabic, and calligraphy with a focus on student development and confidence-building." },
  { icon: "💃", name: "Mrs. Jeyalakshmi Sivakumar", tag: "Handling — Bharatham", text: "Classical Bharatanatyam teacher with 8 years of instruction experience, M.F.A. in Bharatanatyam, and prestigious titles including Natyamani, Natya Tharagai, Natya Samrayagi, and Kalaivalarmani." },
  { icon: "🧮", name: "Mrs. P. Sugapriya Mathankumar", tag: "Handling — Abacus", text: "Experienced Abacus and Vedic Mathematics instructor with MBA in Finance, B.Com, Master Abacus diploma, and Advanced Vedic Mathematics certification focused on mental arithmetic and confidence-building." },
  { icon: "🎭", name: "Master RICO (Viknesh)", tag: "Handling — Western Dance", text: "Talented choreographer, stage director, and creative artist with expertise in dance, fashion choreography, show direction, video editing, scriptwriting, and acting. Featured on Vijay TV, Zee Tamil, and Raj TV." },
];

export const courses = [
  { icon: "🥋", name: "Karate", tag: "Martial Arts", text: "Professional martial arts training building discipline, strength and confidence. All ages." },
  { icon: "🪄", name: "Silambam", tag: "Traditional Martial Arts", label: "Traditional", featured: true, text: "Professional Silambam staff training — ancient Tamil martial art with modern coaching methods." },
  { icon: "💃", name: "Western Dance", tag: "Performing Arts", text: "Professional western dance training with energetic and confidence-building routines." },
  { icon: "🎨", name: "Drawing Classes", tag: "Creative Arts", text: "Creative drawing and art classes with professional guidance for budding artists." },
  { icon: "🧮", name: "Abacus Coaching", tag: "Brain Development", text: "Professional abacus coaching — from memorizing to mastering mathematical concepts." },
  { icon: "📚", name: "English Spoken / Phonics", tag: "Languages", text: "Professional spoken English and phonics classes for confident communication." },
  { icon: "🇮🇳", name: "Hindi Spoken / Written", tag: "Languages", text: "Professional Hindi classes for all ages — spoken and written proficiency." },
  { icon: "🧘", name: "Yoga", tag: "Wellness", text: "Mind-body wellness through guided yoga sessions for flexibility and focus." },
  { icon: "🎹", name: "Music: Keyboard / Guitar / Drums", tag: "Music", text: "Music training on keyboard, guitar and drums with professional instructors." },
  { icon: "🎤", name: "Vocal", tag: "Music", text: "Voice training and vocal classes to develop singing skills and confidence." },
  { icon: "✍️", name: "Handwriting", tag: "Academic", text: "Structured handwriting improvement for neat, legible writing skills." },
  { icon: "🌐", name: "Languages", tag: "Languages", text: "Multi-language programs to build strong communication foundations." },
];

export const galleryItems = [
  { src: "academy-building", size: "wide", caption: "Dragon Ryu Arts Academy — Mannivakkam campus", alt: "Dragon Ryu Arts Academy building at Mannivakkam" },
  { src: "bharatanatyam", size: "wide", caption: "Bharatanatyam performance at Dragon Ryu Arts Academy", alt: "Bharatanatyam dance performance" },
  { src: "karate-outdoor", caption: "Outdoor karate training with students", alt: "Outdoor karate group photo with Indian flag" },
  { src: "karate-class", caption: "Karate class in session", alt: "Large karate class practicing on turf" },
  { src: "belt-grading", caption: "Karate colour belt grading ceremony", alt: "Students holding certificates at belt grading" },
  { src: "community-event", caption: "Community event at the academy", alt: "Children at a community event" },
  { src: "yoga-world-record", size: "wide", caption: "Yoga World Record — Drug Free Tamil Nadu Awareness, UBAC recognition", alt: "Dragon Ryu Arts Academy students at Yoga World Record Drug Free Tamil Nadu event" },
  { src: "world-record-news", size: "tall", caption: "Nova World Record — 30 Dragon Ryu Arts Academy students participated", alt: "TT News coverage of Nova World Record event" },
  { src: "award-ceremony", caption: "National level award ceremony — prize distribution", alt: "Student receiving bicycle and trophies at award ceremony" },
  { src: "newspaper-coverage", size: "wide", caption: "Malai Murasu newspaper coverage — Republic Day world record event", alt: "Newspaper coverage of Dragon Ryu Arts Academy world record" },
];

export const courseOptions = [
  ["karate", "Karate"], ["silambam", "Silambam"], ["dance", "Dance / Bharatham / Zumba"],
  ["drawing", "Drawing"], ["abacus", "Abacus"], ["english", "English Spoken / Phonics"],
  ["hindi", "Hindi Spoken / Written"], ["yoga", "Yoga"], ["music", "Keyboard / Drums / Vocal"],
  ["handwriting", "Handwriting"], ["summer-camp", "Summer Camp"],
];

export const SITE_URL = "https://www.dragonryuartsacademy.com";
export const SITE_NAME = "Dragon Ryu Arts Academy";
export const SITE_DESCRIPTION =
  "Dragon Ryu Arts Academy in Mannivakkam, Chennai — karate, Silambam, yoga, Bharatanatyam, western dance, drawing, abacus, spoken English, Hindi, music and more for all ages. No admission fees.";
export const GOOGLE_PROFILE_URL = "https://share.google/sDfuQ0oFzatWRdSjL";
export const PHONES = ["+919884448277", "+919884448377"];
export const keywords = [
  "Dragon Ryu Arts Academy", "karate classes Mannivakkam", "karate classes Chennai",
  "Silambam classes Chennai", "yoga classes Mannivakkam", "Bharatanatyam classes Mannivakkam",
  "western dance classes Chennai", "drawing classes Mannivakkam", "abacus classes Mannivakkam",
  "spoken English classes", "Hindi classes", "keyboard guitar drums classes",
  "martial arts academy Chennai", "karate Tambaram", "karate Vandalur", "karate Adhanur",
  "yoga world record", "black belt karate training",
];
