import { useEffect, useState } from 'react';
import FormatTabs from './FormatTabs';
import TextView from './TextView';
import AudioNarrator from './AudioNarrator';
import VideoView from './VideoView';
import { SpeakerIcon, TextIcon, VideoIcon } from './icons';
import './ExhibitViewer.css';

const FORMATS = [
  { id: 'text',  label: 'Read',   hint: 'Full story', Icon: TextIcon },
  { id: 'audio', label: 'Listen', hint: 'Read aloud', Icon: SpeakerIcon },
  { id: 'video', label: 'Watch',  hint: 'Short film', Icon: VideoIcon },
];

export default function ExhibitViewer({ exhibit, simple = false, startWith = 'text' }) {
  const [format, setFormat] = useState(startWith);

  /* Every new exhibit opens on this profile's preferred format */
  useEffect(() => setFormat(startWith), [exhibit.id, startWith]);

  return (
    <article className="ev">

      {/* ── Header ──────────────────────────────────────── */}
      <header className="ev__head">
        <div className="ev__thumb" aria-hidden="true">
          {exhibit.image ? (
            <img src={exhibit.image} alt="" loading="lazy" />
          ) : (
            <span className="ev__monogram">{exhibit.title.charAt(0)}</span>
          )}
        </div>

        <div className="ev__heading">
          <div className="ev__tags">
            <span className="ev__tag ev__tag--era">{exhibit.era}</span>
            <span className="ev__tag">{exhibit.gallery}</span>
          </div>
          <h2 className="ev__title">{exhibit.title}</h2>
          <p className="ev__subtitle">{exhibit.subtitle}</p>
        </div>
      </header>

      {/* ── Format switch ───────────────────────────────── */}
      <FormatTabs formats={FORMATS} active={format} onChange={setFormat} />

      {/* ── Selected format ─────────────────────────────── */}
      <div
        className="ev__panel"
        key={`${exhibit.id}-${format}`}
        role="tabpanel"
        id={`fmt-panel-${format}`}
        aria-labelledby={`fmt-tab-${format}`}
      >
        {format === 'text' && (
          <TextView
            exhibit={exhibit}
            simple={simple}
            onListen={() => setFormat('audio')}
          />
        )}
        {format === 'audio' && (
          <AudioNarrator
            exhibit={exhibit}
            simple={simple}
            onRead={() => setFormat('text')}
          />
        )}
        {format === 'video' && (
          <VideoView exhibit={exhibit} onRead={() => setFormat('text')} />
        )}
      </div>
    </article>
  );
}
