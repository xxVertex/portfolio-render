import { useState } from "react";
import { Github, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "../data/portfolio";
import "./Projects.css";

const CATEGORIES = ["All", ...new Set(PROJECTS.map(p => p.category))];

export default function Projects() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? PROJECTS : PROJECTS.filter(p => p.category === active);

  return (
    <main className="projects-page">
      <div className="container">
        <div className="projects-hero">
          <motion.p className="section-label" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}>
            Portfolio
          </motion.p>
          <motion.h1 className="section-title projects-title" initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6, delay:0.1 }}>
            All Projects
          </motion.h1>
          <motion.p className="projects-sub" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5, delay:0.2 }}>
            {PROJECTS.length} projects built with React, Canvas, and a lot of coffee.
          </motion.p>
        </div>

        {/* Filter bar */}
        <motion.div className="filter-bar" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5, delay:0.3 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${active === cat ? "filter-btn--active" : ""}`}
              onClick={() => setActive(cat)}
            >
              {cat}
              <span className="filter-btn__count">
                {cat === "All" ? PROJECTS.length : PROJECTS.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="pcard" style={{ "--col": project.color }}>
      <div className="pcard__glow" />
      <div className="pcard__header">
        <span className="pcard__emoji">{project.emoji}</span>
        <span className="pcard__cat">{project.category}</span>
      </div>
      <h2 className="pcard__title">{project.title}</h2>
      <p className="pcard__subtitle">{project.subtitle}</p>
      <p className="pcard__desc">{project.description}</p>
      <div className="pcard__tags">
        {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="pcard__footer">
        <a href={project.github} target="_blank" rel="noreferrer" className="pcard__link">
          <Github size={15} /> GitHub <ArrowUpRight size={13} />
        </a>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="pcard__link pcard__link--live">
            ▶ Play Live <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
