import { EXHIBITS } from '../../data/exhibits';
import './RecentExhibits.css';

export default function RecentExhibits({ ids, currentId, onOpen }) {
  const visible = ids.filter((id) => EXHIBITS[id] && id !== currentId);
  if (!visible.length) return null;

  return (
    <section className="re" aria-label="Exhibits you visited">
      <h2 className="re__title">Visited on this tour</h2>
      <ul className="re__list">
        {visible.map((id) => (
          <li key={id}>
            <button type="button" className="re__card" onClick={() => onOpen(id)}>
              <span className="re__era">{EXHIBITS[id].era}</span>
              <span className="re__name">{EXHIBITS[id].title}</span>
              <span className="re__again">Open again</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
