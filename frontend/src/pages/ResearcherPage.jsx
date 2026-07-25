import Navbar from '../components/layout/Navbar';
import ScanStage from '../components/researcher/ScanStage';
import { useVisitorName } from '../hooks/useVisitorName';
import './ResearcherPage.css';

export default function ResearcherPage() {
  const visitorName = useVisitorName();

  return (
    <div className="researcher">
      <Navbar />

      <main className="researcher__main">

        <section className="rp-welcome" aria-label="Welcome">
          <span className="rp-welcome__badge">Research access</span>
          <h1 className="rp-welcome__title">
            Hello, <span className="rp-welcome__name">{visitorName}</span>
          </h1>
          <p className="rp-welcome__text">
            Welcome to our museum. Your reading room is open — scan any display to
            open its full account, narration, and archive footage.
          </p>
        </section>

        <ScanStage
          title="Scan the code beside a record"
          text="Point your camera at the QR code on any display to open the full account, hear it narrated, or watch the film."
        />
      </main>
    </div>
  );
}
