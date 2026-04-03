import { useRef } from "react";
import { Download, Github, Mail, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { PERSON, SKILLS, EXPERIENCE, EDUCATION, PROJECTS } from "../data/portfolio";
import "./Resume.css";

export default function Resume() {
  const resumeRef = useRef(null);

  async function handleDownload() {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    const el = resumeRef.current;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0e0e0e",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`Oliver-Kent-Santos-Resume.pdf`);
  }

  return (
    <main className="resume-page">
      <div className="container">
        <div className="resume-controls">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}>
            <p className="section-label">Resume</p>
            <h1 className="section-title">Curriculum Vitae</h1>
          </motion.div>
          <motion.button
            className="btn btn--primary"
            onClick={handleDownload}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
          >
            <Download size={16} /> Download PDF
          </motion.button>
        </div>

        {/* Resume document */}
        <motion.div
          className="resume-doc"
          ref={resumeRef}
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, delay:0.2 }}
        >
          {/* Header */}
          <div className="rdoc__header">
            <div className="rdoc__header-left">
              <h2 className="rdoc__name">{PERSON.name}</h2>
              <p className="rdoc__title">{PERSON.title}</p>
              <p className="rdoc__bio">{PERSON.bio}</p>
            </div>
            <div className="rdoc__header-right">
              <a href={`mailto:${PERSON.email}`} className="rdoc__contact-item">
                <Mail size={14} /> {PERSON.email}
              </a>
              <a href={PERSON.github} target="_blank" rel="noreferrer" className="rdoc__contact-item">
                <Github size={14} /> {PERSON.githubUser}
              </a>
              <span className="rdoc__contact-item">
                <MapPin size={14} /> {PERSON.location}
              </span>
            </div>
          </div>

          <div className="rdoc__body">
            <div className="rdoc__main">
              {/* Experience */}
              <section className="rdoc__section">
                <h3 className="rdoc__section-title">Experience</h3>
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} className="rdoc__item">
                    <div className="rdoc__item-header">
                      <div>
                        <div className="rdoc__item-role">{exp.role}</div>
                        <div className="rdoc__item-company">{exp.company}</div>
                      </div>
                      <span className="rdoc__item-period">{exp.period}</span>
                    </div>
                    <p className="rdoc__item-desc">{exp.description}</p>
                  </div>
                ))}
              </section>

              {/* Projects */}
              <section className="rdoc__section">
                <h3 className="rdoc__section-title">Projects</h3>
                {PROJECTS.map((p, i) => (
                  <div key={i} className="rdoc__item">
                    <div className="rdoc__item-header">
                      <div>
                        <div className="rdoc__item-role">{p.emoji} {p.title} <span className="rdoc__item-sub">— {p.subtitle}</span></div>
                      </div>
                      <a href={p.github} target="_blank" rel="noreferrer" className="rdoc__ext">
                        <ExternalLink size={13} />
                      </a>
                    </div>
                    <p className="rdoc__item-desc">{p.description}</p>
                    <div className="rdoc__tags">
                      {p.tags.map(t => <span key={t} className="rdoc__tag">{t}</span>)}
                    </div>
                  </div>
                ))}
              </section>

              {/* Education */}
              <section className="rdoc__section">
                <h3 className="rdoc__section-title">Education</h3>
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="rdoc__item">
                    <div className="rdoc__item-header">
                      <div>
                        <div className="rdoc__item-role">{edu.degree}</div>
                        <div className="rdoc__item-company">{edu.school}</div>
                      </div>
                      <span className="rdoc__item-period">{edu.period}</span>
                    </div>
                    <p className="rdoc__item-desc">{edu.description}</p>
                  </div>
                ))}
              </section>
            </div>

            {/* Sidebar */}
            <div className="rdoc__sidebar">
              <section className="rdoc__section">
                <h3 className="rdoc__section-title">Skills</h3>
                {SKILLS.map(skill => (
                  <div key={skill.name} className="rdoc__skill">
                    <div className="rdoc__skill-header">
                      <span>{skill.name}</span>
                      <span className="rdoc__skill-score">{skill.score}%</span>
                    </div>
                    <div className="rdoc__skill-track">
                      <div className="rdoc__skill-fill" style={{ width: `${skill.score}%` }} />
                    </div>
                  </div>
                ))}
              </section>

              <section className="rdoc__section">
                <h3 className="rdoc__section-title">Stack</h3>
                <div className="rdoc__stack">
                  {["React", "JavaScript", "HTML5", "CSS3", "Node.js", "Git", "Vite", "REST APIs", "Canvas API", "Recharts", "Framer Motion"].map(s => (
                    <span key={s} className="rdoc__stack-item">{s}</span>
                  ))}
                </div>
              </section>

              <section className="rdoc__section">
                <h3 className="rdoc__section-title">Languages</h3>
                <div className="rdoc__lang">
                  <div className="rdoc__lang-item"><span>Spanish</span><span className="rdoc__lang-level">Native</span></div>
                  <div className="rdoc__lang-item"><span>English</span><span className="rdoc__lang-level">Fluent</span></div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
