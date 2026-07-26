import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div>
      <Navbar />
      <main style={{ padding: '4rem 2rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('notFound.title')}</h1>
        <Link to="/" style={{ color: '#d4af37', textDecoration: 'underline' }}>
          {t('notFound.backHome')}
        </Link>
      </main>
    </div>
  );
}
