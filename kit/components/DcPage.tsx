import Head from 'next/head';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Ico, type IconType } from './Ico';
import { Add as AddIcon, Box as BoxIcon, Building as BuildingIcon, Car as CarIcon, DocumentText as DocumentIcon, Home as HomeIcon, Location as LocationIcon2, Music as MusicIcon, Setting2 as ToolsIcon, ShieldTick as CoverIcon, Tag as TagIcon, Trash as TrashIcon, Truck as TruckIcon, TruckFast as TruckFastIcon, Weight as WeightIcon, Call as CallIcon, Clock as ClockIcon, Location as LocationIcon, Minus as MinusIcon, ShieldTick as ShieldTickIcon, Sms as SmsIcon, Star1 as Star1Icon } from 'iconsax-reactjs';
import GoogleAnalytics from './GoogleAnalytics';
import LocalBusinessSchema from './LocalBusinessSchema';
import CookieConsent from './CookieConsent';
import SiteHeader from './SiteHeader';
import AppNav from './AppNav';
import AssistantLauncher from './assistant/AssistantLauncher';
import { WA_CSS, WaIcon, WhatsAppButton, WhatsAppFloat } from './WhatsApp';
import { BLOCKS_CSS } from './blocks-css';
import { MOTION_CSS } from './HomeMotion';
import { PRICE_EXPLORER_CSS } from './PriceExplorer';
import {
  ADDRESS as FACT_ADDRESS,
  BRAND,
  COMPANIES_HOUSE_URL,
  COMPANY_NAME,
  COMPANY_NO,
  EMAIL,
  GOOGLE_REVIEW_URL,
  HOURS,
  INSURED_TEXT,
  SOCIALS,
  TRUSTPILOT_URL,
  GOOGLE_DIRECTIONS as FACT_GOOGLE_DIRECTIONS,
  HOURS_TEXT,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
  RATES,
  RATING,
  SITE as FACT_SITE,
} from '../site-facts';

export const SITE = FACT_SITE;
export const TEL = PHONE_TEL;
export const ADDRESS = FACT_ADDRESS;
export const GOOGLE_DIRECTIONS = FACT_GOOGLE_DIRECTIONS;

export const INK = '#0f1a09';
export const LIME = '#9fe870';
export const GREEN = '#2f7a18';
export const DISPLAY = "'Bricolage Grotesque',sans-serif";
export const MONO = "'IBM Plex Mono',monospace";

// House rules: body copy >= .68, supporting notes >= .6, labels .72; green only for inline text links.
export const TEXT = 'rgba(15,26,9,.7)';
export const MUTED = 'rgba(15,26,9,.68)';
export const NOTE = 'rgba(15,26,9,.6)';
export const LINE = 'rgba(15,26,9,.1)';

// Design tokens and shared rules. House rules: lime is a background only (ink text on it), grey hovers,
// no shadows, no dark sections or buttons, bands alternate #f2f8e9 / #fff. Full rules: docs/DESIGN.md.
const BASE_CSS = `
input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none;appearance:none;display:none}
:root{--lime:#9fe870;--lime-hover:#93dd63;--lime-soft:rgba(159,232,112,.4);--ink:#0f1a09;--ink-72:rgba(15,26,9,.72);--ink-68:rgba(15,26,9,.68);--ink-60:rgba(15,26,9,.6);--grey:#eef5e5;--band-a:#f2f8e9;--band-b:#fff;--link:#2f7a18;--forest:#163300;--line:rgba(15,26,9,.1);--line-strong:rgba(15,26,9,.18);--hover:rgba(15,26,9,.07);--peach:#fdebe3;--green-soft:#e3f4d2;--focus:rgba(15,26,9,.55);--accent:#2f7a18;--band:#e6f2d8;--star:#b8860b;--card-shadow:0 1px 2px rgba(15,26,9,.04),0 12px 32px -20px rgba(15,26,9,.22);--t-state:.16s;--t-enter:.24s;--err:#8c1f1f;--s-1:8px;--s-2:12px;--s-3:16px;--s-4:24px;--s-5:32px;--s-6:48px;--s-7:64px;--s-8:96px;color-scheme:light}
html,body{margin:0;padding:0}
body{background:var(--band-a);color:var(--ink);font-family:"Instrument Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
*{box-sizing:border-box}
::selection{background:rgba(159,232,112,.6);color:var(--ink)}
a{color:var(--ink);text-decoration:none}
img{max-width:100%;display:block}
p,li,blockquote,dd{text-wrap:pretty;overflow-wrap:break-word}
h1,h2{text-wrap:balance}
.dc-error{margin:6px 0 0;font-size:14px;color:var(--err)}
.dc-num,.mo-odo{font-variant-numeric:tabular-nums}
@media (max-width:640px){.dc-crumbs>a:first-child,.dc-crumbs>span:first-of-type>span[aria-hidden]{display:none}}
section[id],h2[id],h3[id]{scroll-margin-top:84px}
.dc-page{padding-top:64px}
@media (min-width:1024px){.dc-page{padding-top:64px}}
.dc-skip{position:fixed;left:16px;top:-80px;z-index:2000;background:#fff;color:var(--ink);border:1px solid var(--line-strong);border-radius:999px;padding:12px 18px;font-weight:600}
.dc-skip:focus{top:12px}
:where(a,button,summary,[tabindex],input[type=checkbox],input[type=radio]):focus-visible{outline:2px solid var(--focus);outline-offset:3px}
/* Standard form field, used everywhere: one soft border, 12px corners, ink border on focus, no outline ring. */
:where(input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=submit]):not([type=button]):not([type=reset]),select,textarea){border:1px solid rgba(15,26,9,.2);border-radius:12px;background:#fff;color:var(--ink);font:inherit;font-size:16px}
:where(input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=submit]):not([type=button]):not([type=reset]),select,textarea):focus{outline:none;border-color:var(--ink)}
@keyframes dc-text-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:no-preference){
  @supports (animation-timeline:view()){
    .dc-text{animation:dc-text-in linear both;animation-timeline:view();animation-range:entry 0% entry 100%}
  }
}
.dc-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:600;border-radius:999px;white-space:nowrap;cursor:pointer;font-family:inherit;transition:background-color var(--t-state) ease,transform var(--t-state) ease}
.dc-btn:active{transform:scale(.98)}
.dc-btn-mark{gap:10px}
.dc-btn-mark::after{content:"";flex:none;width:30px;height:30px;margin:-6px -12px -6px 0;border-radius:999px;background:rgba(255,255,255,.55) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230f1a09' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14M13 6l6 6-6 6'/%3E%3C/svg%3E\") center/15px no-repeat;transition:transform .3s ease}
.dc-btn-white.dc-btn-mark::after{background-color:var(--lime)}
.dc-btn-mark:hover::after{transform:translateX(2px)}
.ico-fill{color:#f5a623!important}
.ico-fill path{fill:currentColor}
.dc-photo-card img{border-radius:15px}
.dc-page.dc-page-focus{padding-top:0}
.dc-focus-head{display:flex;justify-content:space-between;align-items:center;gap:16px;max-width:1216px;margin:0 auto;padding:10px 5vw}
.dc-focus-logo{display:inline-flex;align-items:center;gap:10px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:21px;letter-spacing:-.03em;color:var(--ink)}
.dc-brand-mark{flex:none;width:30px;height:30px;border-radius:9px;display:block}
.dc-focus-right{display:flex;align-items:center;gap:18px}
.dc-focus-mine{padding:8px 16px;border-radius:999px;border:1px solid transparent;background:var(--lime);font-weight:600;font-size:14px;color:var(--ink);transition:background-color var(--t-state) ease}
@media (hover:hover){.dc-focus-mine:hover{background:var(--lime-hover)}}
@media (max-width:480px){.dc-focus-mine{display:none}}
.dc-focus-call{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:15px;color:var(--ink)}
.dc-focus-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;max-width:1216px;margin:0 auto;padding:24px 5vw 40px;border-top:1px solid var(--line);font-size:13.5px;color:var(--ink-68)}
.dc-focus-foot nav{display:flex;flex-wrap:wrap;gap:8px 18px}
.dc-focus-foot a{color:inherit;text-decoration:underline;text-underline-offset:3px}
.dc-btn-lime{background:var(--lime);color:var(--ink);border:1px solid transparent}
.dc-btn-white{background:#fff;color:var(--ink);border:1px solid var(--line-strong)}
.dc-btn-grey{background:var(--grey);color:var(--ink);border:1px solid rgba(15,26,9,.12)}
.dc-btn-ghost{background:transparent;color:var(--ink);border:1px solid rgba(15,26,9,.34)}
.dc-chip{transition:background-color var(--t-state) ease}
.dc-pick{cursor:pointer;font-family:inherit;color:var(--ink);transition:background-color var(--t-state) ease,transform var(--t-state) ease}
.dc-pick:active{transform:scale(.98)}
.dc-inline-link{color:var(--link);font-weight:600;text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px;text-decoration-color:rgba(47,122,24,.35)}
.dc-foot a:not(.dc-btn){color:inherit}
@media (hover:hover){
  .dc-btn-lime:hover{background:var(--lime-hover);color:var(--ink)}
  .dc-btn-white:hover{background:var(--grey);color:var(--ink)}
  .dc-btn-grey:hover{background:#eaece7;color:var(--ink)}
  .dc-btn-ghost:hover{background:rgba(255,255,255,.4);color:var(--ink)}
  a.dc-chip:hover{background:var(--grey);color:var(--ink)}
  .dc-pick:hover{background:var(--grey)}
  .dc-pick[aria-pressed="true"]:hover{background:var(--lime-hover)}
  .dc-inline-link:hover{text-decoration-color:currentColor}
  .dc-card-title a:hover{text-decoration:underline;text-underline-offset:3px}
  .dc-foot a:not(.dc-btn):hover{color:var(--ink)}
}
.dc-prose p{margin:0 0 18px;font-size:16px;line-height:1.65;color:rgba(15,26,9,.72)}
.dc-prose h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(27px,3vw,36px);letter-spacing:-.025em;line-height:1.15;margin:42px 0 14px;color:#0f1a09;text-wrap:balance}
.dc-prose h3{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.01em;margin:28px 0 10px;color:#0f1a09}
.dc-prose ul{margin:0 0 18px;padding-left:20px}
.dc-prose li{font-size:16px;line-height:1.6;color:rgba(15,26,9,.72);margin-bottom:9px}
.dc-prose a{color:var(--link);font-weight:600;text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px;text-decoration-color:rgba(47,122,24,.35)}
.dc-prose .dc-btn{color:var(--ink);text-decoration:none}
.dc-prose strong{color:var(--ink)}
.dc-table-wrap{overflow-x:auto;margin:0 0 18px;scrollbar-width:thin;scrollbar-color:rgba(15,26,9,.25) transparent}
.dc-table{border-collapse:collapse;width:100%;min-width:440px;font-size:14px;font-variant-numeric:tabular-nums}
.dc-table th,.dc-table td{text-align:left;padding:9px 12px 9px 0;border-bottom:1px solid rgba(15,26,9,.08)}
.dc-table thead th{border-bottom:1px solid rgba(15,26,9,.16);font-weight:600;font-size:12px;color:var(--ink-72)}
.dc-table th:last-child,.dc-table td:last-child{padding-right:0}
.dc-table td:not(:first-child),.dc-table th:not(:first-child){white-space:nowrap}
.dc-table tr.is-total td{font-weight:600;background:var(--grey)}
.dc-table tr.is-total td:first-child{padding-left:10px;border-radius:10px 0 0 10px}
.dc-table tr.is-total td:last-child{padding-right:10px;border-radius:0 10px 10px 0}
/* One FAQ look everywhere: a white card, hairline rows, a round plus/minus chip. */
.dc-faq{background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);padding:2px clamp(16px,2.4vw,24px)}
.dc-faq{max-width:840px}
.dc-faq-split{display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:clamp(24px,4vw,64px);align-items:start}
.dc-faq-split .dc-faq,.ih-split .dc-faq{max-width:none}
@media (min-width:981px){.dc-faq-head{position:sticky;top:112px}}
@media (max-width:980px){.dc-faq-split{grid-template-columns:1fr;gap:16px}}
.dc-faq-item + .dc-faq-item{border-top:1px solid rgba(15,26,9,.1)}
.dc-faq-item h3{margin:0}
.dc-faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;background:none;border:0;padding:18px 0;cursor:pointer;text-align:left;font-family:inherit;font-size:16.5px;line-height:1.4;font-weight:600;color:var(--ink)}
.dc-faq-ico{flex:none;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;background:var(--green-soft);color:var(--accent);transition:background-color var(--t-state) ease}
.dc-faq-q[aria-expanded="true"] .dc-faq-ico{background:var(--lime);color:var(--ink)}
.dc-faq-a{display:grid;grid-template-rows:0fr;max-width:68ch;opacity:0;visibility:hidden;transition:grid-template-rows .34s cubic-bezier(.2,.7,.2,1),opacity .26s ease,visibility 0s linear .34s}
.dc-faq-a[data-open="true"]{grid-template-rows:1fr;opacity:1;visibility:visible;transition-delay:0s}
.dc-faq-in{overflow:hidden;min-height:0}
.dc-faq-pad{padding:0 0 20px}
.dc-faq-ico svg{transition:transform .3s cubic-bezier(.2,.7,.2,1)}
.dc-faq-q[aria-expanded="true"] .dc-faq-ico svg{transform:rotate(180deg)}
@media (prefers-reduced-motion:reduce){.dc-faq-a,.dc-faq-ico svg{transition:none}}
.dc-faq-a p{margin:0 0 12px;font-size:15.5px;line-height:1.65;color:var(--ink-68)}
.dc-faq-a p:last-child{margin-bottom:0}
.dc-faq-all{display:inline-flex;align-items:center;gap:8px;min-height:44px;margin:4px 0 8px;border:0;background:none;padding:0;font:inherit;font-size:15px;font-weight:600;color:var(--ink);cursor:pointer}
.dc-faq-all svg{color:var(--accent)}
.dc-two-col{display:grid;grid-template-columns:minmax(0,780px) minmax(0,300px);gap:clamp(24px,4vw,56px);justify-content:center;align-items:start}
.dc-aside{position:sticky;top:96px;display:flex;flex-direction:column;gap:16px;min-width:0}
@media (hover:hover){
  .dc-prose a:hover{text-decoration-color:currentColor}
  .dc-faq-q:hover{color:var(--ink)}
  .dc-faq-q:hover .dc-faq-ico{background:var(--lime);color:var(--ink)}
}
@media (max-width:980px){
  .dc-two-col{grid-template-columns:minmax(0,1fr)}
  .dc-aside{position:static}
}
.dc-top-btn{display:none}
.dc-map-ph{position:relative;display:grid;place-items:center;text-align:center;gap:10px;padding:24px}
@media (min-width:1024px){
  .dc-top-btn{display:grid;place-items:center;position:fixed;right:24px;bottom:24px;z-index:45;width:48px;height:48px;padding:0;border:0;border-radius:999px;background:#fff;color:var(--ink);cursor:pointer;opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease}
  .dc-top-btn.is-on{opacity:1;visibility:visible}
  .dc-top-ring{position:absolute;inset:0}
}
.am-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:1500;max-width:420px;background:#fff;color:var(--ink);border:1px solid var(--line-strong);border-radius:18px;padding:18px 18px 16px;display:grid;gap:8px;font-family:inherit}
.am-cookie-title{margin:0;font-weight:600;font-size:15px}
.am-cookie-text{margin:0;font-size:14px;line-height:1.5;color:var(--ink-72)}
.am-cookie-text a{color:var(--link);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.am-cookie-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.am-cookie-btn{flex:1;font-size:14.5px;padding:11px 16px;min-height:44px}
@media (prefers-reduced-motion:reduce){
  .dc-btn,.dc-chip,.dc-pick,.dc-btn:active,.dc-pick:active{transition:none;transform:none}
}
@media print{
  #main-header,.dc-top-btn,.am-cookie,.dc-foot,.dc-noprint,[data-hide-sticky]{display:none!important}
  .dc-page{padding:0!important}
  body{background:#fff}
  a{text-decoration:underline}
  .dc-text{animation:none!important;opacity:1!important;transform:none!important}
}
`;

export const icon = (i: IconType, size = 18) => (
  <Ico icon={i} size={size} aria-hidden="true" />
);

export function Stars({ size = 16, color = INK }: { size?: number; color?: string }) {
  return (
    <span role="img" aria-label="5 out of 5 stars" style={{ display: 'inline-flex', gap: 2, color }}>
      {[0, 1, 2, 3, 4].map((k) => (
        <Ico key={k} icon={Star1Icon} size={size} className="ico-fill" aria-hidden="true" />
      ))}
    </span>
  );
}

export const h1Style = (maxWidth = 'none', fontSize = 'clamp(34px,4.6vw,54px)'): CSSProperties => ({
  fontFamily: DISPLAY,
  fontWeight: 500,
  fontSize,
  lineHeight: 1.06,
  letterSpacing: '-.035em',
  margin: '0 0 16px',
  maxWidth,
  textWrap: 'balance',
});

export const h2Style = (margin: string, fontSize = 'clamp(27px,3vw,36px)'): CSSProperties => ({
  fontFamily: DISPLAY,
  fontWeight: 500,
  fontSize,
  lineHeight: 1.15,
  letterSpacing: '-.025em',
  margin,
  textWrap: 'balance',
});

export const h3Style = (fontSize = 18, margin = '0 0 6px'): CSSProperties => ({
  fontFamily: DISPLAY,
  fontWeight: 500,
  fontSize,
  letterSpacing: '-.01em',
  margin,
});

export const leadStyle = (maxWidth: string, margin: string): CSSProperties => ({
  fontSize: 'clamp(15.5px,1.4vw,17.5px)',
  lineHeight: 1.6,
  color: MUTED,
  margin,
  maxWidth,
  textWrap: 'pretty',
});

export const bodySmall: CSSProperties = { margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'rgba(15,26,9,.68)' };

// Uppercase mono micro-label: one to three words only.
export const monoLabel = (margin = '0 0 12px'): CSSProperties => ({
  fontFamily: MONO,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
  color: 'rgba(15,26,9,.72)',
  margin,
});

// Longer labels stay in sentence case.
export const sentenceLabel = (margin = '0 0 12px'): CSSProperties => ({
  fontSize: 13.5,
  fontWeight: 600,
  color: 'rgba(15,26,9,.72)',
  margin,
});

export const card = (lime = false, padding: CSSProperties['padding'] = 20): CSSProperties => ({
  background: lime ? 'var(--band)' : '#fff',
  border: `1px solid rgba(15,26,9,${lime ? '0' : '.05'})`,
  borderRadius: 20,
  ...(lime ? {} : { boxShadow: 'var(--card-shadow)' }),
  padding,
});

export const band = (white: boolean, padding = 'clamp(28px,4vw,52px) 5vw'): CSSProperties => ({
  padding,
  ...(white ? { background: '#fff', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` } : {}),
});

export const chipStyle: CSSProperties = { background: '#fff', boxShadow: '0 1px 2px rgba(15,26,9,.06)', borderRadius: 999, padding: '7px 13px', fontSize: 13.5, whiteSpace: 'nowrap' };

export function TopicTag({ children, solid = false }: { children: ReactNode; solid?: boolean }) {
  return (
    <p style={{ display: 'inline-flex', alignItems: 'center', background: solid ? LIME : 'var(--green-soft)', borderRadius: 999, padding: '4px 10px', fontSize: 11.5, lineHeight: 1.2, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: solid ? INK : 'var(--accent)', margin: '0 0 12px', width: 'fit-content' }}>{children}</p>
  );
}

export type Crumb = { name: string; path?: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="dc-crumbs" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: NOTE, marginBottom: 18, flexWrap: 'wrap' }}>
      <a href="/">Home</a>
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={c.name} style={{ display: 'contents' }}>
            <span aria-hidden="true">/</span>
            {last || !c.path ? <span aria-current={last ? 'page' : undefined}>{c.name}</span> : <a href={c.path}>{c.name}</a>}
          </span>
        );
      })}
    </nav>
  );
}

export function HeroBadge({ ico, children }: { ico: IconType; children: ReactNode }) {
  return (
    <p style={{ display: 'inline-flex', alignItems: 'center', gap: 8, margin: '0 0 18px', padding: '5px 13px 5px 5px', borderRadius: 999, background: '#fff', boxShadow: 'var(--card-shadow)', fontSize: 13, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap', maxWidth: '100%' }}>
      <span style={{ width: 26, height: 26, borderRadius: 999, background: 'var(--green-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center', flex: 'none' }}>{icon(ico, 15)}</span>
      {children}
    </p>
  );
}

// The public booking page. Service pages pass their own /book?service= link.
export const BOOK = '/book';

// One primary action everywhere: Get a quote. WhatsApp is the second button; calling is a plain text link.
export function CallLink({ pre = '', style }: { pre?: string; style?: CSSProperties }) {
  return <a href={TEL} style={{ fontWeight: 600, color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3, whiteSpace: 'nowrap', ...style }}>{pre}{PHONE_DISPLAY}</a>;
}

/** `book` lets a service page open the booking page on its own service. */
export function HeroButtons({ book = BOOK }: { book?: string }) {
  return (
    <>
      <a href={book} data-hero-cta="" className="dc-btn dc-btn-lime dc-btn-mark" style={{ fontSize: 16.5, padding: '15px 24px' }}>Get a quote</a>
      <WhatsAppButton style={{ fontSize: 16.5, padding: '15px 22px' }} />
    </>
  );
}

// What happens after the tap, said once under the hero buttons.
const hourLabel = (h: number) => (h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`);
export const OPEN_HOURS_SHORT = `${hourLabel(HOURS.open)}–${hourLabel(HOURS.close)}`;

export function CtaNote({ children = `You’ll speak to our office, not a call centre. We reply ${OPEN_HOURS_SHORT}.` }: { children?: ReactNode }) {
  return <p style={{ margin: '12px 0 0', fontSize: 13.5, lineHeight: 1.5, color: NOTE }}>{children}</p>;
}

// Hero trust facts as one quiet line of links instead of three pill chips.
export function TrustLine({ middle, style }: { middle?: { ico: IconType; text: string; href?: string }; style?: CSSProperties }) {
  const item: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' };
  const fact = middle ?? insuredChip;
  return (
    <p className="dc-trust" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 14px', margin: '22px 0 0', fontSize: 14, fontWeight: 500, color: 'rgba(15,26,9,.75)', ...style }}>
      <a href="/reviews" style={item} aria-label={`Rated ${RATING.score} from ${RATING.count} reviews`}>
        <Ico icon={Star1Icon} size={15} className="ico-fill" aria-hidden="true" />
        <strong style={{ fontWeight: 600, color: INK }}>{RATING.score}</strong> from {RATING.count} reviews
      </a>
      <span aria-hidden="true" style={{ color: 'rgba(15,26,9,.3)' }}>·</span>
      {fact.href ? <a href={fact.href} style={item}>{icon(fact.ico, 16)} {fact.text}</a> : <span style={item}>{icon(fact.ico, 16)} {fact.text}</span>}
      <span aria-hidden="true" style={{ color: 'rgba(15,26,9,.3)' }}>·</span>
      <a href="/contact" style={item}>{icon(ClockIcon, 16)} {HOURS_TEXT}</a>
    </p>
  );
}

/** @deprecated kept for older imports; renders the trust line. */
export function TrustChips({ middle }: { middle: { ico: IconType; text: string; href?: string } }) {
  return <TrustLine middle={middle} />;
}

export const insuredChip = { ico: ShieldTickIcon, text: INSURED_TEXT, href: '/insurance' };

export function CtaBand({ title, text, facts, book = BOOK }: { title: string; text: string; facts?: string[]; book?: string }) {
  return (
    <section data-hide-sticky="" className="dc-cta-band" style={{ margin: 'clamp(24px,4vw,56px) 5vw', background: 'radial-gradient(60% 90% at 88% 0%,rgba(255,255,255,.42),transparent 60%),linear-gradient(135deg,#a6ec78 0%,#8ed95f 100%)', borderRadius: 28, padding: 'clamp(36px,5vw,64px) 24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'grid', justifyItems: 'center' }}>
          <h2 className="dc-text" style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(28px,3.4vw,42px)', lineHeight: 1.12, letterSpacing: '-.025em', margin: '0 0 10px', maxWidth: '24ch', textWrap: 'balance' }}>{title}</h2>
          <p className="dc-text" style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'rgba(15,26,9,.78)', maxWidth: '46ch' }}>{text}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px 20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <a href={book} className="dc-btn dc-btn-white dc-btn-mark" style={{ fontSize: 16, padding: '15px 24px', borderColor: 'transparent' }}>Get a quote</a>
          <WhatsAppButton style={{ fontSize: 16, padding: '15px 22px', borderColor: 'transparent' }} />
        </div>
      </div>
      {facts && facts.length > 0 && (
        <ul style={{ listStyle: 'none', margin: '22px 0 0', padding: '18px 0 0', borderTop: '1px solid rgba(15,26,9,.14)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 22px', fontSize: 14, fontWeight: 500, color: 'rgba(15,26,9,.78)' }}>
          {facts.map((f) => <li key={f}>{f}</li>)}
        </ul>
      )}
    </section>
  );
}

export const CLOSING_FACTS = [`Man and van from £${RATES[0].hourly}/hr`, 'Fixed quote before moving day', `${RATING.score} from ${RATING.count} reviews`, INSURED_TEXT];

export type RelatedItem = { path: string; title: string; h1: string; description: string };

// Picks an Iconsax icon from the page title and path, so each related card shows what it is about.
const RELATED_ICONS: Array<[RegExp, IconType]> = [
  [/piano|music/i, MusicIcon],
  [/marketplace|pickup|collection|delivery|courier/i, TruckFastIcon],
  [/dismantl|assembl|reassembl/i, ToolsIcon],
  [/clearance|rubbish|waste|junk|skip/i, TrashIcon],
  [/storage|crate|box|packing|pack/i, BoxIcon],
  [/office|commercial|business|it-|server|relocation/i, BuildingIcon],
  [/student|flat|house|home|studio/i, HomeIcon],
  [/van|hire|man-and-van|removal/i, TruckIcon],
  [/ulez|parking|congestion|suspension|car/i, CarIcon],
  [/hoist|sofa|stair|window|balcony|heavy/i, WeightIcon],
  [/insur|cover|protect/i, CoverIcon],
  [/price|cost|pricing|rate|quote/i, TagIcon],
  [/area|borough|london|ilford|central/i, LocationIcon2],
];
const relatedIcon = (item: RelatedItem): IconType => {
  const text = `${item.path} ${item.title} ${item.h1}`;
  return RELATED_ICONS.find(([re]) => re.test(text))?.[1] ?? DocumentIcon;
};

export function RelatedPages({ items, title = 'You might also need' }: { items: RelatedItem[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <section style={{ padding: 'clamp(30px,5vw,60px) 5vw', borderTop: `1px solid ${LINE}` }}>
      <h2 style={h2Style('0 0 20px', 'clamp(22px,2.4vw,30px)')}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
        {items.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="dc-card-title"
            style={{ display: 'block', height: '100%', boxSizing: 'border-box', ...card() }}
          >
            <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 999, background: LIME, marginBottom: 14 }}>{icon(relatedIcon(item), 18)}</span>
            <h3 style={h3Style(17, '0 0 6px')}>{item.h1 || item.title}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: MUTED, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

// Mid-article call-to-action. Lime variant uses white/ghost buttons so no dark button is needed.
export function InlineCta({ title, text, lime = false, book = BOOK }: { title: string; text: string; lime?: boolean; book?: string }) {
  return (
    <div style={{ ...card(lime, 24), margin: '30px 0', display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ minWidth: 220, flex: 1 }}>
        <p style={{ ...h3Style(21, '0 0 6px') }}>{title}</p>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: lime ? 'rgba(15,26,9,.72)' : MUTED }}>{text}</p>
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <a href={book} className="dc-btn dc-btn-lime dc-btn-mark" style={{ fontSize: 15, padding: '13px 20px' }}>Get a quote</a>
        <WhatsAppButton style={{ fontSize: 15, padding: '13px 18px' }} />
      </div>
    </div>
  );
}

export function SideCard({ title, text, book = BOOK }: { title: string; text: string; callLabel?: string; book?: string }) {
  return (
    <div style={card()}>
      <p style={{ ...h3Style(18, '0 0 10px') }}>{title}</p>
      <p style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.55, color: MUTED }}>{text}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
        <a href={book} className="dc-btn dc-btn-lime dc-btn-mark" style={{ fontSize: 15, padding: '13px 20px' }}>Get a quote</a>
        <WhatsAppButton style={{ fontSize: 15, padding: '13px 18px' }} />
      </div>
    </div>
  );
}

// Our own pinned map. It loads with the page (lazily, as it scrolls into view); "Show map" is the fallback if it is switched off.
// The address and a directions link are always there as text. `place` maps an area (a borough page) instead
// of our address; the card still names our base.
export function MapEmbed({ zoom, title, aspectRatio = '1/1', radius = 20, place }: { zoom: number; title: string; aspectRatio?: string; radius?: number; place?: string }) {
  const [show, setShow] = useState(true);
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(place ?? ADDRESS)}&z=${zoom}&output=embed`;
  return (
    <div style={{ aspectRatio, borderRadius: radius, border: '1px solid rgba(15,26,9,.14)', overflow: 'hidden', background: '#eef5e5', minWidth: 0, position: 'relative' }}>
      {show ? (
        <iframe title={title} src={src} width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ border: 0, display: 'block' }} />
      ) : (
        <div className="dc-map-ph" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(15,26,9,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(15,26,9,.05) 1px,transparent 1px)', backgroundSize: '32px 32px' }}>
          <div style={{ display: 'grid', justifyItems: 'center', gap: 10, maxWidth: 300 }}>
            <span style={{ width: 48, height: 48, borderRadius: 999, background: LIME, display: 'grid', placeItems: 'center' }}>{icon(LocationIcon, 22)}</span>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{place ?? BRAND}</p>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: MUTED }}>{place ? `Our base: ${ADDRESS}` : ADDRESS}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 4 }}>
              <button type="button" className="dc-btn dc-btn-white" onClick={() => setShow(true)} style={{ fontSize: 14.5, padding: '11px 18px' }}>Show map</button>
              <a href={GOOGLE_DIRECTIONS} target="_blank" rel="noopener noreferrer" className="dc-btn dc-btn-grey" style={{ fontSize: 14.5, padding: '11px 18px' }}>Get directions</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// A photo from any path or URL. Phi services and blog posts that have no photo yet get a lime icon tile instead.
// `variants`: the image was run through the optimiser and has {name}-{320,480,640}.{avif,webp} beside it, so
// it is served as <picture> with AVIF and WebP. Without it the original file is used as it is.
// `fallback` replaces the default icon tile (an illustration, FleetArt…). Eager photos load with high priority.
const PHOTO_WIDTHS = [320, 480, 640];
const variantSet = (src: string, ext: 'avif' | 'webp') => PHOTO_WIDTHS.map((w) => `${src.replace(/\.[a-z]+$/i, '')}-${w}.${ext} ${w}w`).join(', ');

export function Photo({ src, alt, eager = false, style, sizes = '(max-width: 760px) 90vw, 640px', variants = false, fallback }: { src: string; alt: string; eager?: boolean; sizes?: string; style?: CSSProperties; variants?: boolean; fallback?: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // An image can fail before React attaches onError (server-rendered HTML), so also check once the page has loaded.
  useEffect(() => {
    const check = () => { const el = ref.current; if (el && el.complete && el.naturalWidth === 0) setFailed(true); };
    check();
    window.addEventListener('load', check);
    const t = window.setTimeout(check, 1500);
    return () => { window.removeEventListener('load', check); window.clearTimeout(t); };
  }, [src]);
  if (!src || failed) {
    // Decorative when alt is empty: hidden from screen readers rather than an unlabelled image.
    const a11y = alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true as const };
    return (
      <span {...a11y} className="dc-photo-fallback" style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: 'var(--green-soft)', color: 'var(--accent)', ...style }}>
        {fallback ?? icon(BoxIcon, 44)}
      </span>
    );
  }
  const img = (
    <img
      src={src}
      alt={alt}
      width={640}
      height={480}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      // React 18 warns on the camelCase prop; the lowercase attribute is passed straight to the DOM.
      {...(eager ? { fetchpriority: 'high' } : {})}
      ref={ref}
      onError={() => setFailed(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }}
    />
  );
  if (!variants) return img;
  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/avif" srcSet={variantSet(src, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={variantSet(src, 'webp')} sizes={sizes} />
      {img}
    </picture>
  );
}

export type FaqItem = { q: string; a: string };

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

// Answers stay in the HTML (hidden attribute) so crawlers can read closed items. Long lists show `first`
// questions and a "Show all N questions" button; the rest stay in the HTML, hidden.
export function FaqList({ items, idPrefix = 'faq', first = 6 }: { items: FaqItem[]; idPrefix?: string; first?: number }) {
  const [open, setOpen] = useState(0);
  const [all, setAll] = useState(false);
  const cut = all || items.length <= first + 1 ? items.length : first;
  return (
    <div className="dc-faq">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="dc-faq-item" hidden={i >= cut}>
            <h3>
              <button type="button" className="dc-faq-q" id={`${idPrefix}-q-${i}`} aria-expanded={isOpen} aria-controls={`${idPrefix}-a-${i}`} onClick={() => setOpen((o) => (o === i ? -1 : i))}>
                <span>{f.q}</span>
                <span aria-hidden="true" className="dc-faq-ico">{icon(isOpen ? MinusIcon : AddIcon, 16)}</span>
              </button>
            </h3>
            <div id={`${idPrefix}-a-${i}`} role="region" aria-labelledby={`${idPrefix}-q-${i}`} className="dc-faq-a" data-open={isOpen} aria-hidden={!isOpen}>
              <div className="dc-faq-in"><div className="dc-faq-pad"><p>{f.a}</p></div></div>
            </div>
          </div>
        );
      })}
      {cut < items.length && (
        <button type="button" className="dc-faq-all" onClick={() => setAll(true)}>Show all {items.length} questions {icon(AddIcon, 16)}</button>
      )}
    </div>
  );
}

// A FAQ block laid out across the page: heading and a short line on the left, the questions on the right.
export function FaqSplit({ title, lead, items, idPrefix, id }: { title: ReactNode; lead?: ReactNode; items: FaqItem[]; idPrefix?: string; id?: string }) {
  return (
    <div className="dc-faq-split">
      <div className="dc-faq-head">
        <h2 id={id} className="dc-text" style={h2Style('0 0 8px')}>{title}</h2>
        {lead && <p className="dc-text" style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: 'rgba(15,26,9,.68)' }}>{lead}</p>}
      </div>
      <FaqList items={items} idPrefix={idPrefix} />
    </div>
  );
}

const FOOTER_SERVICES: [string, string][] = [
  ['House removals', '/services/house-removals'],
  ['Flat removals', '/services/flat-removals'],
  ['Man & van', '/services/man-and-van'],
  ['Sofa delivery', '/services/sofa-delivery'],
  ['Single item delivery', '/services/single-item-delivery'],
  ['Office removals', '/services/office-removals'],
  ['All services', '/services'],
];

const FOOTER_AREAS: [string, string][] = [
  ['Central London', '/areas/central-london'],
  ['East London', '/areas/east-london'],
  ['North London', '/areas/north-london'],
  ['South London', '/areas/south-london'],
  ['West London', '/areas/west-london'],
  ['All 32 boroughs', '/areas'],
];

const FOOTER_COMPANY: [string, string][] = [
  ['About us', '/about'],
  ['Reviews', '/reviews'],
  ['Insurance', '/insurance'],
  ['Trust & verification', '/trust'],
  ['Contact', '/contact'],
  ['Terms & conditions', '/terms'],
  ['Privacy policy', '/privacy'],
  ['Cookies', '/cookies'],
  ['Complaints', '/complaints'],
  ['Accessibility', '/accessibility'],
];

const FOOTER_RESOURCES: [string, string][] = [
  ['Book online', '/book'],
  ['Pricing', '/pricing'],
  ['Customer care', '/help'],
  ['Areas we cover', '/areas'],
  ['Moving guides', '/blog'],
  ['My bookings', '/my-bookings'],
  ['Track your quote', '/track'],
  ['Delete account', '/delete-account'],
  ['Site map', '/all-pages'],
];

const FOOTER_CSS = `
.dc-foot-trust{display:flex;flex-wrap:wrap;gap:8px 22px;padding-bottom:20px;margin-bottom:28px;border-bottom:1px solid var(--line);font-size:13.5px;color:var(--ink-68)}
.dc-foot-trust a{color:var(--ink)}
.dc-foot-grid{display:grid;grid-template-columns:minmax(220px,1.3fr) repeat(4,minmax(150px,1fr));gap:28px}
.dc-foot-group summary{list-style:none;cursor:default;pointer-events:none}
.dc-foot-group summary::-webkit-details-marker{display:none}
.dc-foot-group summary .dc-foot-chev{display:none}
.dc-foot-links{margin:0;display:grid;gap:4px;font-size:14px}
.dc-foot-links a{display:flex;align-items:center;min-height:32px;padding:4px 0}
.dc-foot-social{display:flex;flex-wrap:wrap;gap:4px 16px}
.dc-foot-social a{display:inline-flex;align-items:center;min-height:44px;font-size:13.5px;color:var(--ink-68);text-decoration:underline;text-underline-offset:3px}
.dc-foot-brand{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;letter-spacing:-.04em;line-height:.9;font-size:clamp(56px,13vw,180px);color:rgba(15,26,9,.06);margin:28px 0 0;white-space:nowrap;overflow:hidden;user-select:none}
@media (max-width:1100px){.dc-foot-grid{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}}
@media (max-width:640px){
  .dc-foot-grid{grid-template-columns:1fr;gap:0}
  .dc-foot-about{padding-bottom:20px}
  .dc-foot-group{border-top:1px solid rgba(15,26,9,.1)}
  .dc-foot-group summary{pointer-events:auto;cursor:pointer;display:flex;align-items:center;justify-content:space-between;min-height:52px;margin:0!important}
  .dc-foot-group summary .dc-foot-chev{display:inline-flex;transition:transform var(--t-state) ease}
  .dc-foot-group[open] summary .dc-foot-chev{transform:rotate(45deg)}
  .dc-foot-links{padding:0 0 14px}
  .dc-foot-links a{padding:11px 0;min-height:44px}
}
`;

function FooterGroup({ title, links }: { title: string; links: [string, string][] }) {
  // Open on wider screens; on phones each group collapses behind its heading.
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const apply = () => setOpen(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return (
    <details className="dc-foot-group" open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary style={monoLabel('0 0 10px')}>
        {title}
        <span className="dc-foot-chev" aria-hidden="true">{icon(AddIcon, 16)}</span>
      </summary>
      <div className="dc-foot-links">
        {links.map(([label, href]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </div>
    </details>
  );
}

export function SiteFooter() {
  const row: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 28 };
  const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
  // Only links that are filled in site-facts are shown: no blank profile links.
  const socials: [string, string][] = [
    ['Google Maps', GOOGLE_DIRECTIONS],
    ...(GOOGLE_REVIEW_URL ? [['Google reviews', GOOGLE_REVIEW_URL] as [string, string]] : []),
    ...(TRUSTPILOT_URL ? [['Trustpilot', TRUSTPILOT_URL] as [string, string]] : []),
    ...SOCIALS.filter((s) => s.url).map((s) => [s.name, s.url] as [string, string]),
  ];
  return (
    <footer className="dc-foot" data-hide-sticky="" style={{ background: 'var(--band)', color: MUTED, padding: 'clamp(30px,4vw,52px) 5vw 0', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: FOOTER_CSS }} />
      <div className="dc-foot-trust">
        <a href="/insurance">{INSURED_TEXT}</a>
        <span>{HOURS_TEXT}</span>
        {GOOGLE_REVIEW_URL
          ? <a href={GOOGLE_REVIEW_URL} {...ext}>{RATING.score} on {RATING.source} from {RATING.count} reviews</a>
          : <a href="/reviews">{RATING.score} from {RATING.count} reviews</a>}
        {TRUSTPILOT_URL && <a href={TRUSTPILOT_URL} {...ext}>Trustpilot</a>}
        {COMPANY_NO && <a href={COMPANIES_HOUSE_URL} {...ext}>Company no. {COMPANY_NO}</a>}
        <a href="/pricing">Fixed-price quotes</a>
        <a href="/areas">All 32 London boroughs</a>
      </div>
      <div className="dc-foot-grid">
        <div className="dc-foot-about" style={{ minWidth: 0 }}>
          <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 22, letterSpacing: '-.03em', color: INK, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 10 }}><img className="dc-brand-mark" src="/brand/phi-movers-icon-192.png" alt="" width={30} height={30} />{BRAND}</p>
          <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.6, maxWidth: '42ch' }}>{BRAND} is a London removals and man and van company covering all 32 boroughs. Man and van from £{RATES[0].hourly}/hr, with a clear fixed quote before moving day.</p>
          <address style={{ fontStyle: 'normal' }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.6 }}>
              {COMPANY_NAME}{COMPANY_NO && <>, registered in England and Wales, company no. <a href={COMPANIES_HOUSE_URL} {...ext} style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>{COMPANY_NO}</a></>}
              <br />{ADDRESS}
            </p>
            <div style={{ display: 'grid', gap: 6, fontSize: 14, marginBottom: 16 }}>
              <a href={TEL} style={row}>{icon(CallIcon, 16)} {PHONE_DISPLAY}</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={row}><WaIcon size={16} /> WhatsApp {PHONE_DISPLAY}</a>
              <a href={`mailto:${EMAIL}`} style={row}>{icon(SmsIcon, 16)} {EMAIL}</a>
              <a href={GOOGLE_DIRECTIONS} target="_blank" rel="noopener noreferrer" style={row}>{icon(LocationIcon, 16)} Get directions</a>
              <span style={row}>{icon(ClockIcon, 16)} {HOURS_TEXT}, bank holidays included</span>
            </div>
          </address>
          <div className="dc-foot-social">
            {socials.map(([name, href]) => <a key={href} href={href} {...ext}>{name}</a>)}
          </div>
        </div>
        <nav aria-label="Footer" style={{ display: 'contents' }}>
          <FooterGroup title="Services" links={FOOTER_SERVICES} />
          <FooterGroup title="Areas" links={FOOTER_AREAS} />
          <FooterGroup title="Company" links={FOOTER_COMPANY} />
          <FooterGroup title="Resources" links={FOOTER_RESOURCES} />
        </nav>
      </div>
      <p style={{ margin: '18px 0 0', fontSize: 12.5, color: NOTE }}>© {new Date().getFullYear()} {COMPANY_NAME}{COMPANY_NO ? ` · Company no. ${COMPANY_NO}` : ''} · Removals across all 32 London boroughs.</p>
      <p className="dc-foot-brand" aria-hidden="true">{BRAND}</p>
    </footer>
  );
}

type DcPageProps = {
  title: string;
  description: string;
  path: string;
  crumbs: Crumb[];
  ogImage?: string;
  /** "article" on blog posts, with the dates below. */
  ogType?: 'website' | 'article';
  published?: string;
  modified?: string;
  schema?: object[];
  canonical?: string;
  noindex?: boolean;
  iconFont?: boolean;
  /** "focus" drops the menu, footer and tab bar for task pages such as booking: logo, phone and the task only. "app" hands the whole frame to the page (My bookings brings its own sidebar and top bar). */
  chrome?: 'full' | 'focus' | 'app';
  children: ReactNode;
};

function FocusHeader() {
  return (
    <header className="dc-focus-head">
      <a href="/" className="dc-focus-logo"><img className="dc-brand-mark" src="/brand/phi-movers-icon-192.png" alt="" width={30} height={30} />{BRAND}</a>
      <span className="dc-focus-right">
        <a href="/client" className="dc-focus-mine">My quotes</a>
        <a href={TEL} className="dc-focus-call">{icon(CallIcon, 18)} {PHONE_DISPLAY}</a>
      </span>
    </header>
  );
}

function FocusFooter() {
  return (
    <footer className="dc-focus-foot">
      <nav aria-label="Policies">
        <a href="/privacy">Privacy policy</a>
        <a href="/terms">Terms</a>
        <a href="/cookies">Cookies</a>
        <a href="/contact">Contact</a>
      </nav>
      <a href={TEL}>{PHONE_DISPLAY}</a>
    </footer>
  );
}

export function DcPage({ title, description, path, crumbs, ogImage = '/logo.png', ogType = 'website', published, modified, schema = [], canonical, noindex = false, iconFont = false, chrome = 'full', children }: DcPageProps) {
  const focus = chrome === 'focus';
  const app = chrome === 'app';
  const url = `${SITE}${path}`;
  const canonicalUrl = canonical ?? url;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE}${ogImage}`;
  const breadcrumbSchema = crumbs.length === 0 ? null : {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      ...crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: c.name, item: `${SITE}${c.path ?? path}` })),
    ],
  };
  // Every page points at the one business and website entities from the site graph (LocalBusinessSchema).
  const pageSchema = noindex ? null : {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': `${SITE}/#business` },
    ...(breadcrumbSchema ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />
        {noindex && <meta name="robots" content="noindex, follow" />}
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content={BRAND} />
        <meta property="og:locale" content="en_GB" />
        {ogType === 'article' && published && <meta property="article:published_time" content={published} />}
        {ogType === 'article' && modified && <meta property="article:modified_time" content={modified} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        {iconFont && <link rel="stylesheet" href="/vendor/iconsax/isax.css?v=20261013a" />}
      </Head>
      <style dangerouslySetInnerHTML={{ __html: BASE_CSS + MOTION_CSS + PRICE_EXPLORER_CSS + BLOCKS_CSS + WA_CSS }} />
      {[pageSchema, breadcrumbSchema, ...schema].filter(Boolean).map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <GoogleAnalytics />
      <LocalBusinessSchema />

      <a href="#main" className="dc-skip">Skip to content</a>
      <div className={focus || app ? 'dc-page dc-page-focus' : 'dc-page'} style={{ maxWidth: '100%', overflowX: 'clip' }}>
        {app ? children : (
          <>
            {focus ? <FocusHeader /> : <SiteHeader />}
            <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
              {children}
            </main>
            {focus ? <FocusFooter /> : <SiteFooter />}
          </>
        )}
      </div>
      {!focus && !app && <AppNav />}
      {!focus && !app && <WhatsAppFloat />}
      {!focus && <AssistantLauncher />}
      <CookieConsent />
    </>
  );
}
