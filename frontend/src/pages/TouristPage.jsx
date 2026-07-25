import Navbar from '../components/layout/Navbar';
import ScanStage from '../components/researcher/ScanStage';
import { useVisitor } from '../hooks/useVisitor';
import { useVisitorName } from '../hooks/useVisitorName';
import './TouristPage.css';

export default function TouristPage() {
  const visitorName = useVisitorName('traveller');
  const { session } = useVisitor() ?? {};

  const experience = session?.experience;
  const routes = experience?.recommendedRoutes ?? [];

  return (
    <div className="tourist">
      <Navbar />

      <main className="tourist__main">

        <section className="tp-hero" aria-label="Welcome">
          <span className="tp-hero__badge">Guided visit</span>
          <h1 className="tp-hero__title">
            Welcome, <span className="tp-hero__name">{visitorName}</span>
          </h1>
          <p className="tp-hero__text">
            {experience?.summary ??
              'A cinematic walk through Ethiopia’s defining moments — scan any display to read its story, hear it narrated, or watch it on film.'}
          </p>
        </section>

        {routes.length > 0 && (
          <section className="tp-routes" aria-label="Recommended routes">
            <h2 className="tp-routes__title">Routes picked for you</h2>
            <ul className="tp-routes__list">
              {routes.map((route) => (
                <li key={route.id} className="tp-route">
                  <h3 className="tp-route__name">{route.title}</h3>
                  <p className="tp-route__meta">
                    <span>{route.duration}</span>
                    <span className="tp-route__dot" aria-hidden="true" />
                    <span>{route.stops} stops</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ScanStage
          title="Scan the code beside an exhibit"
          text="Point your camera at the QR code on any display to open its story in text, sound, or film."
        />
      </main>
    </div>
  );
}
