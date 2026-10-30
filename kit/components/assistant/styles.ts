// Chat panel styles. Same system as the booking flow and DcPage BASE_CSS: lime-tinted neutrals, the
// site's CSS variables (with fallbacks), 20px cards, 12px inputs and chips, 999 pills, one hairline,
// one shadow, Bricolage 500 headings. Saturated lime only on the primary button and the send button.
// Errors are plain text in #8c1f1f, no boxes, no icons. Prefix: amc-.

export const PANEL_CSS = `
.amc{--amc-bg:var(--band-a,#f2f8e9);--amc-surface:#fff;--amc-soft:var(--grey,#eef5e5);--amc-green:var(--green-soft,#e3f4d2);--amc-lime:var(--lime,#9fe870);--amc-lime-h:var(--lime-hover,#93dd63);--amc-ink:var(--ink,#0f1a09);--amc-muted:var(--ink-68,rgba(15,26,9,.68));--amc-faint:rgba(15,26,9,.45);--amc-line:var(--line,rgba(15,26,9,.1));--amc-line-strong:rgba(15,26,9,.18);--amc-link:var(--link,#2f7a18);--amc-ok:var(--accent,#2f7a18);--amc-bad:#8c1f1f;--amc-shadow:var(--card-shadow,0 1px 2px rgba(15,26,9,.04),0 12px 32px -20px rgba(15,26,9,.22));--amc-ease:cubic-bezier(.22,1,.36,1)}
/* Above the site header (1000) and the cookie card (1500): on phones the panel is a full-height sheet. */
.amc{position:fixed;z-index:1600;display:flex;flex-direction:column;overflow:hidden;background:var(--amc-bg);color:var(--amc-ink);font:400 15px/1.5 'Instrument Sans',system-ui,sans-serif;border:1px solid var(--amc-line-strong);outline:none;transition:transform .32s var(--amc-ease),opacity .32s var(--amc-ease),visibility 0s linear .32s;box-shadow:var(--amc-shadow)}
.amc *{box-sizing:border-box}
.amc button{font:inherit;color:inherit}
.amc h2,.amc h3,.amc h4{font-family:'Bricolage Grotesque',sans-serif;font-weight:500}
.amc.is-open{transition:transform .32s var(--amc-ease),opacity .32s var(--amc-ease)}
@media (min-width:1024px){
  .amc{right:16px;bottom:16px;width:440px;height:min(820px,calc(100dvh - 32px));border-radius:20px}
  .amc:not(.is-open){transform:translateX(24px);opacity:0;visibility:hidden;pointer-events:none}
}
@media (max-width:1023.98px){
  .amc{left:0;right:0;bottom:0;height:calc(var(--amc-vh,100dvh) - 8px);border-radius:20px 20px 0 0;border-bottom:0}
  .amc:not(.is-open){transform:translateY(100%);visibility:hidden;pointer-events:none}
}
@media (prefers-reduced-motion:reduce){.amc,.amc.is-open{transition:none}.amc *{animation:none!important}}

.amc-head{flex:none;background:var(--amc-surface);border-bottom:1px solid var(--amc-line);padding:6px 12px 0 16px}
.amc-handle{display:block;margin:0 auto;width:40px;height:5px;border-radius:999px;background:rgba(15,26,9,.18)}
@media (min-width:1024px){.amc-handle{display:none}.amc-head{padding:10px 14px 0 18px}}
.amc-head-row{display:flex;align-items:center;gap:11px;height:64px}
.amc-avatar{flex:none;display:inline-grid;place-items:center;background:var(--amc-lime);color:var(--amc-ink)}
.amc-head-txt{min-width:0;flex:1}
.amc-title{display:flex;align-items:center;gap:8px;margin:0;font:500 17px/1.2 'Bricolage Grotesque',sans-serif;letter-spacing:-.01em}
.amc-badge{border-radius:999px;background:var(--amc-green);padding:1px 8px;font:600 11px/16px 'Instrument Sans',sans-serif;color:var(--amc-link)}
.amc-status{display:inline-flex;align-items:center;gap:6px;font:500 12.5px 'Instrument Sans',sans-serif;color:var(--amc-ok)}
.amc-status i{width:8px;height:8px;border-radius:999px;background:currentColor}
.amc-status.is-off{color:var(--amc-faint)}
.amc-status.is-wait i{animation:amc-pulse 1.2s ease-in-out infinite}
.amc-sub{margin:2px 0 0;font-size:13.5px;color:var(--amc-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.amc-icon-btn{display:grid;place-items:center;flex:none;width:40px;height:40px;border:0;border-radius:999px;background:transparent;color:var(--amc-muted);cursor:pointer;transition:background-color .2s,color .2s}
.amc-icon-btn:hover{background:var(--amc-soft);color:var(--amc-ink)}
.amc-icon-btn:disabled{opacity:.4;cursor:default;background:transparent}
.amc-icon-btn[aria-pressed="true"]{background:var(--amc-green);color:var(--amc-ink)}
.amc :focus-visible{outline:2px solid var(--focus,rgba(15,26,9,.55));outline-offset:2px}

.amc-body{position:relative;flex:1;min-height:0;display:flex;flex-direction:column}
.amc-scroll{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:20px 16px 12px;scrollbar-width:thin}
@media (min-width:1024px){.amc-scroll{padding:22px 20px 12px}}
.amc-in{animation:amc-in .3s var(--amc-ease) both}
@keyframes amc-in{from{opacity:0}}
@keyframes amc-pulse{50%{opacity:.35}}
@keyframes amc-dot{0%,80%,100%{opacity:.35}40%{opacity:1}}
@keyframes amc-caret{50%{opacity:0}}

/* Gate */
.amc-gate{margin:auto 0;display:flex;flex-direction:column;align-items:center;text-align:center;padding:12px 4px}
.amc-gate h3{margin:20px 0 0;min-height:1.25em;font:500 24px/1.2 'Bricolage Grotesque',sans-serif;letter-spacing:-.02em}
.amc-caret{display:inline-block;width:2px;height:.95em;margin-left:3px;vertical-align:-2px;background:var(--amc-ink);animation:amc-caret 1s steps(1) infinite}
.amc-gate > p{margin:8px 0 0;max-width:34ch;color:var(--amc-muted)}
.amc-form{margin-top:22px;display:flex;flex-direction:column;gap:10px;width:100%;max-width:360px;text-align:left}
.amc-form label{font-size:13.5px;font-weight:600}
.amc-input{height:50px;width:100%;border:1px solid rgba(15,26,9,.2);border-radius:12px;background:var(--amc-surface);padding:0 14px;font:400 16px 'Instrument Sans',sans-serif;color:var(--amc-ink);outline:none;transition:border-color .2s}
.amc-input:focus{outline:none;border-color:var(--amc-ink)}
.amc-input.is-code{letter-spacing:.5em;font-size:22px;text-align:center;font-family:'IBM Plex Mono',monospace}
.amc-help{display:flex;gap:7px;margin:0;font-size:13.5px;line-height:1.45;color:var(--amc-muted)}
.amc-help svg{flex:none;margin-top:1px;color:var(--amc-link)}
.amc-help a,.amc-link{font-weight:600;color:var(--amc-link);text-decoration:none;background:none;border:0;padding:0;cursor:pointer;font-size:14px}
.amc-help a:hover,.amc-link:hover{text-decoration:underline}
.amc-link:disabled{color:var(--amc-faint);text-decoration:none;cursor:default}
.amc-err,.amc-msg-err,.amc-quote-err,.amc-notice{margin:0;font-size:14px;line-height:1.45;font-weight:500;color:var(--amc-bad);background:none;border:0;padding:0}
.amc-test{margin:0;padding:10px 12px;border-radius:12px;background:var(--amc-green);font-size:13.5px}
.amc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 22px;border-radius:999px;border:0;font:600 15.5px 'Instrument Sans',sans-serif;cursor:pointer;text-decoration:none;transition:background-color .2s}
.amc-btn-primary{background:var(--amc-lime);color:var(--amc-ink)}
.amc-btn-primary:hover{background:var(--amc-lime-h)}
.amc-btn-primary:disabled{background:var(--amc-soft);color:var(--amc-faint);cursor:default}
.amc-btn-ghost{background:var(--amc-surface);border:1px solid var(--amc-line-strong);color:var(--amc-ink)}
.amc-btn-ghost:hover{background:var(--amc-soft)}
.amc-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}

/* Welcome */
.amc-hello{display:flex;flex-direction:column;align-items:center;text-align:center;padding:10px 6px 22px}
.amc-hello p{margin:0}
.amc-hello-1{margin-top:16px!important;max-width:24ch;font:500 19px/1.3 'Bricolage Grotesque',sans-serif;letter-spacing:-.01em}
.amc-hello-2{margin-top:6px!important;color:var(--amc-muted)}
.amc-tiles{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.amc-tile{display:flex;flex-direction:column;align-items:flex-start;gap:12px;width:100%;height:100%;padding:14px;border:1px solid rgba(15,26,9,.05);border-radius:20px;background:var(--amc-surface);box-shadow:var(--amc-shadow);text-align:left;cursor:pointer;text-decoration:none;color:var(--amc-ink);transition:border-color .2s}
.amc-tile:hover{border-color:var(--amc-line-strong)}
.amc-tile-ico{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--amc-green);color:var(--amc-ok);transition:background-color .2s}
.amc-tile:hover .amc-tile-ico{background:var(--amc-lime);color:var(--amc-ink)}
.amc-tile b{display:block;font:500 15px/1.3 'Bricolage Grotesque',sans-serif;letter-spacing:-.01em}
.amc-tile small{display:block;margin-top:2px;font-size:13.5px;color:var(--amc-muted)}
.amc-try{margin:18px 0 8px;font-size:13.5px;font-weight:600;color:var(--amc-muted)}
.amc-starters{display:flex;flex-direction:column;align-items:flex-start;gap:8px}
.amc-starter{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 14px 8px 10px;border:1px solid var(--amc-line);border-radius:999px;background:var(--amc-surface);font-size:14px;text-align:left;cursor:pointer;transition:border-color .2s,background-color .2s}
.amc-starter:hover{border-color:var(--amc-line-strong);background:var(--amc-soft)}
.amc-starter svg{flex:none;color:var(--amc-link)}
.amc-back{margin-bottom:10px}
.amc-pick-title{margin:0 0 10px;font-weight:600}
.amc-pick{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.amc-pick button{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:12px 14px;border:1px solid var(--amc-line);border-radius:12px;background:var(--amc-surface);text-align:left;font-size:15px;font-weight:500;cursor:pointer}
.amc-pick button:hover{border-color:var(--amc-line-strong);background:var(--amc-soft)}
.amc-memory{margin:0 0 14px;padding:12px 14px;border-radius:20px;background:var(--amc-green);font-size:14px}
.amc-memory p{margin:0 0 8px}

/* Messages */
.amc-log{display:flex;flex-direction:column;gap:14px}
.amc-msg{display:flex;flex-direction:column;max-width:100%}
.amc-msg.is-user{align-items:flex-end}
.amc-bubble{max-width:86%;padding:10px 14px;border-radius:20px 20px 6px 20px;background:var(--amc-green);white-space:pre-wrap;overflow-wrap:anywhere}
.amc-bubble-meta{display:flex;align-items:center;gap:5px;margin:0 0 4px;font-size:12.5px;font-weight:600;color:var(--amc-muted)}
.amc-photos{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px;margin-bottom:6px}
.amc-photos img{width:84px;height:84px;object-fit:cover;border-radius:12px;border:1px solid var(--amc-line)}
.amc-photo-count{font-size:13.5px;color:var(--amc-muted)}
.amc-bot{display:grid;grid-template-columns:28px minmax(0,1fr);gap:10px;align-items:start}
.amc-bot-body{min-width:0}
.amc-text{overflow-wrap:anywhere}
.amc-text p,.amc-text ul,.amc-text ol{margin:0 0 9px}
.amc-text p:last-child,.amc-text ul:last-child,.amc-text ol:last-child{margin-bottom:0}
.amc-text ul,.amc-text ol{padding-left:20px}
.amc-text li{margin:2px 0}
.amc-text a{color:var(--amc-link);font-weight:600}
.amc-typing{display:inline-flex;align-items:center;gap:8px;color:var(--amc-muted);font-size:13.5px}
.amc-dots{display:inline-flex;gap:4px}
.amc-dots i{width:6px;height:6px;border-radius:999px;background:var(--amc-ink);animation:amc-dot 1.2s infinite}
.amc-dots i:nth-child(2){animation-delay:.15s}.amc-dots i:nth-child(3){animation-delay:.3s}
.amc-note{align-self:center;margin:2px 0;padding:6px 12px;border-radius:999px;background:var(--amc-soft);font-size:13.5px;color:var(--amc-muted);text-align:center}
.amc-msg-err{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.amc-actions{display:flex;align-items:center;gap:2px;margin-top:6px;margin-left:-8px}
.amc-actions .amc-icon-btn{width:34px;height:34px}
.amc-thanks{font-size:13.5px;color:var(--amc-muted);margin-left:6px}
.amc-replies{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.amc-reply{padding:7px 13px;border:1px solid var(--amc-line-strong);border-radius:999px;background:var(--amc-surface);font-size:13.5px;font-weight:500;cursor:pointer;transition:background-color .2s,border-color .2s}
.amc-reply:hover{background:var(--amc-soft);border-color:var(--amc-ink)}
.amc-latest{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border:1px solid var(--amc-line-strong);border-radius:999px;background:var(--amc-surface);font-size:13.5px;font-weight:600;white-space:nowrap;cursor:pointer}

/* Tables and price card */
.amc-table{margin:10px 0 0;border:1px solid rgba(15,26,9,.05);border-radius:20px;background:var(--amc-surface);box-shadow:var(--amc-shadow);overflow:hidden}
.amc-table figcaption{padding:10px 14px;font:500 15px/1.3 'Bricolage Grotesque',sans-serif;letter-spacing:-.01em;border-bottom:1px solid var(--amc-line)}
.amc-table-scroll{overflow-x:auto}
.amc-table table{width:100%;border-collapse:collapse;font-size:13.5px}
.amc-table th,.amc-table td{padding:8px 14px;text-align:left;border-bottom:1px solid var(--amc-line);vertical-align:top}
.amc-table thead th{font-size:12.5px;color:var(--amc-muted);font-weight:600}
.amc-table tbody th{font-weight:600}
.amc-table tr:last-child th,.amc-table tr:last-child td{border-bottom:0}
.amc-quote{margin:10px 0 0;padding:16px;border:1px solid rgba(15,26,9,.05);border-radius:20px;background:var(--amc-surface);box-shadow:var(--amc-shadow)}
.amc-quote[aria-busy="true"]{opacity:.7}
.amc-quote-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:0 0 10px}
.amc-quote-head span{font-size:13.5px;font-weight:600;color:var(--amc-muted)}
.amc-quote-total{font:500 26px/1.1 'Bricolage Grotesque',sans-serif;letter-spacing:-.02em;text-align:right}
.amc-quote-total.is-text{font:600 16px/1.3 'Instrument Sans',sans-serif;letter-spacing:0}
.amc-quote-head>span{flex:none}
.amc-quote-rows,.amc-quote-lines{list-style:none;margin:0 0 10px;padding:0;border-top:1px solid var(--amc-line)}
.amc-quote-rows li,.amc-quote-lines li{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--amc-line);font-size:13.5px}
.amc-quote-rows span,.amc-quote-lines span{color:var(--amc-muted)}
.amc-quote-rows b,.amc-quote-lines b{font-weight:600;text-align:right}
.amc-quote-adjust{display:grid;gap:10px;margin:0 0 10px}
.amc-quote-field{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.amc-quote-label{margin:0;font-size:13.5px;font-weight:600}
.amc-seg{display:inline-flex;padding:3px;border-radius:999px;background:var(--amc-soft)}
.amc-seg button{border:0;border-radius:999px;background:transparent;padding:6px 11px;font-size:13.5px;font-weight:600;cursor:pointer;color:var(--amc-muted)}
.amc-seg button[aria-checked="true"]{background:var(--amc-surface);color:var(--amc-ink);box-shadow:0 1px 3px rgba(15,26,9,.14)}
.amc-seg button:disabled{cursor:default}
.amc-stepper{display:inline-flex;align-items:center;gap:4px}
.amc-stepper button{display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--amc-line-strong);border-radius:999px;background:var(--amc-surface);cursor:pointer}
.amc-stepper button:disabled{opacity:.4;cursor:default}
.amc-stepper output{min-width:48px;text-align:center;font-weight:600;font-size:15px}
.amc-quote-note{margin:0 0 8px;font-size:13.5px;line-height:1.45;color:var(--amc-muted)}
.amc-quote-note a{color:var(--amc-link);font-weight:600}
.amc-quote-err{margin:0 0 8px}
.amc-quote-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-top:12px}
.amc-quote-actions .amc-btn{min-height:44px;padding:0 18px}
.amc-quote-done{display:flex;gap:8px;margin:0 0 10px;font-weight:600;font-size:14px}
.amc-quote-done svg{flex:none;color:var(--amc-ok)}
.amc-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 10px}
@media (max-width:380px){.amc-grid2{grid-template-columns:1fr}}
.amc-field{display:flex;flex-direction:column;gap:5px;min-width:0;margin:0 0 10px;font-size:13.5px;font-weight:600}
.amc-grid2 .amc-field{margin:0}
.amc-field input,.amc-field textarea,.amc-field select{width:100%;min-width:0;border:1px solid rgba(15,26,9,.2);border-radius:12px;padding:12px 14px;min-height:50px;font:400 16px 'Instrument Sans',sans-serif;background:var(--amc-surface);color:var(--amc-ink)}
.amc-field textarea{resize:vertical}
.amc-field input:focus,.amc-field textarea:focus,.amc-field select:focus{outline:none;border-color:var(--amc-ink)}
.amc-field select:disabled{color:var(--amc-muted)}
.amc-field [aria-invalid="true"]{border-color:var(--amc-bad)}
.amc-fieldset{margin:4px 0 6px;padding:0;border:0;min-width:0}
.amc-fieldset legend{padding:0;margin:0 0 6px}
.amc-consent{display:flex;gap:9px;align-items:flex-start;margin:4px 0 6px;font-size:13.5px;line-height:1.45;cursor:pointer}
.amc-consent input{flex:none;width:18px;height:18px;margin:1px 0 0;accent-color:var(--amc-ink)}
.amc-consent a{color:var(--amc-link);font-weight:600}
.amc-days{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 8px;margin:6px 0 8px;scrollbar-width:thin}
.amc-days button{flex:none;min-width:60px;padding:7px 4px;border:1px solid var(--amc-line-strong);border-radius:12px;background:var(--amc-surface);font-size:13.5px;font-weight:600;cursor:pointer}
.amc-days small{display:block;font-weight:400;font-size:11.5px;color:var(--amc-muted)}
.amc-days button[aria-checked="true"],.amc-chips button[aria-checked="true"]{border-color:var(--amc-ink);background:var(--amc-lime)}
.amc-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px}
.amc-chips button{padding:7px 12px;border:1px solid var(--amc-line-strong);border-radius:999px;background:var(--amc-surface);font-size:13.5px;font-weight:600;cursor:pointer}

/* Composer */
.amc-foot{flex:none;background:var(--amc-surface);border-top:1px solid var(--amc-line);padding:10px 12px calc(10px + env(safe-area-inset-bottom))}
.amc-notice{display:flex;align-items:flex-start;gap:8px;margin:0 0 8px;padding:0 4px}
.amc-notice button{margin-left:auto}
.amc-chips-photos{display:flex;gap:8px;margin:0 0 8px;flex-wrap:wrap}
.amc-chips-photos span{position:relative}
.amc-chips-photos img{width:56px;height:56px;object-fit:cover;border-radius:12px;border:1px solid var(--amc-line)}
.amc-chips-photos button{position:absolute;top:-7px;right:-7px;display:grid;place-items:center;width:22px;height:22px;border-radius:999px;border:1px solid var(--amc-line-strong);background:var(--amc-surface);cursor:pointer;padding:0}
.amc-composer{display:flex;align-items:flex-end;gap:2px;padding:5px;border:1px solid var(--amc-line-strong);border-radius:24px;background:var(--amc-surface);transition:border-color .2s}
.amc-composer:focus-within{border-color:var(--amc-ink)}
.amc-composer textarea{flex:1;min-width:0;min-height:40px;max-height:144px;resize:none;border:0;outline:none;background:transparent;padding:8px 6px;font:400 16px/24px 'Instrument Sans',sans-serif;color:var(--amc-ink)}
.amc-composer textarea:focus-visible{outline:none}
.amc-composer textarea::placeholder{color:var(--amc-faint)}
.amc-send{display:grid;place-items:center;flex:none;width:40px;height:40px;border:0;border-radius:999px;background:var(--amc-lime);color:var(--amc-ink);cursor:pointer;transition:background-color .2s}
.amc-send:hover{background:var(--amc-lime-h)}
.amc-send:disabled{background:var(--amc-soft);color:var(--amc-faint);cursor:default}
.amc-rec{display:flex;align-items:center;gap:8px;flex:1;min-height:40px;padding:0 6px;font-size:14px;font-weight:600}
.amc-rec-dot{width:10px;height:10px;border-radius:999px;background:var(--amc-bad);animation:amc-pulse 1s ease-in-out infinite}
.amc-meter{flex:1;height:6px;border-radius:999px;background:var(--amc-soft);overflow:hidden}
.amc-meter i{display:block;height:100%;width:calc(var(--lv,0) * 100%);background:var(--amc-lime);border-radius:999px;transition:width .08s linear}
.amc-foot-note{margin:8px 2px 0;font-size:12px;line-height:1.4;color:var(--amc-muted);text-align:center}
.amc-foot-note a{color:var(--amc-ink);font-weight:600}
.amc-drop{position:absolute;inset:8px;z-index:3;display:grid;place-items:center;border:2px dashed var(--amc-ink);border-radius:20px;background:rgba(242,248,233,.92);font-weight:600}

/* Live Voice */
.amc-live{display:flex;align-items:center;gap:12px;padding:6px 6px 6px 10px;border:1px solid var(--amc-ink);border-radius:24px;background:var(--amc-green)}
.amc-orb{position:relative;flex:none;width:40px;height:40px;border-radius:999px;background:var(--amc-lime);display:grid;place-items:center;transform:scale(calc(1 + var(--lv,0) * .35));transition:transform .08s linear}
.amc-orb.is-speaking{animation:amc-orb 1.1s ease-in-out infinite}
@keyframes amc-orb{50%{transform:scale(1.15)}}
.amc-live-txt{flex:1;min-width:0}
.amc-live-txt b{display:block;font-size:14px}
.amc-live-txt span{display:block;font-size:13.5px;color:var(--amc-muted)}
.amc-live .amc-btn{min-height:40px;padding:0 16px;background:var(--amc-surface);border:1px solid var(--amc-line-strong)}

/* Account sheet */
.amc-sheet{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;background:var(--amc-bg);animation:amc-in .3s var(--amc-ease) both}
.amc-tabs{display:flex;gap:4px;padding:10px 16px 0;border-bottom:1px solid var(--amc-line);background:var(--amc-surface)}
.amc-tabs button{border:0;background:none;padding:10px 12px;font-weight:600;font-size:14px;color:var(--amc-muted);border-bottom:2px solid transparent;cursor:pointer}
.amc-tabs button[aria-selected="true"]{color:var(--amc-ink);border-bottom-color:var(--amc-ink)}
.amc-sheet-body{flex:1;overflow-y:auto;padding:16px}
.amc-set{padding:14px 0;border-bottom:1px solid var(--amc-line)}
.amc-set:first-child{padding-top:0}
.amc-set h4{margin:0 0 4px;font:500 15px/1.3 'Bricolage Grotesque',sans-serif;letter-spacing:-.01em}
.amc-set p{margin:0 0 10px;font-size:13.5px;color:var(--amc-muted)}
.amc-set select{width:100%;height:44px;border:1px solid var(--amc-line-strong);border-radius:12px;padding:0 12px;font:400 16px 'Instrument Sans',sans-serif;background:var(--amc-surface);color:var(--amc-ink)}
.amc-switch-row{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.amc-switch{position:relative;flex:none;width:44px;height:26px;border:0;border-radius:999px;background:rgba(15,26,9,.22);cursor:pointer;transition:background-color .2s;padding:0}
.amc-switch::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:999px;background:#fff;transition:transform .2s}
.amc-switch[aria-checked="true"]{background:var(--amc-ink)}
.amc-switch[aria-checked="true"]::after{transform:translateX(18px)}
.amc-voices{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.amc-voices button{display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--amc-line-strong);border-radius:12px;background:var(--amc-surface);font-size:13.5px;font-weight:600;cursor:pointer;text-align:left}
.amc-voices button[aria-checked="true"]{border-color:var(--amc-ink);background:var(--amc-lime)}
.amc-convs{list-style:none;margin:0;padding:0;border-top:1px solid var(--amc-line)}
.amc-convs button{display:block;width:100%;padding:12px 0;border:0;border-bottom:1px solid var(--amc-line);background:none;text-align:left;cursor:pointer}
.amc-convs button:hover b{color:var(--amc-link)}
.amc-convs b{display:block;font-size:14.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.amc-convs small{font-size:13.5px;color:var(--amc-muted)}
.amc-danger{color:var(--amc-bad)!important}
`;

export const LAUNCHER_CSS = `
.amc-launch{position:fixed;right:24px;bottom:24px;z-index:46;display:inline-flex;align-items:center;gap:10px;padding:6px 20px 6px 6px;border:1px solid rgba(15,26,9,.18);border-radius:999px;background:#fff;color:var(--ink,#0f1a09);font:600 15.5px/1.2 'Instrument Sans',system-ui,sans-serif;white-space:nowrap;cursor:pointer;box-shadow:var(--card-shadow,0 1px 2px rgba(15,26,9,.04),0 12px 32px -20px rgba(15,26,9,.22));transition:opacity .25s,visibility .25s}
.amc-launch:hover{background:var(--grey,#eef5e5)}
.amc-launch:focus-visible{outline:2px solid var(--focus,rgba(15,26,9,.55));outline-offset:3px}
.amc-launch-ico{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:999px;background:var(--lime,#9fe870);color:var(--ink,#0f1a09)}
.amc-launch.is-hidden{opacity:0;visibility:hidden;pointer-events:none}
/* Phones and tablets: the same floating button, shrunk to a round icon in the bottom-right corner,
   sitting just above the tab bar. Its label is kept for screen readers only. */
@media (max-width:1023.98px){
  .amc-launch{right:16px;bottom:calc(84px + env(safe-area-inset-bottom));width:56px;height:56px;padding:0;justify-content:center}
  .amc-launch-ico{width:44px;height:44px}
  .amc-launch>span:last-child{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
}
@media (min-width:1024px){.dc-top-btn{bottom:96px!important}}
/* Pages with a sticky right-hand sidebar: until the page gutter is wide enough for the full pill,
   shrink to the icon and centre it in the gutter so it never sits on the sidebar cards. */
@media (min-width:1024px) and (max-width:1679.98px){
  body:has(aside.side,.am-blog-aside,.dc-aside) :is(.amc-launch,.dc-top-btn){right:clamp(2px,calc((max(5vw,(100% - 1200px)/2) - 44px)/2),24px);width:44px;height:44px;padding:0}
  body:has(aside.side,.am-blog-aside,.dc-aside) .amc-launch{justify-content:center}
  body:has(aside.side,.am-blog-aside,.dc-aside) .amc-launch{width:52px;height:52px;right:clamp(2px,calc((max(5vw,(100% - 1200px)/2) - 52px)/2),24px)}
  body:has(aside.side,.am-blog-aside,.dc-aside) .amc-launch-ico{width:40px;height:40px;border-radius:999px}
  body:has(aside.side,.am-blog-aside,.dc-aside) .amc-launch>span:last-child{position:absolute;right:calc(100% + 8px);top:50%;transform:translateY(-50%);padding:8px 14px;border:1px solid rgba(15,26,9,.18);border-radius:12px;background:#fff;white-space:nowrap;box-shadow:var(--card-shadow,0 1px 2px rgba(15,26,9,.04),0 12px 32px -20px rgba(15,26,9,.22));opacity:0;pointer-events:none;transition:opacity .2s}
  body:has(aside.side,.am-blog-aside,.dc-aside) .amc-launch:is(:hover,:focus-visible)>span:last-child{opacity:1}
  body:has(aside.side,.am-blog-aside,.dc-aside) .dc-top-btn{bottom:80px!important}
}
@media (prefers-reduced-motion:reduce){.amc-launch{transition:none}}
@media print{.amc-launch,.amc{display:none!important}}
`;
