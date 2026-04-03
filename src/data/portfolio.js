export const PERSON = {
  name: "Oliver Kent Santos",
  firstName: "Oliver",
  title: "Full Stack Developer",
  tagline: "I build things for the web — fast, clean, and with care.",
  bio: "Full Stack Developer based in Spain, passionate about crafting digital experiences that are both functional and beautiful. I specialise in React, modern JavaScript, and building products from idea to deployment.",
  email: "oliverkentsantos@outlook.com",
  github: "https://github.com/xxVertex",
  githubUser: "xxVertex",
  location: "Spain",
  available: true,
};

export const SKILLS = [
  { name: "React",       score: 90, category: "Frontend" },
  { name: "JavaScript",  score: 88, category: "Frontend" },
  { name: "CSS / Design",score: 85, category: "Frontend" },
  { name: "HTML",        score: 92, category: "Frontend" },
  { name: "Node.js",     score: 72, category: "Backend" },
  { name: "Git",         score: 80, category: "Tools" },
  { name: "Vite",        score: 78, category: "Tools" },
  { name: "REST APIs",   score: 75, category: "Backend" },
];

export const RADAR_DATA = [
  { subject: "React",     score: 90, fullMark: 100 },
  { subject: "JS/TS",     score: 88, fullMark: 100 },
  { subject: "CSS",       score: 85, fullMark: 100 },
  { subject: "Node.js",   score: 72, fullMark: 100 },
  { subject: "APIs",      score: 75, fullMark: 100 },
  { subject: "Git/DevOps",score: 80, fullMark: 100 },
];

export const PROJECTS = [
  {
    id: 1,
    title: "Spendr",
    subtitle: "Expense Tracker",
    description: "A full-featured personal finance tracker with category budgets, real-time alerts, spending charts, and localStorage persistence.",
    tags: ["React", "Recharts", "CSS"],
    category: "App",
    color: "#b8ff57",
    emoji: "💸",
    github: "https://github.com/xxVertex/expense-tracker",
    featured: true,
  },
  {
    id: 2,
    title: "Skies",
    subtitle: "Weather App",
    description: "Atmospheric weather app powered by Open-Meteo. Auto-detects location, city search with autocomplete, 24h hourly and 7-day forecast. Dynamic background themes shift with the weather.",
    tags: ["React", "Open-Meteo API", "CSS"],
    category: "App",
    color: "#57b8ff",
    emoji: "☁️",
    github: "https://github.com/xxVertex/weather-app",
    liveUrl: "https://weather-app-sd7p.onrender.com",
    featured: true,
  },
  {
    id: 3,
    title: "Pixel Runner",
    subtitle: "Infinite Runner Game",
    description: "A retro pixel art infinite runner built on HTML5 Canvas — no game engine. Double jump, sliding, 3 power-ups, coins, parallax backgrounds, CRT scanlines, and a top-10 leaderboard.",
    tags: ["React", "Canvas API", "Game Dev"],
    category: "Game",
    color: "#e94560",
    emoji: "🕹️",
    github: "https://github.com/xxVertex/pixel-runner",
    liveUrl: "https://pixel-runner-pcd9.onrender.com/",
    featured: true,
  },
  {
    id: 4,
    title: "World Forge",
    subtitle: "Procedural Map Generator",
    description: "Pixel art RPG-style procedural world map generator using layered Perlin noise + fBm. Generates biomes, rivers, lakes, cities and towns — all seeded and exportable as PNG.",
    tags: ["React", "Canvas API", "Algorithms"],
    category: "Creative",
    color: "#c8a030",
    emoji: "🗺️",
    github: "https://github.com/xxVertex/world-forge",
    liveUrl: "https://world-forge-pcd9.onrender.com/",
    featured: true,
  },
  {
    id: 5,
    title: "Animal Detective",
    subtitle: "Kids Guessing Game",
    description: "AI-powered kids game where players guess a mystery animal from progressive clues. Features smart guess checking with typo tolerance, confetti on wins, hint system, streak tracking, and a warm bubbly UI designed for young children.",
    tags: ["HTML", "CSS", "Claude AI", "Vanilla JS"],
    category: "Game",
    color: "#a855f7",
    emoji: "🔍",
    github: "https://github.com/xxVertex/animal-detective",
    liveUrl: "https://animal-detective-pcd9.onrender.com/",
    featured: false,
  },
];

export const EXPERIENCE = [
  {
    role: "Full Stack Developer",
    company: "Freelance",
    period: "2023 — Present",
    description: "Building web apps and tools for clients — from design to deployment. Focus on React frontends and Node.js backends.",
  },
  {
    role: "Frontend Developer",
    company: "Personal Projects",
    period: "2022 — 2023",
    description: "Deep-dived into modern React, animation, Canvas APIs, and generative algorithms. Built games, tools, and creative experiments.",
  },
];

export const EDUCATION = [
  {
    degree: "Self-taught Developer",
    school: "Online & Project-based Learning",
    period: "2021 — Present",
    description: "MDN, The Odin Project, Frontend Mentor, and building real things.",
  },
];
