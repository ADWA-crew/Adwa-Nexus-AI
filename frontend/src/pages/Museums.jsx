import Navbar from '../components/layout/Navbar';
import adwaHero from '../assets/images/heroes/adwa_hero.png';
import './Museums.css';

const TREATIES = [
  {
    name: 'Treaty of Wuchale',
    year: '1889',
    note: 'Agreement between Ethiopia and Italy that later led to conflict over its meaning.',
  },
  {
    name: 'Treaty of Addis Ababa',
    year: '1896',
    note: 'Signed after Adwa. Italy recognized Ethiopia as a fully independent nation.',
  },
  {
    name: 'Hewett Treaty',
    year: '1884',
    note: 'Also called the Adwa Treaty — an early Anglo-Ethiopian agreement at Adwa.',
  },
];

export default function Museums() {
  return (
    <main className="about-museums">
      <Navbar />

      <header className="am-top">
        <img src={adwaHero} alt="" className="am-top__img" aria-hidden="true" />
        <div className="am-top__veil" aria-hidden="true" />
        <div className="am-top__inner">
          <p className="am-label">Adwa Nexus · For Museums</p>
          <h1>About the platform</h1>
        </div>
      </header>

      <div className="am-body">
        <section className="am-block am-block--highlight" aria-labelledby="mission-title">
          <h2 id="mission-title">Mission</h2>
          <p className="am-lead">
            To combine artificial intelligence, immersive storytelling, and modern
            web technologies to make Ethiopian history more accessible, interactive,
            and meaningful.
          </p>
          <p>
            We help museums turn quiet collections into living journeys — so a
            first-time visitor, a young learner, or a researcher can each meet Adwa
            in the way that fits them best.
          </p>
        </section>

        <section className="am-block am-block--highlight" aria-labelledby="vision-title">
          <h2 id="vision-title">Vision</h2>
          <p className="am-lead">
            To create the world&apos;s most intelligent cultural heritage platform
            where every person experiences history in a way that matches their
            curiosity, background, and learning style.
          </p>
          <p>
            Our aim is simple: Ethiopian heritage should feel close, clear, and
            unforgettable — on the museum floor, in the classroom, and anywhere a
            story of Adwa needs to be heard.
          </p>
        </section>

        <section className="am-block" aria-labelledby="treaties-title">
          <h2 id="treaties-title">Well-known treaties</h2>
          <p className="am-note">
            Key agreements often linked to the Adwa story and Ethiopia&apos;s
            independence.
          </p>
          <ul className="am-treaties">
            {TREATIES.map((treaty) => (
              <li key={treaty.name}>
                <h3>
                  {treaty.name} <span>({treaty.year})</span>
                </h3>
                <p>{treaty.note}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
