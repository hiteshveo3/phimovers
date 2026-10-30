'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { PHONE_DISPLAY, WHATSAPP_TEXT, whatsappLink } from '../site-facts';

// WhatsApp sits next to Get a quote everywhere (as on Alpha Movers: many people would rather send a quick
// message than fill in a form). One floating button on every page, plus a button in each CTA.
// Pages can change the floating button's first message:
//   window.dispatchEvent(new CustomEvent('phi:wa-text', { detail: 'Hi Phi Movers, …' }))

export const WA_GREEN = '#25d366';

// The WhatsApp logo glyph (Simple Icons, CC0). Green by default; pass a colour to change it.
const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

export function WaIcon({ size = 18, style, color = WA_GREEN }: { size?: number; style?: CSSProperties; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true" focusable="false" style={{ flex: 'none', ...style }}>
      <path d={WA_PATH} />
    </svg>
  );
}

/** The secondary button next to Book online. `text` is the message typed in for the visitor. */
export function WhatsAppButton({ text = WHATSAPP_TEXT, label = 'WhatsApp us', style, className = 'dc-btn dc-btn-white dc-btn-wa' }: { text?: string; label?: string; style?: CSSProperties; className?: string }) {
  return (
    <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className={className} style={style} data-wa="">
      <WaIcon size={20} /> {label}
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
