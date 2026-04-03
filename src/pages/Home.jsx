import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { ArrowRight, Github, Mail, MapPin, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { PERSON, SKILLS, RADAR_DATA, PROJECTS } from "../data/portfolio";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./Home.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Home() {
  const [aboutRef, aboutVisible] = useScrollReveal();
  const [skillsRef, skillsVisible] = useScrollReveal();
  const [projRef, projVisible] = useScrollReveal();

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero__inner">
          <motion.div className="hero__availability" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Circle size={8} fill="#b8ff57" color="#b8ff57" />
            <span>Available for work</span>
          </motion.div>

          <motion.h1 className="hero__title" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <span className="hero__title-line">Full Stack</span>
            <span className="hero__title-line hero__title-line--indent">
              Developer<span className="hero__dot">.</span>
            </span>
          </motion.h1>

          <motion.p className="hero__sub" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            {PERSON.tagline}
          </motion.p>

          <motion.div className="hero__actions" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Link to="/projects" className="btn btn--primary">
              View my work <ArrowRight size={16} />
            </Link>
            <a href={`mailto:${PERSON.email}`} className="btn btn--ghost">
              Get in touch
            </a>
          </motion.div>

          <motion.div className="hero__links" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <a href={PERSON.github} target="_blank" rel="noreferrer" className="hero__link">
              <Github size={18} /> {PERSON.githubUser}
            </a>
            <a href={`mailto:${PERSON.email}`} className="hero__link">
              <Mail size={18} /> {PERSON.email}
            </a>
            <span className="hero__link hero__link--static">
              <MapPin size={18} /> {PERSON.location}
            </span>
          </motion.div>
        </div>

        {/* Decorative grid */}
        <div className="hero__grid" aria-hidden="true">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="hero__grid-cell" />
          ))}
        </div>

        <div className="hero__scroll-hint">
          <span>scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      <div className="divider" />

      {/* ── ABOUT ── */}
      <section className="section about" ref={aboutRef}>
        <div className="container about__inner">
          <div className={`about__left reveal ${aboutVisible ? "reveal--visible" : ""}`}>
            <p className="section-label">About</p>
            <h2 className="section-title">
              Hey, I'm<br />
              <span className="text-accent">Oliver</span>.
            </h2>
            <p className="about__bio">{PERSON.bio}</p>
            <Link to="/resume" className="btn btn--outline">
              View full resume <ArrowRight size={15} />
            </Link>
          </div>
          <div className={`about__right reveal reveal--delay ${aboutVisible ? "reveal--visible" : ""}`}>
            <div className="about__card">
              <div className="about__card-label">Based in</div>
              <div className="about__card-value">{PERSON.location}</div>
            </div>
            <div className="about__card about__card--accent">
              <div className="about__card-label">Status</div>
              <div className="about__card-value">
                <Circle size={8} fill="#0e0e0e" color="#0e0e0e" /> Open to opportunities
              </div>
            </div>
            <div className="about__card">
              <div className="about__card-label">Focus</div>
              <div className="about__card-value">React · JS · Web</div>
            </div>
            <div className="about__card">
              <div className="about__card-label">GitHub</div>
              <a href={PERSON.github} target="_blank" rel="noreferrer" className="about__card-value about__card-link">
                @{PERSON.githubUser}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── SKILLS RADAR ── */}
      <section className="section skills" ref={skillsRef}>
        <div className="container">
          <p className="section-label">Skills</p>
          <h2 className="section-title">Tech Stack</h2>

          <div className={`skills__inner reveal ${skillsVisible ? "reveal--visible" : ""}`}>
            <div className="skills__radar">
              <ResponsiveContainer width="100%" height={380}>
                <RadarChart data={RADAR_DATA} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="#2a2a2a" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#888078", fontSize: 12, fontFamily: "Instrument Sans" }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#b8ff57"
                    fill="#b8ff57"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="skills__bars">
              {SKILLS.map((skill, i) => (
                <div key={skill.name} className="skill-bar" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="skill-bar__header">
                    <span className="skill-bar__name">{skill.name}</span>
                    <span className="skill-bar__score">{skill.score}%</span>
                  </div>
                  <div className="skill-bar__track">
                    <div
                      className={`skill-bar__fill ${skillsVisible ? "skill-bar__fill--animated" : ""}`}
                      style={{ "--target": `${skill.score}%`, transitionDelay: `${i * 0.06 + 0.3}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── FEATURED PROJECTS ── */}
      <section className="section featured" ref={projRef}>
        <div className="container">
          <div className="featured__header">
            <div>
              <p className="section-label">Work</p>
              <h2 className="section-title">Featured<br />Projects</h2>
            </div>
            <Link to="/projects" className="btn btn--ghost featured__all">
              All projects <ArrowRight size={15} />
            </Link>
          </div>

          <div className={`featured__grid reveal ${projVisible ? "reveal--visible" : ""}`}>
            {PROJECTS.filter(p => p.featured).map((project, i) => (
              <a
                key={project.id}
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="project-card"
                style={{ "--card-color": project.color, animationDelay: `${i * 0.08}s` }}
              >
                <div className="project-card__top">
                  <span className="project-card__emoji">{project.emoji}</span>
                  <span className="project-card__category">{project.category}</span>
                </div>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__sub">{project.subtitle}</p>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__tags">
                  {project.tags.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div className="project-card__arrow">
                  <ArrowRight size={18} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <p className="section-label">Contact</p>
            <h2 className="cta-box__title">Let's build<br />something great.</h2>
            <a href={`mailto:${PERSON.email}`} className="btn btn--primary btn--lg">
              <Mail size={18} /> {PERSON.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
