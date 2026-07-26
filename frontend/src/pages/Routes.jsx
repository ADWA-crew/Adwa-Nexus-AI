import { useMemo, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import RouteCard from '../components/routes/RouteCard';
import VisitorJourneyMap from '../components/routes/VisitorJourneyMap';
import { useVisitor } from '../hooks/useVisitor';
import { MUSEUM, ROUTE_FILTERS, filterRoutes } from '../data/routes';
import './Routes.css';

const Routes = () => {
  const [activeTab, setActiveTab] = useState('map'); // 'map' or 'routes'
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

        {/* ── Page Header ─────────────────────────────────────── */}
        <header className="rt__head">
          <span className="rt__badge">Progress & Museum Map</span>
          <h1 className="rt__title">Visitor Journey & Routes</h1>
          <p className="rt__text">
            Explore the complete sample map of {MUSEUM.name} in {MUSEUM.city} — {MUSEUM.area}.
            Track your progress across stations or select a curated route.
          </p>
        </header>

        {/* ── Main Section Tabs: Journey Map vs Curated Routes ── */}
        <div className="rt__view-tabs" role="tablist" aria-label="Progress view mode">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'map'}
            className={`rt__view-btn ${activeTab === 'map' ? 'rt__view-btn--active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺️ Sample Museum Map & Flow
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'routes'}
            className={`rt__view-btn ${activeTab === 'routes' ? 'rt__view-btn--active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            🧭 Curated Walking Routes
          </button>
        </div>

        {/* ── Tab Content ─────────────────────────────────────── */}
        {activeTab === 'map' ? (
          <VisitorJourneyMap />
        ) : (
          <section aria-label="Curated Walking Routes">
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
          </section>
        )}
      </main>
    </div>
  );
};

export default Routes;
