import type { ChapterId } from "../lib/world";

/** Real, verified image set (generated art direction for each world). */
export const IMG = {
  portrait:
    "https://image.qwenlm.ai/generated-images/a973a502-0600-425e-880f-499466b70100/_result.png",
  hinomori:
    "https://image.qwenlm.ai/generated-images/303c62fb-6438-48d3-a741-f9945920d570/_result.png",
  japandays:
    "https://image.qwenlm.ai/generated-images/7fe3f187-7a89-4b68-b087-e458f33382f2/_result.png",
  seconds:
    "https://image.qwenlm.ai/generated-images/2908202e-f1fb-4c64-bc40-9242450d94d8/_result.png",
  city: "https://image.qwenlm.ai/generated-images/1cb68be8-3222-47f8-be3b-41c801771fbf/_result.png",
  lastinternet:
    "https://image.qwenlm.ai/generated-images/8d37d513-8d6e-45a9-998b-04b9004d86c1/_result.png",
  koppler:
    "https://image.qwenlm.ai/generated-images/001810a3-bd62-46cb-ba80-646bf90412f6/_result.png",
  villa:
    "https://image.qwenlm.ai/generated-images/7bb05c2c-0e25-4d3d-935d-1075f513936e/_result.png",
};

export interface ChapterTheme {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
}

export interface Chapter {
  id: ChapterId;
  num: string;
  name: string;
  line: string; // the story beat label
  theme: ChapterTheme;
  /** height in vh of the cinematic (sticky) section — desktop */
  vh: number;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "hero",
    num: "00",
    name: "ME",
    line: "YOU MEET THE PERSON",
    theme: { bg: "#14120E", ink: "#F3EFE7", muted: "#97907F", accent: "#E4573D" },
    vh: 180,
  },
  {
    id: "experimental",
    num: "01",
    name: "EXPERIMENTAL",
    line: "WHAT I EXPERIMENT WITH",
    theme: { bg: "#EFEAE0", ink: "#1B1812", muted: "#6E675A", accent: "#5E8A6F" },
    vh: 270,
  },
  {
    id: "digital",
    num: "02",
    name: "DIGITAL WORLDS",
    line: "THE WORLDS I BUILD",
    theme: { bg: "#0E0E12", ink: "#E9E7E2", muted: "#7A7A88", accent: "#5C8AFF" },
    vh: 320,
  },
  {
    id: "brands",
    num: "03",
    name: "BRANDS",
    line: "THE BRANDS I SHAPE",
    theme: { bg: "#F1E9DC", ink: "#221B12", muted: "#8A7B66", accent: "#C58A3B" },
    vh: 215,
  },
  {
    id: "architecture",
    num: "04",
    name: "ARCHITECTURE",
    line: "THE SPACES I DESIGN",
    theme: { bg: "#ECE6DA", ink: "#1E1A13", muted: "#7D7466", accent: "#B99A52" },
    vh: 205,
  },
  {
    id: "showroom",
    num: "05",
    name: "SHOWROOM",
    line: "THE PRODUCTS I PRESENT",
    theme: { bg: "#F4F1EA", ink: "#17150F", muted: "#8B857A", accent: "#7C93A8" },
    vh: 250,
  },
  {
    id: "work",
    num: "06",
    name: "ALL WORK",
    line: "THE WORK, INDEXED",
    theme: { bg: "#F3EFE7", ink: "#17150F", muted: "#6E675A", accent: "#E4573D" },
    vh: 0,
  },
  {
    id: "finale",
    num: "07",
    name: "ME, AGAIN",
    line: "BACK TO THE PERSON",
    theme: { bg: "#14120E", ink: "#F3EFE7", muted: "#97907F", accent: "#E4573D" },
    vh: 0,
  },
];

export interface Project {
  id: string;
  num: string;
  title: string;
  jp?: string;
  url: string;
  chapter: Exclude<ChapterId, "hero" | "work" | "finale">;
  category: string;
  format: string;
  description: string;
  story: string;
  tech: string[];
  image: string;
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    id: "hinomori",
    num: "01",
    title: "HINOMORI",
    jp: "日ノ森 — A Day in the Valley",
    url: "https://japanthemeday.vercel.app/",
    chapter: "experimental",
    category: "3D / Experimental",
    format: "Scroll-driven WebGL story with sound",
    description:
      "One spring morning, told in a single scroll. A quiet village below the mountains that you walk through — the morning even rewinds when you scroll back up.",
    story:
      "Hinomori is a village that exists only as long as you keep scrolling. The walk begins at the valley entrance on a spring morning and unfolds scene by scene — sound included, once you allow it. Scroll up, and the morning rewinds. It is an experiment in pacing: how far a single gesture — the scroll — can carry a whole day.",
    tech: ["Three.js", "Scroll narrative", "Web Audio"],
    image: IMG.hinomori,
    accent: "#5E8A6F",
  },
  {
    id: "japandays",
    num: "02",
    title: "JAPAN THEMED DAYS",
    jp: "日ノ森の続き — the village continues",
    url: "https://japanthemedays.vercel.app/",
    chapter: "experimental",
    category: "3D / Experimental",
    format: "Interactive WebGL world",
    description:
      "The companion piece to Hinomori — more days under the same sky. Lanterns, rain-washed stone and a torii waiting in the fog.",
    story:
      "Where Hinomori tells one morning, this piece stretches the valley across days. It is the same quiet language — soft geometry, drifting atmosphere, unhurried camera — pushed into dusk and rain. Two experiments, one obsession: making a browser tab feel like a place you walked through.",
    tech: ["Three.js", "WebGL", "Atmosphere"],
    image: IMG.japandays,
    accent: "#5E8A6F",
  },
  {
    id: "seconds",
    num: "03",
    title: "THE WORLD BETWEEN SECONDS",
    url: "https://worldbetweenseconds.vercel.app/",
    chapter: "digital",
    category: "Digital World",
    format: "Interactive web world",
    description:
      "You have 86,400 seconds today. You will never notice the one that is missing. A city that holds its breath between ticks of the clock.",
    story:
      "A digital world built around a single uncanny idea: somewhere in your day, one second goes missing — and this is the place it goes. Suspended rain, a counting clock, streets paused mid-signal. The piece treats time the way a level designer treats space: something you can walk through.",
    tech: ["WebGL", "Interactive fiction", "Motion"],
    image: IMG.seconds,
    accent: "#5C8AFF",
  },
  {
    id: "cityknows",
    num: "04",
    title: "THE CITY THAT KNOWS YOU",
    url: "https://citythatknowsyou.vercel.app/",
    chapter: "digital",
    category: "Digital World",
    format: "Interactive web world",
    description:
      "A city that watches back. Screens, streets and memory — an urban world that knows you passed through.",
    story:
      "An experiment in ambient surveillance as narrative. The city is not hostile; it simply remembers. Walls of pale screens, a platform, a figure standing still while the infrastructure quietly takes note. It asks what a place would feel like if it had been paying attention to you all along.",
    tech: ["WebGL", "Interactive fiction", "Light"],
    image: IMG.city,
    accent: "#5C8AFF",
  },
  {
    id: "lastinternet",
    num: "05",
    title: "THE LAST INTERNET",
    url: "https://the-last-internet.vercel.app/",
    chapter: "digital",
    category: "Digital World",
    format: "Interactive web world",
    description:
      "A quiet monument to a network at the end of its time — servers, sand, and the last blinking lights.",
    story:
      "What survives the internet? Probably a building, alone, still running. The Last Internet is a pilgrimage to that building: dead cables, warm dust, LEDs that refuse to stop. A melancholy world built to make infrastructure feel like a ruin you can be nostalgic about.",
    tech: ["WebGL", "Interactive fiction", "Atmosphere"],
    image: IMG.lastinternet,
    accent: "#5C8AFF",
  },
  {
    id: "koppler",
    num: "06",
    title: "KOPPLER COFFEE",
    url: "https://koppler-coffee.vercel.app/",
    chapter: "brands",
    category: "Brand / Hospitality",
    format: "Brand experience site",
    description:
      "A complete brand world for a specialty coffee house — identity, packaging mood and a warm digital counter.",
    story:
      "Koppler is the commercial end of the spectrum: everything the experimental worlds do for feeling, done for a brand. Warm light, tactile materials, a menu you can almost smell. The job was restraint — making a coffee house feel premium without shouting, and making the web page feel like the counter.",
    tech: ["Brand identity", "Art direction", "Web build"],
    image: IMG.koppler,
    accent: "#C58A3B",
  },
  {
    id: "cempaka",
    num: "07",
    title: "CEMPAKA VILLA BALI",
    url: "https://cempakavillabali.vercel.app/",
    chapter: "architecture",
    category: "Architecture",
    format: "Architectural presentation",
    description:
      "A quiet architectural walkthrough — concrete, teak, water and Bali daylight.",
    story:
      "An architecture site that behaves like an architecture film: approach, exterior, courtyard, pool, detail. The camera does what a client walkthrough does — it moves you through the space at walking pace, lets the shadows do the selling, and never gets in the way of the building.",
    tech: ["Spatial sequencing", "Art direction", "Web build"],
    image: IMG.villa,
    accent: "#B99A52",
  },
];

export const EMAIL = "pratham.khinvsara20@vit.edu";
export const LEGACY_PORTFOLIO = "https://pratham-portfolio-ralm.vercel.app/";

/** Real capability figures and stacks from Pratham's own portfolio. */
export const CAPABILITIES = [
  { label: "Frontend Development", value: 93 },
  { label: "Backend Engineering", value: 88 },
  { label: "UI / Motion Design", value: 87 },
  { label: "System Architecture", value: 82 },
  { label: "DevOps / Cloud", value: 76 },
];

export const STACKS = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Three.js", "GSAP", "Tailwind", "Framer Motion", "Vue.js"] },
  { group: "Backend", items: ["Node.js", "Express", "Python", "FastAPI", "GraphQL", "PostgreSQL", "MongoDB", "Redis"] },
  { group: "Infrastructure", items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Vercel", "Linux", "Git"] },
];
