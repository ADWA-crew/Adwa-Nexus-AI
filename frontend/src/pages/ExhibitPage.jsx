import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import FormatTabs from '../components/researcher/FormatTabs';
import TextView from '../components/researcher/TextView';
import AudioNarrator from '../components/researcher/AudioNarrator';
import VideoView from '../components/researcher/VideoView';
import { SpeakerIcon, TextIcon, VideoIcon } from '../components/researcher/icons';
import { getExhibit } from '../data/exhibits';
import { artifactService } from '../services/artifact.service';
import './ExhibitPage.css';

/* Falls back to the exhibit image, then YouTube's own still */
const backdropFor = (exhibit) =>
  exhibit.image || `https://img.youtube.com/vi/${exhibit.youtubeId}/maxresdefault.jpg`;

export default function ExhibitPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [params] = useSearchParams();

  const formats = [
    { id: 'text',  label: t('exhibit.readTab'),   hint: t('exhibit.fullStory'), Icon: TextIcon },
    { id: 'audio', label: t('exhibit.listenTab'), hint: t('exhibit.readAloud'), Icon: SpeakerIcon },
    { id: 'video', label: t('exhibit.watchTab'),  hint: t('exhibit.shortFilm'), Icon: VideoIcon },
  ];

  const validFormats = formats.map((f) => f.id);

  const [exhibit, setExhibit] = useState(null);
  const [loading, setLoading] = useState(true);

  /* QR codes can target a format directly, e.g. ?format=audio */
  const requested = params.get('format');
  const simple = params.get('simple') === '1';

  const [format, setFormat] = useState(
    validFormats.includes(requested) ? requested : 'text'
  );

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await artifactService.getById(id);
        if (!cancelled) setExhibit(data);
      } catch {
        if (!cancelled) setExhibit(getExhibit(id));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /* Switching format must silence whatever was playing */
  const changeFormat = (next) => {
    window.speechSynthesis?.cancel();
    setFormat(next);
  };

  if (loading) {
    return (
      <div className="xh">
        <Navbar />
        <main className="xh__missing">
          <h1>{t('scan.openingExhibit')}</h1>
        </main>
      </div>
    );
  }

  if (!exhibit) {
    return (
      <div className="xh">
        <Navbar />
        <main className="xh__missing">
          <h1>{t('exhibit.missingTitle')}</h1>
          <p>
            {t('exhibit.missingText')}
          </p>
          <Link className="xh__home" to="/">
            {t('exhibit.backToMuseum')}
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
          <FormatTabs formats={formats} active={format} onChange={changeFormat} />
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
