import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home',      href: '#home' },
  { label: 'Museums',   href: '#museums' },
  { label: 'Artifacts', href: '#artifacts' },
  { label: 'Routes',    href: '#routes' },
];

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'አማ', label: 'አማርኛ' },
  { code: 'FR', label: 'Français' },
  { code: 'DE', label: 'Deutsch' },
];

const MountainLogo = () => (
  <svg className="nav-logo__icon" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="logoGold" x1="0" y1="34" x2="20" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8B5E14" />
        <stop offset="60%" stopColor="#D4A843" />
        <stop offset="100%" stopColor="#F0CC70" />
      </linearGradient>
      <linearGradient id="logoGold2" x1="40" y1="34" x2="20" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6B4510" />
        <stop offset="100%" stopColor="#C9A453" />
      </linearGradient>
    </defs>
    {/* Left peak */}
    <path d="M0 34 L14 8 L22 20 L14 34 Z" fill="url(#logoGold2)" opacity="0.85" />
    {/* Right / main peak */}
    <path d="M14 34 L20 4 L40 34 Z" fill="url(#logoGold)" />
    {/* Snow cap accent */}
    <path d="M18 12 L20 4 L22 12 Z" fill="rgba(255,255,255,0.50)" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="2,4 6,8 10,4" />
  </svg>
);

const MenuIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    {open ? (
      <>
        <line x1="4" y1="4" x2="20" y2="20" />
        <line x1="20" y1="4" x2="4" y2="20" />
      </>
    ) : (
      <>
        <line x1="3" y1="7" x2="21" y2="7" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="17" x2="21" y2="17" />
      </>
    )}
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [langOpen, setLangOpen]       = useState(false);
  const [activeLang, setActiveLang]   = useState(LANGUAGES[0]);
  const [activeLink, setActiveLink]   = useState('Home');
  const langRef                        = useRef(null);

  /* Scroll handler — adds glass tint after 60 px */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close language dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLangSelect = (lang) => {
    setActiveLang(lang);
    setLangOpen(false);
  };

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">

        {/* ── Logo ── */}
        <a href="#home" className="nav-logo" aria-label="Adwa Nexus — home">
          <MountainLogo />
          <span className="nav-logo__text">
            Adwa <em>Nexus</em>
          </span>
        </a>

        {/* ── Desktop nav links ── */}
        {/* Logic stays intact; links stay hidden while the hero fills the viewport */}
        <nav
          className={`nav-links${scrolled ? '' : ' nav-links--hidden'}`}
          aria-label="Primary navigation"
          aria-hidden={!scrolled}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`nav-links__item${activeLink === label ? ' nav-links__item--active' : ''}`}
              onClick={() => setActiveLink(label)}
            >
              {label}
              <span className="nav-links__underline" aria-hidden="true" />
            </a>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div className="nav-actions">
          {/* Language selector */}
          <div className="nav-lang" ref={langRef}>
            <button
              className="nav-lang__trigger"
              onClick={() => setLangOpen(!langOpen)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label="Select language"
            >
              <span className="nav-lang__globe" aria-hidden="true">
                <svg viewBox="0 0 18 18" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="9" cy="9" r="7.5" />
                  <path d="M9 1.5C9 1.5 6 5 6 9s3 7.5 3 7.5S12 13 12 9 9 1.5 9 1.5z" />
                  <line x1="1.5" y1="9" x2="16.5" y2="9" />
                  <line x1="2.5" y1="6" x2="15.5" y2="6" />
                  <line x1="2.5" y1="12" x2="15.5" y2="12" />
                </svg>
              </span>
              <span className="nav-lang__code">{activeLang.code}</span>
              <span className={`nav-lang__chevron${langOpen ? ' nav-lang__chevron--open' : ''}`}>
                <ChevronDown />
              </span>
            </button>

            {langOpen && (
              <ul className="nav-lang__dropdown" role="listbox" aria-label="Languages">
                {LANGUAGES.map((lang) => (
                  <li
                    key={lang.code}
                    role="option"
                    aria-selected={lang.code === activeLang.code}
                    className={`nav-lang__option${lang.code === activeLang.code ? ' nav-lang__option--active' : ''}`}
                    onClick={() => handleLangSelect(lang)}
                  >
                    <span className="nav-lang__option-code">{lang.code}</span>
                    <span className="nav-lang__option-label">{lang.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      <div className={`nav-mobile${mobileOpen ? ' nav-mobile--open' : ''}`} aria-hidden={!mobileOpen}>
        <nav className="nav-mobile__links" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`nav-mobile__item${activeLink === label ? ' nav-mobile__item--active' : ''}`}
              onClick={() => { setActiveLink(label); setMobileOpen(false); }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-mobile__footer">
          <div className="nav-mobile__lang">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`nav-mobile__lang-btn${lang.code === activeLang.code ? ' nav-mobile__lang-btn--active' : ''}`}
                onClick={() => handleLangSelect(lang)}
              >
                {lang.code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
