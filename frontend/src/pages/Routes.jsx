import { useMemo, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import RouteCard from '../components/routes/RouteCard';
import { useVisitor } from '../hooks/useVisitor';
import { MUSEUM, ROUTE_FILTERS, filterRoutes } from '../data/routes';
import './Routes.css';

const Routes = () => {
  const [filter, setFilter] = useState('all');
  const { session } = useVisitor() ?? {};

  /* Routes the personalization step already suggested for this visitor */
  const recommendedIds = useMemo(
    () => new Set((session?.experience?.recommendedRoutes ?? []).map((r) => r.id)),
    [session]
  );

  const routes = useMemo(() => {
    const list = filterRoutes(filter);
    /* Anything picked for this visitor floats to the top */
    return [...list].sort(
      (a, b) => Number(recommendedIds.has(b.id)) - Number(recommendedIds.has(a.id))
    );
  }, [filter, recommendedIds]);

  return (
    <div className="rt">
      <Navbar />

      <main className="rt__main">

        <header className="rt__head">
          <span className="rt__badge">Plan your visit</span>
          <h1 className="rt__title">Museum routes</h1>
          <p className="rt__text">
            Ways to walk the {MUSEUM.name} in {MUSEUM.city} — {MUSEUM.area}. Pick
            the route that matches your time and who you are visiting with.
          </p>
        </header>

        <div className="rt__filters" role="tablist" aria-label="Route types">
          {ROUTE_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              className={`rt__filter${filter === id ? ' rt__filter--on' : ''}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {routes.length === 0 ? (
          <p className="rt__empty">No routes match that filter yet.</p>
        ) : (
          <ul className="rt__list">
            {routes.map((route) => (
              <li key={route.id}>
                <RouteCard
                  route={route}
                  recommended={recommendedIds.has(route.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Routes;
