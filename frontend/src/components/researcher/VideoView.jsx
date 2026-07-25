import { useEffect, useRef, useState } from 'react';
import { PlayIcon, TextIcon } from './icons';
import './VideoView.css';

export default function VideoView({ exhibit, onRead }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed]   = useState(false);

  /* A new exhibit means a fresh poster and a stopped player */
  useEffect(() => {
    setStarted(false);
    setFailed(false);
    return () => videoRef.current?.pause();
  }, [exhibit.id]);

  const start = () => {
    setStarted(true);
    videoRef.current?.play();
  };

  return (
    <div className="vv">
      <div className={`vv__frame${started ? ' vv__frame--live' : ''}`}>
        <video
          ref={videoRef}
          key={exhibit.id}
          className="vv__video"
          src={exhibit.videoUrl}
          poster={exhibit.image || undefined}
          controls={started}
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          onPause={() => { if (videoRef.current?.ended) setStarted(false); }}
        />

        {!started && !failed && (
          <button type="button" className="vv__cover" onClick={start}>
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

        {failed && (
          <div className="vv__error">
            <p>The film could not be loaded. Please check the connection.</p>
            <button type="button" className="vv__error-btn" onClick={onRead}>
              Read the story instead
            </button>
          </div>
        )}
      </div>

      <div className="vv__footer">
        <p className="vv__caption">{exhibit.videoCaption}</p>
        <button type="button" className="vv__read" onClick={onRead}>
          <TextIcon />
          Read the transcript
        </button>
      </div>
    </div>
  );
}
