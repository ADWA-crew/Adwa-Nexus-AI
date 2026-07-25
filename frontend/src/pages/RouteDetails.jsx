import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import RouteDetailsView from '../components/routes/RouteDetails';
import { MUSEUM, getRoute, routeStopCount } from '../data/routes';
import './RouteDetails.css';

const BackArrow = () => (
  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="16" y1="10" x2="4" y2="10" />
    <polyline points="9,5 4,10 9,15" />
  </svg>
);

const RouteDetails = () => {
  const { id } = useParams();
  const route = getRoute(id);

  if (!route) {
    return (
      <div className="rdp">
        <Navbar />
        <main className="rdp__main rdp__main--empty">
          <h1 className="rdp__title">Route not found</h1>
          <p className="rdp__text">
            That route is not part of the {MUSEUM.name} plan.
          </p>
          <Link className="rdp__back" to="/routes">
            <BackArrow />
            All routes
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="rdp">
      <Navbar />

      <main className="rdp__main">
        <Link className="rdp__back" to="/routes">
          <BackArrow />
          All routes
        </Link>

        <header className="rdp__head">
          <span className="rdp__audience">{route.audience}</span>
          <h1 className="rdp__title">{route.title}</h1>
          <p className="rdp__text">{route.summary}</p>

          <ul className="rdp__facts">
            <li>
              <span>Time</span>
              {route.duration}
            </li>
            <li>
              <span>Stops</span>
              {routeStopCount(route)}
            </li>
            <li>
              <span>Levels</span>
              {route.floors}
            </li>
            <li>
              <span>Access</span>
              {route.accessible ? 'Step-free' : 'Stairs on part of the route'}
            </li>
          </ul>
        </header>

        <RouteDetailsView route={route} />
      </main>
    </div>
  );
};

export default RouteDetails;
