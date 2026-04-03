# Oliver Kent Santos — Portfolio

Personal developer portfolio built with React, Vite, Framer Motion, and Recharts.

## Pages

- **Home** — Hero with animated title, about section, skills radar chart + bars, featured projects, CTA
- **Projects** — Filterable gallery with animated transitions (Framer Motion `AnimatePresence`)
- **Resume** — Full CV with PDF export (jsPDF + html2canvas)

## Tech Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router v6](https://reactrouter.com/) — client-side routing
- [Framer Motion](https://www.framer.com/motion/) — page transitions + animations
- [Recharts](https://recharts.org/) — skills radar chart
- [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) — PDF export
- [Lucide React](https://lucide.dev/) — icons

## Getting Started

```bash
git clone https://github.com/xxVertex/portfolio-render.git
cd portfolio-render
npm run install:all && npm run build:all
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run install:all && npm run build:all
npm start
```

## Customising

All content (name, bio, projects, skills, experience) lives in one file:

```
src/data/portfolio.js
```

Edit that file to update everything across the site at once.

## Deploy

Push to GitHub → import at [render.com](https://render.com) → done.

## License

MIT
