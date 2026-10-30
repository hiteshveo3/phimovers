import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { Ico, type IconType } from '../kit/components/Ico';
import { Add as AddIcon, ArrowRight as ArrowRightIcon, Home as HomeIcon, Minus as MinusIcon, QuoteDown as QuoteDownIcon, SearchNormal1 as SearchNormal1Icon, ShieldTick as ShieldTickIcon, Star1 as Star1Icon, TicketDiscount as TicketDiscountIcon } from 'iconsax-reactjs';
import { BOOK, CallLink, DcPage, Photo, faqSchema as buildFaqSchema } from '../kit/components/DcPage';
import { WhatsAppButton } from '../kit/components/WhatsApp';
import { hourLabel } from '../kit/components/OpenNow';
import { FleetArt, type FleetKind } from '../kit/components/FleetArt';
import { CtaMark, Odo, Words, useHomeMotion } from '../kit/components/HomeMotion';
import { PriceExplorer } from '../kit/components/PriceExplorer';
import { searchSite } from '../kit/components/SiteHeader';
import { SearchClear } from '../kit/components/SearchClear';
import { REVIEWS, initials } from '../kit/reviews';
import { BRAND, FREE_MILES, GOOGLE_REVIEW_URL, HELPER_RATE, HOURS, HOURS_TEXT, INSURED_TEXT, MIN_HOURS, RATES, RATING, TRUSTPILOT_URL, isOpenNow } from '../kit/site-facts';
import { getFaqsForPath } from '../lib/page-faqs';
import { BOROUGHS, REGION_HREF, REGION_ORDER } from '../kit/areas-list';
import { allServiceCards, shortPrice } from '../kit/services-catalog';
import { servicePhoto } from '../kit/service-icons';
import { categories, priceLabel } from '../lib/data';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const icon = (i: IconType, size = 18) => <Ico icon={i} size={size} aria-hidden="true" />;

// Homepage in the site's design system: centred hero with search, a bento of services, a pricing band with a
// live price explorer, a looped "how it works", the vans, three reviews, the regions, FAQ and one closing panel.
// All copy and figures are Phi Movers' own (lib/data.ts, kit/site-facts.ts, lib/reviews.ts, lib/areas.ts).
const HOME_CSS = `
.ih{--band:#e6f2d8;--accent:#2f7a18;--star:#b8860b;--card-shadow:0 1px 2px rgba(15,26,9,.04),0 12px 32px -20px rgba(15,26,9,.22)}
.ih-wrap{max-width:1400px;margin:0 auto;padding:0 5vw}
.ih-sec{padding:clamp(40px,5vw,72px) 0}
.ih-sec + .ih-sec{padding-top:0}
.ih-eyebrow{display:block;margin:0 0 14px;color:var(--accent);font:600 11.5px/1.2 'Instrument Sans',sans-serif;letter-spacing:.1em;text-transform:uppercase}
.ih-h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(27px,3vw,36px);line-height:1.15;letter-spacing:-.025em;margin:0;color:var(--ink);text-wrap:balance}
.ih-lead{margin:12px 0 0;max-width:52ch;font-size:16px;line-height:1.6;color:var(--ink-68)}
.ih-more{display:inline-flex;align-items:center;gap:8px;margin-top:22px;font-weight:600;font-size:15px;color:var(--ink)}
.ih-more svg{transition:translate .35s var(--ease-soft)}
.ih-more:hover svg{translate:4px 0}
.ih-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:28px}
.ih-head .ih-more{margin:0;flex:none}
.ih-split{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:clamp(28px,5vw,72px);align-items:start}
/* Left column (heading and copy) stays in view while the right column scrolls. Sections with an inline style (reviews) are left alone. */
@media (min-width:981px){.ih-split:not([style])>:first-child{position:sticky;top:112px}}
/* Keeps the FAQ heading in view while the answers scroll (desktop only; the header is ~100px). */
@media (min-width:981px){.ih-faq-intro{position:sticky;top:112px}}
.ih-band{background:var(--band);border-radius:28px;padding:clamp(28px,4vw,56px)}
.ih-card{background:#fff;border-radius:20px;box-shadow:var(--card-shadow)}
.ih-btn{display:inline-flex;align-items:center;gap:10px;border-radius:999px;font-weight:600;white-space:nowrap;cursor:pointer;border:0;font-family:inherit;transition:background-color .2s ease}
.ih-btn-lime{background:var(--lime);color:var(--ink);padding:7px 7px 7px 20px;font-size:15.5px}
.ih-btn-lime .mo-cta-mark{background:rgba(255,255,255,.55)}
.ih-btn-lime:hover{background:var(--lime-hover)}
.ih-btn-white{background:#fff;color:var(--ink);padding:8px 8px 8px 24px;font-size:16px}
.ih-btn-white .mo-cta-mark{background:var(--lime)}
.ih-stars{display:inline-flex;gap:2px;color:var(--star)}
.ih a.ih-card:hover{color:var(--ink)}

/* Hero */
.ih-hero{background-color:var(--band-a);background-image:radial-gradient(120% 100% at 50% 0%,#dff0cc 0%,var(--band-a) 72%);padding:clamp(24px,3.4vw,40px) 0 clamp(20px,2.6vw,32px);text-align:center;overflow-x:clip}
.ih-hero-top{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px}
.ih-crew{display:flex}
.ih-crew img{width:36px;height:36px;border-radius:999px;border:2px solid var(--band-a);object-fit:cover;background:var(--grey)}
.ih-crew img+img{margin-inline-start:-10px}
.ih-offer{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;background:var(--lime);color:var(--ink);font-size:12px;font-weight:600;white-space:nowrap}
.ih-pill{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;font-size:13.5px;font-weight:600;line-height:1.2}
.ih-pill-white{background:#fff;box-shadow:var(--card-shadow)}
.ih-pill-lime{background:var(--lime)}
.ih-h1{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(36px,5.2vw,64px);line-height:1.06;letter-spacing:-.035em;margin:22px auto 0;max-width:20ch;color:var(--ink)}
.ih-h1 .ih-price{color:var(--accent)}
.ih-hero-lead{margin:18px auto 0;max-width:60ch;font-size:clamp(15.5px,1.4vw,17.5px);line-height:1.6;color:var(--ink-68)}
.ih-search{position:relative;max-width:600px;margin:28px auto 0;text-align:left}
.ih-search-box{display:flex;align-items:center;gap:10px;height:62px;padding:0 7px 0 20px;border-radius:999px;background:#fff;box-shadow:0 2px 4px rgba(15,26,9,.04),0 18px 40px -18px rgba(15,26,9,.3);border:1px solid rgba(15,26,9,.06)}
.ih-search-box:focus-within{outline:2px solid var(--focus);outline-offset:2px}
.ih-search-box>svg{color:var(--accent);flex:none}
.ih-search-box input{flex:1;min-width:0;height:100%;border:0;outline:0;background:transparent;font:inherit;font-size:16.5px;color:var(--ink)}
.ih-search-box input::placeholder{color:rgba(15,26,9,.5)}
.ih-hits{position:absolute;z-index:20;left:0;right:0;top:calc(100% + 8px);margin:0;padding:6px;list-style:none;background:#fff;border-radius:20px;box-shadow:var(--card-shadow);border:1px solid var(--line)}
.ih-hits a{display:flex;justify-content:space-between;gap:12px;padding:11px 14px;border-radius:12px;font-weight:600;font-size:15px}
.ih-hits a small{font-weight:500;color:var(--ink-60);white-space:nowrap}
.ih-hits a:hover,.ih-hits a:focus-visible{background:var(--grey)}
.ih-hits li.ih-empty{padding:12px 14px;font-size:15px;color:var(--ink-68)}
.ih-popular{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px;margin:14px 0 0;padding:0;list-style:none;font-size:13.5px;color:var(--ink-68)}
.ih-popular a{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:999px;background:#fff;color:var(--ink);font-weight:500}
.ih-popular a:hover{background:var(--green-soft)}
.ih-trust{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:22px 0 0;padding:0;list-style:none}
.ih-trust li{display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:0 12px;border-radius:999px;background:#fff;font-size:13.5px;font-weight:500}
.ih-dot{width:8px;height:8px;border-radius:999px;background:#9aa394}
.ih-dot.on{background:#1f9d4c;box-shadow:0 0 0 3px rgba(31,157,76,.18)}

/* Services bento */
.ih-bento{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,1fr);gap:14px;margin:0;padding:0;list-style:none}
.ih-bento>li:first-child{grid-row:span 2}
.ih-svc{display:flex;flex-direction:column;height:100%;padding:6px;color:inherit;transition:transform .35s var(--ease-soft),box-shadow .35s var(--ease-soft)}
.ih-svc:hover{transform:translateY(-3px);box-shadow:0 2px 4px rgba(15,26,9,.05),0 22px 40px -22px rgba(15,26,9,.32)}
.ih-svc-img{position:relative;overflow:hidden;border-radius:15px;aspect-ratio:4/3;background:var(--grey)}
.ih-svc-img img{transition:transform .6s var(--ease-soft)}
.ih-svc:hover .ih-svc-img img{transform:scale(1.04)}
.ih-svc-big .ih-svc-img{aspect-ratio:16/9;flex:1;min-height:240px}
.ih-svc-body{padding:16px 12px 12px;display:grid;gap:10px;justify-items:start}
.ih-svc h3{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px;letter-spacing:-.01em}
.ih-svc-big h3{font-size:clamp(19px,1.7vw,22px);display:flex;align-items:center;gap:12px}
.ih-svc-ico{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:11px;background:var(--green-soft);color:var(--accent)}
.ih-svc p{margin:0;font-size:15px;line-height:1.55;color:var(--ink-68)}
.ih-tag{display:inline-flex;align-items:baseline;gap:4px;padding:5px 12px 5px 18px;border-radius:0 9px 9px 0;background:var(--lime);color:var(--ink);font-weight:600;font-size:16px;line-height:1.2;clip-path:polygon(9px 0,100% 0,100% 100%,9px 100%,0 50%);font-variant-numeric:tabular-nums}
.ih-tag small{font-size:11.5px;font-weight:500}
.ih-spec{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none}
.ih-spec a{display:grid;grid-template-rows:auto 1fr;height:100%;overflow:hidden;color:inherit;transition:transform .3s var(--ease-soft)}
.ih-spec-img{display:block;aspect-ratio:16/9;overflow:hidden;background:#e9e8e2}
.ih-spec-body{display:grid;align-content:start;gap:6px;padding:16px 18px}
.ih-spec a:hover{transform:translateY(-2px)}
.ih-spec b{font-size:15.5px;font-weight:600}
.ih-spec span{font-size:14px;line-height:1.5;color:var(--ink-68)}
.ih-spec small{font-size:13.5px;font-weight:600;color:var(--accent)}
.ih-spec-more{margin:18px 0 0;font-size:15px}
.ih-spec-more a{font-weight:600;text-decoration:underline;text-underline-offset:3px}
@media (max-width:980px){.ih-spec{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.ih-spec{grid-template-columns:minmax(0,1fr)}}
.ih-from{font-size:13.5px;color:var(--ink-68)}
.ih-from b{font-weight:600;color:var(--ink)}

/* Pricing band */
.ih-rates{margin:24px 0 0;padding:0;list-style:none;background:#fff;border-radius:20px;box-shadow:var(--card-shadow)}
.ih-rates li{display:grid;grid-template-columns:110px 1fr;align-items:center;gap:12px;padding:14px 18px}
.ih-rates li+li{border-top:1px solid var(--line)}
.ih-rates b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:28px;letter-spacing:-.02em;color:var(--accent);line-height:1;font-variant-numeric:tabular-nums}
.ih-rates li>span{font-size:13.5px;color:var(--ink-68)}

/* How it works */
.ih-loop{position:relative;display:grid;grid-template-columns:1fr 1fr;grid-template-areas:"a b" "d c";gap:56px 64px;margin:0;padding:0;list-style:none;counter-reset:none}
.ih-loop>li:nth-child(1){grid-area:a}.ih-loop>li:nth-child(2){grid-area:b}.ih-loop>li:nth-child(3){grid-area:c}.ih-loop>li:nth-child(4){grid-area:d}
.ih-loop-ring{position:absolute;left:50%;top:50%;width:260px;height:260px;translate:-50% -50%;pointer-events:none;color:var(--accent)}
.ih-step{position:relative;z-index:1;padding:18px 20px 20px;height:100%}
.ih-num{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:999px;background:var(--lime);font-weight:600;font-size:14px}
.ih-step h3{margin:14px 0 6px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px;letter-spacing:-.01em}
.ih-step p{margin:0;font-size:15px;line-height:1.55;color:var(--ink-68)}
.ih-promise{display:flex;align-items:center;gap:14px;margin-top:22px;padding:16px 18px}
.ih-promise>span:first-child{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--green-soft);color:var(--accent);flex:none}
.ih-promise b{display:block;font-size:16px;font-weight:600}
.ih-promise small{font-size:13px;color:var(--ink-60)}

/* Fleet band */
.ih-vans{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none}
.ih-van{display:block;height:100%;padding:14px 16px 16px;color:inherit;transition:transform .35s var(--ease-soft),box-shadow .35s var(--ease-soft)}
a.ih-van:hover{transform:translateY(-3px);box-shadow:0 2px 4px rgba(15,26,9,.05),0 22px 40px -22px rgba(15,26,9,.32)}
.ih-van .bk-van-svg{display:block;width:100%;height:auto}
.ih-van h3{margin:8px 0 2px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px;letter-spacing:-.01em}
.ih-van p{margin:0;font-size:13.5px;color:var(--ink-60);display:flex;justify-content:space-between;gap:8px}
.ih-van p b{color:var(--ink);font-weight:600;white-space:nowrap}

/* Reviews */
.ih-scores{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.ih-score{padding:22px 24px;color:inherit}
.ih-score strong{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:44px;line-height:1;letter-spacing:-.03em}
.ih-score .ih-stars{margin-top:8px}
.ih-score small{display:block;margin-top:8px;font-size:13px;color:var(--ink-60)}
.ih-revs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:36px 0 0;padding:0;list-style:none}
.ih-rev{display:flex;flex-direction:column;gap:14px;padding:22px}
.ih-rev-top{display:flex;justify-content:space-between;align-items:center}
.ih-rev-q{display:grid;place-items:center;width:34px;height:34px;border-radius:999px;background:var(--green-soft);color:var(--accent)}
.ih-rev blockquote{margin:0;font-size:15px;line-height:1.6;color:var(--ink);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.ih-rev[data-open] blockquote{-webkit-line-clamp:unset}
.ih-rev-more{align-self:flex-start;border:0;background:none;padding:0;font:inherit;font-size:13.5px;font-weight:600;color:var(--accent);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.ih-rev-by{display:flex;align-items:center;gap:10px;margin-top:auto}
.ih-ava{display:grid;place-items:center;width:34px;height:34px;border-radius:999px;background:var(--green-soft);color:var(--accent);font-weight:600;font-size:12.5px}
.ih-rev-by b{display:block;font-size:14px;font-weight:600}
.ih-rev-by small{font-size:12.5px;color:var(--ink-60)}

/* Areas: five hairline rows, one per region */
.ih-regions{margin:0;padding:0;list-style:none;border-top:1px solid rgba(15,26,9,.1)}
.ih-regions a{display:grid;grid-template-columns:84px minmax(0,1fr) auto;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid rgba(15,26,9,.1);color:var(--ink)}
.ih-reg-img{display:block;width:84px;height:60px;border-radius:12px;overflow:hidden;background:#e9e8e2}
.ih-regions b{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px;letter-spacing:-.01em}
.ih-regions small{display:block;margin-top:2px;font-size:13.5px;color:var(--ink-60)}
.ih-regions svg{flex:none;color:var(--accent);transition:translate .35s var(--ease-soft)}
.ih-regions a:hover svg{translate:4px 0}

/* FAQ */
.ih-faq-body p.lead{color:var(--ink)}
.ih-faq-body a{display:inline-flex;margin-top:12px;align-items:center;gap:6px;font-size:14px;font-weight:600;color:var(--accent);text-decoration:underline;text-underline-offset:3px}
.ih-faq-all{display:inline-flex;align-items:center;gap:8px;margin:16px 0 0;border:0;background:none;padding:0;font:inherit;font-size:15px;font-weight:600;color:var(--ink);cursor:pointer}
.ih-faq-all svg{color:var(--accent)}

/* Closing panel */
.ih-cta{position:relative;overflow:hidden;border-radius:28px;padding:clamp(40px,6vw,72px) 24px;text-align:center;background:radial-gradient(60% 90% at 88% 0%,rgba(255,255,255,.42),transparent 60%),linear-gradient(135deg,#a6ec78 0%,#8ed95f 100%)}
.ih-cta .ih-h2{font-size:clamp(30px,3.6vw,44px);margin-top:18px}
.ih-cta p{margin:12px auto 0;max-width:46ch;font-size:16px;line-height:1.6;color:rgba(15,26,9,.78)}
.ih-cta-row{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:14px 22px;margin-top:26px}
.ih-cta .dc-call{font-weight:600}

@media (prefers-reduced-motion:no-preference){
  .js-reveal .ih-loop-ring .ih-draw{stroke-dasharray:1;stroke-dashoffset:1}
  .js-reveal [data-seen] .ih-loop-ring .ih-draw{animation:ih-draw 1.4s var(--ease-soft) .2s forwards}
}
@media (max-width:980px){
  .ih-split{grid-template-columns:1fr}
  .ih-split>:first-child{position:static}
  .ih-faq-intro{position:static}
  .ih-bento{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ih-bento>li:first-child{grid-column:span 2;grid-row:auto}
  .ih-revs{grid-template-columns:1fr}
}
@media (max-width:760px){
  .ih-band{margin:0 -5vw;border-radius:0;padding:52px 5vw}
  .ih-head{flex-direction:column;align-items:flex-start}
  .ih-popular a,.ih-trust li{min-height:44px}
  .ih-bento{display:flex;gap:12px;margin:0 -5vw;padding:4px 5vw 12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
  .ih-bento::-webkit-scrollbar{display:none}
  .ih-bento>li{flex:0 0 76vw;scroll-snap-align:start}
  .ih-bento>li:first-child{flex-basis:86vw}
  .ih-svc-big .ih-svc-img{min-height:0;aspect-ratio:4/3}
  .ih-loop{grid-template-columns:1fr;grid-template-areas:none;gap:12px}
  .ih-loop>li{grid-area:auto!important}
  .ih-loop-ring{display:none}
  .ih-step{display:grid;grid-template-columns:32px 1fr;column-gap:14px;background:none;box-shadow:none;border:0;padding:6px 0}
  .ih-step h3{margin:4px 0 4px}
  .ih-step p{grid-column:2}
  .ih-vans{grid-template-columns:1fr 1fr}
  .ih-cta{margin:0 -5vw;border-radius:0}
  .ih-search-box{height:56px;padding-left:16px}
  .ih-search-box input{font-size:16px}
  .ih-search .ih-btn-lime{padding:7px 7px 7px 16px}
  .ih-van{padding:12px}
  .ih-van p{flex-direction:column;gap:2px}
}
@media (max-width:420px){
  .ih-search .mo-cta-mark{display:none}
  .ih-search .ih-btn-lime{padding:0 18px;height:44px}
}
.ih-crew img{flex:none}
.ih-hero-cta{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:22px 0 0}
.ih-btn-white{border:1px solid rgba(15,26,9,.08)}
.ih-hero-cta .ih-btn{padding:7px 7px 7px 22px;font-size:15.5px}
.ih-svc-small p{font-size:13.5px;line-height:1.45}
.ih-ava{overflow:hidden;object-fit:cover;flex:none}
.ih-step-survey{background:var(--lime)}
.ih-step-survey .ih-num{background:rgba(255,255,255,.55)}
.ih-step-survey p{color:rgba(15,26,9,.78)}
.ih-step-survey h3{font-size:16px}
.ih-step-link{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:14px;font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.ih-vans{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.ih-faq-body p{margin:0}
.ih-trust a{color:inherit}
.ih-near{margin-top:28px}
.ih-near h3{margin:0 0 10px;font-size:13.5px;font-weight:600;color:var(--ink-72)}
.ih-near ul{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.ih-near a{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border-radius:999px;background:#fff;box-shadow:var(--card-shadow);font-size:13.5px;font-weight:500}
.ih-near a:hover{background:var(--green-soft)}
@media (max-width:760px){.ih-vans{grid-template-columns:1fr}.ih-step-link{grid-column:2}}
`;

// Home FAQ from the one lookup (lib/page-faqs.ts): visible answers and schema come from the same list.
const phiFaqs = getFaqsForPath('/');
const faqSchema = buildFaqSchema(phiFaqs);

type Service = { img: string; href: string; title: string; desc: string; tag: ReactNode };

const tagFor = (href: string): ReactNode => {
  const card = allServiceCards.find((s) => s.href === href);
  if (!card) return null;
  if (/^from\s+/i.test(card.price.trim())) {
    const [amount, unit] = shortPrice(card.price).split('/');
    return <><small>From</small>{amount}{unit && <small>/{unit}</small>}</>;
  }
  return priceLabel(card.price);
};

const serviceFor = (title: string): Service => {
  const c = categories.find((x) => x.title === title)!;
  // Pictures live in kit/service-icons.ts; a service without one gets the lime icon tile.
  return { img: servicePhoto(c.href.split('/').pop() ?? ''), href: c.href, title: c.title, desc: c.subtitle, tag: tagFor(c.href) };
};

const bigService = serviceFor('House Removals');
const services: Service[] = ['Man & Van', 'Office Removals', 'Sofa Delivery', 'Secure Storage'].map(serviceFor);

const steps = [
  { title: 'Tell us the move', text: 'Postcodes, property size and dates — send a quote request or call our London desk.' },
  { title: 'Get a clear price', text: 'We confirm the right van size, crew number and a fixed quote — usually within about an hour.' },
  { title: 'We do the heavy lifting', text: 'Our own insured London crew on the day. Loading, transport and careful delivery with no moving-day surprises.' },
];

const VAN_KIND: Record<string, FleetKind> = { small: 'small', transit: 'lwb', luton: 'luton' };
const vans = RATES.map((r) => ({ kind: VAN_KIND[r.id], name: r.name, suits: r.suits, from: `From £${r.hourly}/hr` }));

// Boroughs nearest our Dagenham base (kit/site-facts ADDRESS), shown as quick links under the regions.
const NEAR_BASE = ['barking-and-dagenham', 'havering', 'redbridge', 'newham', 'waltham-forest', 'tower-hamlets'];
const nearBase = NEAR_BASE.map((s) => BOROUGHS.find((b) => b.slug === s)).filter((b): b is (typeof BOROUGHS)[number] => Boolean(b));

// Region rows borrow a photo until each region has its own.
const REGION_PHOTO: Record<string, string> = {
  'Central London': '/services/office-removals.jpg',
  'North London': '/services/house-removals.jpg',
  'East London': '/services/flat-removals.jpg',
  'South London': '/services/man-and-van.jpg',
  'West London': '/services/furniture-delivery.jpg',
};

const regions = REGION_ORDER.map((label) => ({
  label,
  image: REGION_PHOTO[label],
  sub: BOROUGHS.filter((b) => b.region === label).slice(0, 4).map((b) => b.name).join(', '),
  href: REGION_HREF[label],
}));

// Shown in turn as the search placeholder, so people see what the box answers.
const PLACEHOLDERS = ['What do you need moved?', 'Man & van in Hackney', 'Sofa delivery, 3rd floor', 'Office removals in Croydon'];
const FAQ_FIRST = 5;

function Stars() {
  return (
    <span className="ih-stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Ico key={i} icon={Star1Icon} size={14} className="ico-fill" />
      ))}
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="ih-eyebrow">{children}</p>;
}

function SectionHead({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id: string }) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="ih-h2 mo-head"><Words text={title} /></h2>
      {lead && <p className="ih-lead mo-lead">{lead}</p>}
    </>
  );
}

function More({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="ih-more"><span className="mo-link">{children}</span>{icon(ArrowRightIcon, 16)}</a>;
}

function HeroSearch() {
  const [q, setQ] = useState('');
  const [closed, setClosed] = useState(false);
  const [ph, setPh] = useState(0);
  const hits = searchSite(q, 6);
  const open = !closed && q.trim().length >= 2;
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = window.setInterval(() => setPh((i) => (i + 1) % PLACEHOLDERS.length), 3200);
    return () => window.clearInterval(t);
  }, []);
  const go = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = hits[0]?.href ?? BOOK;
  };
  return (
    <form
      role="search"
      className="ih-search"
      onSubmit={go}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setClosed(true); }}
    >
      <label className="ih-search-box">
        {icon(SearchNormal1Icon, 20)}
        <span className="dc-sr">What do you need moved?</span>
        <input type="search" value={q} onChange={(e) => { setQ(e.target.value); setClosed(false); }} onKeyDown={(e) => { if (e.key === 'Escape') setClosed(true); }} placeholder={PLACEHOLDERS[ph]} autoComplete="off" aria-controls="ih-hits" />
        <SearchClear value={q} onClear={() => setQ('')} />
        <button type="submit" data-hero-cta="" className="ih-btn ih-btn-lime mo-btn">Go <CtaMark /></button>
      </label>
      {open && (
        <ul className="ih-hits" id="ih-hits">
          {hits.length > 0
            ? hits.map((h) => <li key={h.href}><a href={h.href}><span>{h.title}</span><small>{h.price ? `from ${h.price}` : h.kind}</small></a></li>)
            : <li className="ih-empty">All 32 London boroughs are covered. Press Go to get a quote.</li>}
        </ul>
      )}
    </form>
  );
}

function OpenChip() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    setOpen(isOpenNow());
    const t = window.setInterval(() => setOpen(isOpenNow()), 60_000);
    return () => window.clearInterval(t);
  }, []);
  const text = open === null ? `Open ${HOURS_TEXT}` : open ? `Open now · until ${hourLabel(HOURS.close)}` : `Closed now · opens ${hourLabel(HOURS.open)}`;
  return <li><span className={open ? 'ih-dot on' : 'ih-dot'} aria-hidden="true" />{text}</li>;
}

function ReviewCard({ r, index }: { r: (typeof REVIEWS)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 110;
  return (
    <li className="ih-card ih-rev" data-open={open ? '' : undefined} data-reveal="" style={{ '--i': index } as Vars}>
      <div className="ih-rev-top"><Stars /><span className="ih-rev-q" aria-hidden="true">{icon(QuoteDownIcon, 16)}</span></div>
      <blockquote>{r.text}</blockquote>
      {long && <button type="button" className="ih-rev-more" onClick={() => setOpen((o) => !o)}>{open ? 'Less' : 'More'}</button>}
      <div className="ih-rev-by">
        {r.avatar
          ? <img className="ih-ava" src={r.avatar} alt="" width={34} height={34} loading="lazy" decoding="async" />
          : <span className="ih-ava" aria-hidden="true">{initials(r.name)}</span>}
        <span><b>{r.name}</b><small>{r.location} · {r.service}</small></span>
      </div>
    </li>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [allFaqs, setAllFaqs] = useState(false);
  useHomeMotion();

  return (
    <DcPage
      title={`House Removals & Man and Van London from £${RATES[0].hourly}/hr | ${BRAND}`}
      description={`Removals and man and van across all 32 London boroughs from £${RATES[0].hourly}/hr, ${MIN_HOURS}-hour minimum, first ${FREE_MILES} miles free. Rated ${RATING.score} on ${RATING.source}. Free fixed-price quote.`}
      path="/"
      crumbs={[]}
      schema={[faqSchema]}
    >
      <style dangerouslySetInnerHTML={{ __html: HOME_CSS }} />
      <div className="ih">
        <section className="ih-hero" aria-labelledby="hero-title">
          <div className="ih-wrap">
            <div className="ih-hero-top">
              <span className="ih-offer"><Ico icon={TicketDiscountIcon} size={14} variant="Bold" />Fixed quote before moving day · first {FREE_MILES} miles free</span>
            </div>
            <h1 id="hero-title" className="ih-h1 mo-title">
              <Words text="Removals and man and van in London" />{' '}
              <span className="ih-price">from <Odo value={`£${RATES[0].hourly}`} />/hr</span>
            </h1>
            <p className="ih-hero-lead">Professional house &amp; office removals, packing and storage across every London borough. Get a free, no-obligation quote in minutes.</p>
            <HeroSearch />
            <ul className="ih-trust" aria-label="At a glance">
              <OpenChip />
              <li><Stars /> {RATING.score} · {RATING.count} reviews</li>
              <li><a href="/insurance">{INSURED_TEXT}</a></li>
              <li>Fixed-price quotes</li>
            </ul>
          </div>
        </section>

        <section className="ih-sec" aria-labelledby="services-h">
          <div className="ih-wrap">
            <div className="ih-head">
              <div>
                <SectionHead id="services-h" eyebrow="Services" title="Every kind of London move, one local crew" lead="Homes, single items, offices and storage, priced from the same published rates." />
              </div>
              <More href="/services">See all services</More>
            </div>
            <ul className="ih-bento">
              <li data-reveal="">
                <a href={bigService.href} className="ih-card ih-svc ih-svc-big">
                  <span className="ih-svc-img"><Photo src={bigService.img} alt="" eager /></span>
                  <span className="ih-svc-body">
                    <h3><span className="ih-svc-ico icon-pop">{icon(HomeIcon, 20)}</span>{bigService.title}</h3>
                    <p>{bigService.desc}</p>
                    <span className="ih-tag">{bigService.tag}</span>
                  </span>
                </a>
              </li>
              {services.map((s, i) => (
                <li key={s.href} data-reveal="" style={{ '--i': i + 1 } as Vars}>
                  <a href={s.href} className="ih-card ih-svc ih-svc-small">
                    <span className="ih-svc-img"><Photo src={s.img} alt="" /></span>
                    <span className="ih-svc-body">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                      <span className="ih-tag">{s.tag}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ih-sec" aria-labelledby="pricing-h">
          <div className="ih-wrap">
            <div className="ih-band ih-split">
              <div>
                <SectionHead id="pricing-h" eyebrow="Pricing" title="Simple man & van pricing" lead={`Choose your van, add a helper if needed, minimum ${MIN_HOURS} hours. Loading & unloading included.`} />
                <ul className="ih-rates">
                  {RATES.map((r, i) => (
                    <li key={r.id} data-reveal="" style={{ '--i': i } as Vars}><b><Odo value={`£${r.hourly}`} view /></b><span>an hour, {r.name.toLowerCase()}. {r.suits}</span></li>
                  ))}
                  <li data-reveal="" style={{ '--i': RATES.length } as Vars}><b><Odo value={`£${HELPER_RATE}`} view /></b><span>an hour for each extra helper</span></li>
                </ul>
                <More href="/pricing">See all prices</More>
              </div>
              <PriceExplorer />
            </div>
          </div>
        </section>

        <section className="ih-sec" aria-labelledby="how-h">
          <div className="ih-wrap ih-split">
            <div>
              <SectionHead id="how-h" eyebrow="How it works" title="How Phi Movers works" lead="Three clear steps from enquiry to moving day — no complicated calculators, no hidden fees, and no moving-day surprises." />
            </div>
            <div>
              <div style={{ position: 'relative' }} data-seen-watch="">
                <svg className="ih-loop-ring" viewBox="0 0 260 260" aria-hidden="true">
                  <defs>
                    <mask id="ih-ring-mask">
                      <circle className="ih-draw" cx="130" cy="130" r="118" fill="none" stroke="#fff" strokeWidth="8" pathLength={1} transform="rotate(-90 130 130)" />
                    </mask>
                  </defs>
                  <circle cx="130" cy="130" r="118" fill="none" stroke="currentColor" strokeOpacity=".22" strokeWidth="1.4" strokeDasharray="5 7" mask="url(#ih-ring-mask)" />
                </svg>
                <ol className="ih-loop">
                  {steps.map((s, i) => (
                    <li key={s.title} data-reveal="" style={{ '--i': i } as Vars}>
                      <div className="ih-card ih-step">
                        <span className="ih-num icon-pop">{i + 1}</span>
                        <h3>{s.title}</h3>
                        <p>{s.text}</p>
                      </div>
                    </li>
                  ))}
                  <li data-reveal="" style={{ '--i': 3 } as Vars}>
                    <div className="ih-card ih-step ih-step-survey">
                      <span className="ih-num icon-pop">{icon(ShieldTickIcon, 18)}</span>
                      <h3>Book a free home survey and get a fixed-price quote from our expert movers</h3>
                      <p>Free Survey &amp; Quote · No obligation · fixed-price quote</p>
                      <a href={BOOK} className="ih-step-link">Book Free Survey {icon(ArrowRightIcon, 15)}</a>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="ih-sec" aria-labelledby="vans-h">
          <div className="ih-wrap">
            <div className="ih-band">
              <div className="ih-head">
                <div>
                  <SectionHead id="vans-h" eyebrow="Our vans" title="Choose your van" lead={`Hourly van rates, ${MIN_HOURS}-hour minimum. Add a helper for £${HELPER_RATE} an hour.`} />
                </div>
                <More href="/pricing">Prices by van</More>
              </div>
              <ul className="ih-vans">
                {vans.map((v, i) => (
                  <li key={v.name} data-reveal="" style={{ '--i': i } as Vars}>
                    <a href="/pricing" className="ih-card ih-van">
                      <FleetArt kind={v.kind} />
                      <h3>{v.name}</h3>
                      <p><span>{v.suits}</span><b>{v.from}</b></p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="ih-sec" aria-labelledby="reviews-h">
          <div className="ih-wrap ih-split" style={{ alignItems: 'center' }}>
            <div>
              <SectionHead id="reviews-h" eyebrow="Customer reviews" title="Loved by movers across London" lead="Real reviews from real customers who trusted us with their move." />
              <More href="/reviews">Read all reviews</More>
            </div>
            <div className="ih-scores" style={{ gridTemplateColumns: TRUSTPILOT_URL ? undefined : 'minmax(0,1fr)' }}>
              <a href={GOOGLE_REVIEW_URL || '/reviews'} className="ih-card ih-score" data-reveal="" {...(GOOGLE_REVIEW_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <strong><Odo value={RATING.score} view /></strong>
                <Stars />
                <small>{RATING.count} reviews on {RATING.source}</small>
              </a>
              {TRUSTPILOT_URL && (
                <a href={TRUSTPILOT_URL} className="ih-card ih-score" data-reveal="" style={{ '--i': 1 } as Vars} target="_blank" rel="noopener noreferrer">
                  <strong>Trustpilot</strong>
                  <small>Read our reviews on Trustpilot</small>
                </a>
              )}
            </div>
          </div>
          <div className="ih-wrap">
            <ul className="ih-revs" aria-label="Customer reviews">
              {REVIEWS.slice(0, 3).map((r, i) => <ReviewCard key={r.name} r={r} index={i} />)}
            </ul>
          </div>
        </section>

        <section className="ih-sec" aria-labelledby="areas-h">
          <div className="ih-wrap ih-split">
            <div>
              <SectionHead id="areas-h" eyebrow="Areas" title="All 32 London boroughs" lead="North · South · East · West London" />
              <More href="/areas">All areas we cover</More>
              <div className="ih-near">
                <h3>Close to our Dagenham base</h3>
                <ul>{nearBase.map((b) => <li key={b.slug}><a href={b.href}>{b.name}</a></li>)}</ul>
              </div>
            </div>
            <ul className="ih-regions">
              {regions.map((r, i) => (
                <li key={r.label} data-reveal="" style={{ '--i': i } as Vars}>
                  <a href={r.href}><span className="ih-reg-img"><Photo src={r.image} alt="" /></span><span><b>{r.label}</b><small>{r.sub}</small></span>{icon(ArrowRightIcon, 18)}</a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ih-sec" aria-labelledby="faq-h">
          <div className="ih-wrap">
            <div className="ih-band ih-split">
              <div className="ih-faq-intro">
                <SectionHead id="faq-h" eyebrow="FAQ" title="Frequently asked questions" lead={`Everything you need to know about booking your move with ${BRAND}.`} />
                <More href="/help">More answers</More>
              </div>
              <div>
                <div className="dc-faq">
                  {phiFaqs.slice(0, allFaqs ? phiFaqs.length : FAQ_FIRST).map((f, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={f.q} className="dc-faq-item">
                        <h3>
                          <button type="button" className="dc-faq-q" id={`faq-q-${i}`} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpenFaq((o) => (o === i ? -1 : i))}>
                            <span>{f.q}</span><span aria-hidden="true" className="dc-faq-ico">{icon(isOpen ? MinusIcon : AddIcon, 16)}</span>
                          </button>
                        </h3>
                        <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="dc-faq-a ih-faq-body" data-open={isOpen} aria-hidden={!isOpen}>
                          <div className="dc-faq-in"><div className="dc-faq-pad"><p>{f.a}</p></div></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!allFaqs && phiFaqs.length > FAQ_FIRST && <button type="button" className="ih-faq-all" onClick={() => setAllFaqs(true)}>Show all {phiFaqs.length} questions {icon(AddIcon, 16)}</button>}
              </div>
            </div>
          </div>
        </section>

        <section className="ih-sec" aria-labelledby="cta-h">
          <div className="ih-wrap">
            <div className="ih-cta">
              <span className="ih-pill ih-pill-white"><Stars /> {RATING.score} from {RATING.count} reviews</span>
              <h2 id="cta-h" className="ih-h2 mo-head"><Words text="Ready to book your stress-free move?" /></h2>
              <p className="mo-lead">Start your free quote in under a minute — we usually reply within about one working hour. No obligation, no hidden fees.</p>
              <div className="ih-cta-row">
                <a href={BOOK} className="ih-btn ih-btn-white mo-btn">Get my free quote <CtaMark /></a>
                <WhatsAppButton style={{ fontSize: 16, padding: '13px 20px', borderColor: 'transparent' }} />
                <span>or call <CallLink />, {HOURS_TEXT}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DcPage>
  );
}
