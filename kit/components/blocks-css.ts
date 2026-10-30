// Styles for src/components/Blocks.tsx. Same house rules as DcPage: lime only as a fill with ink on it,
// grey hovers, weight-500 display type and soft-shadow white cards as on the homepage. Included once in DcPage's BASE_CSS.

export const BLOCKS_CSS = `
.bk-sec{padding:clamp(40px,5.5vw,76px) 5vw}
.bk-sec-white{background:#fff;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.bk-sec + .bk-sec-white,.bk-sec-white + .bk-sec{border-top:0}
.bk-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 24px;margin:0 0 clamp(22px,3vw,32px)}
.bk-head h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(27px,3vw,36px);letter-spacing:-.025em;line-height:1.15;margin:0;text-wrap:balance}
.bk-head h2 .bk-soft{color:rgba(15,26,9,.5)}
.bk-head p{margin:12px 0 0;font-size:15.5px;line-height:1.6;color:var(--ink-68);max-width:56ch}
.bk-link{display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:600;white-space:nowrap;padding:6px 0}

/* Hero price bar */
.pb{background:#fff;border:1px solid rgba(15,26,9,.14);border-radius:20px;padding:18px;display:grid;gap:14px;margin:0 0 20px}
.pb-q{margin:0;font-size:14px;font-weight:600;color:var(--ink-72)}
.pb-chips{display:flex;flex-wrap:wrap;gap:8px}
.pb-chip{border:1px solid rgba(15,26,9,.16);background:#fff;border-radius:999px;padding:9px 14px;font-size:14.5px;font-weight:600;min-height:42px}
.pb-chip[aria-checked="true"]{background:var(--lime);border-color:rgba(15,26,9,.18)}
.pb-result{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding-top:14px;border-top:1px solid var(--line)}
.pb-label{display:block;font-size:12.5px;font-weight:600;color:var(--ink-60)}
.pb-figure{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(28px,3vw,36px);letter-spacing:-.03em;line-height:1.05;font-variant-numeric:tabular-nums}
.pb-sub{display:block;margin-top:3px;font-size:13.5px;color:var(--ink-68)}
.pb-note{margin:0;font-size:12.5px;line-height:1.5;color:var(--ink-60)}
.pb-note a{color:var(--link);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.pb-cta{display:flex;flex-wrap:wrap;gap:12px}
@keyframes bk-flip{from{opacity:.25;transform:translateY(5px)}to{opacity:1;transform:none}}
.bk-flip{display:inline-block;animation:bk-flip .3s ease}

/* Stat band */
.bk-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}
.bk-stats b{display:block;color:var(--accent);font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(26px,3vw,34px);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.bk-stats span{display:block;margin-top:6px;font-size:14px;line-height:1.4;color:var(--ink-68)}
.bk-stats a{display:block}
@media (max-width:720px){.bk-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* Rate tickets */
.bk-tickets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.bk-ticket{--notch:var(--band-a);position:relative;background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);padding:22px 22px 18px;display:flex;flex-direction:column}
.bk-sec-white .bk-ticket{--notch:#fff;background:var(--band-a)}
.bk-ticket::before,.bk-ticket::after{content:"";position:absolute;top:62%;width:18px;height:18px;border-radius:999px;background:var(--notch);border:1px solid var(--line)}
.bk-ticket::before{left:-10px;clip-path:inset(0 0 0 50%)}
.bk-ticket::after{right:-10px;clip-path:inset(0 50% 0 0)}
.bk-ticket.is-pick{background:var(--lime);border-color:rgba(15,26,9,.16)}
.bk-ticket-name{margin:0 0 10px;font-size:13.5px;font-weight:600;color:var(--ink-72)}
.bk-ticket-from{display:flex;align-items:baseline;gap:6px;margin:0}
.bk-ticket-from small{font-size:13px;color:var(--ink-60)}
.bk-ticket-fig{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:44px;line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.bk-ticket-terms{margin:6px 0 0;font-size:14px;color:var(--ink-68)}
.bk-ticket-foot{margin:22px 0 0;padding-top:14px;border-top:1px dashed rgba(15,26,9,.22);font-size:14px;line-height:1.5;color:rgba(15,26,9,.75)}
.bk-ticket.is-pick .bk-ticket-terms,.bk-ticket.is-pick .bk-ticket-name{color:rgba(15,26,9,.75)}
@media (max-width:860px){.bk-tickets{grid-template-columns:1fr}}

/* Never charged */
.bk-zero{display:grid;grid-template-columns:auto minmax(0,1fr);gap:clamp(20px,4vw,48px);align-items:center;margin-top:clamp(26px,4vw,40px)}
.bk-zero-fig{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(84px,11vw,140px);line-height:.85;letter-spacing:-.05em}
.bk-zero h3{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(20px,2.2vw,26px);letter-spacing:-.02em;margin:0 0 12px}
.bk-zero ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.bk-zero li{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(15,26,9,.16);background:#fff;border-radius:999px;padding:8px 14px;font-size:14px}
.bk-zero li s{color:var(--ink-60)}
.bk-zero li b{font-variant-numeric:tabular-nums}
@media (max-width:560px){.bk-zero{grid-template-columns:1fr}}

/* Worked example */
.bk-example{background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);padding:clamp(18px,2.6vw,26px);display:grid;gap:12px}
.bk-sec-white .bk-example{background:var(--band-a)}
.bk-example h3{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.02em}
.bk-example p{margin:0;font-size:15px;line-height:1.55;color:var(--ink-68)}
.bk-example .dc-table{min-width:0;font-size:15px}

/* Steps */
.bk-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;position:relative}
.bk-steps::before{content:"";position:absolute;top:22px;left:22px;right:calc(33.333% - 22px);height:0;border-top:2px dashed rgba(15,26,9,.18)}
.bk-step{position:relative}
.bk-step-n{position:relative;width:44px;height:44px;border-radius:999px;background:var(--lime);display:grid;place-items:center;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;margin:0 0 16px;border:4px solid var(--band-a);box-sizing:content-box;margin-left:-4px;margin-top:-4px}
.bk-sec-white .bk-step-n{border-color:#fff}
.bk-step h3{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px;letter-spacing:-.02em;margin:0 0 6px}
.bk-step p{margin:0;font-size:15px;line-height:1.55;color:var(--ink-68);max-width:34ch}
.bk-promise{display:flex;align-items:center;gap:12px;margin:28px 0 0;padding:14px 18px;border:1px solid var(--line);border-radius:16px;background:#fff;font-size:15px;font-weight:600}
.bk-sec-white .bk-promise{background:var(--band-a)}
.bk-promise small{display:block;font-weight:400;font-size:13.5px;color:var(--ink-68);margin-top:2px}
@media (max-width:760px){
  .bk-steps{grid-template-columns:1fr;gap:22px}
  .bk-steps::before{top:22px;bottom:22px;left:20px;right:auto;height:auto;border-top:0;border-left:2px dashed rgba(15,26,9,.18)}
  .bk-step{display:grid;grid-template-columns:44px 1fr;column-gap:16px}
  .bk-step-n{grid-row:span 2;margin-bottom:0}
}

/* Review cards */
.bk-reviews{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.bk-review{margin:0;background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);padding:22px;display:flex;flex-direction:column;gap:12px;min-width:0}
.bk-sec-white .bk-review{background:var(--band-a)}
.bk-review-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.bk-review blockquote{margin:0;font-size:15.5px;line-height:1.55}
.bk-review blockquote.is-clamped{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}
.bk-review-more{align-self:flex-start;background:none;border:0;padding:4px 0;font:inherit;font-size:14px;font-weight:600;color:var(--link);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.bk-review figcaption{margin-top:auto;display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600}
.bk-more{margin-top:10px}
.bk-more summary{display:inline-flex;align-items:center;min-height:44px;font-size:14.5px;font-weight:600;color:var(--link);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.bk-avatar{flex:none;width:38px;height:38px;border-radius:999px;display:grid;place-items:center;background:#fff;border:1px solid rgba(15,26,9,.16);font-weight:700;font-size:13.5px}
.bk-review figcaption small{display:block;font-weight:400;font-size:12.5px;color:var(--ink-60)}
.bk-review-g{margin-left:auto;width:18px;height:18px}
.bk-themes{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 20px;padding:0;list-style:none}
.bk-themes li{border:1px solid rgba(15,26,9,.16);border-radius:999px;padding:7px 13px;font-size:13.5px;font-weight:500;background:#fff}
.bk-standing{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.bk-standing-card{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);padding:12px 16px}
.bk-sec-white .bk-standing-card{background:var(--band-a)}
.bk-standing-card b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:30px;line-height:1}
.bk-standing-card span{font-size:13.5px;line-height:1.35;color:var(--ink-68)}
@media (max-width:980px){.bk-reviews{grid-template-columns:repeat(2,minmax(0,1fr))}}


/* Fleet */
.bk-fleet{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.bk-van{background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0}
.bk-sec-white .bk-van{background:var(--band-a)}
.bk-van h3{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:18px;letter-spacing:-.02em}
.bk-van p{margin:0;font-size:14.5px;line-height:1.5;color:var(--ink-68)}
.bk-van-svg{width:100%;height:auto;color:var(--ink)}
.bk-cap{display:grid;gap:5px}
.bk-cap-track{height:8px;border-radius:999px;background:rgba(15,26,9,.08);overflow:hidden}
.bk-cap-fill{display:block;height:100%;border-radius:999px;background:var(--lime);border-right:2px solid rgba(15,26,9,.5)}
.bk-cap small{font-size:12.5px;color:var(--ink-60)}
.bk-van-foot{margin-top:auto;padding-top:12px;border-top:1px solid var(--line);font-size:14px;font-weight:600}
@media (max-width:1100px){.bk-fleet{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* Services bento */
.bk-bento{display:grid;grid-template-columns:1.25fr 1fr 1fr;grid-template-rows:auto auto;gap:16px}
.bk-svc{position:relative;background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);overflow:hidden;display:flex;flex-direction:column;min-width:0;color:var(--ink);transition:background-color var(--t-state) ease}
.bk-svc.is-lead{grid-row:span 2}
.bk-svc-img{aspect-ratio:4/3;overflow:hidden;background:#eef5e5}
.bk-svc.is-lead .bk-svc-img{aspect-ratio:auto;flex:1;min-height:240px}
.bk-svc-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.bk-svc-body{padding:16px 18px 18px;display:grid;gap:6px}
.bk-svc h3{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.02em}
.bk-svc.is-lead h3{font-size:24px}
.bk-svc p{margin:0;font-size:14.5px;line-height:1.5;color:var(--ink-68)}
.bk-svc-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:6px;font-size:14px;font-weight:600}
.bk-svc-meta span:last-child{display:inline-flex;align-items:center;gap:4px}
.bk-svc-price{font-variant-numeric:tabular-nums;color:var(--ink-72);font-weight:500}
.bk-svc::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none}
.bk-svc-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.bk-svc-links a{border:1px solid rgba(15,26,9,.16);border-radius:999px;padding:6px 12px;font-size:13.5px;font-weight:600;background:#fff}
@media (hover:hover){
  a.bk-svc:hover{background:var(--grey)}
  a.bk-svc:hover .bk-svc-img img{transform:scale(1.03)}
  .bk-svc-links a:hover{background:var(--grey)}
}
@media (max-width:980px){
  .bk-bento{grid-template-columns:1fr 1fr}
  .bk-svc.is-lead{grid-row:auto;grid-column:span 2}
  .bk-svc.is-lead .bk-svc-img{aspect-ratio:16/9;flex:none}
}
@media (max-width:560px){
  .bk-bento{grid-template-columns:1fr 1fr;gap:10px}
  .bk-svc.is-lead{grid-column:span 2}
  .bk-svc:not(.is-lead) .bk-svc-body p{display:none}
  .bk-svc:not(.is-lead) h3{font-size:16px}
  .bk-svc-body{padding:12px 14px 14px}
}

/* Area check */
.bk-check{display:grid;gap:8px;max-width:520px}
.bk-check label{font-size:14px;font-weight:600}
.bk-check-row{display:flex;gap:8px}
.bk-check-row input{flex:1;min-width:0;height:50px;border:1px solid rgba(15,26,9,.2);border-radius:12px;padding:0 14px;font:inherit;font-size:16px;background:#fff;color:var(--ink)}
.bk-check-row input:focus{border-color:var(--ink);outline:none}
.bk-check-out{min-height:22px;margin:0;font-size:14.5px;line-height:1.5}
.bk-check-out a{color:var(--link);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.bk-pills{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0;padding:0}
.bk-pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:8px 14px 8px 10px;background:#fff;border:1px solid rgba(15,26,9,.14);font-size:14px;font-weight:500;transition:background-color var(--t-state) ease}
.bk-pill small{color:var(--ink-60);font-size:12.5px}
@media (hover:hover){a.bk-pill:hover{background:var(--grey);color:var(--ink)}}

/* Compare */
.bk-compare{width:100%;border-collapse:separate;border-spacing:0;font-size:15px;background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);overflow:hidden}
.bk-sec-white .bk-compare{background:var(--band-a)}
.bk-compare th,.bk-compare td{text-align:left;vertical-align:top;padding:14px 18px;border-bottom:1px solid var(--line)}
.bk-compare tr:last-child th,.bk-compare tr:last-child td{border-bottom:0}
.bk-compare thead th{font-size:12.5px;font-weight:600;color:var(--ink-72);background:rgba(15,26,9,.03)}
.bk-compare tbody th{font-weight:600;width:44%}
.bk-compare td{color:rgba(15,26,9,.8)}
.bk-compare td b{color:var(--ink)}
@media (max-width:640px){
  .bk-compare thead{display:none}
  .bk-compare tr{display:block;padding:14px 16px;border-bottom:1px solid var(--line)}
  .bk-compare tr:last-child{border-bottom:0}
  .bk-compare tbody th,.bk-compare td{display:block;width:auto;padding:0;border:0}
  .bk-compare td{margin-top:4px}
}

/* FAQ split */
.bk-faq{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(24px,5vw,72px);align-items:start}
.bk-faq-aside{position:sticky;top:96px;display:grid;gap:14px}
.bk-faq-aside h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(26px,3vw,38px);letter-spacing:-.03em;line-height:1.08;margin:0;text-wrap:balance}
.bk-faq-aside p{margin:0;font-size:16px;line-height:1.55;color:var(--ink-68)}
@media (max-width:860px){.bk-faq{grid-template-columns:1fr}.bk-faq-aside{position:static}}

/* Guide cards */
.bk-guides{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.bk-guide{display:flex;flex-direction:column;background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);overflow:hidden;color:var(--ink);transition:background-color var(--t-state) ease;min-width:0}
.bk-sec-white .bk-guide{background:var(--band-a)}
.bk-guide-img{aspect-ratio:4/3;overflow:hidden;background:#eef5e5}
.bk-guide-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.bk-guide-body{padding:16px 18px 18px;display:grid;gap:6px}
.bk-guide-cat{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-72)}
.bk-guide h3{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:18px;line-height:1.25;letter-spacing:-.02em;text-wrap:balance}
.bk-guide small{font-size:13px;color:var(--ink-60)}
@media (hover:hover){a.bk-guide:hover{background:var(--grey);color:var(--ink)}a.bk-guide:hover .bk-guide-img img{transform:scale(1.03)}}
@media (max-width:860px){.bk-guides{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* Strip of what we move */
.bk-strip{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center;font-size:14.5px;font-weight:500;color:rgba(15,26,9,.75)}
.bk-strip span + span::before{content:"·";margin-right:18px;color:rgba(15,26,9,.3)}

/* Pricing page: billing timeline (the rest of the page styles itself in pages/pricing.tsx) */


.bt{background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);padding:clamp(18px,2.6vw,26px);display:grid;gap:12px}
.bt-h{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px;letter-spacing:-.02em}
.bt-p{margin:0;font-size:15.5px;line-height:1.55;color:var(--ink-72);max-width:62ch}
.bt-track{list-style:none;margin:6px 0 0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
.bt-track li{height:44px;border-radius:10px;display:grid;place-items:center;font-size:12.5px;font-weight:600;border:1px solid var(--line-strong)}
.bt-track li.is-min{background:var(--lime)}
.bt-track li.is-step{background:#fff;border-style:dashed}
.bt-legend{display:flex;flex-wrap:wrap;gap:8px 22px;font-size:13.5px;color:var(--ink-72)}
.bt-legend span{display:inline-flex;align-items:center;gap:8px}
.bt-legend i{width:14px;height:14px;border-radius:4px;border:1px solid var(--line-strong);display:inline-block}
.bt-legend i.is-min{background:var(--lime)}
.bt-legend i.is-step{background:#fff;border-style:dashed}


/* Quote form and callback picker */
.qf{background:#fff;border:1px solid rgba(15,26,9,.05);border-radius:20px;box-shadow:var(--card-shadow);padding:clamp(18px,2.6vw,28px);display:grid;gap:18px}
.qf h3{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(20px,2.2vw,24px);letter-spacing:-.02em}
.qf form{display:grid;gap:18px}
.qf-group{display:grid;gap:8px}
.qf-label{margin:0;font-size:14px;font-weight:600;color:var(--ink-72)}
.qf-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.qf-box{display:grid;gap:14px;padding:14px;border:1px solid var(--line);border-radius:14px}
.qf-field{display:grid;gap:6px;min-width:0}
.qf-input{width:100%;box-sizing:border-box;font:inherit;font-size:16px;color:var(--ink);background:#fff;border:1px solid rgba(15,26,9,.2);border-radius:12px;padding:12px 14px;min-height:50px;resize:none;overflow:hidden}
.qf-input:focus{outline:none;border-color:var(--ink)}
.qf-input::placeholder{color:rgba(15,26,9,.45)}
.qf-input[aria-invalid="true"]{border-color:#b4532a;background:var(--peach)}
.qf-input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px #fff inset;-webkit-text-fill-color:var(--ink)}
.qf-err{margin:0;font-size:14px;line-height:1.45;color:var(--err);font-weight:500}
.qf-why,.qf-next{margin:0;font-size:13.5px;line-height:1.5;color:var(--ink-68)}
.qf-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px 18px}
.qf-copied{font-size:14px;font-weight:600;color:var(--link);min-width:60px}
.qf-done p{margin:0;font-size:15.5px;line-height:1.55;color:var(--ink-72);max-width:60ch}
.qf-done{background:var(--green-soft);border-color:rgba(15,26,9,.12)}
@media (max-width:640px){.qf-two{grid-template-columns:1fr}}

/* Phone rails: one card wide with the next one peeking. Kept last so it beats each grid's own column rules. */
@media (max-width:640px){
  .bk-rail{display:grid;grid-auto-flow:column;grid-auto-columns:84%;grid-template-columns:none;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding:0 5vw;gap:12px;margin:0 -5vw;padding:2px 5vw 10px;scrollbar-width:none}
  .bk-rail::-webkit-scrollbar{display:none}
  .bk-rail > *{scroll-snap-align:start}
}

@media (prefers-reduced-motion:reduce){.bk-flip{animation:none}.bk-svc-img img,.bk-guide-img img{transition:none}}
`;
