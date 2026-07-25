import { useCallback, useEffect, useState } from 'react';
import QrScanner from './QrScanner';
import ExhibitPicker from './ExhibitPicker';
import ExhibitViewer from './ExhibitViewer';
import { EXHIBIT_IDS, getExhibit } from '../../data/exhibits';
import { artifactService } from '../../services/artifact.service';
import { FEATURES } from '../../utils/constants';
import { QrGlyph, ScanIcon } from './icons';
import './ScanStage.css';

/**
 * The exhibit entry point shared by every visitor profile: one scan
 * button, then the scanned exhibit in text, audio and video.
 */
export default function ScanStage({
  simple = false,
  startWith = 'text',
  variant = 'default',
  title = 'Scan the code beside an exhibit',
  text = 'Point your camera at the QR code on any display to open its story.',
}) {
  const [exhibit, setExhibit] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const showExhibit = useCallback((match) => {
    window.speechSynthesis?.cancel();
    setNotice('');
    setExhibit(match);
    setScannerOpen(false);

    requestAnimationFrame(() =>
      document.getElementById('exhibit')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      }),
    );
  }, []);

  const resolveExhibit = useCallback(
    async (payload) => {
      if (!payload) return null;

      try {
        return await artifactService.resolveQr(payload);
      } catch {
        return getExhibit(payload);
      }
    },
    [],
  );

  /* A ?exhibit= link opens an exhibit without a camera */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linked = params.get('exhibit') || params.get('id');
    if (!linked) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      const match = await resolveExhibit(linked);
      if (!cancelled && match) showExhibit(match);
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [resolveExhibit, showExhibit]);

  /* Narration must not follow the visitor off the page */
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const open = useCallback(
    async (payload) => {
      setLoading(true);
      const match = await resolveExhibit(payload);
      setLoading(false);

      if (!match) {
        setNotice('That code does not belong to an exhibit in this museum.');
        return;
      }

      showExhibit(match);
    },
    [resolveExhibit, showExhibit],
  );

  const startScan = () => {
    setNotice('');
    setScannerOpen(true);
  };

  return (
    <div className={`ss ss--${variant}`}>

      {exhibit ? (
        <>
          <div className="ss__bar">
            <p className="ss__bar-text">Scanned exhibit</p>
            <button type="button" className="ss__again" onClick={startScan}>
              <ScanIcon size={15} />
              Scan another
            </button>
          </div>

          <div id="exhibit" className="ss__stage">
            <ExhibitViewer
              exhibit={exhibit}
              simple={simple}
              startWith={startWith}
            />
          </div>
        </>
      ) : (
        <section className="ss__cta" aria-label="Scan an exhibit code">
          <div className="ss__art" aria-hidden="true">
            <span className="ss__art-ring" />
            <QrGlyph size={62} />
          </div>

          <h2 className="ss__title">{title}</h2>
          <p className="ss__text">{text}</p>

          <button type="button" className="ss__scan" onClick={startScan} disabled={loading}>
            <ScanIcon size={19} />
            {loading ? 'Opening exhibit…' : 'Scan QR code'}
          </button>

          {notice && <p className="ss__notice" role="status">{notice}</p>}
        </section>
      )}

      {FEATURES.exhibitPicker && (
        <ExhibitPicker
          activeId={exhibit?.id ?? EXHIBIT_IDS[0]}
          onSelect={open}
          variant={variant === 'playful' ? 'playful' : 'default'}
        />
      )}

      {scannerOpen && (
        <QrScanner
          notice={notice}
          onScan={open}
          onClose={() => { setNotice(''); setScannerOpen(false); }}
        />
      )}
    </div>
  );
}
