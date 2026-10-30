import { useState } from 'react';
import { Ico } from './Ico';
import { Star1 as Star1Icon, TickCircle as TickCircleIcon } from 'iconsax-reactjs';
import { REVIEWS, initials, type Review } from '../reviews';

export function StatBand({ items }: { items: { value: string; label: string; href?: string }[] }) {
  return (
    <div className="bk-stats">
      {items.map((s) => {
        const inner = <><b>{s.value}</b><span>{s.label}</span></>;
        return s.href ? <a key={s.label} href={s.href} {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a> : <div key={s.label}>{inner}</div>;
      })}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const [more, setMore] = useState(false);
  const long = r.text.length > 170;
  return (
    <figure className="bk-review">
      <div className="bk-review-top">
        <span role="img" aria-label="5 out of 5 stars" style={{ display: 'inline-flex', gap: 2 }}>
          {[0, 1, 2, 3, 4].map((k) => <Ico key={k} icon={Star1Icon} size={16} className="ico-fill" aria-hidden="true" />)}
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(15,26,9,.72)', textAlign: 'right' }}>{r.tag}</span>
      </div>
      <blockquote className={long && !more ? 'is-clamped' : undefined}>{r.text}</blockquote>
      {long && <button type="button" className="bk-review-more" aria-expanded={more} onClick={() => setMore((m) => !m)}>{more ? 'Show less' : 'Read more'}</button>}
      <figcaption>
        <span className="bk-avatar" aria-hidden="true">{initials(r.name)}</span>
        <span>{r.name}<small>{r.location}</small></span>
      </figcaption>
    </figure>
  );
}

export function ReviewGrid({ count = 6 }: { count?: number; themes?: boolean }) {
  return (
    <div className="bk-reviews bk-rail">
      {REVIEWS.slice(0, count).map((r) => <ReviewCard key={r.name} r={r} />)}
    </div>
  );
}

function Ticks({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
      {items.map((t) => (
        <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15.5, lineHeight: 1.5, color: 'rgba(15,26,9,.8)' }}>
          <span aria-hidden="true" style={{ flex: 'none', display: 'grid', placeItems: 'center', marginTop: 1 }}><Ico icon={TickCircleIcon} size={22} aria-hidden="true" /></span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Tick list. With `max`, the first items show and the rest open from a "Show N more" summary. */
export function TickList({ items, max }: { items: string[]; max?: number }) {
  if (!max || items.length <= max + 1) return <Ticks items={items} />;
  return (
    <>
      <Ticks items={items.slice(0, max)} />
      <details className="bk-more">
        <summary>Show {items.length - max} more</summary>
        <div style={{ marginTop: 10 }}><Ticks items={items.slice(max)} /></div>
      </details>
    </>
  );
}
