import React from 'react';
import './ArtifactCard.css';

const ArrowIcon = () => (
  <svg
    viewBox="0 0 20 20"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="10" x2="17" y2="10" />
    <polyline points="12,5 17,10 12,15" />
  </svg>
);

export default function ArtifactCard({ artifact, onSelect }) {
  if (!artifact) return null;

  const {
    title,
    amharic,
    subtitle,
    dateLabel,
    category,
    museum,
    badge,
    image,
    cardTheme = 'parchment',
    shortSnippet,
  } = artifact;

  return (
    <article
      className={`art-card art-card--${cardTheme}`}
      onClick={() => onSelect && onSelect(artifact)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(artifact);
        }
      }}
    >
      {/* Paper Grain Noise Texture Layer */}
      <div className="art-card__paper-grain" aria-hidden="true" />

      {/* Top Media Container */}
      <div className="art-card__media-wrapper">
        {image ? (
          <img
            src={image}
            alt={title}
            className="art-card__img"
            loading="lazy"
          />
        ) : (
          <div className="art-card__img-placeholder">
            <span>{category || 'Historical Artifact'}</span>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="art-card__badges">
          {badge && <span className="art-card__badge art-card__badge--tag">{badge}</span>}
          {dateLabel && <span className="art-card__badge art-card__badge--date">{dateLabel}</span>}
        </div>

        {/* Subtle Cinematic Grading Veil */}
        <div className="art-card__veil" aria-hidden="true" />
      </div>

      {/* Paper Card Body */}
      <div className="art-card__body">
        <div className="art-card__meta">
          <span className="art-card__amharic">{amharic || category}</span>
          <span className="art-card__museum">• {museum}</span>
        </div>

        <h3 className="art-card__title">{title}</h3>
        <p className="art-card__snippet">{shortSnippet || subtitle}</p>

        {/* Arrow-based Learn More Button */}
        <div className="art-card__footer">
          <div className="art-card__learn-btn">
            <span className="art-card__learn-text">Learn More</span>
            <span className="art-card__arrow-icon">
              <ArrowIcon />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
