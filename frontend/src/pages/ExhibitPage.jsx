import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import FormatTabs from '../components/researcher/FormatTabs';
import TextView from '../components/researcher/TextView';
import AudioNarrator from '../components/researcher/AudioNarrator';
import VideoView from '../components/researcher/VideoView';
import { SpeakerIcon, TextIcon, VideoIcon } from '../components/researcher/icons';
import { getExhibit } from '../data/exhibits';
import './ExhibitPage.css';

const FORMATS = [
  { id: 'text',  label: 'Read',   hint: 'Full story', Icon: TextIcon },
  { id: 'audio', label: 'Listen', hint: 'Read aloud', Icon: SpeakerIcon },
  { id: 'video', label: 'Watch',  hint: 'Short film', Icon: VideoIcon },
];

const VALID_FORMATS = FORMATS.map((f) => f.id);

/* Falls back to the exhibit image, then YouTube's own still */
const backdropFor = (exhibit) =>
  exhibit.image || `https://img.youtube.com/vi/${exhibit.youtubeId}/maxresdefault.jpg`;

export default function ExhibitPage() {
  const { id } = useParams();
  const [params] = useSearchParams();

  const exhibit = getExhibit(id);
  /* QR codes can target a format directly, e.g. ?format=audio */
  const requested = params.get('format');
  const simple = params.get('simple') === '1';

  const [format, setFormat] = useState(
    VALID_FORMATS.includes(requested) ? requested : 'text'
  );

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  /* Switching format must silence whatever was playing */
  const changeFormat = (next) => {
    window.speechSynthesis?.cancel();
    setFormat(next);
  };

  if (!exhibit) {
    return (
      <div className="xh">
        <Navbar />
        <main className="xh__missing">
          <h1>This code has no exhibit yet</h1>
          <p>
            The label may be from another gallery. Please try the code on the
            display again.
          </p>
          <Link className="xh__home" to="/">
            Back to the museum
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="xh">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────── */}
      <header className="xh__hero">
        <img
          className="xh__hero-img"
          src={backdropFor(exhibit)}
          alt=""
          loading="eager"
        />
        <span className="xh__hero-scrim" aria-hidden="true" />

        <div className="xh__hero-body">
          <div className="xh__tags">
            <span className="xh__tag xh__tag--era">{exhibit.era}</span>
            <span className="xh__tag">{exhibit.gallery}</span>
          </div>

          <h1 className="xh__title">{exhibit.title}</h1>
          <p className="xh__subtitle">{exhibit.subtitle}</p>
        </div>
      </header>

      {/* ── Format switch ───────────────────────────────── */}
      <div className="xh__switch">
        <div className="xh__switch-inner">
          <FormatTabs formats={FORMATS} active={format} onChange={changeFormat} />
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="xh__main">
        <div className="xh__panel" key={format}>
          {format === 'text' && (
            <TextView
              exhibit={exhibit}
              simple={simple}
              onListen={() => changeFormat('audio')}
            />
          )}
          {format === 'audio' && (
            <AudioNarrator
              exhibit={exhibit}
              simple={simple}
              onRead={() => changeFormat('text')}
            />
          )}
          {format === 'video' && (
            <VideoView exhibit={exhibit} onRead={() => changeFormat('text')} />
          )}
        </div>
      </main>
    </div>
  );
}
