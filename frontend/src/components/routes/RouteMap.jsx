import { routeFloors } from '../../data/routes';
import './RouteMap.css';

/**
 * A floor diagram rather than a geographic map: the levels the route
 * touches, in visiting order, with a marker per stop.
 */
const RouteMap = ({ route, activeIndex = -1 }) => {
  if (!route) return null;

  const floors = routeFloors(route);
  let counter = 0;

  return (
    <aside className="rm" aria-label="Route levels">
      <h3 className="rm__title">Levels on this route</h3>

      <ol className="rm__floors">
        {floors.map(({ floor, stops }) => (
          <li key={floor} className="rm__floor">
            <span className="rm__floor-name">{floor}</span>

            <span className="rm__dots">
              {stops.map((stop) => {
                const index = counter++;
                return (
                  <span
                    key={stop.name}
                    className={`rm__dot${index === activeIndex ? ' rm__dot--active' : ''}`}
                    title={stop.name}
                  >
                    {index + 1}
                  </span>
                );
              })}
            </span>
          </li>
        ))}
      </ol>

      <p className="rm__start">
        <span>Start</span>
        {route.start}
      </p>
    </aside>
  );
};

export default RouteMap;
