'use client';

// A dropdown that looks the same on every browser and matches the booking form fields.
// Keyboard: Enter/Space/ArrowDown open; arrows move; Home/End jump; Enter picks; Escape closes.
// Options are real role="option" items, so screen readers announce them.

import { type KeyboardEvent, type MouseEvent, useEffect, useId, useRef, useState } from 'react';
import styles from './Select.module.css';

export type SelectOption = { value: string; label: string; group?: string; disabled?: boolean };

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Shown when no option matches the value. */
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
};

export default function Select({ id, value, onChange, options, placeholder = 'Choose', disabled, invalid, describedBy, className }: Props) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  const openList = () => {
    if (disabled) return;
    const current = options.findIndex((o) => o.value === value);
    setActive(current >= 0 && !options[current].disabled ? current : (enabled[0] ?? -1));
    setOpen(true);
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const pick = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    onChange(o.value);
    close();
  };

  useEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${uid}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, uid]);

  const step = (dir: 1 | -1) => {
    if (!enabled.length) return;
    const pos = enabled.indexOf(active);
    setActive(pos === -1 ? enabled[0] : enabled[(pos + dir + enabled.length) % enabled.length]);
  };

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        step(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        step(-1);
        break;
      case 'Home':
        e.preventDefault();
        setActive(enabled[0] ?? -1);
        break;
      case 'End':
        e.preventDefault();
        setActive(enabled[enabled.length - 1] ?? -1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        pick(active);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  // Clicking an option inside a <label> must not also re-toggle the trigger.
  const stop = (e: MouseEvent) => e.preventDefault();

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ''}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={styles.trigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${uid}-list` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            openList();
          }
        }}
      >
        <span className={selected ? undefined : styles.placeholder}>{selected ? selected.label : placeholder}</span>
        <svg className={styles.chev} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${uid}-list`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          aria-activedescendant={active >= 0 ? `${uid}-${active}` : undefined}
          className={styles.list}
          onKeyDown={onListKey}
        >
          {options.map((o, i) => (
            <li key={`${o.value}-${i}`} className="contents">
              {o.group && o.group !== options[i - 1]?.group && <div className={styles.group} role="presentation">{o.group}</div>}
              <div
                id={`${uid}-${i}`}
                role="option"
                aria-selected={o.value === value}
                aria-disabled={o.disabled || undefined}
                data-active={i === active}
                className={styles.option}
                onMouseDown={stop}
                onMouseEnter={() => !o.disabled && setActive(i)}
                onClick={() => pick(i)}
              >
                <span>{o.label}</span>
                <svg className={styles.check} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
