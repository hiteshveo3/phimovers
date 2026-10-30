import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight2 as ArrowIcon, Location as LocationIcon } from 'iconsax-reactjs';
import { LIME, MUTED, Photo, card, h3Style, icon } from './DcPage';

// Small pieces shared by the /areas pages. Alpha's card, chip and band styling, with Phi's area and service data.

export const pageBand = (white: boolean, padding = 'clamp(28px,4vw,52px) 5vw'): CSSProperties => ({
  padding,
  background: white ? '#fff' : undefined,
  borderTop: '1px solid rgba(15,26,9,.08)',
  borderBottom: '1px solid rgba(15,26,9,.08)',
});

/** An area as a card: lime pin, name, the short blurb and a "Removals in X" link. */
export function AreaCard({ href, name, blurb, label, lime = false, extra }: { href: string; name: string; blurb: string; label: string; lime?: boolean; extra?: ReactNode }) {
  return (
    <div style={{ ...card(lime, 20), height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 999, background: lime ? '#fff' : LIME, marginBottom: 14 }}>{icon(LocationIcon, 18)}</span>
      <h3 className="dc-text dc-card-title" style={h3Style(19, '0 0 8px')}><a href={href}>{name}</a></h3>
      <p className="dc-text" style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.55, color: MUTED, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }}>{blurb}</p>
      <p style={{ margin: 'auto 0 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', fontSize: 14.5, fontWeight: 600 }}>
        <a href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--link)' }}>{label} {icon(ArrowIcon, 15)}</a>
        {extra}
      </p>
    </div>
  );
}

export type ServiceTile = { slug: string; title: string; price: string; desc?: string; image: string };

/** A service as a photo card that links to its local page. */
export function ServiceTiles({ items, hrefFor, titleFor, showDesc = false }: { items: ServiceTile[]; hrefFor: (slug: string) => string; titleFor: (title: string) => string; showDesc?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
      {items.map((s) => (
        <a key={s.slug} href={hrefFor(s.slug)} className="dc-card-title" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', ...card(false, 0) }}>
          <div style={{ aspectRatio: '16/9', background: '#e9e8e2', overflow: 'hidden' }}>
            <Photo src={s.image} alt={s.title} />
          </div>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <p style={{ display: 'inline-flex', width: 'fit-content', background: 'var(--green-soft)', color: 'var(--accent)', borderRadius: 999, padding: '4px 10px', fontSize: 12.5, fontWeight: 600, margin: '0 0 10px' }}>{s.price}</p>
            <h3 style={h3Style(18, '0 0 6px')}>{titleFor(s.title)}</h3>
            {showDesc && s.desc && <p style={{ margin: '0 0 12px', fontSize: 14.5, lineHeight: 1.5, color: MUTED, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{s.desc}</p>}
            <p style={{ margin: 'auto 0 0', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14.5, fontWeight: 600, color: 'var(--link)' }}>View local page {icon(ArrowIcon, 15)}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
