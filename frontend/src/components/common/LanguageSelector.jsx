import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';
import './LanguageSelect.css';

/** App languages shown in the navbar switcher */
export const APP_LANGUAGES = [
  { code: 'EN', value: 'en', label: 'English' },
  { code: 'አማ', value: 'am', label: 'አማርኛ' },
];

/**
 * Dark glass language dropdown (globe + short label + chevron).
 * Uses react-i18next — selecting an option calls i18n.changeLanguage().
 *
 * Note: this project uses the existing LanguageSelect.css tokens
 * (not Tailwind) so the switcher matches the rest of the UI.
 */
export default function LanguageSelector({ className = '' }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const resolved = (i18n.resolvedLanguage || i18n.language || 'am').split('-')[0];
  const current =
    APP_LANGUAGES.find((lang) => lang.value === resolved) ||
    APP_LANGUAGES.find((lang) => lang.value === 'am') ||
    APP_LANGUAGES[0];

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const select = (value) => {
    i18n.changeLanguage(value);
    setOpen(false);
  };

  return (
    <div className={`lang ${className}`.trim()} ref={ref}>
      <button
        type="button"
        className="lang__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('nav.selectLanguage')}
      >
        <span className="lang__globe" aria-hidden="true">
          <Globe size={15} strokeWidth={1.75} />
        </span>
        <span className="lang__code">{current.code}</span>
        <span className={`lang__chevron${open ? ' lang__chevron--open' : ''}`}>
          <ChevronDown size={11} strokeWidth={2.25} />
        </span>
      </button>

      {open && (
        <ul className="lang__dropdown" role="listbox" aria-label={t('nav.selectLanguage')}>
          {APP_LANGUAGES.map((lang) => {
            const active = lang.value === current.value;
            return (
              <li
                key={lang.value}
                role="option"
                aria-selected={active}
                className={`lang__option${active ? ' lang__option--active' : ''}`}
                onClick={() => select(lang.value)}
              >
                <span className="lang__option-code">{lang.code}</span>
                <span className="lang__option-label">{lang.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
