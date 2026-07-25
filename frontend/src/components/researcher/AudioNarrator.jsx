import { useEffect, useMemo, useRef } from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import { exhibitScript } from '../../data/exhibits';
import { PauseIcon, PlayIcon, RestartIcon, SpeakerIcon } from './icons';
import './AudioNarrator.css';

const SPEEDS = [0.8, 1, 1.25];

/* Word offsets let the transcript light up in step with the voice */
const tokenize = (script) => {
  const tokens = [];
  const pattern = /\S+/g;
  let match = pattern.exec(script);

  while (match) {
    tokens.push({
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
    match = pattern.exec(script);
  }

  return tokens;
};

export default function AudioNarrator({ exhibit, simple = false, onRead }) {
  const script = useMemo(() => exhibitScript(exhibit, simple), [exhibit, simple]);
  const tokens = useMemo(() => tokenize(script), [script]);

  const { supported, status, charIndex, progress, rate, changeRate, toggle, stop, play } =
    useSpeech(script);

  const transcriptRef = useRef(null);
  const activeRef     = useRef(null);

  const activeIndex = useMemo(() => {
    if (charIndex < 0) return -1;
    const exact = tokens.findIndex((t) => charIndex >= t.start && charIndex < t.end);
    if (exact !== -1) return exact;
    /* Some voices report the index just before a word starts */
    return tokens.findIndex((t) => t.start >= charIndex);
  }, [charIndex, tokens]);

  /* Keep the spoken word visible without moving the whole page */
  useEffect(() => {
    const node = activeRef.current;
    const box  = transcriptRef.current;
    if (!node || !box) return;

    const nodeTop = node.offsetTop - box.offsetTop;
    const target  = nodeTop - box.clientHeight / 2 + node.clientHeight / 2;
    box.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }, [activeIndex]);

  if (!supported) {
    return (
      <div className="an an--fallback">
        <SpeakerIcon size={22} />
        <p>
          This browser cannot read text aloud. Chrome, Edge and Safari support
          narration — meanwhile the full story is on the Read tab.
        </p>
        <button type="button" className="an__link" onClick={onRead}>
          Open the written story
        </button>
      </div>
    );
  }

  const playing = status === 'speaking';

  return (
    <div className="an">

      {/* ── Player ──────────────────────────────────────── */}
      <div className="an__player">
        <button
          type="button"
          className={`an__play${playing ? ' an__play--on' : ''}`}
          onClick={toggle}
          aria-label={playing ? 'Pause narration' : 'Play narration'}
        >
          <span className="an__play-ring" aria-hidden="true" />
          {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
        </button>

        <div className="an__info">
          <p className="an__title">
            {status === 'idle'    && 'Listen to this exhibit'}
            {status === 'speaking' && 'Narrating…'}
            {status === 'paused'  && 'Paused'}
          </p>
          <p className="an__sub">
            {status === 'idle'
              ? 'The guide reads the full story aloud and follows along with the text.'
              : 'Words highlight as they are spoken.'}
          </p>

          <div
            className="an__track"
            role="progressbar"
            aria-label="Narration progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <span className="an__fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* ── Controls ────────────────────────────────────── */}
      <div className="an__controls">
        <div className="an__speeds" role="group" aria-label="Narration speed">
          {SPEEDS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={rate === value}
              className={`an__speed${rate === value ? ' an__speed--on' : ''}`}
              onClick={() => changeRate(value)}
            >
              {value}×
            </button>
          ))}
        </div>

        <div className="an__side">
          <button
            type="button"
            className="an__ghost"
            onClick={play}
            disabled={status === 'idle'}
          >
            <RestartIcon />
            Restart
          </button>
          <button
            type="button"
            className="an__ghost"
            onClick={stop}
            disabled={status === 'idle'}
          >
            Stop
          </button>
        </div>
      </div>

      {/* ── Follow-along transcript ─────────────────────── */}
      <div className="an__transcript" ref={transcriptRef}>
        {tokens.map((token, index) => (
          <span
            key={`${token.start}-${index}`}
            ref={index === activeIndex ? activeRef : null}
            className={
              index === activeIndex
                ? 'an__word an__word--now'
                : index < activeIndex
                  ? 'an__word an__word--done'
                  : 'an__word'
            }
          >
            {token.text}{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
