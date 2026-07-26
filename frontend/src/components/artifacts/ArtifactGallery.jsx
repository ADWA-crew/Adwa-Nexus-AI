import React, { useState, useMemo } from 'react';
import ArtifactCard from './ArtifactCard';
import { ARTIFACT_CATEGORIES } from '../../data/artifactsData';
import './ArtifactGallery.css';

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ArtifactGallery({ artifacts = [], onSelectArtifact }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtifacts = useMemo(() => {
    return artifacts.filter((art) => {
      const matchesCategory =
        activeCategory === 'All' || art.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title?.toLowerCase().includes(q) ||
        art.subtitle?.toLowerCase().includes(q) ||
        art.museum?.toLowerCase().includes(q) ||
        art.era?.toLowerCase().includes(q) ||
        art.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [artifacts, activeCategory, searchQuery]);

  return (
    <section className="art-gallery" id="artifacts-collection">
      <div className="art-gallery__header">
        <div className="art-gallery__title-wrap">
          <span className="art-gallery__kicker">Historical Artifacts Collection</span>
          <h2 className="art-gallery__heading">
            About <em>Visual & Historical</em> Artifact Events
          </h2>
          <p className="art-gallery__sub">
            Explore curated relics, royal regalia, sacred manuscripts, and victory arms that shaped the Horn of Africa.
          </p>
        </div>

        {/* Search Bar */}
        <div className="art-gallery__search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search artifacts, eras, museums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="art-gallery__search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="art-gallery__search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="art-gallery__categories" role="tablist" aria-label="Artifact categories">
        {ARTIFACT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            className={`art-gallery__cat-btn${activeCategory === cat ? ' art-gallery__cat-btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Artifact Cards */}
      {filteredArtifacts.length > 0 ? (
        <div className="art-gallery__grid">
          {filteredArtifacts.map((art) => (
            <ArtifactCard
              key={art.id}
              artifact={art}
              onSelect={onSelectArtifact}
            />
          ))}
        </div>
      ) : (
        <div className="art-gallery__empty">
          <p>No artifacts found matching "{searchQuery}".</p>
          <button
            type="button"
            className="art-gallery__reset-btn"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
