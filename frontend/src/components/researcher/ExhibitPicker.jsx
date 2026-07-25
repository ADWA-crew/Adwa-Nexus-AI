import { exhibitList } from '../../data/exhibits';
import { ArrowRightIcon } from './icons';
import './ExhibitPicker.css';

/**
 * Shared exhibit chooser. `variant="playful"` enlarges the cards and
 * numbers them for the child experience.
 */
export default function ExhibitPicker({
  activeId,
  onSelect,
  title = 'Choose an exhibit',
  variant = 'default',
}) {
  const exhibits = exhibitList();

  return (
    <section className={`xp xp--${variant}`} aria-label="Exhibits">
      <h2 className="xp__title">{title}</h2>

      <ul className="xp__list">
        {exhibits.map((exhibit, index) => {
          const active = exhibit.id === activeId;

          return (
            <li key={exhibit.id}>
              <button
                type="button"
                className={`xp__card${active ? ' xp__card--active' : ''}`}
                onClick={() => onSelect(exhibit.id)}
                aria-current={active ? 'true' : undefined}
              >
                <span className="xp__thumb" aria-hidden="true">
                  {exhibit.image ? (
                    <img src={exhibit.image} alt="" loading="lazy" />
                  ) : (
                    <span className="xp__index">{index + 1}</span>
                  )}
                </span>

                <span className="xp__body">
                  <span className="xp__era">{exhibit.era}</span>
                  <span className="xp__name">{exhibit.title}</span>
                  <span className="xp__sub">{exhibit.subtitle}</span>
                </span>

                <span className="xp__go" aria-hidden="true">
                  <ArrowRightIcon size={16} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
