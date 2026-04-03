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
git clone https://github.com/xxVertex/portfolio.git
cd portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Customising

All content (name, bio, projects, skills, experience) lives in one file:

```
src/data/portfolio.js
```

Edit that file to update everything across the site at once.

## Deploy

Push to GitHub → import at [vercel.com](https://vercel.com) → done.

## License

MIT
