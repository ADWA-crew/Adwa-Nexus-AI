import { useState, useRef, useEffect, useId } from 'react';
import './GlassSelect.css';

const Chevron = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="2,4 6,8 10,4" />
  </svg>
);

const Tick = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3,8 6.5,11.5 13,5" />
  </svg>
);

/**
 * Accessible glassmorphic dropdown.
 * Follows the same trigger + floating listbox pattern as the navbar language menu.
 */
export default function GlassSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  invalid = false,
  disabled = false,
  id,
  labelledBy,
}) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const generatedId = useId();
  const listboxId = `${id || generatedId}-listbox`;

  const selected = options.find((o) => o.value === value) || null;

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Highlight the selected option whenever the list opens */
  useEffect(() => {
    if (open) {
      const i = options.findIndex((o) => o.value === value);
      setActiveIndex(i >= 0 ? i : 0);
    }
  }, [open, value, options]);

  /* Flip the list upward when the space below cannot hold it.
     Keeps the last field's menu clear of the submit button. */
  useEffect(() => {
    if (!open || !wrapRef.current) return;
    const { bottom, top } = wrapRef.current.getBoundingClientRect();
    const needed = Math.min(264, window.innerHeight * 0.4) + 16;
    setDropUp(window.innerHeight - bottom < needed && top > needed);
  }, [open, options.length]);

  const commit = (option) => {
    onChange?.(option.value);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (options[activeIndex]) commit(options[activeIndex]);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`gselect${open ? ' gselect--open' : ''}${invalid ? ' gselect--invalid' : ''}${disabled ? ' gselect--disabled' : ''}${dropUp ? ' gselect--up' : ''}`}
      ref={wrapRef}
    >
      <button
        type="button"
        id={id}
        className="gselect__trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={labelledBy}
        aria-invalid={invalid || undefined}
        disabled={disabled}
      >
        <span className={`gselect__value${selected ? '' : ' gselect__value--placeholder'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="gselect__chevron" aria-hidden="true">
          <Chevron />
        </span>
      </button>

      {open && (
        <ul
          className="gselect__list"
          id={listboxId}
          role="listbox"
          ref={listRef}
          aria-labelledby={labelledBy}
          tabIndex={-1}
        >
          {options.map((option, i) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={
                  'gselect__option' +
                  (isSelected ? ' gselect__option--selected' : '') +
                  (i === activeIndex ? ' gselect__option--active' : '')
                }
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => commit(option)}
              >
                <span className="gselect__option-body">
                  <span className="gselect__option-label">{option.label}</span>
                  {option.hint && (
                    <span className="gselect__option-hint">{option.hint}</span>
                  )}
                </span>
                {isSelected && (
                  <span className="gselect__option-tick" aria-hidden="true">
                    <Tick />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
