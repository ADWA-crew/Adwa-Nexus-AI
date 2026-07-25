import { useState } from 'react';
import { EXHIBITS, DEMO_CODES } from '../../data/exhibits';
import { ArrowRightIcon, QrGlyph, ScanIcon } from './icons';
import './ScanPrompt.css';

export default function ScanPrompt({ notice, onScanClick, onOpenCode }) {
  const [code, setCode] = useState('');

  const submit = (event) => {
    event.preventDefault();
    onOpenCode(code);
  };

  return (
    <section className="sp" id="scan" aria-label="Scan an exhibit code">

      <div className="sp__art" aria-hidden="true">
        <span className="sp__art-ring" />
        <QrGlyph size={66} />
      </div>

      <div className="sp__body">
        <h2 className="sp__title">Scan the code beside an exhibit</h2>
        <p className="sp__text">
          One scan opens the exhibit in three ways — read the story, hear it
          narrated aloud, or watch a short film.
        </p>

        <button type="button" className="sp__scan" onClick={onScanClick}>
          <ScanIcon size={18} />
          Scan QR code
        </button>

        <form className="sp__form" onSubmit={submit}>
          <label className="sp__label" htmlFor="exhibit-code">
            No camera? Enter the code printed on the display
          </label>
          <div className="sp__row">
            <input
              id="exhibit-code"
              className="sp__input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="adwa-victory"
              autoComplete="off"
              spellCheck="false"
            />
            <button type="submit" className="sp__go" aria-label="Open exhibit">
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </form>

        {notice && <p className="sp__notice" role="status">{notice}</p>}

        <div className="sp__demo">
          <span className="sp__demo-label">Try an exhibit</span>
          <ul className="sp__demo-list">
            {DEMO_CODES.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  className="sp__chip"
                  onClick={() => onOpenCode(id)}
                >
                  {EXHIBITS[id].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
