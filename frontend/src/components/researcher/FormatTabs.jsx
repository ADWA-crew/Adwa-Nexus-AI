import './FormatTabs.css';

export default function FormatTabs({ formats, active, onChange }) {
  const activeIndex = Math.max(0, formats.findIndex((f) => f.id === active));

  return (
    <div
      className="fmt"
      role="tablist"
      aria-label="Information format"
      style={{ '--fmt-count': formats.length, '--fmt-index': activeIndex }}
    >
      <span className="fmt__indicator" aria-hidden="true" />

      {formats.map(({ id, label, hint, Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          id={`fmt-tab-${id}`}
          aria-selected={active === id}
          aria-controls={`fmt-panel-${id}`}
          className={`fmt__btn${active === id ? ' fmt__btn--active' : ''}`}
          onClick={() => onChange(id)}
        >
          <Icon />
          <span className="fmt__label">{label}</span>
          <span className="fmt__hint">{hint}</span>
        </button>
      ))}
    </div>
  );
}
