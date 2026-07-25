import { Link } from 'react-router-dom';
import { routeStopCount } from '../../data/routes';
import './RouteCard.css';

const ArrowRight = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="10" x2="16" y2="10" />
    <polyline points="11,5 16,10 11,15" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <circle cx="8" cy="8" r="6.4" />
    <polyline points="8,4.4 8,8 10.6,9.4" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 14.5s5-4.2 5-7.6a5 5 0 0 0-10 0c0 3.4 5 7.6 5 7.6z" />
    <circle cx="8" cy="6.8" r="1.8" />
  </svg>
);

const RouteCard = ({ route, recommended = false }) => {
  if (!route) return null;

  return (
    <article className={`rc${recommended ? ' rc--recommended' : ''}`}>
      {recommended && <span className="rc__flag">Picked for you</span>}

      <header className="rc__head">
        <span className="rc__audience">{route.audience}</span>
        <h3 className="rc__title">{route.title}</h3>
        <p className="rc__tagline">{route.tagline}</p>
      </header>

      <ul className="rc__meta">
        <li>
          <ClockIcon />
          {route.duration}
        </li>
        <li>
          <PinIcon />
          {routeStopCount(route)} stops
        </li>
        <li className="rc__meta-floors">{route.floors}</li>
      </ul>

      <Link className="rc__open" to={`/routes/${route.id}`}>
        See the route
        <ArrowRight />
      </Link>
    </article>
  );
};

export default RouteCard;
