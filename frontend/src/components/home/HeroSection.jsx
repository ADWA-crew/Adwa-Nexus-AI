import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
import adwaHero from '../../assets/images/heroes/adwa_hero.png';
import './HeroSection.css';

/* ── Icon helpers ─────────────────────────────────────── */
const ArrowRight = () => (
  <svg viewBox="0 0 20 20" width="17" height="17" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="10" x2="16" y2="10" />
    <polyline points="11,5 16,10 11,15" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
    <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <polygon points="8,6.5 8,13.5 14,10" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="var(--gold-bright)" aria-hidden="true">
    <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 5.2l4-.6z" />
  </svg>
);

export default function HeroSection() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { t } = useTranslation();
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

  return (
    <section className="hero" id="home" aria-label="Hero section">

      {/* ── Background ──────────────────────────────────────── */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src={adwaHero}
          alt=""
          className="hero__bg-img"
          loading="eager"
          decoding="async"
        />

        {/* Timelapse sky — drifting clouds + travelling warm light */}
        <div className="hero__sky">
          <div className="hero__clouds hero__clouds--back" />
          <div className="hero__clouds hero__clouds--front" />
          <div className="hero__sky-light" />
        </div>

        {/* Cinematic layered overlay — dark vignette with warm tones */}
        <div className="hero__overlay" />
        <div className="hero__overlay-top" />
        <div className="hero__overlay-bottom" />
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="hero__content">
        <div className="hero__left">

          {/* Badge */}
          <div className="hero__badge">
            <span className="hero__badge-pulse" aria-hidden="true" />
            <StarIcon />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className="hero__title">
            {t('hero.titleLine1')}
            <br />
            <span className="hero__title-gold">{t('hero.titleLine2')}</span>
          </h1>

          {/* Description */}
          <p className="hero__desc">
            {t('hero.description')}
          </p>

          {/* CTA row */}
          <div className="hero__cta-row">
            <button
              className="hero-btn hero-btn--primary"
              type="button"
              onClick={() => navigate('/start-journey')}
            >
              <ArrowRight />
              {t('hero.startJourney')}
            </button>
            <button className="hero-btn hero-btn--ghost" type="button">
              <PlayIcon />
              {t('hero.discoverEthiopia')}
            </button>
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────── */}
      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-dot" />
        </div>
        <span className="hero__scroll-label">{t('hero.scroll')}</span>
      </div>

    </section>
  );
}
