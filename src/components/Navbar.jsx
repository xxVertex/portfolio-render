import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PERSON } from "../data/portfolio";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/resume", label: "Resume" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-bracket">[</span>
          OKS
          <span className="navbar__logo-bracket">]</span>
        </NavLink>

        <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => `navbar__link ${isActive ? "navbar__link--active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
          <a href={`mailto:${PERSON.email}`} className="navbar__cta">
            Hire me
          </a>
        </div>

        <button className="navbar__burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
        </button>
      </div>
    </nav>
  );
}
