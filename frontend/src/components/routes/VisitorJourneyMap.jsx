import { useState } from 'react';
import './VisitorJourneyMap.css';

/* ── Sample Museum Stations based on the Visitor Journey Map ── */
export const JOURNEY_STATIONS = [
  {
    id: 'arrival',
    step: 1,
    title: 'Arrival & Plaza Entrance',
    category: 'Welcome',
    icon: '🏛️',
    location: 'Ground Level — Piassa Entrance',
    time: '5 mins',
    description: 'Arrive at the grand Adwa Memorial Plaza beside Menelik II Square. Pass security check and step under the soaring memorial dome.',
    highlights: ['Grand Plaza Monuments', 'Digital Check-in', 'Info Desk'],
    status: 'completed',
    type: 'entrance',
  },
  {
    id: 'tickets',
    step: 2,
    title: 'Ticket Purchase & Registration',
    category: 'Check-in',
    icon: '🎟️',
    location: 'Welcome Atrium',
    time: '3 mins',
    description: 'Purchase or validate your digital entry ticket. Scan your Adwa Nexus personalization code to configure your visitor profile.',
    highlights: ['Fast-track Digital Pass', 'Visitor Personalization', 'Language Selection'],
    status: 'completed',
    type: 'service',
  },
  {
    id: 'coatcheck',
    step: 3,
    title: 'Coat Check & Cloakroom',
    category: 'Service',
    icon: '🧥',
    location: 'Atrium East Wing',
    time: '2 mins',
    description: 'Store large bags, coats, and umbrellas in secure smart lockers before entering the main historical galleries.',
    highlights: ['Smart Lockers', 'Self-service Storage', 'Accessibility Assistance'],
    status: 'current',
    type: 'service',
  },
  {
    id: 'audioguide',
    step: 4,
    title: 'Audio Guide & QR Sync',
    category: 'Tech Station',
    icon: '🎧',
    location: 'Gallery Entry Desk',
    time: '4 mins',
    description: 'Pick up your multilingual audio headset or sync your smartphone with the Adwa Nexus AI guide via QR code.',
    highlights: ['Multilingual Headsets (Amharic, EN, FR, OM, TI)', 'Adwa AI Companion', 'Word-by-Word Narration'],
    status: 'next',
    type: 'tech',
  },
  {
    id: 'exhibition1',
    step: 5,
    title: 'Exhibition Hall 1: Wuchale & Prelude',
    category: 'Gallery',
    icon: '📜',
    location: 'Ground Floor Gallery A',
    time: '20 mins',
    description: 'Explore the events leading to 1896. Compare Article 17 of the Treaty of Wuchale side by side in Amharic and Italian, and view Menelik II’s mobilization decree.',
    highlights: ['Treaty of Wuchale Original Facsimiles', 'Imperial Mobilization Proclamation', '19th Century Weapons'],
    status: 'upcoming',
    type: 'exhibition',
    exhibitId: 'menelik-ii',
  },
  {
    id: 'cafebreak',
    step: 6,
    title: 'Cafe Break & Courtyard',
    category: 'Rest Area',
    icon: '☕',
    location: 'Courtyard Level 1',
    time: '15 mins',
    description: 'Take a brief pause for authentic highland Ethiopian coffee, traditional teas, and pastries overlooking the memorial courtyard gardens.',
    highlights: ['Traditional Coffee Ceremony', 'Shaded Garden Seating', 'Refreshments & Water'],
    status: 'upcoming',
    type: 'amenity',
  },
  {
    id: 'exhibition2',
    step: 7,
    title: 'Exhibition Hall 2: Battle Panorama',
    category: 'Gallery',
    icon: '⚔️',
    location: 'Level 2 Panorama Dome',
    time: '25 mins',
    description: 'Step into the breathtaking 360-degree battle panorama hall depicting 1 March 1896. View Empress Taytu’s tactical command displays and victorious hero portraits.',
    highlights: ['360° Battle Mural', 'Empress Taytu Relics', 'Battlefield Diorama'],
    status: 'upcoming',
    type: 'exhibition',
    exhibitId: 'adwa-victory',
  },
  {
    id: 'giftshop',
    step: 8,
    title: 'Gift Shop & Souvenirs',
    category: 'Shopping',
    icon: '🎁',
    location: 'Level 1 Concourse',
    time: '10 mins',
    description: 'Browse artisan-crafted commemorative items, historical books, replica shields, traditional textiles, and custom visitor badges.',
    highlights: ['Handcrafted Ethiopian Replicas', 'Adwa Victory Books', 'Customized Badges'],
    status: 'upcoming',
    type: 'shopping',
  },
  {
    id: 'departure',
    step: 9,
    title: 'Departure & Victory Memorial',
    category: 'Exit',
    icon: '🚩',
    location: 'South Exit / Memorial Terrace',
    time: '5 mins',
    description: 'Conclude your journey at the outdoor reflection terrace. Scan your final journey QR code to save your visit memory and review certificate.',
    highlights: ['Memorial Reflection Wall', 'Digital Visit Certificate', 'Feedback QR Point'],
    status: 'upcoming',
    type: 'exit',
  },
];

export default function VisitorJourneyMap({ onSelectStation }) {
  const [activeStation, setActiveStation] = useState(JOURNEY_STATIONS[2]); // Coat Check / Ex 1
  const [showQrModal, setShowQrQrModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleStationClick = (station) => {
    setActiveStation(station);
    if (onSelectStation) {
      onSelectStation(station);
    }
  };

  const handleGenerateQrCode = () => {
    const journeyData = {
      museum: 'Adwa Victory Memorial Museum',
      currentStep: activeStation.step,
      station: activeStation.title,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
    
    const encoded = encodeURIComponent(
      `https://adwa-nexus.ai/journey?station=${activeStation.id}&step=${activeStation.step}`
    );
    // Custom styled QR code URL using qrserver API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=1A0D06&bgcolor=E6AC47&data=${encoded}`;
    setQrCodeUrl(qrUrl);
    setShowQrQrModal(true);
  };

  return (
    <section className="vjm" aria-label="Visitor Journey Map">
      {/* ── Top Header ───────────────────────────────────── */}
      <div className="vjm__header">
        <div className="vjm__header-text">
          <span className="vjm__badge">
            <span className="vjm__badge-dot" /> Sample Museum Layout
          </span>
          <h2 className="vjm__title">Visitor Journey Map</h2>
          <p className="vjm__subtitle">
            An interactive roadmap of the Adwa Victory Memorial Museum — follow the trail from arrival to the panorama hall and exit.
          </p>
        </div>

        <button
          type="button"
          className="vjm__qr-btn"
          onClick={handleGenerateQrCode}
          title="Generate QR code for this journey map"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 18h3v3h-3z" fill="currentColor" stroke="none" />
          </svg>
          Generate Journey QR Code
        </button>
      </div>

      {/* ── Visual Journey Map Diagram ───────────────────── */}
      <div className="vjm__canvas">
        {/* Decorative Background Grid */}
        <div className="vjm__grid-bg" aria-hidden="true" />

        {/* Winding Connecting Path (SVG) */}
        <svg className="vjm__path-svg" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 50,80 Q 150,20 250,90 T 450,110 T 650,70 T 850,120 T 950,280 L 800,280 Q 600,310 400,270 T 100,290"
            fill="none"
            stroke="rgba(230, 172, 71, 0.25)"
            strokeWidth="4"
            strokeDasharray="8 6"
          />
          <path
            d="M 50,80 Q 150,20 250,90 T 450,110 T 650,70"
            fill="none"
            stroke="#E6AC47"
            strokeWidth="4"
          />
        </svg>

        {/* Journey Map Nodes Grid */}
        <div className="vjm__nodes">
          {JOURNEY_STATIONS.map((st) => {
            const isSelected = activeStation.id === st.id;
            return (
              <button
                key={st.id}
                type="button"
                className={`vjm-node vjm-node--${st.type} vjm-node--${st.status} ${
                  isSelected ? 'vjm-node--selected' : ''
                }`}
                onClick={() => handleStationClick(st)}
                aria-label={`Step ${st.step}: ${st.title}`}
              >
                <div className="vjm-node__bubble">
                  <span className="vjm-node__icon">{st.icon}</span>
                  <span className="vjm-node__step-num">{st.step}</span>
                </div>

                <div className="vjm-node__info">
                  <span className="vjm-node__cat">{st.category}</span>
                  <h4 className="vjm-node__title">{st.title}</h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected Station Details Panel ───────────────── */}
      {activeStation && (
        <div className="vjm-card">
          <div className="vjm-card__header">
            <div className="vjm-card__badge">
              <span className="vjm-card__icon">{activeStation.icon}</span>
              <span>Step {activeStation.step} of {JOURNEY_STATIONS.length}</span>
            </div>

            <span className="vjm-card__time">⏱️ {activeStation.time}</span>
          </div>

          <h3 className="vjm-card__title">{activeStation.title}</h3>
          <p className="vjm-card__loc">📍 {activeStation.location}</p>
          <p className="vjm-card__desc">{activeStation.description}</p>

          <div className="vjm-card__highlights">
            <span className="vjm-card__hl-label">Station Highlights:</span>
            <ul>
              {activeStation.highlights.map((hl, i) => (
                <li key={i}>✓ {hl}</li>
              ))}
            </ul>
          </div>

          <div className="vjm-card__actions">
            <button
              type="button"
              className="vjm-btn vjm-btn--primary"
              onClick={handleGenerateQrCode}
            >
              Scan & Share Journey Code
            </button>
          </div>
        </div>
      )}

      {/* ── QR Code Modal Generator ──────────────────────── */}
      {showQrModal && (
        <div className="vjm-modal-overlay" onClick={() => setShowQrQrModal(false)}>
          <div className="vjm-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vjm-modal__close"
              onClick={() => setShowQrQrModal(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="vjm-modal__head">
              <span className="vjm-modal__badge">Adwa Nexus QR Code</span>
              <h3 className="vjm-modal__title">Visitor Journey Pass</h3>
              <p className="vjm-modal__sub">
                Scan this code at any museum kiosk or share it to load this exact journey route.
              </p>
            </div>

            <div className="vjm-modal__qr-wrap">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Journey Map QR Code" className="vjm-modal__qr-img" />
              ) : (
                <div className="vjm-modal__qr-fallback">Generating QR Code...</div>
              )}
            </div>

            <div className="vjm-modal__details">
              <p><strong>Station:</strong> {activeStation.title}</p>
              <p><strong>Location:</strong> {activeStation.location}</p>
              <p className="vjm-modal__code-text">
                <code>ADWA-MAP-STATION-{activeStation.step}-2026</code>
              </p>
            </div>

            <button
              type="button"
              className="vjm-btn vjm-btn--secondary"
              onClick={() => setShowQrQrModal(false)}
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
