import React from 'react';
import './ArtifactDetails.css';

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AudioIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export default function ArtifactDetails({ artifact, onClose }) {
  if (!artifact) return null;

  const {
    title,
    subtitle,
    era,
    category,
    museum,
    badge,
    image,
    description,
    origin,
    material,
    dimensions,
    location,
  } = artifact;

  return (
    <div className="art-modal__backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="art-modal__container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="art-modal__close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        <div className="art-modal__grid">
          {/* Left Media */}
          <div className="art-modal__media">
            {image ? (
              <img src={image} alt={title} className="art-modal__img" />
            ) : (
              <div className="art-modal__placeholder">{category}</div>
            )}
            {badge && <span className="art-modal__badge">{badge}</span>}
          </div>

          {/* Right Details */}
          <div className="art-modal__content">
            <div className="art-modal__meta">
              <span className="art-modal__cat">{category}</span>
              <span className="art-modal__era">• {era}</span>
            </div>

            <h2 className="art-modal__title">{title}</h2>
            <p className="art-modal__sub">{subtitle}</p>

            <div className="art-modal__divider" />

            <p className="art-modal__desc">{description}</p>

            {/* Spec List */}
            <div className="art-modal__specs">
              <div className="art-modal__spec-item">
                <span className="art-modal__spec-label">Museum & Location</span>
                <span className="art-modal__spec-value">{museum} ({location})</span>
              </div>
              <div className="art-modal__spec-item">
                <span className="art-modal__spec-label">Origin & Era</span>
                <span className="art-modal__spec-value">{origin} — {era}</span>
              </div>
              <div className="art-modal__spec-item">
                <span className="art-modal__spec-label">Materials</span>
                <span className="art-modal__spec-value">{material}</span>
              </div>
              <div className="art-modal__spec-item">
                <span className="art-modal__spec-label">Dimensions</span>
                <span className="art-modal__spec-value">{dimensions}</span>
              </div>
            </div>

            {/* Audio narration CTA */}
            <div className="art-modal__actions">
              <button
                type="button"
                className="art-modal__audio-btn"
                onClick={() => alert(`Audio narration for "${title}" is ready in your visitor experience!`)}
              >
                <AudioIcon />
                <span>Listen to Audio Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
