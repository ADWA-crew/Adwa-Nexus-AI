import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ArtifactGallery from '../components/artifacts/ArtifactGallery';
import ArtifactDetails from '../components/artifacts/ArtifactDetails';
import { useArtifacts } from '../hooks/useArtifacts';

import shotelsTrio from '../assets/images/artifacts/shotels_trio.png';
import adwaMountainCannon from '../assets/images/artifacts/adwa_mountain_cannon.png';
import warriorLionsManeAttire from '../assets/images/artifacts/warrior_lions_mane_attire.png';
import gashaShieldsPair from '../assets/images/artifacts/gasha_shields_pair.png';
import adwaHeadlinesLeather from '../assets/images/artifacts/adwa_headlines_leather.png';

import './Artifacts.css';

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14 6 20 12 14 18" />
  </svg>
);

const CrownIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const CompassIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export default function Artifacts() {
  const { artifacts, loading } = useArtifacts();
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  // Fallback artifact if needed
  const heroFeatured = artifacts[0] || {
    id: 'shotels-trio',
    title: 'Curved Shotel Blades Trio',
    subtitle: 'Triple curved highland swords mounted for rapid horseback & hand-to-hand maneuvers.',
    image: shotelsTrio,
  };

  return (
    <div className="art-page">
      <Navbar />

      {/* ── 1. EDITORIAL HERO SECTION WITH NOISED PAPER CARDS ── */}
      <section className="art-hero">
        <div className="art-hero__container">
          {/* Hero Left Column */}
          <div className="art-hero__left">
            <span className="art-hero__kicker">Adwa Victory Museum Archives</span>
            <h1 className="art-hero__heading">
              Discover —<br />
              <span className="art-hero__heading-accent">treasure with</span><br />
              <span className="art-hero__heading-script">historical value</span>
            </h1>

            {/* Noised Parchment Paper Highlight Card */}
            <div
              className="art-hero__paper-card art-paper-card art-paper-card--parchment"
              onClick={() => setSelectedArtifact(artifacts.find(a => a.id === 'gasha-shields-pair') || heroFeatured)}
              role="button"
              tabIndex={0}
            >
              <div className="art-paper-card__grain" aria-hidden="true" />
              <div className="art-paper-card__content">
                <span className="art-paper-card__tag">FEATURED RELIC</span>
                <h3 className="art-paper-card__title">Gasha Shields of Adwa</h3>
                <p className="art-paper-card__text">Embossed buffalo hide shields engineered for battlefield defense</p>
                <div className="art-paper-card__btn">
                  <span>Learn More</span>
                  <ArrowRightIcon />
                </div>
              </div>
              <div className="art-paper-card__img-wrap">
                <img src={gashaShieldsPair} alt="Gasha Shields" className="art-paper-card__img" />
              </div>
            </div>
          </div>

          {/* Hero Right Column (Noised Imperial Gold Paper Card) */}
          <div className="art-hero__right">
            <div
              className="art-hero__big-paper art-paper-card art-paper-card--ochre"
              onClick={() => setSelectedArtifact(artifacts.find(a => a.id === 'adwa-mountain-cannon') || heroFeatured)}
              role="button"
              tabIndex={0}
            >
              <div className="art-paper-card__grain" aria-hidden="true" />
              <div className="art-hero__big-content">
                <div className="art-hero__big-badge">EXHIBIT HIGHLIGHT</div>
                <h2 className="art-hero__big-title">Adwa Mountain Artillery Cannon</h2>
                <p className="art-hero__big-desc">
                  Explore heavy brass field artillery deployed across steep highland ridges during the 1896 Battle of Adwa.
                </p>
                <div className="art-hero__big-btn">
                  <span>Learn More</span>
                  <ArrowRightIcon />
                </div>
              </div>
              <div className="art-hero__big-figure">
                <img src={adwaMountainCannon} alt="Adwa Mountain Cannon" className="art-hero__big-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED QUOTE BANNER (Noised Gold Rawhide Paper) ── */}
      <section className="art-quote-banner">
        <div className="art-quote-banner__paper art-paper-card art-paper-card--ochre">
          <div className="art-paper-card__grain" aria-hidden="true" />
          <div className="art-quote-banner__inner">
            <div className="art-quote-banner__symbol">“</div>
            <div className="art-quote-banner__content">
              <p className="art-quote-banner__text">
                Heroes and artisans who advanced civilization and turned thoughts into art & courage into history.
              </p>
              <div className="art-quote-banner__author-wrap">
                <span className="art-quote-banner__author">Empress Taytu Betul</span>
                <span className="art-quote-banner__dates">• 1851 – 1918</span>
              </div>
            </div>
            <div className="art-quote-banner__action">
              <button
                type="button"
                className="art-quote-banner__btn"
                onClick={() => {
                  const galleryEl = document.getElementById('artifacts-collection');
                  galleryEl?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. EDITORIAL FEATURED EXHIBITIONS (Noised Paper Cards with Different Colors) ── */}
      <section className="art-programs">
        <div className="art-programs__container">
          <div className="art-programs__header">
            <span className="art-programs__kicker">Curated Exhibition Programs</span>
            <h2 className="art-programs__title">
              Our <em>Art & Historical</em> exhibition collections
            </h2>
          </div>

          <div className="art-programs__grid">
            {/* Card 1: Terracotta Red Ochre Paper Card */}
            <div
              className="art-program-card art-paper-card art-paper-card--terracotta"
              onClick={() => setSelectedArtifact(artifacts.find(a => a.id === 'warrior-lions-mane-attire') || heroFeatured)}
              role="button"
              tabIndex={0}
            >
              <div className="art-paper-card__grain" aria-hidden="true" />
              <div className="art-program-card__top">
                <div className="art-program-card__header-row">
                  <CrownIcon />
                  <span className="art-program-card__brand">Adwa Royal Regalia</span>
                </div>
                <div className="art-program-card__img-box">
                  <img src={warriorLionsManeAttire} alt="Lion Mane Attire" className="art-program-card__img" />
                </div>
                <span className="art-program-card__tag">HALL OF VALOR</span>
              </div>
              <div className="art-program-card__bottom">
                <h3 className="art-program-card__heading">Warrior’s Lion’s Mane Attire & Royal Regalia</h3>
                <p className="art-program-card__subtext">Authentic lion-mane cape and tunic worn by vanguard heroes.</p>
                <div className="art-program-card__btn">
                  <span>Learn More</span>
                  <ArrowRightIcon />
                </div>
              </div>
            </div>

            {/* Card 2: Charcoal Dark Slate Paper Card */}
            <div
              className="art-program-card art-paper-card art-paper-card--charcoal"
              onClick={() => setSelectedArtifact(artifacts.find(a => a.id === 'shotels-trio') || heroFeatured)}
              role="button"
              tabIndex={0}
            >
              <div className="art-paper-card__grain" aria-hidden="true" />
              <div className="art-program-card__top">
                <div className="art-program-card__header-row">
                  <CompassIcon />
                  <span className="art-program-card__brand">Armory Vault</span>
                </div>
                <div className="art-program-card__img-box">
                  <img src={shotelsTrio} alt="Shotel Swords Trio" className="art-program-card__img" />
                </div>
                <span className="art-program-card__tag">WEAPONRY EXHIBIT</span>
              </div>
              <div className="art-program-card__bottom">
                <h3 className="art-program-card__heading">Curved Shotel Blades & Highland Sabers</h3>
                <p className="art-program-card__subtext">Iconic curved steel blades crafted for highland combat.</p>
                <div className="art-program-card__btn">
                  <span>Learn More</span>
                  <ArrowRightIcon />
                </div>
              </div>
            </div>

            {/* Card 3: Parchment Cream Paper Card */}
            <div
              className="art-program-card art-paper-card art-paper-card--parchment"
              onClick={() => setSelectedArtifact(artifacts.find(a => a.id === 'adwa-headlines-leather') || heroFeatured)}
              role="button"
              tabIndex={0}
            >
              <div className="art-paper-card__grain" aria-hidden="true" />
              <div className="art-program-card__top">
                <div className="art-program-card__header-row">
                  <span className="art-program-card__brand">Global Impact Archives</span>
                </div>
                <div className="art-program-card__img-box">
                  <img src={adwaHeadlinesLeather} alt="Adwa Newspaper Display" className="art-program-card__img" />
                </div>
                <span className="art-program-card__tag">GLOBAL PRESS 1896</span>
              </div>
              <div className="art-program-card__bottom">
                <h3 className="art-program-card__heading">Adwa Victory Headlines Leather Display</h3>
                <p className="art-program-card__subtext">Rawhide parchment mounting international press reports from 1896.</p>
                <div className="art-program-card__btn">
                  <span>Learn More</span>
                  <ArrowRightIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MAIN ARTIFACT GALLERY GRID WITH NOISED PAPER CARDS ── */}
      <ArtifactGallery
        artifacts={artifacts}
        onSelectArtifact={(art) => setSelectedArtifact(art)}
      />

      {/* ── 5. DETAIL MODAL ── */}
      {selectedArtifact && (
        <ArtifactDetails
          artifact={selectedArtifact}
          onClose={() => setSelectedArtifact(null)}
        />
      )}
    </div>
  );
}
