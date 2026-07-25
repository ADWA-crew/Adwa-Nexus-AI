import Navbar from '../components/layout/Navbar';
import ScanStage from '../components/researcher/ScanStage';
import { useVisitorName } from '../hooks/useVisitorName';
import './ChildPage.css';

export default function ChildPage() {
  const visitorName = useVisitorName('explorer');

  return (
    <div className="child">
      <Navbar />

      <main className="child__main">

        <section className="cp-hello" aria-label="Welcome">
          <span className="cp-hello__badge">Young explorer</span>
          <h1 className="cp-hello__title">
            Hi <span className="cp-hello__name">{visitorName}</span>, ready to
            explore?
          </h1>
          <p className="cp-hello__text">
            Find a picture code next to anything in the museum and scan it. Then
            you can read the story, listen to it, or watch a little film.
          </p>

          <ul className="cp-steps">
            <li className="cp-step">
              <span className="cp-step__num">1</span>
              Find a code
            </li>
            <li className="cp-step">
              <span className="cp-step__num">2</span>
              Scan it
            </li>
            <li className="cp-step">
              <span className="cp-step__num">3</span>
              Read, listen, or watch
            </li>
          </ul>
        </section>

        <ScanStage
          simple
          startWith="audio"
          variant="playful"
          title="Scan a picture code"
          text="Hold your camera up to the square code next to the exhibit. We will read the story to you."
        />
      </main>
    </div>
  );
}
