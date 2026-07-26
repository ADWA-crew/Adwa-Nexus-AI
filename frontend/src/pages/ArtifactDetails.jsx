import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { artifactService } from '../services/artifact.service';
import './ArtifactDetailsPage.css';

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const AudioIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export default function ArtifactDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artifact, setArtifact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    artifactService
      .getById(id)
      .then((data) => setArtifact(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="art-detail-page art-detail-page--loading">
        <Navbar />
        <div className="art-detail-page__spinner">
          <span>Loading Artifact Details...</span>
        </div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="art-detail-page">
        <Navbar />
        <div className="art-detail-page__not-found">
          <h2>Artifact Not Found</h2>
          <button type="button" onClick={() => navigate('/artifacts')} className="art-detail-page__back-btn">
            <ArrowLeftIcon />
            <span>Back to Artifacts</span>
          </button>
        </div>
      </div>
    );
  }

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
    <div className="art-detail-page">
      <Navbar />

      <main className="art-detail-page__container">
        {/* Navigation bar back link */}
        <button
          type="button"
          className="art-detail-page__back-link"
          onClick={() => navigate('/artifacts')}
        >
          <ArrowLeftIcon />
          <span>Back to All Artifacts</span>
        </button>

        <div className="art-detail-page__card">
          <div className="art-detail-page__grid">
            {/* Image Column */}
            <div className="art-detail-page__media">
              {image ? (
                <img src={image} alt={title} className="art-detail-page__img" />
              ) : (
                <div className="art-detail-page__placeholder">{category}</div>
              )}
              {badge && <span className="art-detail-page__badge">{badge}</span>}
            </div>

            {/* Info Column */}
            <div className="art-detail-page__content">
              <div className="art-detail-page__meta">
                <span className="art-detail-page__cat">{category}</span>
                <span className="art-detail-page__era">• {era}</span>
              </div>

              <h1 className="art-detail-page__title">{title}</h1>
              <p className="art-detail-page__subtitle">{subtitle}</p>

              <div className="art-detail-page__divider" />

              <p className="art-detail-page__desc">{description}</p>

              <div className="art-detail-page__specs">
                <div className="art-detail-page__spec">
                  <span className="art-detail-page__spec-lbl">Museum & Location</span>
                  <span className="art-detail-page__spec-val">{museum} ({location})</span>
                </div>
                <div className="art-detail-page__spec">
                  <span className="art-detail-page__spec-lbl">Origin & Era</span>
                  <span className="art-detail-page__spec-val">{origin} — {era}</span>
                </div>
                <div className="art-detail-page__spec">
                  <span className="art-detail-page__spec-lbl">Materials</span>
                  <span className="art-detail-page__spec-val">{material}</span>
                </div>
                <div className="art-detail-page__spec">
                  <span className="art-detail-page__spec-lbl">Dimensions</span>
                  <span className="art-detail-page__spec-val">{dimensions}</span>
                </div>
              </div>

              <button
                type="button"
                className="art-detail-page__audio-btn"
                onClick={() => alert(`Playing audio guide for ${title}`)}
              >
                <AudioIcon />
                <span>Play Audio Narration Guide</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
