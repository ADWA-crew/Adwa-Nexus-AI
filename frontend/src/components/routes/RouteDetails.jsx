import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RouteMap from './RouteMap';
import { routeMinutes, routeStopCount } from '../../data/routes';
import './RouteDetails.css';

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3,8.5 6.5,12 13,4.5" />
  </svg>
);

const PlayCircle = () => (
  <svg viewBox="0 0 18 18" width="14" height="14" fill="none" stroke="currentColor"
    strokeWidth="1.6" aria-hidden="true">
    <circle cx="9" cy="9" r="7.2" />
    <polygon points="7.4,5.8 7.4,12.2 12.6,9" fill="currentColor" stroke="none" />
  </svg>
);

const RouteDetails = ({ route }) => {
  const [done, setDone]       = useState(() => new Set());
  const [active, setActive]   = useState(-1);

  const total = routeStopCount(route);
  const walked = useMemo(
    () => Math.round((done.size / Math.max(1, total)) * 100),
    [done, total]
  );

  if (!route) return null;

  const toggle = (index) => {
    setActive(index);
    setDone((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="rd">

      {/* ── Progress ────────────────────────────────────── */}
      <div className="rd__progress">
        <div className="rd__progress-head">
          <span className="rd__progress-count">
            {done.size} of {total} stops
          </span>
          <span className="rd__progress-time">
            about {routeMinutes(route)} minutes of stops
          </span>
        </div>
        <div
          className="rd__track"
          role="progressbar"
          aria-label="Stops completed"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={walked}
        >
          <span className="rd__fill" style={{ width: `${walked}%` }} />
        </div>
        <p className="rd__hint">Tap a stop as you reach it to keep your place.</p>
      </div>

      <div className="rd__grid">

        {/* ── Stop timeline ─────────────────────────────── */}
        <ol className="rd__stops">
          {route.stops.map((stop, index) => {
            const complete = done.has(index);

            return (
              <li
                key={stop.name}
                className={`rd__stop${complete ? ' rd__stop--done' : ''}${
                  active === index ? ' rd__stop--active' : ''
                }`}
              >
                <button
                  type="button"
                  className="rd__marker"
                  onClick={() => toggle(index)}
                  aria-pressed={complete}
                  aria-label={
                    complete
                      ? `Mark ${stop.name} as not visited`
                      : `Mark ${stop.name} as visited`
                  }
                >
                  {complete ? <CheckIcon /> : index + 1}
                </button>

                <div className="rd__stop-body">
                  <div className="rd__stop-head">
                    <h3 className="rd__stop-name">{stop.name}</h3>
                    <span className="rd__stop-meta">
                      {stop.floor} · {stop.minutes} min
                    </span>
                  </div>

                  <p className="rd__stop-note">{stop.note}</p>

                  {stop.exhibitId && (
                    <Link className="rd__stop-link" to={`/exhibit/${stop.exhibitId}`}>
                      <PlayCircle />
                      Open this story
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <RouteMap route={route} activeIndex={active} />
      </div>
    </div>
  );
};

export default RouteDetails;
