import { Github, Mail } from "lucide-react";
import { PERSON } from "../data/portfolio";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">[OKS]</span>
          <span className="footer__name">{PERSON.name}</span>
        </div>
        <div className="footer__links">
          <a href={PERSON.github} target="_blank" rel="noreferrer" className="footer__link">
            <Github size={16} />
          </a>
          <a href={`mailto:${PERSON.email}`} className="footer__link">
            <Mail size={16} />
          </a>
        </div>
        <div className="footer__copy">
          © {new Date().getFullYear()} Oliver Kent Santos
        </div>
      </div>
    </footer>
  );
}
