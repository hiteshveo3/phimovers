import { useMemo, useState } from 'react';
import { QuoteDown as QuoteDownIcon, SearchNormal1 as SearchIcon, Star1 as StarIcon } from 'iconsax-reactjs';
import { BOOK, Breadcrumbs, CtaBand, DcPage, DISPLAY, NOTE, h1Style, icon, leadStyle } from '../kit/components/DcPage';
import { Ico } from '../kit/components/Ico';
import { Words, useHomeMotion } from '../kit/components/HomeMotion';
import Select from '../kit/components/ui/Select';
import { REVIEW_PHOTOS_CONFIRMED, REVIEW_THEMES, initials } from '../kit/reviews';
import { PkSearchClear } from '../kit/components/PageKit';
import { reviewServices, siteReviews, type SiteReview } from '../lib/reviews';
import { GOOGLE_REVIEW_URL, SITE, TRUSTPILOT_URL } from '../kit/site-facts';

// Same static three-column cards as the homepage (.ih-rev), one column on phones, with the old filters:
// search, service chips, rating and borough. No Review or AggregateRating markup: self-served review
// schema is not eligible and the count here differs from the Google profile.

const CSS = `
.rv-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 18px}
.rv-chips button{border:0;padding:8px 13px;border-radius:999px;background:var(--band);font:inherit;font-size:13.5px;font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .2s}
.rv-chips button[aria-pressed=true]{background:var(--lime)}
.rv-tools{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:0 0 18px}
.rv-find{display:flex;align-items:center;gap:10px;flex:1 1 260px;max-width:380px;min-height:48px;padding:0 14px;background:#fff;border:1px solid rgba(15,26,9,.2);border-radius:999px;color:var(--ink-60)}
.rv-find:focus-within{border-color:var(--ink)}
.rv-find input{flex:1;min-width:0;border:0!important;background:transparent!important;outline:none;font:inherit;font-size:16px;color:var(--ink);padding:10px 0}
.rv-sel{width:170px}
.rv-count{margin:0 0 16px;font-size:14px;color:var(--ink-60)}
.rv-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:0;padding:0;list-style:none}
.rv-card{display:flex;flex-direction:column;gap:14px;padding:22px;background:#fff;border-radius:20px;box-shadow:var(--card-shadow);border:1px solid rgba(15,26,9,.05)}
.rv-top{display:flex;justify-content:space-between;align-items:center}
.rv-q{display:grid;place-items:center;width:34px;height:34px;border-radius:999px;background:var(--green-soft);color:var(--accent)}
.rv-card blockquote{margin:0;font-size:15px;line-height:1.6;color:var(--ink)}
.rv-by{display:flex;align-items:center;gap:10px;margin-top:auto}
.rv-ava{display:grid;place-items:center;width:34px;height:34px;border-radius:999px;background:var(--green-soft);color:var(--accent);font-weight:700;font-size:12.5px;overflow:hidden;flex:none}
.rv-ava img{width:100%;height:100%;object-fit:cover}
.rv-by b{display:block;font-size:14px;font-weight:600}
.rv-by small{font-size:12.5px;color:var(--ink-60)}
.rv-empty{padding:40px 20px;text-align:center;background:#fff;border-radius:20px;border:1px solid rgba(15,26,9,.05)}
.rv-empty b{display:block;font-size:16px}
.rv-empty p{margin:4px 0 0;font-size:14.5px;color:var(--ink-68)}
.rv-empty button{margin-top:14px;border:0;background:none;font:inherit;font-weight:600;color:var(--link);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.rv-links{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 0;padding:0;list-style:none}
.rv-links a{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;background:#fff;box-shadow:var(--card-shadow);font-size:14px;font-weight:600}
.rv-links img{width:18px;height:18px}
.rv-themes{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 18px;padding:0;list-style:none}
.rv-themes li{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:var(--green-soft);font-size:13.5px;font-weight:600}
.rv-themes small{color:var(--accent)}
.rv-source{margin:10px 0 0;font-size:13.5px;color:var(--ink-60)}
.rv-chips button{min-height:44px}
.rv-badge{display:inline-flex;margin:0 0 14px;padding:4px 12px;border-radius:999px;background:var(--lime);color:var(--ink);font-size:12.5px;font-weight:600}
@media (max-width:1023.98px){.rv-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:759.98px){.rv-grid{grid-template-columns:1fr}.rv-sel{width:100%}.rv-find{max-width:none}}
`;

function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} style={{ display: 'inline-flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map((k) => (
        <Ico key={k} icon={StarIcon} size={size} className={k < rating ? 'ico-fill' : undefined} aria-hidden="true" style={k < rating ? undefined : { opacity: 0.3, color: '#f5a623' }} />
      ))}
    </span>
  );
}

function Avatar({ r }: { r: SiteReview }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="rv-ava" aria-hidden="true">
      {REVIEW_PHOTOS_CONFIRMED && r.avatar && !failed ? <img src={r.avatar} alt="" width={34} height={34} loading="lazy" onError={() => setFailed(true)} /> : initials(r.name)}
    </span>
  );
}

const RATINGS = ['All', '5', '4'];
const ratingOptions = RATINGS.map((r) => ({ value: r, label: r === 'All' ? 'All ratings' : `${r} stars` }));

export default function Reviews() {
  useHomeMotion();
  const [service, setService] = useState('All');
  const [rating, setRating] = useState('All');
  const [borough, setBorough] = useState('All');
  const [query, setQuery] = useState('');

  const boroughOptions = useMemo(
    () => ['All', ...Array.from(new Set(siteReviews.map((r) => r.borough))).sort()].map((b) => ({ value: b, label: b === 'All' ? 'All boroughs' : b })),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return siteReviews.filter((r) => {
      const okService = service === 'All' || r.service === service;
      const okRating = rating === 'All' || String(r.rating) === rating;
      const okBorough = borough === 'All' || r.borough === borough;
      const okQ = q === '' || r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.service.toLowerCase().includes(q);
      return okService && okRating && okBorough && okQ;
    });
  }, [service, rating, borough, query]);

  const clear = () => { setService('All'); setRating('All'); setBorough('All'); setQuery(''); };

  const avg = siteReviews.reduce((s, r) => s + r.rating, 0) / Math.max(siteReviews.length, 1);
  const ratingValue = avg.toFixed(1);

  const sources = [
    ...(GOOGLE_REVIEW_URL ? [{ name: 'Google', href: GOOGLE_REVIEW_URL, logo: '/brand/google-logo.svg' }] : []),
    ...(TRUSTPILOT_URL ? [{ name: 'Trustpilot', href: TRUSTPILOT_URL, logo: '/brand/trustpilot-star.svg' }] : []),
  ];

  return (
    <DcPage
      title="Customer Reviews — Phi Movers | London Removals"
      description="Read Phi Movers customer reviews from house moves, man & van, sofa delivery and office removals across all 32 London boroughs."
      path="/reviews"
      canonical={`${SITE}/reviews`}
      crumbs={[{ name: 'Reviews' }]}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ padding: 'clamp(30px,5vw,60px) 5vw 28px' }}>
        <Breadcrumbs crumbs={[{ name: 'Reviews' }]} />
        <span className="rv-badge">Customer reviews</span>
        <h1 className="mo-title" style={h1Style('18ch')}><Words text="What customers say" /></h1>
        <p style={leadStyle('56ch', '0 0 22px')}>Real feedback from London moves — filter by service, borough or rating to find reviews like yours.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 24px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 34, lineHeight: 1, letterSpacing: '-.02em' }}>{ratingValue}<span style={{ fontSize: 16, color: NOTE }}> / 5</span></span>
            <span style={{ display: 'grid', gap: 2, fontSize: 13.5, color: NOTE }}><RatingStars rating={5} size={15} />{siteReviews.length} customer reviews</span>
          </span>
          <a href={BOOK} className="dc-btn dc-btn-lime" style={{ fontSize: 15, padding: '12px 20px' }}>Book online</a>
        </div>
        <p className="rv-source">The score above is the average of the {siteReviews.length} customer reviews on this page.{sources.length > 0 ? ' Read more, or leave your own, on our public profiles.' : ''}</p>
        {sources.length > 0 && (
          <ul className="rv-links" aria-label="Review profiles">
            {sources.map((s) => (
              <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer"><img src={s.logo} alt="" width={18} height={18} />Reviews on {s.name}</a></li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ padding: '0 5vw clamp(30px,4vw,52px)' }}>
        <div className="rv-tools">
          <label className="rv-find">
            {icon(SearchIcon, 18)}
            <span className="dc-sr">Search reviews</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reviews…" autoComplete="off" />
            <PkSearchClear value={query} onClear={() => setQuery('')} />
          </label>
          <div className="rv-sel"><Select value={rating} onChange={setRating} options={ratingOptions} /></div>
          <div className="rv-sel"><Select value={borough} onChange={setBorough} options={boroughOptions} /></div>
        </div>
        {REVIEW_THEMES.length > 0 && (
          <>
            <h2 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600 }}>What people mention most</h2>
            <ul className="rv-themes">
              {REVIEW_THEMES.map((t) => <li key={t.label}>{t.label}<small>{t.count}</small></li>)}
            </ul>
          </>
        )}
        <div className="rv-chips" role="group" aria-label="Filter reviews by service">
          {reviewServices.map((s) => (
            <button key={s} type="button" aria-pressed={service === s} onClick={() => setService(s)}>{s}</button>
          ))}
        </div>
        <p className="rv-count" role="status">Showing {filtered.length} of {siteReviews.length} reviews</p>
        {filtered.length > 0 ? (
          <ul className="rv-grid" aria-label="Customer reviews">
            {filtered.map((r) => (
              <li key={r.id} className="rv-card">
                <div className="rv-top"><RatingStars rating={r.rating} /><span className="rv-q" aria-hidden="true">{icon(QuoteDownIcon, 16)}</span></div>
                <blockquote>{r.text}</blockquote>
                <div className="rv-by">
                  <Avatar r={r} />
                  <span><b>{r.name}</b><small>{r.location} · {r.service} · {r.borough}</small></span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rv-empty">
            <b>No reviews match</b>
            <p>Try clearing a filter.</p>
            <button type="button" onClick={clear}>Clear filters</button>
          </div>
        )}
        <p style={{ margin: '28px 0 0', textAlign: 'center', fontSize: 14.5, color: 'var(--ink-68)' }}>Want to share your move? {GOOGLE_REVIEW_URL ? <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="dc-inline-link">Leave a Google review</a> : <a href="/contact" className="dc-inline-link">Contact us</a>}</p>
      </section>

      <CtaBand title="Ready to book your stress-free move?" text="Start your free quote in under a minute — we usually reply within about one working hour. No obligation, no hidden fees." />
    </DcPage>
  );
}
