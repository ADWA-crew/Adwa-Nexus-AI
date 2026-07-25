import { useEffect, useState } from 'react';
import { PlayIcon, TextIcon } from './icons';
import './VideoView.css';

/* The iframe is mounted only after a press, so the page never pulls
   YouTube's player until a visitor actually wants the film. */
const embedUrl = (youtubeId) =>
  `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

const thumbUrl = (youtubeId) =>
  `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

const watchUrl = (youtubeId) => `https://www.youtube.com/watch?v=${youtubeId}`;

export default function VideoView({ exhibit, onRead }) {
  const [started, setStarted] = useState(false);

  /* A new exhibit returns to the cover */
  useEffect(() => setStarted(false), [exhibit.id]);

  return (
    <div className="vv">
      <div className={`vv__frame${started ? ' vv__frame--live' : ''}`}>
        {started ? (
          <iframe
            key={exhibit.id}
            className="vv__embed"
            src={embedUrl(exhibit.youtubeId)}
            title={`${exhibit.title} — museum film`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" className="vv__cover" onClick={() => setStarted(true)}>
            <img
              className="vv__poster"
              src={thumbUrl(exhibit.youtubeId)}
              alt=""
              loading="lazy"
            />
            <span className="vv__scrim" aria-hidden="true" />
            <span className="vv__cover-glow" aria-hidden="true" />
            <span className="vv__play">
              <PlayIcon size={26} />
            </span>
            <span className="vv__cover-text">
              <strong>Watch the short film</strong>
              {exhibit.videoCaption}
            </span>
          </button>
        )}
      </div>

      <div className="vv__footer">
        <p className="vv__caption">{exhibit.videoCaption}</p>

        <div className="vv__actions">
          <a
            className="vv__read"
            href={watchUrl(exhibit.youtubeId)}
            target="_blank"
            rel="noreferrer"
          >
            Open on YouTube
          </a>
          <button type="button" className="vv__read" onClick={onRead}>
            <TextIcon />
            Read the transcript
          </button>
        </div>
      </div>
    </div>
  );
}
