import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelect from '../common/LanguageSelect';
import { useLanguage } from '../../hooks/useLanguage';
import adwaLogo from '../../assets/images/adwa_logo.png';
import './Navbar.css';

/* `to` = real page, `href` = in-page anchor until that page is built */
const NAV_LINKS = [
  { label: 'Home',      to: '/' },
  { label: 'Museums',   href: '#museums' },
  { label: 'Artifacts', href: '#artifacts' },
  { label: 'Progress',  to: '/routes' },
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

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
        {/* Logic stays intact; links stay hidden while the hero fills the viewport */}
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
          {NAV_LINKS.map(({ label, href, to }) => {
            const className = `nav-mobile__item${activeLink === label ? ' nav-mobile__item--active' : ''}`;
            const close = () => { setActiveLink(label); setMobileOpen(false); };

            return to ? (
              <Link key={label} to={to} className={className} onClick={close}>
                {label}
              </Link>
            ) : (
              <a key={label} href={href} className={className} onClick={close}>
                {label}
              </a>
            );
          })}
        </nav>

        <div className="nav-mobile__footer">
          <div className="nav-mobile__lang">
            {languages.map((lang) => (
              <button
                key={lang.value}
                className={`nav-mobile__lang-btn${lang.value === activeLanguage.value ? ' nav-mobile__lang-btn--active' : ''}`}
                onClick={() => setLanguage(lang.value)}
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
