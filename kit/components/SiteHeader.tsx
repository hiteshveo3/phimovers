'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { Ico, type IconType } from './Ico';
import { Archive as ArchiveIcon, ArrowDown2 as ArrowDown2Icon, ArrowRight2 as ArrowRight2Icon, ArrowUp2 as ArrowUp2Icon, Box as BoxIcon, Box1 as Box1Icon, Briefcase as BriefcaseIcon, Building4 as Building4Icon, Calculator as CalculatorIcon, Call as CallIcon, Car as CarIcon, Clock as ClockIcon, Global as GlobalIcon, Home2 as Home2Icon, I3Dcube as I3DcubeIcon, Location as LocationIcon, Lock as LockIcon, MagicStar as MagicStarIcon, SearchNormal1 as SearchNormal1Icon, Star1 as Star1Icon, Trash as TrashIcon, Truck as TruckIcon, User as UserIcon } from 'iconsax-reactjs';
import { BOROUGHS, REGION_HREF, findBoroughs } from '../areas-list';
import { getAreaBySlug } from '../../lib/areas';
import { BRAND, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../site-facts';
import { WaIcon } from './WhatsApp';
import { allServiceCards, startingPrices } from '../services-catalog';
import s from './SiteHeader.module.css';
import { SearchClear } from './SearchClear';

type MenuLink = { href: string; title: string; price?: string; icon: IconType };

// The Services mega menu, in the order and with the icons of the live site. Hovering or focusing one swaps the
// right-hand panel to that service's photo, description and from-price (all read from the catalogue).
const MEGA_ITEMS: { href: string; icon: IconType; image?: string }[] = [
  { href: '/services/house-removals', icon: Home2Icon },
  { href: '/services/sofa-delivery', icon: BoxIcon },
  { href: '/services/man-and-van', icon: TruckIcon },
  { href: '/services/office-removals', icon: BriefcaseIcon },
  { href: '/services/full-packing-service', icon: Box1Icon },
  { href: '/services/secure-storage', icon: LockIcon },
  { href: '/services/student-moves', icon: UserIcon },
  { href: '/services/flat-removals', icon: Building4Icon },
  { href: '/services/piano-and-specialist', icon: Star1Icon, image: '/services/furniture-delivery.jpg' },
  { href: '/services/furniture-delivery', icon: ArchiveIcon },
  { href: '/services/same-day-move', icon: ClockIcon, image: '/services/man-and-van.jpg' },
  { href: '/services/house-clearance', icon: TrashIcon },
  { href: '/services/international-moves', icon: GlobalIcon, image: '/services/long-distance-removals.jpg' },
  { href: '/services/end-of-tenancy-clean', icon: MagicStarIcon, image: '/services/house-clearance.jpg' },
  { href: '/services/vehicle-transport', icon: CarIcon, image: '/services/man-and-van.jpg' },
];

// One entry of a mega menu: the link, plus what the side panel shows while it is hovered.
type MegaEntry = { href: string; title: string; text: string; image: string; badge?: string; icon: IconType };

const megaServices: MegaEntry[] = MEGA_ITEMS.flatMap((m) => {
  const c = allServiceCards.find((x) => x.href === m.href);
  return c ? [{ href: c.href, title: c.title, text: c.text, image: m.image ?? c.image, badge: startingPrices[c.href] ? `from ${startingPrices[c.href].from}` : undefined, icon: m.icon }] : [];
});

// The boroughs of the live Areas menu. Borough pages have no photo of their own, so each region borrows one.
const MEGA_BOROUGHS = ['camden', 'islington', 'hackney', 'westminster', 'kensington-and-chelsea', 'hammersmith-and-fulham', 'wandsworth', 'lambeth', 'southwark', 'greenwich', 'lewisham', 'croydon', 'ealing', 'brent', 'barnet'];
const REGION_PHOTO: Record<string, string> = {
  'Central London': '/services/office-removals.jpg',
  'North London': '/services/house-removals.jpg',
  'East London': '/services/flat-removals.jpg',
  'South London': '/services/man-and-van.jpg',
  'West London': '/services/furniture-delivery.jpg',
};

const megaAreas: MegaEntry[] = MEGA_BOROUGHS.flatMap((slug) => {
  const b = BOROUGHS.find((x) => x.slug === slug);
  const a = getAreaBySlug(slug);
  return b && a ? [{ href: b.href, title: b.name, text: a.blurb, image: REGION_PHOTO[b.region], badge: b.postcodes ? `${b.region} · ${b.postcodes.split(' ').slice(0, 4).join(' ')}` : b.region, icon: LocationIcon }] : [];
});

type MegaMenu = {
  id: 'services' | 'areas';
  label: string;
  entries: MegaEntry[];
  all: { href: string; title: string; icon: IconType };
  more: string;
  promo: { title: string; text: string };
};

const PROMO_TEXT = 'Get a free survey and a fixed-price quote — we usually reply within about one working hour across all 32 London boroughs.';

const MEGA: Record<'services' | 'areas', MegaMenu> = {
  services: { id: 'services', label: 'Our services', entries: megaServices, all: { href: '/services', title: 'All services', icon: I3DcubeIcon }, more: 'View service', promo: { title: 'Not sure which service you need?', text: PROMO_TEXT } },
  areas: { id: 'areas', label: 'London boroughs we cover', entries: megaAreas, all: { href: '/areas', title: 'All 32 boroughs', icon: LocationIcon }, more: 'View area', promo: { title: 'Moving in your borough?', text: PROMO_TEXT } },
};

const popularAreas: MenuLink[] = [
  { href: '/areas/westminster', title: 'Westminster', icon: LocationIcon },
  { href: '/areas/kensington-and-chelsea', title: 'Kensington & Chelsea', icon: LocationIcon },
  { href: '/areas/city-of-london', title: 'City of London', icon: LocationIcon },
  { href: '/areas/camden', title: 'Camden', icon: LocationIcon },
  { href: '/areas/islington', title: 'Islington', icon: LocationIcon },
  { href: '/areas/hackney', title: 'Hackney', icon: LocationIcon },
  { href: '/areas/croydon', title: 'Croydon', icon: LocationIcon },
  { href: '/areas/barking-and-dagenham', title: 'Barking & Dagenham (our base)', icon: LocationIcon },
];

type MenuKey = 'services' | 'areas' | null;

const icon = (i: IconType, size = 18) => <Ico icon={i} size={size} aria-hidden="true" />;

type SearchEntry = { title: string; href: string; kind: string; text?: string };

// Every service in the catalogue, then the main pages. `text` is searched but not shown.
const searchEntries: SearchEntry[] = [
  ...allServiceCards.map((c) => ({ title: c.title, href: c.href, kind: 'Service', text: c.text })),
  { title: 'Book online', href: '/book', kind: 'Page', text: 'booking book quote get a price' },
  { title: 'Pricing', href: '/pricing', kind: 'Page', text: 'prices rates cost how much hourly' },
  { title: 'Price calculator', href: '/pricing#calculator', kind: 'Page', text: 'calculator estimate cost price my move hours van helpers' },
  { title: 'Help and FAQs', href: '/help', kind: 'Page', text: 'customer care questions faq deposit cancel cancellation claims' },
  { title: 'Insurance', href: '/insurance', kind: 'Page', text: 'insured cover goods in transit public liability damage' },
  { title: 'Trust and verification', href: '/trust', kind: 'Page', text: 'company number companies house verify legitimate' },
  { title: 'My bookings', href: '/my-bookings', kind: 'Page', text: 'account sign in login my quotes track' },
  { title: 'All pages', href: '/all-pages', kind: 'Page', text: 'site map sitemap directory' },
  { title: 'All services', href: '/services', kind: 'Page' },
  { title: 'Areas we cover', href: '/areas', kind: 'Page', text: 'boroughs locations london' },
  { title: 'Reviews', href: '/reviews', kind: 'Page', text: 'rating feedback testimonials' },
  { title: 'Blog and guides', href: '/blog', kind: 'Page', text: 'advice tips articles' },
  { title: 'Contact', href: '/contact', kind: 'Page', text: 'phone email address call' },
  ...popularAreas.map((l) => ({ title: l.title, href: l.href, kind: 'Area' })),
];

const norm = (v: string) => v.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9£]+/g, ' ').trim();

export type SiteHit = { title: string; href: string; kind: string; price?: string };

const toHit = (e: SearchEntry): SiteHit => ({ title: e.title, href: e.href, kind: e.kind, price: startingPrices[e.href]?.from });


/** Services and pages by name or description, boroughs by name or postcode. Shared by the header and homepage search. */
export function searchSite(q: string, limit = 7): SiteHit[] {
  const term = norm(q);
  if (term.length < 2) return [];
  const words = term.split(' ').filter((w) => w !== 'and' && w !== 'in' && w !== 'london');
  const scored = searchEntries.flatMap((e, order) => {
    const title = norm(e.title);
    const all = `${title} ${norm(e.text ?? '')}`;
    if (words.length === 0 || !words.every((w) => all.includes(w))) return [];
    // Title matches first, best when the title starts with the query.
    const rank = title.startsWith(term) ? 0 : words.every((w) => title.includes(w)) ? 1 : 2;
    return [{ hit: toHit(e), rank, order }];
  });
  scored.sort((a, b) => a.rank - b.rank || a.order - b.order);
  const found = [
    ...scored.map((x) => x.hit),
    ...findBoroughs(q).map((b) => ({ title: b.name, href: b.href ?? REGION_HREF[b.region], kind: b.region })),
  ];
  return found.filter((h, i) => found.findIndex((x) => x.href === h.href || x.title === h.title) === i).slice(0, limit);
}

// Header search, laid out like Alpha Movers: an icon opens a centred box (Ctrl/Cmd + K too). Type, see the
// best matches, press Enter to open one. It stays in the header while the page scrolls.
const X = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
    <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const TRY_TERMS = ['2 bed flat', 'man and van', 'Hackney', 'piano'];

function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        opener.current = document.activeElement as HTMLElement | null;
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    input.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      opener.current?.focus?.();
    };
  }, [open]);

  const term = q.trim();
  const results = term.length >= 2 ? searchSite(term, 6) : [];
  const close = () => { setOpen(false); setQ(''); setActive(0); };
  const go = (href: string) => { close(); window.location.href = href; };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0))); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active].href); }
  };

  return (
    <div className={s.siteSearch}>
      <button
        type="button"
        className={`${s.iconBtnOutline} ${s.searchBare}`}
        aria-label="Search"
        aria-haspopup="dialog"
        title="Search (Ctrl K)"
        onClick={(e) => { opener.current = e.currentTarget; setOpen(true); }}
      >
        {icon(SearchNormal1Icon, 20)}
      </button>
      {open && createPortal(
        <div className="qs" role="dialog" aria-modal="true" aria-label="Search the site">
          <style dangerouslySetInnerHTML={{ __html: QS_CSS }} />
          <button type="button" tabIndex={-1} aria-label="Close search" onClick={close} className="qs-scrim" />
          <div className="qs-card" onKeyDown={onKeyDown}>
            <div className="qs-top">
              <Ico icon={SearchNormal1Icon} size={19} className="qs-ico" />
              <input
                ref={input}
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                placeholder="Service, area or postcode…"
                aria-label="Search services, areas and pages"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={results.length > 0}
                aria-controls={results.length > 0 ? `${id}-results` : undefined}
              />
              {q && <button type="button" className="qs-clear" onClick={() => { setQ(''); input.current?.focus(); }} aria-label="Clear search"><X size={13} /></button>}
              <button type="button" className="qs-close" onClick={close} aria-label="Close search"><X size={18} /></button>
            </div>
            <div className="qs-body">
              {!term && (
                <div className="qs-popular">
                  <p>Popular</p>
                  <div>{TRY_TERMS.map((x) => <button key={x} type="button" onClick={() => setQ(x)}>{x}</button>)}</div>
                </div>
              )}
              {term.length >= 2 && results.length === 0 && (
                <p className="qs-none">Nothing matches “{term}”. If it is in Greater London, we cover it. <a href="/book" onClick={close}>Get a price</a></p>
              )}
              {results.length > 0 && (
                <ul id={`${id}-results`} role="listbox" aria-label="Matching pages" className="qs-list">
                  {results.map((h, i) => (
                    <li key={`${h.kind}-${h.href}`} role="option" aria-selected={i === active}>
                      <button type="button" tabIndex={-1} onMouseEnter={() => setActive(i)} onClick={() => go(h.href)} className={i === active ? 'is-active' : undefined}>
                        <span className="qs-text">
                          <span className="qs-name">{h.title}</span>
                          <small>{h.price ? `${h.kind} · from ${h.price}` : h.kind}</small>
                        </span>
                        {i === active && <Ico icon={ArrowRight2Icon} size={16} />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

const QS_CSS = `
@keyframes qs-fade{from{opacity:0}}
.qs{position:fixed;inset:0;z-index:1100;display:flex;align-items:flex-start;justify-content:center;padding:12vh 16px 0;color:#0f1a09}
.qs-scrim{position:absolute;inset:0;border:0;padding:0;background:rgba(15,26,9,.45);cursor:default;animation:qs-fade .15s ease-out}
.qs-card{position:relative;width:100%;max-width:600px;overflow:hidden;border-radius:18px;background:#fff;box-shadow:0 24px 60px -20px rgba(15,26,9,.5)}
.qs-top{display:flex;align-items:center;gap:12px;height:56px;padding:0 16px;border-bottom:1px solid rgba(15,26,9,.08)}
.qs-ico{flex:none;color:rgba(15,26,9,.6)}
.qs-top input{flex:1;min-width:0;height:100%;border:0;background:transparent;font:inherit;font-size:16px;color:#0f1a09;outline:none;box-shadow:none}
.qs-top input::placeholder{color:rgba(15,26,9,.6)}
.qs-clear,.qs-close{flex:none;display:grid;place-items:center;border:0;border-radius:999px;background:none;color:rgba(15,26,9,.6);cursor:pointer;transition:background-color .16s,color .16s}
.qs-clear{width:32px;height:32px}
.qs-close{width:40px;height:40px;color:#0f1a09}
.qs-clear:hover,.qs-close:hover{background:#f2f8e9;color:#0f1a09}
.qs-body{max-height:60vh;overflow-y:auto;padding:8px}
.qs-popular{display:flex;flex-direction:column;gap:8px;padding:8px}
.qs-popular p{margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:rgba(15,26,9,.6)}
.qs-popular div{display:flex;flex-wrap:wrap;gap:6px}
.qs-popular button{border:1px solid rgba(15,26,9,.14);border-radius:999px;padding:4px 12px;background:#fff;font:inherit;font-size:13px;color:rgba(15,26,9,.72);cursor:pointer;transition:background-color .15s,color .15s}
.qs-popular button:hover{background:#f2f8e9;color:#0f1a09}
.qs-none{margin:0;padding:32px 12px;text-align:center;font-size:14px;line-height:1.5;color:rgba(15,26,9,.72)}
.qs-none a{font-weight:600;color:#0f1a09;text-decoration:underline;text-underline-offset:3px}
.qs-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.qs-list button{display:flex;align-items:center;gap:12px;width:100%;padding:8px;border:0;border-radius:12px;background:none;text-align:left;font:inherit;color:#0f1a09;cursor:pointer}
.qs-list button.is-active{background:#f7fbf2}
.qs-text{display:flex;flex:1;min-width:0;flex-direction:column}
.qs-name{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:15px;font-weight:600}
.qs-text small{font-size:12.5px;color:rgba(15,26,9,.6)}
@media (prefers-reduced-motion:reduce){.qs-scrim{animation:none}}
`;

export default function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<MenuKey>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const previewed = [...megaServices, ...megaAreas].find((m) => m.href === preview);

  // Pointer devices open the Services menu on hover; a short delay lets the cursor cross the gap into the panel.
  const hoverOpen = (key: MenuKey) => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const hoverClose = () => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    closeTimer.current = setTimeout(() => { setOpen(null); setPreview(null); }, 160);
  };

  useEffect(() => {
    setOpen(null);
    setPreview(null);
  }, [pathname]);

  // Publish the header's real height so the sticky section bar on service pages sits right under it.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () => document.documentElement.style.setProperty('--hdr', `${el.offsetHeight}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const servicesActive = pathname.startsWith('/services');
  const areasActive = pathname.startsWith('/areas');
  const current = (href: string) => (pathname === href ? 'page' : undefined);

  const linkRow = (l: MenuLink, size = 15) => (
    <a key={l.href} href={l.href} className={s.panelLink} aria-current={current(l.href)}>
      <span className={s.panelIco} aria-hidden="true"><Ico icon={l.icon} size={size} /></span>
      <span className={s.panelText}>{l.title}</span>
    </a>
  );

  const megaNav = (m: MegaMenu, name: string, active: boolean) => (
    <div className={s.item} onMouseEnter={() => hoverOpen(m.id)} onMouseLeave={hoverClose}>
      <button
        type="button"
        className={`${s.navBtn} ${active ? s.active : ''}`}
        aria-expanded={open === m.id}
        aria-controls={`amh-panel-${m.id}`}
        onClick={() => { setPreview(null); setOpen((o) => (o === m.id ? null : m.id)); }}
      >
        {name} {icon(ArrowDown2Icon, 16)}
      </button>
      <div id={`amh-panel-${m.id}`} className={s.mega} hidden={open !== m.id}>
        <div className={s.megaCard}>
          <div className={s.megaGrid}>
            <div className={s.megaMain}>
              <p className={s.megaLabel}>{m.label}</p>
              <div className={s.megaItems} onMouseLeave={() => setPreview(null)}>
                {m.entries.map((e) => (
                  <a
                    key={e.href}
                    href={e.href}
                    className={`${s.megaItem} ${preview === e.href ? s.megaItemOn : ''}`}
                    aria-current={current(e.href)}
                    onMouseEnter={() => setPreview(e.href)}
                    onFocus={() => setPreview(e.href)}
                    onBlur={() => setPreview(null)}
                  >
                    <span className={s.megaIco} aria-hidden="true"><Ico icon={e.icon} size={18} /></span>
                    <span className={s.megaName}>{e.title}</span>
                  </a>
                ))}
                <a href={m.all.href} className={s.megaItem} onMouseEnter={() => setPreview(null)}>
                  <span className={s.megaIco} aria-hidden="true"><Ico icon={m.all.icon} size={18} /></span>
                  <span className={s.megaName}>{m.all.title}</span>
                </a>
              </div>
            </div>
            <aside className={s.megaSide} aria-live="polite">
              {previewed && open === m.id && m.entries.includes(previewed) ? (
                <a key={previewed.href} href={previewed.href} className={s.megaPreview} tabIndex={-1}>
                  <span className={s.megaPhoto}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewed.image} alt="" loading="lazy" onError={(e) => { e.currentTarget.src = '/services/house-removals.jpg'; }} />
                    {previewed.badge && <span className={s.megaPrice}>{previewed.badge}</span>}
                  </span>
                  <span className={s.megaPreviewTitle}>{previewed.title}</span>
                  <span className={s.megaPreviewText}>{previewed.text}</span>
                  <span className={s.megaPreviewMore}>{m.more} {icon(ArrowRight2Icon, 15)}</span>
                </a>
              ) : (
                <div key="promo" className={s.megaPromo}>
                  <div>
                    <span className={s.megaTag}>Free home survey</span>
                    <p className={s.megaPromoTitle}>{m.promo.title}</p>
                    <p className={s.megaPromoText}>{m.promo.text}</p>
                  </div>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={s.megaCta}>Get a quote {icon(ArrowRight2Icon, 16)}</a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header ref={headerRef} className={`${s.header} ${scrolled ? s.scrolled : ''}`} id="main-header">
      <div className={s.inner}>
        <a href="/" className={s.logo} aria-label={`${BRAND} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.logoMark} src="/brand/phi-movers-icon-192.png" alt="" width={34} height={34} />
          <span>{BRAND}</span>
        </a>

        <nav ref={navRef} className={s.nav} aria-label="Primary">
          {megaNav(MEGA.services, 'Services', servicesActive)}
          <a href="/pricing" className={s.navLink} aria-current={current('/pricing')}>Pricing</a>
          {megaNav(MEGA.areas, 'Areas', areasActive)}
          <a href="/reviews" className={s.navLink} aria-current={current('/reviews')}>Reviews</a>
          <a href="/blog" className={s.navLink} aria-current={pathname.startsWith('/blog') ? 'page' : undefined}>Blog</a>
          <a href="/contact" className={s.navLink} aria-current={current('/contact')}>Contact</a>
        </nav>

        <div className={s.actions}>
          <SiteSearch />
          <a href={PHONE_TEL} className={`${s.phoneLink} ${s.desktopOnly}`}>{icon(CallIcon, 18)} {PHONE_DISPLAY}</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={s.iconBtnOutline} aria-label="WhatsApp us (opens WhatsApp)" title="WhatsApp us"><WaIcon size={21} /></a>
          <a href={PHONE_TEL} className={`${s.iconBtnOutline} ${s.phoneOnly}`} aria-label={`Call ${PHONE_DISPLAY}`} title="Call us">{icon(CallIcon, 20)}</a>
          <a href="/book" className={s.btnLime} aria-current={current('/book')}>Book online</a>
        </div>
      </div>
    </header>
  );
}
