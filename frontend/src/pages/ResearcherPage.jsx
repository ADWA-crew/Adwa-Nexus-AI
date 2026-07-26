import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import ScanStage from '../components/researcher/ScanStage';
import { useVisitorName } from '../hooks/useVisitorName';
import './ResearcherPage.css';

export default function ResearcherPage() {
  const { t } = useTranslation();
  const visitorName = useVisitorName();

  return (
    <div className="researcher">
      <Navbar />

      <main className="researcher__main">

        <section className="rp-welcome" aria-label="Welcome">
          <span className="rp-welcome__badge">{t('researcher.badge')}</span>
          <h1 className="rp-welcome__title">
            {t('researcher.hello', { name: visitorName })}
          </h1>
          <p className="rp-welcome__text">
            {t('researcher.text')}
          </p>
        </section>

        <ScanStage
          title={t('researcher.scanTitle')}
          text={t('researcher.scanText')}
        />
      </main>
    </div>
  );
}
