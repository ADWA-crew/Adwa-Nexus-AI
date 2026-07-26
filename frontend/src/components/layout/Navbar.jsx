import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../common/LanguageSelector';
import { useLanguage } from '../../hooks/useLanguage';
import './Navbar.css';

=======
import LanguageSelect from '../common/LanguageSelect';
import { useLanguage } from '../../hooks/useLanguage';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home',      href: '#home' },
  { label: 'Museums',   href: '#museums' },
  { label: 'Artifacts', href: '#artifacts' },
  { label: 'Routes',    href: '#routes' },
];

>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
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
    <path d="M0 34 L14 8 L22 20 L14 34 Z" fill="url(#logoGold2)" opacity="0.85" />
    <path d="M14 34 L20 4 L40 34 Z" fill="url(#logoGold)" />
    <path d="M18 12 L20 4 L22 12 Z" fill="rgba(255,255,255,0.50)" />
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
<<<<<<< HEAD
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const { setLanguage, activeLanguage, languages } = useLanguage();

  const navLinks = [
    { key: 'home', href: '#home', label: t('nav.home') },
    { key: 'museums', href: '#museums', label: t('nav.museums') },
    { key: 'artifacts', href: '#artifacts', label: t('nav.artifacts') },
    { key: 'routes', href: '#routes', label: t('nav.routes') },
  ];
=======
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  const { setLanguage, activeLanguage, languages } = useLanguage();
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

<<<<<<< HEAD
=======
  /* Lock body scroll when mobile menu is open */
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">

        <a href="#home" className="nav-logo" aria-label="Adwa Nexus — home">
          <MountainLogo />
          <span className="nav-logo__text">
            Adwa <em>Nexus</em>
          </span>
        </a>

        <nav
          className={`nav-links${scrolled ? '' : ' nav-links--hidden'}`}
          aria-label="Primary navigation"
          aria-hidden={!scrolled}
        >
          {navLinks.map(({ key, label, href }) => (
            <a
              key={key}
              href={href}
              className={`nav-links__item${activeLink === key ? ' nav-links__item--active' : ''}`}
              onClick={() => setActiveLink(key)}
            >
              {label}
              <span className="nav-links__underline" aria-hidden="true" />
            </a>
          ))}
        </nav>

        <div className="nav-actions">
<<<<<<< HEAD
          <LanguageSelector />

=======
          <LanguageSelect />

          {/* Mobile hamburger */}
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <div className={`nav-mobile${mobileOpen ? ' nav-mobile--open' : ''}`} aria-hidden={!mobileOpen}>
        <nav className="nav-mobile__links" aria-label="Mobile navigation">
          {navLinks.map(({ key, label, href }) => (
            <a
              key={key}
              href={href}
              className={`nav-mobile__item${activeLink === key ? ' nav-mobile__item--active' : ''}`}
              onClick={() => { setActiveLink(key); setMobileOpen(false); }}
            >
              {label}
            </a>
          ))}
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
