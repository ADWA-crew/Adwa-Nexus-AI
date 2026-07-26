import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { exhibitList } from '../data/exhibits';
import './Artifacts.css';

export default function Artifacts() {
  const exhibits = exhibitList();

  return (
    <div className="art-page">
      <Navbar />

      <main className="art-main">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="art-head">
          <span className="art-badge">Historical Artifacts & Stories</span>
          <h1 className="art-title">Adwa Museum Collection</h1>
          <p className="art-text">
            Explore primary artifacts, royal portraits, battle maps, and treaties from the 1896 Battle of Adwa. Click any item to open its multi-sensory story (Text, Sound, Video).
          </p>
        </header>

        {/* ── Artifact Grid ───────────────────────────────── */}
        <div className="art-grid">
          {exhibits.map((item) => (
            <article key={item.id} className="art-card">
              <div className="art-card__head">
                <span className="art-card__era">{item.era}</span>
                <span className="art-card__gallery">{item.gallery}</span>
              </div>

              <h2 className="art-card__title">{item.title}</h2>
              <p className="art-card__subtitle">{item.subtitle}</p>
              <p className="art-card__desc">{item.paragraphs[0]}</p>

              <div className="art-card__facts">
                {item.facts.map((fact, i) => (
                  <div key={i} className="art-card__fact">
                    <span className="art-card__label">{fact.label}</span>
                    <span className="art-card__val">{fact.value}</span>
                  </div>
                ))}
              </div>

              <div className="art-card__footer">
                <Link to={`/exhibit/${item.id}`} className="art-btn art-btn--primary">
                  Open Story (Text, Audio, Video) →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
