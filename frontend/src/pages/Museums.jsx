import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import adwaHero from '../assets/images/heroes/adwa_hero.png';
import './Museums.css';

export const MUSEUMS_DATA = [
  {
    id: 'adwa-memorial',
    name: 'Adwa Victory Memorial Museum',
    city: 'Addis Ababa',
    location: 'Piassa, beside Menelik II Square',
    category: 'Historical Memorial & National Museum',
    image: adwaHero,
    badge: 'Featured Museum',
    description: 'Ethiopia’s flagship living history museum commemorating the historic 1896 Battle of Adwa. Features the 360° battle panorama hall, royal artifacts, and digital guides.',
    highlights: ['360° Battle Panorama Dome', 'Treaty of Wuchale Originals', 'Empress Taytu Relics', 'Digital AI Concierge'],
    routeCount: 4,
    exhibitsCount: 12,
  },
  {
    id: 'national-museum',
    name: 'National Museum of Ethiopia',
    city: 'Addis Ababa',
    location: 'King George VI St, Sidist Kilo',
    category: 'Paleoanthropology & Archaeology',
    description: 'Home to the famous fossilized hominid "Lucy" (Dinkinesh) dating back 3.2 million years, alongside ancient Aksumite, Lalibela, and royal collections.',
    highlights: ['Lucy (Dinkinesh) Fossil', 'Aksumite Royal Thrones', 'Traditional Ethiopian Art'],
    routeCount: 3,
    exhibitsCount: 25,
  },
  {
    id: 'ethnological-museum',
    name: 'Ethnological Museum of Ethiopia',
    city: 'Addis Ababa',
    location: 'Addis Ababa University, Genete Leul Palace',
    category: 'Ethnography & Cultural Heritage',
    description: 'Housed within Emperor Haile Selassie’s former palace, showcasing the rich cultural diversity, traditional musical instruments, and crafts of Ethiopia’s nations.',
    highlights: ['Emperor’s Bedroom & Palace', 'Traditional Instruments Collection', 'Religious Crosses & Icons'],
    routeCount: 2,
    exhibitsCount: 18,
  },
];

export default function Museums() {
  return (
    <div className="mus-page">
      <Navbar />

      <main className="mus-main">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="mus-head">
          <span className="mus-badge">Explore Heritage Destinations</span>
          <h1 className="mus-title">Ethiopian Museums</h1>
          <p className="mus-text">
            Discover Ethiopia’s world-renowned historical museums, royal halls, and archaeological collections through the Adwa Nexus platform.
          </p>
        </header>

        {/* ── Museums Grid ────────────────────────────────── */}
        <div className="mus-grid">
          {MUSEUMS_DATA.map((museum) => (
            <article key={museum.id} className="mus-card">
              {museum.image && (
                <div className="mus-card__media">
                  <img src={museum.image} alt={museum.name} className="mus-card__img" />
                  {museum.badge && <span className="mus-card__flag">{museum.badge}</span>}
                </div>
              )}

              <div className="mus-card__body">
                <span className="mus-card__cat">{museum.category}</span>
                <h2 className="mus-card__name">{museum.name}</h2>
                <p className="mus-card__loc">📍 {museum.location} · {museum.city}</p>
                <p className="mus-card__desc">{museum.description}</p>

                <div className="mus-card__highlights">
                  <span className="mus-card__hl-title">Highlights:</span>
                  <ul>
                    {museum.highlights.map((hl, i) => (
                      <li key={i}>✓ {hl}</li>
                    ))}
                  </ul>
                </div>

                <div className="mus-card__footer">
                  <Link to="/routes" className="mus-btn mus-btn--primary">
                    View Museum Routes ({museum.routeCount})
                  </Link>
                  <Link to="/start-journey" className="mus-btn mus-btn--ghost">
                    Start Journey
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
