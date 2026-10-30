'use client';

import { useState, type FormEvent } from 'react';
import { Breadcrumbs, DcPage } from './DcPage';
import { CtaMark, MOTION_CSS, Words, useHomeMotion } from './HomeMotion';
import { Eyebrow, KIT_CSS, PkSearchClear, kitIcon } from './PageKit';
import { searchSite } from './SiteHeader';
import { SearchNormal1 as SearchIcon } from 'iconsax-reactjs';

const LINKS = [
  { name: 'Services', path: '/services' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Areas we cover', path: '/areas' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Moving guides', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const NF_CSS = `
.nf{padding-bottom:clamp(56px,8vw,104px)}
.nf-hits{margin:10px 0 0;padding:6px;list-style:none;max-width:560px}
.nf-hits a{display:flex;justify-content:space-between;gap:12px;padding:11px 14px;border-radius:12px;font-weight:600;font-size:15px}
.nf-hits a small{font-weight:500;color:var(--ink-60);white-space:nowrap}
.nf-hits a:hover,.nf-hits a:focus-visible{background:var(--grey);color:var(--ink)}
.nf-hits li.nf-empty{padding:12px 14px;font-size:15px;color:var(--ink-68)}
.nf-cta{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;margin-top:28px}
`;

export default function NotFound() {
  useHomeMotion();
  const [q, setQ] = useState('');
  const hits = searchSite(q, 6);
  const searching = q.trim().length >= 2;
  const go = (e: FormEvent) => {
    e.preventDefault();
    if (hits[0]) window.location.href = hits[0].href;
  };
  return (
    <DcPage
      title="Page not found | Phi Movers"
      description="The page you were looking for has moved or no longer exists."
      path="/404"
      crumbs={[{ name: 'Page not found' }]}
      noindex
    >
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS + KIT_CSS + NF_CSS }} />
      <div className="pk">
        <section className="pk-hero nf">
          <div className="pk-wrap">
            <Breadcrumbs crumbs={[{ name: 'Page not found' }]} />
            <Eyebrow>Page not found</Eyebrow>
            <h1 className="pk-h1 mo-title"><Words text="We can’t find that page." /></h1>
            <p className="pk-hero-lead">It may have moved. Search for what you need, try one of the pages below, or message us for a fixed quote.</p>

            <form className="pk-find" role="search" onSubmit={go}>
              <label className="pk-find-box">
                {kitIcon(SearchIcon, 20)}
                <span className="dc-sr">Search the site</span>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="What do you need moved?" autoComplete="off" aria-controls="nf-hits" />
                <PkSearchClear value={q} onClear={() => setQ('')} />
              </label>
            </form>
            {searching && (
              <ul id="nf-hits" className="pk-card nf-hits" aria-live="polite">
                {hits.length === 0 && <li className="nf-empty">Nothing matches that. Try “sofa”, “office” or a borough name.</li>}
                {hits.map((h) => (
                  <li key={h.href}><a href={h.href}><span>{h.title}</span><small>{h.price ? `from ${h.price}` : h.kind}</small></a></li>
                ))}
              </ul>
            )}

            <ul className="pk-chips" aria-label="Popular pages">
              {LINKS.map((link) => <li key={link.path}><a href={link.path}>{link.name}</a></li>)}
            </ul>

            <div className="nf-cta">
              <a href="/contact#quote" data-magnet="" className="pk-btn mo-btn">Get a quote <CtaMark /></a>
            </div>
          </div>
        </section>
      </div>
    </DcPage>
  );
}
