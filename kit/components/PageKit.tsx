import type { ReactNode } from 'react';
import { Ico, type IconType } from './Ico';
import { Words } from './HomeMotion';
import { ArrowRight as ArrowRightIcon, MagicStar as MagicStarIcon } from 'iconsax-reactjs';

// The homepage look as a small kit for inner pages: wrap, hero, section head, card, band, split,
// chips and the lime button. Pages add their own classes on top. Use with MOTION_CSS + useHomeMotion.

export const kitIcon = (i: IconType, size = 18) => <Ico icon={i} size={size} aria-hidden="true" />;

/** Our own clear button for a find box. The browser's blue native cross is hidden in KIT_CSS. */
export function PkSearchClear({ value, onClear }: { value: string; onClear: () => void }) {
  if (!value) return null;
  return (
    <button type="button" className="pk-find-clear" aria-label="Clear search" onClick={onClear}>
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
    </button>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="pk-eyebrow"><Ico icon={MagicStarIcon} size={13} variant="Bold" />{children}</p>;
}

export function Head({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: ReactNode; id: string }) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="pk-h2 mo-head"><Words text={title} /></h2>
      {lead && <p className="pk-lead mo-lead">{lead}</p>}
    </>
  );
}

export function More({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="pk-more"><span className="mo-link">{children}</span>{kitIcon(ArrowRightIcon, 16)}</a>;
}

export const KIT_CSS = `
.pk-wrap{max-width:1400px;margin:0 auto;padding:0 5vw}
.pk-sec{padding-top:clamp(52px,6.5vw,84px)}
.pk-sec:last-of-type{padding-bottom:clamp(20px,3vw,36px)}
.pk-eyebrow{display:inline-flex;align-items:center;gap:6px;margin:0 0 14px;padding:4px 10px;border-radius:999px;background:var(--green-soft);color:var(--accent);font:600 11.5px/1.2 'Instrument Sans',sans-serif;letter-spacing:.08em;text-transform:uppercase}
.pk-band .pk-eyebrow{background:#fff}
.pk-h1{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(36px,5vw,60px);line-height:1.06;letter-spacing:-.035em;margin:0;max-width:22ch;color:var(--ink);text-wrap:balance}
.pk-h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(27px,3vw,36px);line-height:1.15;letter-spacing:-.025em;margin:0;color:var(--ink);text-wrap:balance}
.pk-lead{margin:12px 0 0;max-width:56ch;font-size:15.5px;line-height:1.6;color:var(--ink-68)}
.pk-hero{background-image:radial-gradient(120% 100% at 50% 0%,#dff0cc 0%,var(--band-a) 72%);padding:clamp(28px,4vw,48px) 0 0}
.pk-hero-lead{margin:18px 0 0;max-width:60ch;font-size:clamp(15.5px,1.4vw,17.5px);line-height:1.6;color:var(--ink-68)}
.pk-hero-lead a{color:var(--link);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.pk-head{margin-bottom:26px}
.pk-headrow{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:26px}
.pk-headrow .pk-more{margin:0;flex:none}
.pk-card{background:#fff;border-radius:20px;border:1px solid rgba(15,26,9,.05);box-shadow:var(--card-shadow)}
.pk-band{background:var(--band);border-radius:28px;padding:clamp(28px,4vw,56px)}
.pk-split{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(28px,5vw,72px);align-items:start}
.pk-note{margin:14px 0 0;font-size:13px;line-height:1.55;color:var(--ink-60);max-width:78ch}
.pk-more{display:inline-flex;align-items:center;gap:8px;margin-top:22px;font-weight:600;font-size:15px;color:var(--ink)}
.pk-more svg{transition:translate .35s var(--ease-soft)}
.pk-more:hover svg{translate:4px 0}
.pk-btn{display:inline-flex;align-items:center;gap:10px;border-radius:999px;font-weight:600;white-space:nowrap;background:var(--lime);color:var(--ink);padding:7px 7px 7px 20px;font-size:15.5px;transition:background-color .2s ease}
.pk-btn .mo-cta-mark{background:rgba(255,255,255,.55)}
.pk-btn:hover{background:var(--lime-hover);color:var(--ink)}
.pk-chips{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:22px 0 0;padding:0;list-style:none;font-size:13.5px;color:var(--ink-68)}
.pk-chips a,.pk-chips button{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:7px 13px;border:0;border-radius:999px;background:#fff;color:var(--ink);font:inherit;font-weight:500;box-shadow:0 1px 2px rgba(15,26,9,.06);cursor:pointer;transition:background-color .2s ease}
.pk-chips a:hover,.pk-chips button:hover{background:var(--green-soft);color:var(--ink)}
.pk-chips button[aria-pressed=true]{background:var(--lime)}
.pk-chips small{font-size:11.5px;color:var(--ink-60)}
.pk-find{position:relative;max-width:560px;margin-top:26px}
.pk-find-box{display:flex;align-items:center;gap:10px;height:58px;padding:0 20px;border-radius:999px;background:#fff;border:1px solid rgba(15,26,9,.06);box-shadow:0 2px 4px rgba(15,26,9,.04),0 18px 40px -18px rgba(15,26,9,.3)}
.pk-find-box:focus-within{outline:2px solid var(--focus);outline-offset:2px}
.pk-find-box svg{color:var(--accent);flex:none}
.pk-find-box input{flex:1;min-width:0;height:100%;border:0;outline:0;background:transparent;font:inherit;font-size:16px;color:var(--ink)}
.pk-find-box input::placeholder{color:rgba(15,26,9,.5)}
.pk-find-count{font-size:13px;color:var(--ink-60);white-space:nowrap}
.pk-find-box input::-webkit-search-cancel-button,.pk-find-box input::-webkit-search-decoration{-webkit-appearance:none;appearance:none;display:none}
.pk-find-box input[type=search]{-webkit-appearance:none;appearance:none}
.pk-find-clear{flex:none;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:999px;background:var(--grey,#eef5e5);color:var(--ink);cursor:pointer;transition:background-color .2s}
.pk-find-clear:hover{background:var(--green-soft,#e3f4d2)}
.pk-find-clear:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
.pk [hidden]{display:none!important}
.pk-tag{display:inline-flex;align-items:baseline;gap:4px;padding:5px 12px 5px 18px;border-radius:0 9px 9px 0;background:var(--lime);color:var(--ink);font-weight:700;font-size:15px;line-height:1.2;clip-path:polygon(9px 0,100% 0,100% 100%,9px 100%,0 50%)}
.pk-ico{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:11px;background:var(--green-soft);color:var(--accent);flex:none}
.pk a.pk-card:hover{color:var(--ink)}
@media (max-width:980px){
  .pk-split{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:760px){
  .pk-band{margin:0 -5vw;border-radius:0;padding:48px 5vw}
  .pk-headrow{flex-direction:column;align-items:flex-start}
}
`;
