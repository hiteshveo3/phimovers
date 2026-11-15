'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { PHONE_DISPLAY, WHATSAPP_TEXT, whatsappLink } from '../site-facts';

// WhatsApp sits next to Get a quote everywhere (as on Alpha Movers: many people would rather send a quick
// message than fill in a form). One floating button on every page, plus a button in each CTA.
// Pages can change the floating button's first message:
//   window.dispatchEvent(new CustomEvent('phi:wa-text', { detail: 'Hi Phi Movers, …' }))

export const WA_GREEN = '#25d366';

// The WhatsApp Business glyph (Hugeicons "whatsapp-business", outline). Inline SVG, so it adds no package weight.
// Green by default; pass a colour (or "currentColor") to change it.
const WA_PATHS = [
  "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.3789 2.27907 14.6926 2.78382 15.8877C3.06278 16.5481 3.20226 16.8784 3.21953 17.128C3.2368 17.3776 3.16334 17.6521 3.01642 18.2012L2 22L5.79877 20.9836C6.34788 20.8367 6.62244 20.7632 6.87202 20.7805C7.12161 20.7977 7.45185 20.9372 8.11235 21.2162C9.30745 21.7209 10.6211 22 12 22Z",
  "M12.8824 12C14.0519 12 15 13.0074 15 14.25C15 15.4926 14.0519 16.5 12.8824 16.5H10.4118C9.74625 16.5 9.4135 16.5 9.20675 16.2972C9 16.0945 9 15.7681 9 15.1154V12M12.8824 12C14.0519 12 15 10.9926 15 9.75C15 8.50736 14.0519 7.5 12.8824 7.5H10.4118C9.74625 7.5 9.4135 7.5 9.20675 7.70277C9 7.90554 9 8.2319 9 8.88462V12M12.8824 12H9",
];

export function WaIcon({ size = 18, style, color = WA_GREEN }: { size?: number; style?: CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={{ flex: "none", ...style }}>
      {WA_PATHS.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

/** A WhatsApp button. `text` is the message typed in for the visitor. */
export function WhatsAppButton({ text = WHATSAPP_TEXT, label = 'WhatsApp us', style, className = 'dc-btn dc-btn-white dc-btn-wa' }: { text?: string; label?: string; style?: CSSProperties; className?: string }) {
  return (
    <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className={className} style={style} data-wa="">
      <WaIcon size={20} color={className.includes("lime") ? "currentColor" : undefined} /> {label}
    </a>
  );
}

export const setWhatsAppText = (text: string) => window.dispatchEvent(new CustomEvent('phi:wa-text', { detail: text }));

const TYPING = 'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=range]),textarea,select,[contenteditable=true]';

export const WA_CSS = `
.dc-btn-wa{gap:8px}
.phi-wa{position:fixed;left:24px;bottom:24px;z-index:46;display:inline-flex;align-items:center;gap:10px;padding:6px 20px 6px 6px;border:0;border-radius:999px;background:var(--lime);color:var(--ink);font:600 15.5px/1.2 'Instrument Sans',system-ui,sans-serif;white-space:nowrap;box-shadow:0 10px 24px -10px rgba(15,26,9,.4),0 2px 6px rgba(15,26,9,.1);transition:opacity .25s,visibility .25s,transform .2s ease,box-shadow .2s ease}
.phi-wa:hover{background:var(--lime-hover);color:var(--ink);transform:translateY(-2px)}
.phi-wa:focus-visible{outline:2px solid var(--focus);outline-offset:3px}
.phi-wa-ico{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:999px;background:#fff;}
.phi-wa.is-hidden{opacity:0;visibility:hidden;pointer-events:none}
/* Phones and tablets: a round green button bottom-left, above the tab bar (Ask Phi sits bottom-right). */
@media (max-width:1023.98px){
  .phi-wa{left:16px;bottom:calc(84px + env(safe-area-inset-bottom));width:56px;height:56px;padding:0;justify-content:center}
  .phi-wa-ico{width:44px;height:44px}
  .phi-wa>span:last-child{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
}
@media print{.phi-wa{display:none!important}}
`;

/** Floating "WhatsApp us" button. Steps aside while the on-screen keyboard is up so it never covers a field. */
export function WhatsAppFloat() {
  const [text, setText] = useState(WHATSAPP_TEXT);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onText = (e: Event) => {
      const t = (e as CustomEvent<string>).detail;
      setText(typeof t === 'string' && t.trim() ? t : WHATSAPP_TEXT);
    };
    const phone = window.matchMedia('(max-width: 1023.98px)');
    const check = () => {
      const el = document.activeElement;
      setTyping(phone.matches && Boolean(el && el.matches(TYPING)));
    };
    window.addEventListener('phi:wa-text', onText);
    document.addEventListener('focusin', check);
    document.addEventListener('focusout', check);
    return () => {
      window.removeEventListener('phi:wa-text', onText);
      document.removeEventListener('focusin', check);
      document.removeEventListener('focusout', check);
    };
  }, []);

  return (
    <a
      href={whatsappLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`phi-wa${typing ? ' is-hidden' : ''}`}
      aria-label={`WhatsApp us on ${PHONE_DISPLAY} (opens WhatsApp)`}
      tabIndex={typing ? -1 : undefined}
      data-wa=""
    >
      <span className="phi-wa-ico" aria-hidden="true"><WaIcon size={26} /></span>
      <span>WhatsApp us</span>
    </a>
  );
}
