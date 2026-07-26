import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useVisitor } from '../hooks/useVisitor';
import { VISITOR_ROUTES } from '../utils/constants';
import './VisitorProfile.css';

export default function VisitorProfile() {
  const { visitor, session, clearSession } = useVisitor() ?? {};

  const name = visitor?.fullName || visitor?.name || 'Museum Guest';
  const type = visitor?.visitorType || 'tourist';
  const targetPage = VISITOR_ROUTES[type] || '/tourist';

  return (
    <div className="prof-page">
      <Navbar />

      <main className="prof-main">
        <header className="prof-head">
          <span className="prof-badge">Visitor Session</span>
          <h1 className="prof-title">Your Profile & Journey</h1>
          <p className="prof-text">
            Manage your active personalization profile and access your customized museum experience.
          </p>
        </header>

        <article className="prof-card">
          <div className="prof-card__avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="prof-card__body">
            <span className="prof-card__type">{type} profile</span>
            <h2 className="prof-card__name">{name}</h2>
            <p className="prof-card__summary">
              {session?.experience?.summary ||
                `Personalized experience configured for ${name}.`}
            </p>

            <div className="prof-card__meta">
              <div>
                <span>Visitor Type</span>
                <strong>{type}</strong>
              </div>
              <div>
                <span>Education</span>
                <strong>{visitor?.education || 'Standard'}</strong>
              </div>
            </div>

            <div className="prof-card__actions">
              <Link to={targetPage} className="prof-btn prof-btn--primary">
                Go to My Experience Page →
              </Link>
              <Link to="/start-journey" className="prof-btn prof-btn--secondary">
                Change Personalization
              </Link>
              {clearSession && (
                <button
                  type="button"
                  className="prof-btn prof-btn--ghost"
                  onClick={clearSession}
                >
                  Reset Session
                </button>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
