'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Clock as ClockIcon, Book1 as Book1Icon, Location as TrackIcon, Profile as ProfileIcon, Category as CategoryIcon, CloseCircle as CloseCircleIcon, HamburgerMenu as HamburgerMenuIcon, Home2 as Home2Icon, Location as LocationIcon, SearchNormal1 as SearchNormal1Icon, Sms as SmsIcon, Star1 as Star1Icon, Tag as TagIcon } from 'iconsax-reactjs';
import { Ico, type IconType } from './Ico';
import OpenNow from './OpenNow';
import { searchSite } from './SiteHeader';
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../site-facts';
import { WaIcon } from './WhatsApp';
import { SearchClear } from './SearchClear';

// The phone and tablet app shell: a five-tab bar fixed to the bottom of every page, and the Menu tab's
// bottom sheet (search, section tiles, Book online). From 1024px the header carries the navigation instead.

type Tab = { href: string; label: string; icon: IconType; on: (p: string) => boolean };

const TABS: Tab[] = [
  { href: '/', label: 'Home', icon: Home2Icon, on: (p) => p === '/' },
  { href: '/services', label: 'Services', icon: CategoryIcon, on: (p) => p.startsWith('/services') },
  { href: '/pricing', label: 'Pricing', icon: TagIcon, on: (p) => p === '/pricing' },
  // The primary action gets its own tab: one tap to the booking page from anywhere. The client portal lives in the menu sheet.
  { href: '/book', label: 'Book', icon: ClockIcon, on: (p) => p.startsWith('/book') },
];

// Eight tiles: the sections people look for most, then their own quotes and tracking. Ask Phi has its own floating button on phones.
const TILES: { href: string; label: string; icon: IconType }[] = [
  { href: '/services', label: 'Services', icon: CategoryIcon },
  { href: '/pricing', label: 'Pricing', icon: TagIcon },
  { href: '/areas', label: 'Areas', icon: LocationIcon },
  { href: '/reviews', label: 'Reviews', icon: Star1Icon },
  { href: '/blog', label: 'Blog', icon: Book1Icon },
  { href: '/contact', label: 'Contact', icon: SmsIcon },
  { href: '/my-bookings', label: 'My quotes', icon: ProfileIcon },
  { href: '/track', label: 'Track', icon: TrackIcon },
];

const TYPING = 'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=range]),textarea,[contenteditable=true]';

export const APPNAV_CSS = `
.tb-bar,.tb-menu{display:none}
@media (max-width:1023.98px){
  .dc-foot{padding-bottom:calc(70px + env(safe-area-inset-bottom))!important}
  .am-cookie{bottom:calc(86px + env(safe-area-inset-bottom))}
  body .amc-launch{bottom:calc(80px + env(safe-area-inset-bottom))}

  .tb-bar{--tb-ease:cubic-bezier(.2,.7,.2,1);display:block;position:fixed;left:0;right:0;bottom:0;z-index:900;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:rgba(242,248,233,.9);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 -1px 0 var(--line),0 -12px 30px -24px rgba(22,51,0,.45);transition:transform .5s var(--tb-ease),opacity .5s var(--tb-ease)}
  .tb-bar.is-away{transform:translateY(110%);opacity:0;pointer-events:none}
  .tb-list{position:relative;display:flex;align-items:stretch;gap:4px;margin:0;padding:0;list-style:none}
  .tb-list>li{display:flex;flex:1;min-width:0}
  .tb-tab{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:6px 0;border:0;border-radius:12px;background:none;font:600 11px/1.6 "Instrument Sans",system-ui,sans-serif;color:var(--ink-60);cursor:pointer;transition:color .3s,transform .3s}
  .tb-tab span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .tb-tab:active{transform:scale(.95)}
  .tb-tab[aria-current=page],.tb-tab[aria-expanded=true],a.tb-tab[aria-current=page]:hover{color:var(--link)}
  .tb-list>.tb-rule{position:absolute;left:0;top:-8px;flex:none;width:calc((100% - (var(--n) - 1) * 4px) / var(--n));height:3px;opacity:0;pointer-events:none;transform:translateX(calc(var(--at) * (100% + 4px)));transition:transform .45s var(--tb-ease),opacity .2s}
  .tb-list>.tb-rule[data-on]{opacity:1}
  .tb-rule>span{display:block;width:28px;height:3px;margin:0 auto;border-radius:0 0 3px 3px;background:var(--link)}

  .tb-menu{--tb-ease:cubic-bezier(.2,.7,.2,1);display:block;position:fixed;inset:0;z-index:1100;pointer-events:none}
  .tb-menu[data-open]{pointer-events:auto}
  .tb-scrim{position:absolute;inset:0;background:rgba(15,26,9,.35);opacity:0;transition:opacity .3s}
  .tb-menu[data-open] .tb-scrim{opacity:1}
  .tb-sheet{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;max-height:88dvh;padding-bottom:env(safe-area-inset-bottom);border-radius:24px 24px 0 0;background:var(--band-a);box-shadow:0 2px 6px rgba(15,26,9,.05),0 22px 48px -20px rgba(22,51,0,.32);outline:none;visibility:hidden;transform:translateY(100%);transition:transform .5s var(--tb-ease),visibility 0s linear .5s}
  .tb-menu[data-open] .tb-sheet{visibility:visible;transform:none;transition:transform .5s var(--tb-ease)}
  .tb-sheet-top{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px 4px}
  .tb-handle{position:absolute;left:50%;top:8px;width:40px;height:4px;margin-left:-20px;border-radius:999px;background:rgba(15,26,9,.2)}
  .tb-status{margin-top:12px;padding:6px 12px;border-radius:999px;background:var(--green-soft);font-size:12.5px;font-weight:600}
  .tb-close{display:grid;place-items:center;width:44px;height:44px;margin-top:8px;border:0;border-radius:999px;background:none;color:var(--ink);cursor:pointer}
  .tb-body{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 16px 16px}
  .tb-search{position:relative;margin-top:4px}
  .tb-search svg{position:absolute;left:16px;top:50%;margin-top:-10px;color:var(--ink-60);pointer-events:none}
  .tb-search input{width:100%;height:50px;padding:0 50px 0 44px;border:1px solid rgba(15,26,9,.2);border-radius:12px;background:#fff;font:inherit;font-size:16px;color:var(--ink);outline:none;-webkit-appearance:none;appearance:none}
  .tb-search input::placeholder{color:var(--ink-60)}
  .tb-search input:focus{border-color:var(--ink)}
  .tb-hits{margin:10px 0 0;padding:6px;list-style:none;border-radius:18px;background:#fff;box-shadow:0 1px 2px rgba(15,26,9,.04),0 10px 30px -14px rgba(22,51,0,.22)}
  .tb-hits a{display:flex;align-items:baseline;justify-content:space-between;gap:12px;min-height:44px;padding:11px 12px;border-radius:12px;font-size:15px;font-weight:600;color:var(--ink)}
  .tb-hits small{flex:none;font-size:12.5px;font-weight:500;color:var(--ink-60)}
  .tb-hits p{margin:0;padding:11px 12px;font-size:14px;line-height:1.5;color:var(--ink-68)}
  .tb-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px 0 0;padding:0;list-style:none}
  .tb-tile{width:100%;border:0;font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;padding:16px 8px;border-radius:18px;background:#fff;box-shadow:0 1px 2px rgba(15,26,9,.04),0 10px 30px -14px rgba(22,51,0,.22);font-size:14px;font-weight:600;line-height:1.3;text-align:center;color:var(--ink);transition:transform .3s}
  .tb-tile:active{transform:scale(.96)}
  .tb-tile i{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--green-soft);color:var(--link)}
  .tb-tile[aria-current=page] i{background:var(--lime);color:var(--ink)}
  .tb-foot{flex:none;display:grid;justify-items:center;gap:10px;padding:4px 16px 16px}
  .tb-book{display:flex;align-items:center;justify-content:center;width:100%;height:48px;border-radius:999px;background:var(--lime);font-size:16px;font-weight:600;color:var(--ink);transition:transform .3s var(--tb-ease)}
  .tb-book:active{transform:scale(.97)}
  .tb-wa{gap:8px;background:#fff;border:1px solid var(--line-strong)}
  .tb-call{font-size:14.5px;font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
  @keyframes tb-rise{0%{opacity:0;transform:translateY(12px)}}
}
@media (max-width:1023.98px) and (prefers-reduced-motion:no-preference){
  .tb-menu[data-open] .tb-search,.tb-menu[data-open] .tb-tiles>li,.tb-menu[data-open] .tb-foot{animation:tb-rise .5s var(--tb-ease) both;animation-delay:calc(.14s + var(--i,0) * 38ms)}
  .tb-foot{--i:9}
}
@media (prefers-reduced-motion:reduce){.tb-bar,.tb-sheet,.tb-scrim,.tb-tab,.tb-tile,.tb-rule{transition:none!important}}
@media print{.tb-bar,.tb-menu{display:none!important}}
`;

export default function AppNav() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [q, setQ] = useState('');
  const sheetRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) menuBtnRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    setOpen(false);
    setQ('');
  }, [pathname]);

  // The bar steps aside while the on-screen keyboard is up, so it never sits on top of a form.
  useEffect(() => {
    const check = () => {
      const el = document.activeElement;
      setTyping(Boolean(el && el.matches(TYPING) && !el.closest('.tb-menu')));
    };
    document.addEventListener('focusin', check);
    document.addEventListener('focusout', check);
    return () => {
      document.removeEventListener('focusin', check);
      document.removeEventListener('focusout', check);
    };
  }, []);

  // Open sheet: page stays put behind it, focus stays inside, Escape closes.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>('a[href],button,input'));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === sheetRef.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    // Rotating or widening past the phone layout closes it, so the page is never left locked.
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const active = open ? TABS.length : TABS.findIndex((t) => t.on(pathname));
  const hits = searchSite(q, 6);
  const searching = q.trim().length >= 2;
  const go = (e: FormEvent) => {
    e.preventDefault();
    if (hits[0]) window.location.href = hits[0].href;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: APPNAV_CSS }} />
      <div className={`tb-bar${typing ? ' is-away' : ''}`} aria-hidden={typing} {...(typing ? { inert: '' as unknown as boolean } : {})}>
        <nav aria-label="Sections">
          <ul className="tb-list">
            <li className="tb-rule" aria-hidden="true" data-on={active >= 0 ? '' : undefined} style={{ ['--at' as string]: Math.max(active, 0), ['--n' as string]: TABS.length + 1 }}><span /></li>
            {TABS.map((t, i) => (
              <li key={t.href}>
                <a href={t.href} className="tb-tab" aria-current={active === i ? 'page' : undefined}>
                  <Ico icon={t.icon} size={22} variant={active === i ? 'Bold' : 'Linear'} />
                  <span>{t.label}</span>
                </a>
              </li>
            ))}
            <li>
              <button ref={menuBtnRef} type="button" className="tb-tab" aria-expanded={open} aria-controls="tb-menu" onClick={() => setOpen((o) => !o)}>
                <Ico icon={HamburgerMenuIcon} size={22} />
                <span>Menu</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div id="tb-menu" className="tb-menu" data-open={open ? '' : undefined} aria-hidden={!open} {...(!open ? { inert: '' as unknown as boolean } : {})}>
        <div className="tb-scrim" onClick={() => close()} />
        <div ref={sheetRef} className="tb-sheet" role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1}>
          <div className="tb-sheet-top">
            <span className="tb-handle" aria-hidden="true" />
            <OpenNow className="tb-status" />
            <button type="button" className="tb-close" aria-label="Close menu" onClick={() => close()}><Ico icon={CloseCircleIcon} size={24} /></button>
          </div>
          <div className="tb-body">
            <form className="tb-search" role="search" onSubmit={go}>
              <Ico icon={SearchNormal1Icon} size={20} />
              <input type="search" enterKeyHint="search" autoComplete="off" placeholder="What are you moving, and where?" aria-label="Search services and areas" value={q} onChange={(e) => setQ(e.target.value)} />
              <SearchClear value={q} onClear={() => setQ('')} style={{ position: 'absolute', right: 11, top: '50%', marginTop: -14 }} />
            </form>
            {searching && (
              <div className="tb-hits" aria-live="polite">
                {hits.length > 0
                  ? <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>{hits.map((h) => <li key={`${h.kind}-${h.href}`}><a href={h.href}><span>{h.title}</span><small>{h.kind}</small></a></li>)}</ul>
                  : <p>No match. If it is in Greater London, we cover it at the same prices.</p>}
              </div>
            )}
            <ul className="tb-tiles">
              {TILES.map((t, i) => (
                <li key={t.href} style={{ ['--i' as string]: Math.min(i + 1, 8) }}>
                  <a href={t.href} className="tb-tile" aria-current={pathname === t.href ? 'page' : undefined}>
                    <i aria-hidden="true"><Ico icon={t.icon} size={22} variant="Bold" /></i>
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="tb-foot">
            <a href="/book" className="tb-book">Book online</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="tb-book tb-wa"><WaIcon size={20} /> WhatsApp us</a>
            <a href={PHONE_TEL} className="tb-call">Or call {PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </>
  );
}
