import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import ScanStage from '../components/researcher/ScanStage';
import { useVisitor } from '../hooks/useVisitor';
import { useVisitorName } from '../hooks/useVisitorName';
import './TouristPage.css';

export default function TouristPage() {
  const { t } = useTranslation();
  const visitorName = useVisitorName('traveller');
  const { session } = useVisitor() ?? {};

  const experience = session?.experience;
  const routes = experience?.recommendedRoutes ?? [];

  return (
    <div className="tourist">
      <Navbar />

      <main className="tourist__main">

        <section className="tp-hero" aria-label="Welcome">
          <span className="tp-hero__badge">{t('tourist.badge')}</span>
          <h1 className="tp-hero__title">
            {t('tourist.welcome', { name: visitorName })}
          </h1>
          <p className="tp-hero__text">
            {experience?.summary ?? t('tourist.defaultSummary')}
          </p>
        </section>

        {routes.length > 0 && (
          <section className="tp-routes" aria-label="Recommended routes">
            <h2 className="tp-routes__title">{t('tourist.routesTitle')}</h2>
            <ul className="tp-routes__list">
              {routes.map((route) => (
                <li key={route.id} className="tp-route">
                  <h3 className="tp-route__name">{route.title}</h3>
                  <p className="tp-route__meta">
                    <span>{route.duration}</span>
                    <span className="tp-route__dot" aria-hidden="true" />
                    <span>{t('tourist.stopsCount', { count: route.stops })}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ScanStage
          title={t('tourist.scanTitle')}
          text={t('tourist.scanText')}
        />
      </main>
    </div>
  );
}
