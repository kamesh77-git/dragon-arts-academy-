import type { ReactNode } from "react";

// "Orbit of Arts": animated SVG hero. The academy emblem sits at the
// centre; 14 art badges ride two counter-rotating orbits, each with its own
// micro-animation, while a spotlight cycles through them in order and the
// current art's name appears under the emblem. Pure SVG + CSS (pages.css,
// "Hero arts" section), no JS. Motion stops for prefers-reduced-motion.

const C = 300; // viewBox centre
const SLOT = 2; // seconds each art holds the spotlight

type Category = "martial" | "wellness" | "dance" | "creative" | "academic" | "music";

interface Art {
  name: string;
  cat: Category;
  glyph: ReactNode;
}

// Glyphs are line drawings centred on (0,0), roughly -18..18.
const ARTS: Art[] = [
  {
    name: "Karate",
    cat: "martial",
    glyph: (
      <>
        <circle cx="-7" cy="-13" r="3.2" className="art__fill" />
        <path d="M-7 -9 L-5 3" />
        <path d="M-6 -6 L5 -9" />
        <path d="M-6 -6 L-13 -2" />
        <path d="M-5 3 L-10 15" />
        <path d="M-5 3 L13 -1" className="anim-kick" />
      </>
    ),
  },
  {
    name: "Yoga",
    cat: "wellness",
    glyph: (
      <>
        <circle r="20" className="art__accent anim-breathe" fill="none" strokeWidth="1.2" />
        <circle cx="0" cy="-15" r="3" className="art__fill" />
        <path d="M0 -11 L0 5 M0 5 L0 17 M0 5 L7 9 L1 12" />
        <path d="M0 -9 L-6 -15 L0 -21 L6 -15 L0 -9" />
      </>
    ),
  },
  {
    name: "Bharatanatyam",
    cat: "dance",
    glyph: (
      <g className="anim-sway">
        <circle cx="0" cy="-15" r="3" className="art__fill" />
        <path d="M0 -11 L0 0" />
        <path d="M0 -8 L-8 -8 L-12 -13 M0 -8 L8 -8 L12 -4" />
        <path d="M0 0 L-8 7 L-6 15 M0 0 L8 7 L6 15" />
        <path d="M-4 0 L0 8 L4 0 Z" className="art__accent-fill" />
        <circle cx="-6" cy="15" r="1.4" className="art__accent-fill anim-twinkle" />
        <circle cx="6" cy="15" r="1.4" className="art__accent-fill anim-twinkle anim-twinkle--late" />
      </g>
    ),
  },
  {
    name: "Drawing",
    cat: "creative",
    glyph: (
      <>
        <path d="M-15 10 C-9 0 -3 16 3 6 S12 -4 15 2" className="art__accent anim-draw" strokeWidth="3" />
        <path d="M11 -17 L3 -6" strokeWidth="2.6" />
        <path d="M3 -6 L0 -1" className="art__accent" strokeWidth="4" />
      </>
    ),
  },
  {
    name: "Abacus",
    cat: "academic",
    glyph: (
      <>
        <rect x="-16" y="-13" width="32" height="26" rx="2.5" />
        <path d="M-16 -6 H16 M-16 1 H16 M-16 8 H16" strokeWidth="1.2" />
        <g className="anim-bead"><circle cx="-10" cy="-6" r="2.6" className="art__accent-fill" /><circle cx="-4.5" cy="-6" r="2.6" className="art__accent-fill" /></g>
        <g className="anim-bead anim-bead--2"><circle cx="-10" cy="1" r="2.6" className="art__fill" /></g>
        <g className="anim-bead anim-bead--3"><circle cx="-10" cy="8" r="2.6" className="art__accent-fill" /><circle cx="-4.5" cy="8" r="2.6" className="art__accent-fill" /><circle cx="1" cy="8" r="2.6" className="art__accent-fill" /></g>
      </>
    ),
  },
  {
    name: "Keyboard",
    cat: "music",
    glyph: (
      <>
        <rect x="-17" y="-6" width="34" height="16" rx="2" />
        <path d="M-10.2 -6 V10 M-3.4 -6 V10 M3.4 -6 V10 M10.2 -6 V10" strokeWidth="1.1" />
        <rect x="-12" y="-6" width="3.6" height="8" className="art__fill" stroke="none" />
        <rect x="-5.2" y="-6" width="3.6" height="8" className="art__fill" stroke="none" />
        <rect x="8.4" y="-6" width="3.6" height="8" className="art__fill" stroke="none" />
        <rect x="-3.2" y="2.5" width="6.4" height="7" className="art__accent-fill anim-key" stroke="none" />
        <path d="M8 -12 V-19 L13 -20 V-14" strokeWidth="1.6" className="anim-note" />
        <circle cx="6.6" cy="-12" r="1.8" className="art__fill anim-note" stroke="none" />
      </>
    ),
  },
  {
    name: "Silambam",
    cat: "martial",
    glyph: (
      <>
        <path d="M-13 -11 A17 17 0 0 1 13 -11" className="art__accent anim-arc" strokeWidth="1.4" />
        <path d="M13 11 A17 17 0 0 1 -13 11" className="art__accent anim-arc anim-arc--late" strokeWidth="1.4" />
        <g className="anim-spin">
          <path d="M-17 0 L17 0" strokeWidth="2.8" />
          <circle cx="-17" cy="0" r="1.8" className="art__accent-fill" stroke="none" />
          <circle cx="17" cy="0" r="1.8" className="art__accent-fill" stroke="none" />
        </g>
      </>
    ),
  },
  {
    name: "Western Dance",
    cat: "dance",
    glyph: (
      <g className="anim-jump">
        <circle cx="2" cy="-15" r="3" className="art__fill" />
        <path d="M1 -11 L-1 1" />
        <path d="M0 -8 L-9 -16 M0 -8 L10 -13" />
        <path d="M-1 1 L-11 8 M-1 1 L8 5 L11 12" />
        <path d="M-15 15 h6 M10 16 h5" className="art__accent" strokeWidth="1.4" />
      </g>
    ),
  },
  {
    name: "Spoken English",
    cat: "academic",
    glyph: (
      <g className="anim-pop">
        <path d="M-15 -12 h30 a3 3 0 0 1 3 3 v13 a3 3 0 0 1 -3 3 h-17 l-7 6 v-6 h-6 a3 3 0 0 1 -3 -3 v-13 a3 3 0 0 1 3 -3z" />
        <text x="0" y="1" className="art__text">ABC</text>
      </g>
    ),
  },
  {
    name: "Hindi",
    cat: "academic",
    glyph: (
      <g className="anim-pop anim-pop--late">
        <path d="M15 -12 h-30 a3 3 0 0 0 -3 3 v13 a3 3 0 0 0 3 3 h17 l7 6 v-6 h6 a3 3 0 0 0 3 -3 v-13 a3 3 0 0 0 -3 -3z" />
        <text x="0" y="2.5" className="art__text art__text--deva">अ आ</text>
      </g>
    ),
  },
  {
    name: "Guitar",
    cat: "music",
    glyph: (
      <g transform="rotate(-38)">
        <rect x="-1.4" y="-20" width="2.8" height="15" rx="1" className="art__fill" stroke="none" />
        <circle cx="0" cy="0" r="5.5" />
        <circle cx="0" cy="8" r="7.5" />
        <circle cx="0" cy="3" r="2" className="art__fill" stroke="none" />
        <path d="M-0.7 -19 V12 M0.7 -19 V12" strokeWidth="0.6" className="art__accent anim-strum" />
      </g>
    ),
  },
  {
    name: "Drums",
    cat: "music",
    glyph: (
      <>
        <ellipse cx="0" cy="3" rx="13" ry="4.5" className="art__accent anim-ripple" strokeWidth="1" />
        <ellipse cx="0" cy="3" rx="13" ry="4.5" />
        <path d="M-13 3 V12 M13 3 V12 M-13 12 A13 4.5 0 0 0 13 12" />
        <path d="M-7 5 L-3 13 M7 5 L3 13" strokeWidth="1" />
        <path d="M-15 -14 L-4 0" strokeWidth="2.2" className="anim-stick" />
        <path d="M15 -14 L4 0" strokeWidth="2.2" className="anim-stick anim-stick--right" />
      </>
    ),
  },
  {
    name: "Vocal",
    cat: "music",
    glyph: (
      <>
        <rect x="-8" y="-16" width="8" height="13" rx="4" className="art__fill" stroke="none" />
        <path d="M-11 -7 a7 7 0 0 0 14 0 M-4 0 V8 M-9 8 H1" />
        <path d="M6 -14 a8 8 0 0 1 0 11" className="art__accent anim-wave" strokeWidth="1.8" />
        <path d="M10 -17 a12 12 0 0 1 0 17" className="art__accent anim-wave anim-wave--2" strokeWidth="1.8" />
        <path d="M14 -20 a16 16 0 0 1 0 23" className="art__accent anim-wave anim-wave--3" strokeWidth="1.8" />
      </>
    ),
  },
  {
    name: "Handwriting",
    cat: "academic",
    glyph: (
      <>
        <path d="M-17 11 c3 -8 6 -8 6 0 s3 -8 6 0 s3 -8 6 0 s3 -6 6 -2" className="art__accent anim-draw anim-draw--slow" strokeWidth="2.2" />
        <path d="M15 -17 L5 -5" strokeWidth="3" />
        <path d="M5 -5 L3 -1 L7 -3 Z" className="art__fill" />
      </>
    ),
  },
];

const INNER = { radius: 150, start: -90, names: ["Karate", "Yoga", "Bharatanatyam", "Drawing", "Abacus", "Keyboard"] };
const OUTER = { radius: 238, start: -67.5, names: ["Silambam", "Western Dance", "Spoken English", "Hindi", "Guitar", "Drums", "Vocal", "Handwriting"] };
const PERIOD = ARTS.length * SLOT;

function Badge({ art, index }: { art: Art; index: number }) {
  // Negative delay so every art is already "in phase" on first paint.
  const delay = `${index * SLOT - PERIOD}s`;
  return (
    <g className="art__upright">
      <g className={`art art--${art.cat}`} style={{ animationDelay: delay }}>
        <circle r="38" className="art__glow" style={{ animationDelay: delay }} />
        <circle r="31" className="art__disc" />
        <g className="art__glyph">{art.glyph}</g>
        <title>{art.name}</title>
      </g>
    </g>
  );
}

function Ring({ ring, className }: { ring: typeof INNER; className: string }) {
  const step = 360 / ring.names.length;
  return (
    <g className={className}>
      {ring.names.map((name, i) => {
        const a = ((ring.start + i * step) * Math.PI) / 180;
        const x = C + ring.radius * Math.cos(a);
        const y = C + ring.radius * Math.sin(a);
        const index = ARTS.findIndex((art) => art.name === name);
        return (
          <g key={name}>
            <line x1={C} y1={C} x2={x} y2={y} className="hero-arts__spoke" />
            <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
              <Badge art={ARTS[index]} index={index} />
            </g>
          </g>
        );
      })}
      <circle cx={C} cy={C - ring.radius} r="4" className="hero-arts__comet" />
    </g>
  );
}

export default function HeroArts() {
  const label = `Dragon Ryu Arts Academy: ${ARTS.map((a) => a.name).join(", ")} and more.`;
  return (
    <div className="hero-arts" id="hero-arts">
      <svg viewBox="0 0 600 600" role="img" aria-label={label} className="hero-arts__svg">
        <defs>
          <radialGradient id="ha-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5c518" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#2bbbaa" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#2bbbaa" stopOpacity="0" />
          </radialGradient>
          <clipPath id="ha-logo">
            <circle cx={C} cy={C - 14} r="70" />
          </clipPath>
        </defs>

        {/* backdrop */}
        <circle cx={C} cy={C} r="290" fill="url(#ha-core)" />
        <circle cx={C} cy={C} r={OUTER.radius} className="hero-arts__track" />
        <circle cx={C} cy={C} r={INNER.radius} className="hero-arts__track hero-arts__track--inner" />
        {[
          [70, 90], [520, 120], [560, 420], [90, 500], [300, 22], [470, 560], [30, 280], [440, 40],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.6} className="hero-arts__spark" style={{ animationDelay: `${-i * 0.7}s` }} />
        ))}

        <Ring ring={OUTER} className="hero-arts__ring hero-arts__ring--outer" />
        <Ring ring={INNER} className="hero-arts__ring hero-arts__ring--inner" />

        {/* centre: emblem + halos + cycling label */}
        <circle cx={C} cy={C - 14} r="92" className="hero-arts__halo" />
        <circle cx={C} cy={C - 14} r="83" className="hero-arts__halo hero-arts__halo--2" />
        <circle cx={C} cy={C - 14} r="75" className="hero-arts__core" />
        <image href="/images/logo.webp" x={C - 72} y={C - 86} width="144" height="144" clipPath="url(#ha-logo)" preserveAspectRatio="xMidYMid meet" />
        <g className="hero-arts__labels" aria-hidden="true">
          {ARTS.map((art, i) => (
            <text key={art.name} x={C} y={C + 84} className="hero-arts__label" style={{ animationDelay: `${i * SLOT - PERIOD}s` }}>
              {art.name}
            </text>
          ))}
          <text x={C} y={C + 84} className="hero-arts__label hero-arts__label--static">14+ Arts</text>
        </g>
      </svg>
    </div>
  );
}
