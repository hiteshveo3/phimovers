// Booking flow styles (after Alpha's booking-css.ts): a step card on the left, a sticky "Your booking" summary
// phones the summary becomes a bar at the bottom that opens into a sheet. Lime only on the primary
// button, selected states and the progress bar.
export const BOOKING_CSS = `
.bf-page{background:var(--band-a);min-height:70vh}
.bf-wrap{max-width:1100px;margin:0 auto;padding:10px 5vw 24px}
.bf-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:20px;align-items:start}
.bf-main{min-width:0;scroll-margin-top:16px}
.bf-progress{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:0 12px}
.bf-progress>p{display:flex;justify-content:flex-end;grid-column:2;margin:0;font-size:13px;font-weight:600;color:var(--ink-68)}
.bf-progress>p small{font-size:12.5px;font-weight:500;color:var(--ink-60);white-space:nowrap}
.bf-track{height:3px;border-radius:9px;background:rgba(15,26,9,.1);overflow:hidden;grid-column:1/-1;margin:6px 0 10px}
.bf-track i{display:block;height:100%;background:var(--lime);border-radius:9px;transition:width .5s var(--ease-soft)}
.bf-backlink{display:inline-flex;align-items:center;gap:6px;margin:0;grid-column:1;border:0;background:none;padding:0;font:inherit;font-size:14px;font-weight:600;color:var(--ink-68);cursor:pointer}
.bf-backlink:hover{color:var(--ink)}
.bf-tab-n{font-weight:500;color:var(--ink-60);font-size:12.5px}
.bf-tabs button[aria-selected=true] .bf-tab-n{color:var(--ink-68)}
.bf-popular{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;background:var(--lime);font-size:11.5px;font-weight:600;vertical-align:2px}
.bf-toggles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.bf-toggles.two{grid-template-columns:repeat(2,minmax(0,1fr))}
.bf-toggles[aria-label$="parking"]{grid-template-columns:1fr}
.bf-toggle{display:flex;gap:10px;align-items:center;min-height:56px;padding:10px 12px;border:1px solid rgba(15,26,9,.14);border-radius:12px;background:#fff;font:inherit;font-size:14px;color:var(--ink);text-align:left;cursor:pointer;transition:border-color .2s,box-shadow .2s,background-color .2s}
.bf-toggle:hover{border-color:rgba(15,26,9,.34)}
.bf-toggle[aria-checked=true]{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink);background:#fbfef7}
.bf-toggle-ico{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:var(--green-soft);color:var(--link)}
.bf-toggle[aria-checked=true] .bf-toggle-ico{background:var(--lime);color:var(--ink)}
.bf-toggle>span:last-child{display:grid;gap:1px;min-width:0}
.bf-toggle b{font-weight:600}
.bf-toggle small{font-size:12.5px;color:var(--ink-60)}
.bf-h2-first{margin-top:0}
.bf-resume{margin:16px 0 0;padding-top:14px;border-top:1px solid var(--line);text-align:center}
.bf-resume-form{text-align:left}
.bf-resume-form .bf-label{margin-top:0}
.bf-card{background:#fff;border-radius:16px;padding:clamp(14px,1.8vw,18px);border:1px solid var(--line)}
.bf-skel{color:var(--ink-60)}
.bf-head{display:flex;gap:16px;align-items:flex-start;margin-bottom:6px}
.bf-head-ico{flex:none;display:grid;place-items:center;width:48px;height:48px;border-radius:14px;background:var(--green-soft);color:var(--link)}
.bf-h1{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(20px,2vw,24px);line-height:1.15;letter-spacing:-.025em}
.bf-lead{margin:8px 0 0;font-size:15.5px;line-height:1.55;color:var(--ink-68)}
.bf-h2{margin:18px 0 8px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.01em}
.bf-label{display:block;margin:9px 0 5px;font-size:13px;font-weight:600}
.bf-label small{font-weight:500;color:var(--ink-60);margin-left:6px}
.bf-small{margin:8px 0 0;font-size:13px;line-height:1.5;color:var(--ink-60)}
.bf-small a{color:var(--ink);font-weight:600}
.bf-center{text-align:center}
.bf-input{width:100%;min-height:40px;padding:8px 12px;border-radius:12px;border:1px solid rgba(15,26,9,.2);background:#fff;font:inherit;font-size:16px;color:var(--ink);transition:border-color .2s,box-shadow .2s}
textarea.bf-input{min-height:44px;resize:vertical;line-height:1.5}
/* One border only: the colour changes, no second ring. Outline is removed for every focus state. */
.bf-input,.bf-input:focus,.bf-input:focus-visible{outline:none}
.bf-input:focus{border-color:var(--ink)}
.bf-input[aria-invalid=true]{border-color:#8c1f1f}
.bf-err{margin:8px 0 0;color:#8c1f1f;font-size:13.5px;font-weight:600}
.bf-inline{display:flex;gap:10px;align-items:stretch}
.bf-inline .bf-input{flex:1}
.bf-code{letter-spacing:.4em;font-size:20px;font-weight:600;max-width:220px}
.bf-primary{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:46px;padding:6px 7px 6px 22px;border-radius:999px;border:0;background:var(--lime);color:var(--ink);font:inherit;font-size:16px;font-weight:600;white-space:nowrap;cursor:pointer;transition:background-color .2s}
.bf-primary .mo-cta-mark{background:rgba(255,255,255,.55)}
.bf-primary:hover{background:var(--lime-hover)}
.bf-primary:disabled{opacity:.55;cursor:default}
.bf-ghost{display:inline-flex;align-items:center;gap:8px;min-height:50px;padding:0 20px;border-radius:999px;border:1px solid rgba(15,26,9,.18);background:#fff;font:inherit;font-size:15px;font-weight:600;color:var(--ink);cursor:pointer}
.bf-ghost:hover{background:var(--grey)}
.bf-textbtn{border:0;background:none;padding:0;font:inherit;font-size:14px;font-weight:600;color:var(--link);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.bf-textlink{display:inline-block;margin-top:18px;font-weight:600;text-decoration:underline;text-underline-offset:3px}
.bf-iconbtn{display:grid;place-items:center;width:40px;height:40px;border-radius:999px;border:1px solid rgba(15,26,9,.18);background:#fff;color:var(--ink);cursor:pointer}
.bf-iconbtn:disabled{opacity:.35;cursor:default}
.bf-points{margin:22px 0 0;padding:18px 0 0;list-style:none;border-top:1px solid var(--line);display:grid;gap:10px}
.bf-points li{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.5}
.bf-points svg{color:var(--link);flex:none;margin-top:1px}
.bf-dev{margin:12px 0 0;padding:10px 12px;border-radius:12px;background:var(--band-a);font-size:13px}

.bf-tabs{display:flex;gap:4px;padding:4px;border-radius:999px;background:var(--band-a);margin-bottom:16px;overflow-x:auto}
.bf-tabs button{flex:1;white-space:nowrap;border:0;background:none;padding:10px 14px;border-radius:999px;font:inherit;font-size:14px;font-weight:600;color:var(--ink-68);cursor:pointer;transition:background-color .25s,color .25s,box-shadow .25s}
.bf-tabs button[aria-selected=true]{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(15,26,9,.14)}
.bf-choice{position:relative;display:block;width:100%;text-align:left;border:1px solid rgba(15,26,9,.14);background:#fff;border-radius:16px;padding:14px 16px;font:inherit;font-size:15px;font-weight:600;color:var(--ink);cursor:pointer;transition:border-color .2s,box-shadow .2s,background-color .2s}
.bf-choice:hover{border-color:rgba(15,26,9,.34)}
.bf-choice[aria-checked=true]{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink);background:#fbfef7}
.bf-check{position:absolute;top:10px;right:10px;display:grid;place-items:center;color:var(--link);opacity:0;transform:scale(.5);transition:opacity .2s,transform .25s var(--ease-soft)}
.bf-check svg{background:#fff;border-radius:999px}
.bf-choice[aria-checked=true] .bf-check{opacity:1;transform:none}
.bf-team .bf-check{top:auto;bottom:12px}
.bf-team[aria-checked=true] .bf-badge{right:44px}
.bf-services{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.bf-svc{display:flex;gap:12px;align-items:flex-start}
.bf-svc-ico{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--green-soft);color:var(--link)}
.bf-svc[aria-checked=true] .bf-svc-ico{background:var(--lime);color:var(--ink)}
.bf-svc-txt{display:grid;gap:2px}
.bf-svc-txt small{font-weight:500;font-size:13px;color:var(--ink-60)}
.bf-svc-txt em{font-style:normal;font-size:13px;font-weight:600;color:var(--link);margin-top:4px}
.bf-svc-txt .bf-tag{justify-self:start;margin-top:6px;font-size:11.5px;padding:3px 9px}
.bf-svc{padding-right:40px}
.bf-seg{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--band-a)}
.bf-seg button{border:0;background:none;padding:10px 22px;border-radius:999px;font:inherit;font-size:15px;font-weight:600;color:var(--ink-68);cursor:pointer}
.bf-seg button[aria-checked=true]{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(15,26,9,.14)}
.bf-sizes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.bf-sizes .bf-choice{text-align:center}
.bf-hint{display:flex;gap:10px;align-items:flex-start;margin:8px 0 0;padding:7px 10px;border-radius:10px;background:var(--band-a);font-size:12.5px;line-height:1.4}
.bf-hint svg{display:none}
.bf-teams{display:grid;gap:10px}
.bf-team{display:grid;gap:4px;padding-right:110px}
.bf-team small{font-weight:500;font-size:13px;color:var(--ink-60)}
.bf-team-price{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px}
.bf-team-price small{font-family:'Instrument Sans',sans-serif;font-size:13px}
.bf-badge{position:absolute;top:12px;right:12px;padding:4px 10px;border-radius:999px;background:var(--lime);font-size:12px;font-weight:600}
.bf-stepper{display:inline-flex;align-items:center;gap:16px;padding:6px;border-radius:999px;border:1px solid rgba(15,26,9,.14)}
.bf-stepper output{min-width:96px;text-align:center;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px;perspective:300px}
.bf-live{margin:14px 0 0;padding:12px 14px;border-radius:12px;background:var(--green-soft);font-size:14.5px}
.bf-chips{display:flex;flex-wrap:wrap;gap:8px}
.bf-chip{border:1px solid rgba(15,26,9,.16);background:#fff;border-radius:999px;padding:9px 14px;font:inherit;font-size:14px;font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .2s,border-color .2s}
.bf-chip:hover:not(:disabled){border-color:rgba(15,26,9,.4)}
.bf-chip[aria-pressed=true]{background:var(--lime);border-color:var(--lime)}
.bf-chip:disabled{opacity:.35;cursor:default;text-decoration:line-through}
.bf-days{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 10px;margin:0 -2px 6px;scrollbar-width:thin}
.bf-day{flex:none;min-width:74px;border:1px solid rgba(15,26,9,.14);border-radius:14px;background:#fff;padding:10px 8px;text-align:center;font:inherit;color:var(--ink);cursor:pointer}
.bf-day b{display:block;font-size:14px}
.bf-day small{display:block;font-size:12.5px;color:var(--ink-60);margin-top:2px}
.bf-day[aria-checked=true]{background:var(--lime);border-color:var(--lime)}
.bf-day[aria-checked=true] small{color:var(--ink)}
.bf-day:disabled{opacity:.35;cursor:default}
.bf-cal{margin:12px 0 0;padding:14px;border-radius:16px;border:1px solid rgba(15,26,9,.12);max-width:360px}
.bf-cal-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.bf-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}
.bf-cal-dow{font-size:12px;color:var(--ink-60);padding:4px 0}
.bf-cal-day{aspect-ratio:1;border:0;border-radius:10px;background:none;font:inherit;font-size:14px;cursor:pointer}
.bf-cal-day:hover:not(:disabled){background:var(--grey)}
.bf-cal-day[aria-pressed=true]{background:var(--lime);font-weight:600}
.bf-cal-day:disabled{opacity:.3;cursor:default}
.bf-slotgroup{display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:start;margin-top:12px}
.bf-slotgroup>span{padding-top:10px;font-size:13.5px;color:var(--ink-60);font-weight:600}
.bf-stops{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
.bf-stops.one{grid-template-columns:1fr}
.bf-stop{border:0;padding:0;margin:0;min-width:0}
.bf-stop legend{padding:0;margin:0 0 2px;font-weight:700;font-size:14px}
.bf-stop .bf-grid2{grid-template-columns:112px minmax(0,1fr);gap:0 10px}
.bf-stop .bf-toggles{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.bf-stop .bf-toggles.two{grid-template-columns:repeat(2,minmax(0,1fr))}
.bf-stop .bf-toggles[aria-label$="parking"]{grid-template-columns:repeat(3,minmax(0,1fr))}
.bf-stop .bf-toggle{min-height:34px;padding:4px 6px;border-radius:10px;font-size:12.5px;line-height:1.2;justify-content:center;text-align:center}
.bf-stop .bf-toggle-ico,.bf-stop .bf-small{display:none}
.bf-stop .bf-tag{margin-top:4px;padding:2px 8px;font-size:12px}
.bf-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 14px}
.bf-tag{display:inline-block;margin-top:8px;padding:4px 10px;border-radius:999px;font-size:12.5px;font-weight:600}
.bf-tag.ok{background:var(--green-soft);color:var(--link)}
.bf-tag.far{background:var(--grey);color:var(--ink-68)}
.bf-tag.call{background:var(--band-a);color:var(--ink-68)}
.bf-hours{margin-bottom:10px}
.bf-review-total{display:grid;gap:4px;margin:0 0 14px;padding:16px 18px;border-radius:16px;background:var(--green-soft)}
.bf-review-total span{font-size:13px;font-weight:600;color:var(--link)}
.bf-review-total strong{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:30px;letter-spacing:-.02em;line-height:1.1}
.bf-review-total small{font-size:13px;color:var(--ink-68);line-height:1.45}
.bf-signed{margin:16px 0 0;padding:12px 14px;border-radius:12px;background:var(--band-a);font-size:14px}
.bf-review{margin:0;border-top:1px solid var(--line)}
.bf-review>div{display:grid;grid-template-columns:130px 1fr auto;gap:12px;align-items:baseline;padding:11px 0;border-bottom:1px solid var(--line);font-size:14.5px}
.bf-review dt{color:var(--ink-60)}
.bf-review dd{margin:0}
.bf-pay{display:flex;gap:14px;align-items:center;margin:20px 0 0;padding:16px;border-radius:16px;border:1px solid var(--lime);background:#fbfef7}
.bf-pay b{display:block;font-size:15.5px}
.bf-pay small{font-size:13.5px;color:var(--ink-68)}
.bf-policies{margin:0;padding:0;list-style:none;display:grid;gap:8px}
.bf-policies li{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.5}
.bf-policies svg{color:var(--link);flex:none;margin-top:1px}
.bf-consent{display:flex;gap:10px;align-items:flex-start;margin:18px 0 0;font-size:14.5px;cursor:pointer}
.bf-consent input{width:20px;height:20px;accent-color:var(--ink);margin-top:1px;flex:none}
.bf-consent a{text-decoration:underline;text-underline-offset:3px}
.bf-actions{display:flex;justify-content:flex-end;align-items:center;gap:12px;margin-top:10px}
.bf-actions .bf-primary{min-width:200px}

.bf-sum{position:sticky;top:12px}
.bf-sum-bar{display:none}
.bf-sum-body{background:#fff;border-radius:16px;padding:16px;border:1px solid var(--line);max-height:calc(100vh - 36px);overflow:auto}
.bf-sum-empty{margin:0;font-size:14px;line-height:1.5;color:var(--ink-68)}
.bf-sum-rows{margin:0;display:grid;gap:8px}
.bf-sum-rows>div{display:grid;gap:1px}
.bf-sum-rows dt{font-size:12px;color:var(--ink-60)}
.bf-sum-rows dd{margin:0;font-size:14px;font-weight:600;line-height:1.35}
.bf-sum-total{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}
.bf-sum-total>span{font-size:13.5px;font-weight:600}
.bf-sum-total strong{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:26px;letter-spacing:-.02em;perspective:300px}
.bf-sum-more-btn{display:block;width:100%;margin:12px 0 0;padding:9px 12px;border:1px solid rgba(15,26,9,.16);border-radius:999px;background:#fff;font:inherit;font-size:13.5px;font-weight:600;color:var(--ink);cursor:pointer}
.bf-sum-more-btn:hover{background:var(--grey)}
.bf-sum-more{margin-top:14px;padding-top:14px;border-top:1px dashed rgba(15,26,9,.18)}
.bf-sum-lines{margin:14px 0 0;padding:0;list-style:none;display:grid;gap:8px}
.bf-sum-lines li{display:flex;justify-content:space-between;gap:12px;font-size:13.5px}
.bf-sum-lines small{display:block;font-size:12px;color:var(--ink-60)}
.bf-how{margin:0;padding:0;list-style:none;display:grid;gap:12px}
.bf-how li{display:flex;gap:12px;align-items:flex-start}
.bf-how li>span:last-child{display:grid;gap:2px}
.bf-how b{font-size:14.5px}
.bf-how small{font-size:13px;line-height:1.45;color:var(--ink-60)}
.bf-how-n{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:999px;background:var(--green-soft);color:var(--link);font-size:13px;font-weight:600}
.bf-trust{margin:14px 0 0;padding:14px 0 0;list-style:none;border-top:1px solid var(--line);display:grid;gap:9px}
.bf-trust li{display:flex;gap:10px;align-items:center;font-size:13.5px;line-height:1.4;color:var(--ink-68)}
.bf-trust svg{flex:none;color:var(--link)}
.bf-sum-call{display:flex;gap:10px;align-items:flex-start;margin:14px 0 0;font-size:13.5px;color:var(--ink-68)}
.bf-wa-btn{justify-content:center;text-decoration:none;white-space:nowrap}
.bf-sum-wa{display:flex;width:100%;margin:16px 0 0;min-height:46px}
.bf-wa-row{display:flex;align-items:center;justify-content:space-between;gap:12px 16px;flex-wrap:wrap;margin:18px 0 0;padding:14px 16px;border:1px solid var(--line);border-radius:16px;background:var(--band-a)}
.bf-wa-txt{flex:1 1 220px;min-width:0}
.bf-wa-txt b{display:block;font-size:15px;font-weight:600}
.bf-wa-txt small{display:block;margin-top:2px;font-size:13.5px;line-height:1.45;color:var(--ink-68)}
.bf-wa-row .bf-wa-btn{min-height:46px}
@media (max-width:640px){.bf-wa-row .bf-wa-btn{width:100%}}
/* Phones: the floating WhatsApp button would sit on the sticky Continue button; the header pill and the
   WhatsApp box under each step take its place here. */
@media (max-width:1023.98px){.phi-wa{display:none!important}}
.bf-sum-call svg{color:var(--link);flex:none;margin-top:2px}
.bf-sum-call small{display:block;font-size:12.5px;color:var(--ink-60);margin-top:2px}
.bf-sum-call a{color:var(--ink);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.bf-next{margin:26px auto 0;padding:0;list-style:none;display:grid;gap:12px;max-width:440px;text-align:left}
.bf-next li{display:flex;gap:14px;align-items:center}
.bf-next li>span:last-child{display:grid;gap:2px}
.bf-next b{font-size:15px}
.bf-next small{font-size:13.5px;line-height:1.45;color:var(--ink-68)}
.bf-next-ico{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--green-soft);color:var(--link)}

.bf-done{max-width:620px;margin:0 auto;text-align:center;background:#fff;border-radius:20px;padding:clamp(28px,5vw,48px);box-shadow:var(--card-shadow)}
.bf-done-ico{display:inline-grid;place-items:center;width:68px;height:68px;border-radius:999px;background:var(--lime);margin-bottom:16px}
.bf-ref-label{margin:18px 0 4px;font-size:13px;color:var(--ink-60);font-weight:600;text-transform:uppercase;letter-spacing:.08em}
.bf-ref{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:38px;letter-spacing:.02em}
.bf-done-row{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:24px}

.bf-faq{max-width:1056px;margin:0 auto;padding:clamp(40px,6vw,72px) 5vw}
.bf-faq h2{margin:0 0 18px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(26px,3vw,34px);letter-spacing:-.025em}

@media (max-width:980px){
  .bf-layout{grid-template-columns:1fr;gap:12px}
  .bf-sum{position:fixed;left:0;right:0;bottom:0;top:auto;z-index:50;padding:0;display:flex;flex-direction:column-reverse}
  .bf-sum-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:10px 5vw calc(10px + env(safe-area-inset-bottom));border-top:1px solid var(--line);background:#fff}
  .bf-sum-toggle{display:grid;grid-template-columns:auto;gap:0;border:0;background:none;padding:0;font:inherit;text-align:left;cursor:pointer;min-width:0}
  .bf-sum-toggle span{font-size:12px;color:var(--ink-60);font-weight:600}
  .bf-sum-toggle b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px;line-height:1.15}
  .bf-sum-toggle small{font-size:12.5px;font-weight:600;text-decoration:underline;text-underline-offset:3px}
  .bf-sum-go{flex:none;min-width:140px;padding:6px 22px;border:0;border-radius:999px;background:var(--lime);color:var(--ink);font:inherit;font-size:16px;font-weight:600;cursor:pointer}
  .bf-sum-go:disabled{opacity:.55}
  .bf-sum-body{display:none;border-radius:16px 16px 0 0;border-bottom:0;max-height:65vh}
  .bf-sum.open .bf-sum-body{display:block}
  .bf-sum-more-btn{display:none}
  .bf-actions{display:none}
  .bf-page{padding-bottom:76px}
  .am-cookie{bottom:calc(84px + env(safe-area-inset-bottom))}
}
@media (max-width:640px){
  .bf-tabs{scrollbar-width:none;scroll-snap-type:x proximity;padding-right:24px;mask-image:linear-gradient(90deg,#000 88%,transparent)}
  .bf-tabs::-webkit-scrollbar{display:none}
  .bf-tabs button{flex:none;scroll-snap-align:start}
  .bf-services,.bf-grid2{grid-template-columns:1fr}
  .bf-sizes{grid-template-columns:repeat(2,minmax(0,1fr))}
  .bf-inline{flex-direction:column}
  .bf-code{max-width:none}
  .bf-slotgroup{grid-template-columns:1fr;gap:6px}
  .bf-slotgroup>span{padding-top:0}
  .bf-review>div{grid-template-columns:1fr auto}
  .bf-review dt{grid-column:1 / -1}
  .bf-team{padding-right:16px}
  .bf-badge{position:static;justify-self:start;margin-bottom:4px}
  .bf-toggles,.bf-toggles.two{grid-template-columns:repeat(2,minmax(0,1fr))}
  .bf-stops{grid-template-columns:1fr;gap:14px}
}
@media (prefers-reduced-motion:reduce){
  .bf-track i,.bf-check,.bf-toggle{transition:none}
}
`;
