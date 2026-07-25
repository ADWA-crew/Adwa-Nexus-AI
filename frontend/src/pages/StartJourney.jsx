import { Link } from 'react-router-dom';
import CinematicBackdrop from '../components/common/CinematicBackdrop';
import GashaEmblem from '../components/common/GashaEmblem';
import LanguageSelect from '../components/common/LanguageSelect';
import PersonalizationForm from '../components/home/PersonalizationForm';
import './StartJourney.css';

const BackArrow = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="13" y1="8" x2="3" y2="8" />
    <polyline points="7,4 3,8 7,12" />
  </svg>
);

export default function StartJourney() {
  return (
    <main className="sj">
      <CinematicBackdrop />

      {/* Top bar — back link left, language right */}
      <div className="sj__topbar">
        <Link to="/" className="sj__back">
          <BackArrow />
          Back to home
        </Link>
        <LanguageSelect />
      </div>

      {/* Split: form left, emblem right */}
      <div className="sj__grid">
        <div className="sj__form">
          <PersonalizationForm />
        </div>

        <div className="sj__emblem">
          <GashaEmblem />
        </div>
      </div>
    </main>
  );
}
