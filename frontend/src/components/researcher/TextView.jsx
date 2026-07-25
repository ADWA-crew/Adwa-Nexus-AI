import { useState } from 'react';
import { readingMinutes } from '../../data/exhibits';
import { SpeakerIcon } from './icons';
import './TextView.css';

const SIZES = [
  { id: 'sm', label: 'A', title: 'Small text' },
  { id: 'md', label: 'A', title: 'Normal text' },
  { id: 'lg', label: 'A', title: 'Large text' },
];

export default function TextView({ exhibit, onListen }) {
  const [size, setSize] = useState('md');

  return (
    <div className={`tv tv--${size}`}>

      <div className="tv__bar">
        <span className="tv__meta">
          {readingMinutes(exhibit)} min read
        </span>

        <div className="tv__sizes" role="group" aria-label="Text size">
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
        {exhibit.paragraphs.map((paragraph, index) => (
          <p key={index} className={index === 0 ? 'tv__lead' : undefined}>
            {paragraph}
          </p>
        ))}
      </article>

      <ul className="tv__facts">
        {exhibit.facts.map(({ label, value }) => (
          <li key={label} className="tv__fact">
            <span className="tv__fact-label">{label}</span>
            <span className="tv__fact-value">{value}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="tv__listen" onClick={onListen}>
        <SpeakerIcon />
        Prefer to listen? Play the narration
      </button>
    </div>
  );
}
