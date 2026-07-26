import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exhibitParagraphs, readingMinutes } from '../../data/exhibits';
import { SpeakerIcon } from './icons';
import './TextView.css';

const SIZES = [
  { id: 'sm', label: 'A', title: 'Small text' },
  { id: 'md', label: 'A', title: 'Normal text' },
  { id: 'lg', label: 'A', title: 'Large text' },
];

export default function TextView({ exhibit, simple = false, onListen }) {
  const { t } = useTranslation();
  const [size, setSize] = useState(simple ? 'lg' : 'md');
  const paragraphs = exhibitParagraphs(exhibit, simple);

  return (
    <div className={`tv tv--${size}`}>

      <div className="tv__bar">
        <span className="tv__meta">
          {t('exhibit.minRead', { minutes: readingMinutes(exhibit, simple) })}
        </span>

        <div className="tv__sizes" role="group" aria-label={t('exhibit.textSize')}>
          {SIZES.map(({ id, label, title }) => (
            <button
              key={id}
              type="button"
              title={title}
              aria-pressed={size === id}
              className={`tv__size tv__size--${id}${size === id ? ' tv__size--on' : ''}`}
              onClick={() => setSize(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <article className="tv__body">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={index === 0 ? 'tv__lead' : undefined}>
            {paragraph}
          </p>
        ))}
      </article>

      <ul className="tv__facts">
        {(exhibit.facts || []).map(({ label, value }) => (
          <li key={label} className="tv__fact">
            <span className="tv__fact-label">{label}</span>
            <span className="tv__fact-value">{value}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="tv__listen" onClick={onListen}>
        <SpeakerIcon />
        {t('exhibit.preferToListen')}
      </button>
    </div>
  );
}
