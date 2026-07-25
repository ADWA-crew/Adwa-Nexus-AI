import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import QrScanner from '../components/researcher/QrScanner';
import ScanPrompt from '../components/researcher/ScanPrompt';
import ExhibitViewer from '../components/researcher/ExhibitViewer';
import RecentExhibits from '../components/researcher/RecentExhibits';
import { useVisitor } from '../hooks/useVisitor';
import { DEMO_CODES, getExhibit } from '../data/exhibits';
import { storage } from '../utils/storage';

import './ResearcherPage.css';

const HISTORY_KEY = 'adwa:visited-exhibits';
const HISTORY_MAX = 6;

export default function ResearcherPage() {
  /* Visitor comes from VisitorContext once the provider has data;
     ?visitor= in the QR link and 'Guest' cover the meantime. */
  const visitorContext = useVisitor();
  const [visitorName, setVisitorName] = useState('Guest');

  const [exhibit, setExhibit]         = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [notice, setNotice]           = useState('');
  const [history, setHistory]         = useState(() => storage.get(HISTORY_KEY) || []);

  const openExhibit = useCallback((payload) => {
    const match = getExhibit(payload);

    if (!match) {
      setNotice(`That code is not in this museum yet. Try ${DEMO_CODES.join(', ')}.`);
      return;
    }

    window.speechSynthesis?.cancel();
    setNotice('');
    setExhibit(match);
    setScannerOpen(false);

    setHistory((previous) => {
      const next = [match.id, ...previous.filter((id) => id !== match.id)]
        .slice(0, HISTORY_MAX);
      storage.set(HISTORY_KEY, next);
      return next;
    });

    requestAnimationFrame(() =>
      document.getElementById('exhibit')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    );
  }, []);

  /* Resolve the visitor name and any exhibit carried in the QR link */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contextName = visitorContext?.visitor?.name;
    const nameParam = params.get('visitor') || params.get('name');

    if (contextName) setVisitorName(contextName);
    else if (nameParam) setVisitorName(nameParam);
  }, [visitorContext?.visitor?.name]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const exhibitParam = params.get('exhibit') || params.get('id');
    if (exhibitParam) openExhibit(exhibitParam);
  }, [openExhibit]);

  /* Never let a narration outlive the page */
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const startScan = () => {
    setNotice('');
    setScannerOpen(true);
  };

  return (
    <div className="researcher">
      <Navbar />

      <main className="researcher__main">

        {/* ── Welcome ─────────────────────────────────────── */}
        <section className="rp-welcome" aria-label="Welcome">
          <span className="rp-welcome__badge">Museum guide</span>
          <h1 className="rp-welcome__title">
            Hello, <span className="rp-welcome__name">{visitorName}</span>
          </h1>
          <p className="rp-welcome__text">
            Welcome to our museum — we are happy to have you here. Every exhibit
            tells its story in the way that suits you best.
          </p>
        </section>

        {/* ── Scan or exhibit ─────────────────────────────── */}
        <div id="exhibit" className="researcher__stage">
          {exhibit ? (
            <ExhibitViewer exhibit={exhibit} onScanAnother={startScan} />
          ) : (
            <ScanPrompt
              notice={notice}
              onScanClick={startScan}
              onOpenCode={openExhibit}
            />
          )}
        </div>

        <RecentExhibits
          ids={history}
          currentId={exhibit?.id}
          onOpen={openExhibit}
        />
      </main>

      {scannerOpen && (
        <QrScanner
          notice={notice}
          onScan={openExhibit}
          onClose={() => { setNotice(''); setScannerOpen(false); }}
        />
      )}
    </div>
  );
}
