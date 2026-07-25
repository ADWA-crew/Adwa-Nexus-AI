import { useCallback, useEffect, useState } from 'react';
import QrScanner from './QrScanner';
import ExhibitPicker from './ExhibitPicker';
import ExhibitViewer from './ExhibitViewer';
import { EXHIBIT_IDS, EXHIBITS, getExhibit } from '../../data/exhibits';
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
  const [activeId, setActiveId]       = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [notice, setNotice]           = useState('');

  /* A ?exhibit= link opens an exhibit without a camera */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linked = getExhibit(params.get('exhibit') || params.get('id'));
    if (linked) setActiveId(linked.id);
  }, []);

  /* Narration must not follow the visitor off the page */
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const open = useCallback((payload) => {
    const match = getExhibit(payload);

    if (!match) {
      setNotice('That code does not belong to an exhibit in this museum.');
      return;
    }

    window.speechSynthesis?.cancel();
    setNotice('');
    setActiveId(match.id);
    setScannerOpen(false);

    requestAnimationFrame(() =>
      document.getElementById('exhibit')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    );
  }, []);

  const startScan = () => {
    setNotice('');
    setScannerOpen(true);
  };

  const exhibit = activeId ? EXHIBITS[activeId] : null;

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

          <button type="button" className="ss__scan" onClick={startScan}>
            <ScanIcon size={19} />
            Scan QR code
          </button>

          {notice && <p className="ss__notice" role="status">{notice}</p>}
        </section>
      )}

      {/* Browsing without a code returns in a later milestone */}
      {FEATURES.exhibitPicker && (
        <ExhibitPicker
          activeId={activeId ?? EXHIBIT_IDS[0]}
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
