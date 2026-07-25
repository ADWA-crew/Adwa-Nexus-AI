import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import './LanguageSelect.css';

const GlobeIcon = () => (
  <svg viewBox="0 0 18 18" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="9" cy="9" r="7.5" />
    <path d="M9 1.5C9 1.5 6 5 6 9s3 7.5 3 7.5S12 13 12 9 9 1.5 9 1.5z" />
    <line x1="1.5" y1="9" x2="16.5" y2="9" />
    <line x1="2.5" y1="6" x2="15.5" y2="6" />
    <line x1="2.5" y1="12" x2="15.5" y2="12" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="2,4 6,8 10,4" />
  </svg>
);

/**
 * Shared language switcher. Reads and writes LanguageContext so every
 * instance across the app stays in sync.
 */
export default function LanguageSelect({ className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { setLanguage, activeLanguage, languages } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const select = (lang) => {
    setLanguage(lang.value);
    setOpen(false);
  };

  return (
    <div className={`lang ${className}`.trim()} ref={ref}>
      <button
        type="button"
        className="lang__trigger"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className="lang__globe" aria-hidden="true">
          <GlobeIcon />
        </span>
        <span className="lang__code">{activeLanguage.code}</span>
        <span className={`lang__chevron${open ? ' lang__chevron--open' : ''}`}>
          <ChevronDown />
        </span>
      </button>

      {open && (
        <ul className="lang__dropdown" role="listbox" aria-label="Languages">
          {languages.map((lang) => (
            <li
              key={lang.value}
              role="option"
              aria-selected={lang.value === activeLanguage.value}
              className={`lang__option${lang.value === activeLanguage.value ? ' lang__option--active' : ''}`}
              onClick={() => select(lang)}
            >
              <span className="lang__option-code">{lang.code}</span>
              <span className="lang__option-label">{lang.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
