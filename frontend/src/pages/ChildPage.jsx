import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import ScanStage from '../components/researcher/ScanStage';
import { useVisitorName } from '../hooks/useVisitorName';
import './ChildPage.css';

export default function ChildPage() {
  const { t } = useTranslation();
  const visitorName = useVisitorName('explorer');

  return (
    <div className="child">
      <Navbar />

      <main className="child__main">

        <section className="cp-hello" aria-label="Welcome">
          <span className="cp-hello__badge">{t('child.badge')}</span>
          <h1 className="cp-hello__title">
            {t('child.hello', { name: visitorName })}
          </h1>
          <p className="cp-hello__text">
            {t('child.text')}
          </p>

          <ul className="cp-steps">
            <li className="cp-step">
              <span className="cp-step__num">1</span>
              {t('child.step1')}
            </li>
            <li className="cp-step">
              <span className="cp-step__num">2</span>
              {t('child.step2')}
            </li>
            <li className="cp-step">
              <span className="cp-step__num">3</span>
              {t('child.step3')}
            </li>
          </ul>
        </section>

        <ScanStage
          simple
          startWith="audio"
          variant="playful"
          title={t('child.scanTitle')}
          text={t('child.scanText')}
        />
      </main>
    </div>
  );
}
