import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelect from '../common/LanguageSelect';
import { useLanguage } from '../../hooks/useLanguage';
import adwaLogo from '../../assets/images/adwa_logo.png';
import './Navbar.css';

/* `to` = real page, `href` = in-page anchor until that page is built */
const NAV_LINKS = [
  { label: 'Home',      to: '/',        icon: '🏠' },
  { label: 'Museums',   to: '/museums',  icon: '🏛️' },
  { label: 'Artifacts', to: '/artifacts',icon: '📜' },
  { label: 'Progress',  to: '/routes',   icon: '🗺️' },
];

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

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  const { pathname } = useLocation();
  const { setLanguage, activeLanguage, languages } = useLanguage();

  /* Only the hero page hides the links until you scroll past it */
  const onHome = pathname === '/';
  const showLinks = scrolled || !onHome;

  /* Keep the highlight in step with the page you are actually on */
  useEffect(() => {
    const match = NAV_LINKS.find(
      ({ to }) => to && (to === '/' ? pathname === '/' : pathname.startsWith(to))
    );
    if (match) setActiveLink(match.label);
  }, [pathname]);

  /* Scroll handler — adds glass tint after 60 px */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll when mobile slider is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">

        {/* ── Logo ── */}
        <Link to="/" className="nav-logo" aria-label="Adwa Nexus — home">
          <img src={adwaLogo} alt="Battle of Adwa Logo" className="nav-logo__img" />
          <span className="nav-logo__text">
            Adwa <em>Nexus</em>
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav
          className={`nav-links${showLinks ? '' : ' nav-links--hidden'}`}
          aria-label="Primary navigation"
          aria-hidden={!showLinks}
        >
          {NAV_LINKS.map(({ label, href, to }) => {
            const className = `nav-links__item${activeLink === label ? ' nav-links__item--active' : ''}`;
            const inner = (
              <>
                {label}
                <span className="nav-links__underline" aria-hidden="true" />
              </>
            );

            return to ? (
              <Link key={label} to={to} className={className} onClick={() => setActiveLink(label)}>
                {inner}
              </Link>
            ) : (
              <a key={label} href={href} className={className} onClick={() => setActiveLink(label)}>
                {inner}
              </a>
            );
          })}
        </nav>

        {/* ── Actions ── */}
        <div className="nav-actions">
          <LanguageSelect />

          {/* Mobile hamburger button */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation slider' : 'Open navigation slider'}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* ── Mobile Slide-out Drawer / Slider Overlay ── */}
      {mobileOpen && (
        <div
          className="nav-mobile-backdrop"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`nav-mobile-slider ${mobileOpen ? 'nav-mobile-slider--open' : ''}`}
        aria-label="Mobile navigation drawer"
        aria-hidden={!mobileOpen}
      >
        {/* Slider Header */}
        <div className="nav-mobile-slider__header">
          <Link to="/" className="nav-logo" onClick={closeMobile}>
            <img src={adwaLogo} alt="Battle of Adwa Logo" className="nav-logo__img" />
            <span className="nav-logo__text">
              Adwa <em>Nexus</em>
            </span>
          </Link>

          <button
            type="button"
            className="nav-mobile-slider__close"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Slider Navigation Links */}
        <nav className="nav-mobile-slider__nav">
          <span className="nav-mobile-slider__section-title">Navigation</span>
          <ul className="nav-mobile-slider__list">
            {NAV_LINKS.map(({ label, href, to, icon }) => {
              const isActive = activeLink === label;
              const linkClass = `nav-mobile-slider__link ${isActive ? 'nav-mobile-slider__link--active' : ''}`;

              return (
                <li key={label}>
                  {to ? (
                    <Link to={to} className={linkClass} onClick={closeMobile}>
                      <span className="nav-mobile-slider__link-icon">{icon}</span>
                      <span className="nav-mobile-slider__link-text">{label}</span>
                      {isActive && <span className="nav-mobile-slider__link-dot" />}
                    </Link>
                  ) : (
                    <a href={href} className={linkClass} onClick={closeMobile}>
                      <span className="nav-mobile-slider__link-icon">{icon}</span>
                      <span className="nav-mobile-slider__link-text">{label}</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Slider AI Concierge & Quick Action Card */}
        <div className="nav-mobile-slider__ai-card">
          <div className="nav-mobile-slider__ai-head">
            <span className="nav-mobile-slider__ai-badge">🤖 Adwa AI Concierge</span>
            <span className="nav-mobile-slider__ai-pulse" />
          </div>
          <h4 className="nav-mobile-slider__ai-title">Smart Museum Assistant</h4>
          <p className="nav-mobile-slider__ai-desc">
            Get instant multilingual answers, directions, or audio guide narration for any exhibit.
          </p>
          <div className="nav-mobile-slider__ai-actions">
            <Link to="/start-journey" className="nav-mobile-slider__ai-btn" onClick={closeMobile}>
              ⚡ Start Personal Journey
            </Link>
          </div>
        </div>

        {/* Slider Footer / Language Switcher */}
        <div className="nav-mobile-slider__footer">
          <span className="nav-mobile-slider__section-title">Select Language</span>
          <div className="nav-mobile-slider__lang-grid">
            {languages.map((lang) => (
              <button
                key={lang.value}
                type="button"
                className={`nav-mobile-slider__lang-btn ${
                  lang.value === activeLanguage.value ? 'nav-mobile-slider__lang-btn--active' : ''
                }`}
                onClick={() => setLanguage(lang.value)}
              >
                <span>{lang.code}</span>
                <small>{lang.label}</small>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
}
