import type { CSSProperties, InputHTMLAttributes } from 'react';

// Our own clear (×) button for search boxes. The browser's blue native cross is hidden site-wide
// (input[type=search] rules in DcPage BASE_CSS), so every search box uses this one instead.

export function SearchClear({ value, onClear, size = 28, style }: { value: string; onClear: () => void; size?: number; style?: CSSProperties }) {
  if (!value) return null;
  return (
    <button
      type="button"
      aria-label="Clear search"
      // Keep the focus in the box, so menus that close on blur stay open.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClear}
      style={{ flex: 'none', display: 'grid', placeItems: 'center', width: size, height: size, padding: 0, border: 0, borderRadius: 999, background: 'var(--grey,#eef5e5)', color: 'var(--ink,#0f1a09)', cursor: 'pointer', ...style }}
    >
      <svg viewBox="0 0 24 24" width={Math.round(size / 2)} height={Math.round(size / 2)} aria-hidden="true" focusable="false">
        <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** A search input with the clear button inside its right edge. */
export function ClearableSearch({ value, onValue, style, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & { value: string; onValue: (v: string) => void }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: style?.maxWidth }}>
      <input {...rest} type="search" value={value} onChange={(e) => onValue(e.target.value)} style={{ ...style, maxWidth: '100%', paddingRight: 52 }} />
      <SearchClear value={value} onClear={() => onValue('')} size={32} style={{ position: 'absolute', right: 10, top: '50%', marginTop: -16 }} />
    </div>
  );
}
