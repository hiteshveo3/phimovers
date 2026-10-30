// Design-system CSS for the staff dashboard (tokens copied from kit/components/DcPage.tsx BASE_CSS,
// shell like the office shell). Injected by app/admin/layout.tsx, so it exists only while /admin is mounted
// and can never leak into the public pages.

export const ADMIN_FONT_LINKS = [
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500&family=Instrument+Sans:wght@400;500;600;700&display=swap",
];

export const ADMIN_CSS = `
:root{--lime:#9fe870;--lime-hover:#93dd63;--lime-soft:rgba(159,232,112,.4);--ink:#0f1a09;--ink-72:rgba(15,26,9,.72);--ink-68:rgba(15,26,9,.68);--ink-60:rgba(15,26,9,.6);--grey:#eef5e5;--band-a:#f2f8e9;--band-b:#fff;--link:#2f7a18;--forest:#163300;--line:rgba(15,26,9,.1);--line-strong:rgba(15,26,9,.18);--hover:rgba(15,26,9,.07);--peach:#fdebe3;--green-soft:#e3f4d2;--focus:rgba(15,26,9,.55);--card-shadow:0 1px 2px rgba(15,26,9,.04),0 12px 32px -20px rgba(15,26,9,.22);--err:#8c1f1f;--amber:#fdf0c8;--amber-ink:#6b4d00;color-scheme:light}
html,body{margin:0;padding:0}
body{background:var(--band-a)!important;color:var(--ink)!important;font-family:"Instrument Sans",system-ui,sans-serif;-webkit-tap-highlight-color:transparent}
.sh,.as-page,.sh *,.as-page *{box-sizing:border-box}
.sh,.as-page{font-family:"Instrument Sans",system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.sh button,.sh a,.sh input,.sh select,.sh textarea,.as-page button,.as-page input{font:inherit}
.sh a,.as-page a{color:inherit;text-decoration:none}
.sh img,.as-page img{filter:none}
.sh :where(a,button,summary,input,select,textarea):focus-visible,.as-page :where(a,button,input):focus-visible{outline:2px solid var(--focus);outline-offset:3px}
::selection{background:rgba(159,232,112,.6);color:var(--ink)}

/* ---------- shell ---------- */
.sh{min-height:100dvh;background:var(--band-a);color:var(--ink);font-size:16px}
.sh-top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 18px;background:rgba(242,248,233,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 1px 0 var(--line)}
.sh-brand{display:flex;flex-direction:column;color:var(--ink);text-decoration:none;line-height:1.1}
.sh-brand b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.02em}
.sh-brand small{margin-top:2px;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-68)}
.sh-end{margin-left:auto;display:flex;gap:8px;align-items:center}
.sh-icon{position:relative;display:grid;place-items:center;width:48px;height:48px;border:0;border-radius:999px;background:#fff;color:var(--ink);cursor:pointer;box-shadow:0 1px 2px rgba(15,26,9,.06)}
.sh-dot{position:absolute;top:-2px;right:-2px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:var(--forest);color:var(--lime);font-size:11px;font-weight:700;display:grid;place-items:center}
.sh-main{padding:18px 18px 110px;max-width:1240px;margin:0 auto}
.sh-tabs{position:fixed;left:0;right:0;bottom:0;z-index:40;display:grid;grid-template-columns:repeat(5,1fr);gap:2px;padding:8px 6px calc(8px + env(safe-area-inset-bottom));background:#fff;box-shadow:0 -1px 0 var(--line)}
.sh-tab{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:58px;border:0;border-radius:16px;background:none;color:var(--ink-68);font-size:13px;font-weight:700;cursor:pointer;text-decoration:none}
.sh-tab[aria-current=page]{background:var(--green-soft);color:var(--forest)}
.sh-tab .sh-dot{top:4px;right:calc(50% - 26px);min-width:18px;height:18px;font-size:10.5px}
.sh-side{display:none}
.sh-sheet{position:fixed;inset:0;z-index:60}
.sh-sheet>button{position:absolute;inset:0;width:100%;border:0;background:rgba(15,26,9,.4)}
.sh-sheet-panel{position:absolute;left:0;right:0;bottom:0;padding:14px 16px calc(16px + env(safe-area-inset-bottom));border-radius:24px 24px 0 0;background:#fff;display:grid;gap:8px}
.sh-sheet-panel h2{margin:4px 0 6px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px}
.sh-row{display:flex;align-items:center;gap:14px;width:100%;min-height:56px;padding:0 16px;border:0;border-radius:16px;background:var(--grey);color:var(--ink);font-weight:600;text-align:left;cursor:pointer;text-decoration:none}
.sh-row[aria-current=page]{background:var(--green-soft);color:var(--forest)}
.sh-row .sh-count{margin-left:auto;min-width:22px;height:22px;padding:0 7px;border-radius:999px;background:var(--forest);color:var(--lime);font-size:12px;font-weight:700;display:grid;place-items:center}
@media (min-width:1024px){
  .sh-top,.sh-tabs,.sh-sheet{display:none}
  .sh-side{display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:40;width:264px;padding:20px 14px 16px;background:#fff;box-shadow:1px 0 0 var(--line);transition:width .3s cubic-bezier(.2,.7,.2,1),padding .3s}
  .sh{padding-left:264px;transition:padding-left .3s cubic-bezier(.2,.7,.2,1)}
  .sh-main{padding:32px 36px 64px}
  .sh-side-top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 6px 14px}
  .sh-toggle{display:grid;place-items:center;flex:none;width:36px;height:36px;border:0;border-radius:12px;background:var(--grey);color:var(--ink-68);cursor:pointer;transition:background-color .2s,color .2s}
  .sh-toggle:hover{background:var(--green-soft);color:var(--forest)}
  .sh-side nav{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;margin:0 -4px;padding:0 4px;scrollbar-width:thin;scrollbar-color:transparent transparent;transition:scrollbar-color .3s}
  .sh-side nav:hover{scrollbar-color:rgba(15,26,9,.22) transparent}
  .sh-group{margin-bottom:6px}
  .sh-group-h{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:36px;padding:0 12px;border:0;border-radius:10px;background:none;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-60);cursor:pointer;transition:color .2s,background-color .2s}
  .sh-group-h:hover{color:var(--ink);background:rgba(15,26,9,.04)}
  .sh-group-h svg{transition:transform .3s cubic-bezier(.2,.7,.2,1)}
  .sh-group.is-closed .sh-group-h svg{transform:rotate(-90deg)}
  .sh-group-body{display:grid;grid-template-rows:1fr;transition:grid-template-rows .3s cubic-bezier(.2,.7,.2,1)}
  .sh-group.is-closed .sh-group-body{grid-template-rows:0fr}
  .sh-group-list{min-height:0;overflow:hidden;display:grid;gap:3px;padding-top:2px}
  .sh-side .sh-row{min-height:44px;padding:0 14px;border-radius:14px;background:none;font-size:15.5px;font-weight:600;color:var(--ink-68);transition:background-color .2s,color .2s}
  .sh-side .sh-row:hover{background:var(--grey);color:var(--ink)}
  .sh-side .sh-row[aria-current=page]{background:var(--green-soft);color:var(--forest)}
  .sh-side-foot{margin-top:12px;flex:none}
  .sh-who-card{display:flex;align-items:center;gap:8px;padding:10px;border-radius:18px;background:var(--grey)}
  .sh-who-card i{display:grid;place-items:center;flex:none;width:34px;height:34px;border-radius:999px;background:#fff;color:var(--link)}
  .sh-who-card span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}
  .sh-who-card button{flex:none;height:34px;padding:0 12px;border:0;border-radius:999px;background:#fff;font-size:13.5px;font-weight:600;color:var(--ink);cursor:pointer}
  .sh-side.is-rail{width:84px;padding:20px 12px 16px}
  .sh.is-rail{padding-left:84px}
  .sh-side.is-rail .sh-brand,.sh-side.is-rail .sh-group-h,.sh-side.is-rail .sh-lbl,.sh-side.is-rail .sh-who-card span,.sh-side.is-rail .sh-who-card button,.sh-side.is-rail .sh-count{display:none}
  .sh-side.is-rail .sh-side-top{justify-content:center;padding:0 0 14px}
  .sh-side.is-rail .sh-group-body{grid-template-rows:1fr}
  .sh-side.is-rail .sh-group{margin-bottom:10px;border-top:1px solid var(--line);padding-top:10px}
  .sh-side.is-rail .sh-group:first-child{border-top:0;padding-top:0}
  .sh-side.is-rail .sh-row{justify-content:center;padding:0;width:52px;height:52px;margin:0 auto;min-height:0}
  .sh-side.is-rail .sh-who-card{justify-content:center;padding:8px;background:none}
  .sh-side.is-rail .sh-who-card i{background:var(--grey)}
  .sh-side.is-rail .sh-side-foot{margin-top:auto}
}
@media print{.sh-top,.sh-tabs,.sh-side,.sh-sheet,.ad-noprint{display:none!important}.sh{padding:0!important;background:#fff}}

/* ---------- page basics ---------- */
.ad{display:grid;gap:18px;min-width:0}
.ad h1{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(26px,6vw,34px);letter-spacing:-.02em;line-height:1.15}
.ad-eyebrow{margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--link)}
.ad-sub{margin:4px 0 0;font-size:15.5px;color:var(--ink-68)}
.ad-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px}
.ad-head-actions{display:flex;flex-wrap:wrap;gap:8px}
.ad-card{background:#fff;border-radius:20px;padding:18px;box-shadow:var(--card-shadow);min-width:0}
.ad-card h2{margin:0 0 12px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.01em}
.ad-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 12px}
.ad-card-head h2{margin:0}
.ad-link{border:0;background:none;padding:0;min-height:40px;display:inline-flex;align-items:center;gap:4px;font-size:14.5px;font-weight:600;color:var(--link);cursor:pointer}
.ad-muted{color:var(--ink-68)}
.ad-small{font-size:13.5px}
.ad-two{display:grid;gap:14px}
@media (min-width:560px){.ad-two{grid-template-columns:1fr 1fr}}
.ad-cols{display:grid;gap:18px;align-items:start}
@media (min-width:1000px){.ad-cols{grid-template-columns:minmax(0,3fr) minmax(0,2fr)}.ad-cols.even{grid-template-columns:1fr 1fr}}
.ad-banner{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:16px;background:var(--amber);color:var(--amber-ink);font-size:15px;line-height:1.45}
.ad-banner.err{background:#f9dcdc;color:var(--err)}
.ad-banner.info{background:var(--green-soft);color:var(--forest)}
.ad-banner svg{flex:none;margin-top:2px}

/* ---------- buttons, badges ---------- */
.ad-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 20px;border-radius:999px;border:1px solid rgba(15,26,9,.14);background:#fff;font-size:15.5px;font-weight:600;color:var(--ink)!important;cursor:pointer;white-space:nowrap;transition:background-color .16s,transform .16s}
.ad-btn:active{transform:scale(.98)}
.ad-btn:hover{background:var(--grey)}
.ad-btn.lime{background:var(--lime);border-color:transparent}
.ad-btn.lime:hover{background:var(--lime-hover)}
.ad-btn.dark{background:var(--forest);border-color:transparent;color:var(--lime)!important}
.ad-btn.dark:hover{background:#0f2400}
.ad-btn.sm{min-height:38px;padding:0 14px;font-size:14px}
.ad-btn.quiet{border-color:transparent;background:none;color:var(--ink-68)!important}
.ad-btn.quiet:hover{background:var(--hover)}
.ad-btn.danger{color:var(--err)!important;border-color:rgba(140,31,31,.25);background:#fdf3f3}
.ad-btn.block{width:100%}
.ad-btn:disabled,.ad-btn[aria-disabled=true]{opacity:.5;cursor:default;pointer-events:none}
.ad-icon-btn{display:grid;place-items:center;width:40px;height:40px;border-radius:999px;border:1px solid rgba(15,26,9,.12);background:#fff;color:var(--ink);cursor:pointer;flex:none}
.ad-icon-btn.lime{background:var(--lime);border-color:transparent}
.ad-icon-btn:hover{background:var(--grey)}
.ad-icon-btn.lime:hover{background:var(--lime-hover)}
.ad-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;font-size:12.5px;font-weight:700;white-space:nowrap;background:var(--grey)}
.ad-badge.st-new{background:var(--lime);color:var(--forest)}
.ad-badge.st-contacted{background:var(--green-soft);color:var(--forest)}
.ad-badge.st-quoted{background:var(--amber);color:var(--amber-ink)}
.ad-badge.st-booked{background:var(--forest);color:var(--lime)}
.ad-badge.st-lost{background:#ececea;color:var(--ink-68)}
.ad-badge.urgent,.ad-badge.sla-late{background:#f9dcdc;color:var(--err)}
.ad-badge.sla-warn{background:var(--amber);color:var(--amber-ink)}
.ad-badge.sla-ok{background:var(--green-soft);color:var(--forest)}
.ad-badge.iv-paid{background:var(--lime);color:var(--forest)}
.ad-badge.iv-sent{background:var(--green-soft);color:var(--forest)}
.ad-badge.iv-part{background:var(--amber);color:var(--amber-ink)}
.ad-badge.iv-overdue{background:#f9dcdc;color:var(--err)}
.ad-badge.iv-draft,.ad-badge.iv-void{background:#ececea;color:var(--ink-68)}
.ad-badge.bk-pending{background:var(--lime);color:var(--forest)}
.ad-badge.bk-confirmed{background:var(--green-soft);color:var(--forest)}
.ad-badge.bk-live{background:var(--amber);color:var(--amber-ink)}
.ad-badge.bk-done,.ad-badge.bk-paid{background:var(--forest);color:var(--lime)}
.ad-badge.bk-cancelled{background:#ececea;color:var(--ink-68)}
.ad-badge.bk-unpaid{background:#f9dcdc;color:var(--err)}

/* ---------- chips, segmented, inputs ---------- */
.ad-chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px 0;margin:0 -18px;padding-left:18px;padding-right:18px}
.ad-chips::-webkit-scrollbar{display:none}
@media (min-width:1024px){.ad-chips{flex-wrap:wrap;overflow:visible;margin:0;padding:2px 0}}
.ad-chip{flex:none;min-height:42px;padding:0 15px;border-radius:999px;border:1px solid rgba(15,26,9,.16);background:#fff;font-size:14.5px;font-weight:600;color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.ad-chip[aria-pressed=true]{background:var(--ink);border-color:var(--ink);color:#fff}
.ad-chip.red[aria-pressed=true]{background:var(--err);border-color:var(--err)}
.ad-chip small{font-size:12px;font-weight:700;opacity:.7}
.ad-seg{display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;padding:4px;border-radius:999px;background:var(--grey)}
.ad-seg button{min-height:40px;padding:0 16px;border:0;border-radius:999px;background:none;font-size:14.5px;font-weight:600;color:var(--ink-68);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}
.ad-seg button[aria-pressed=true]{background:#fff;color:var(--ink);box-shadow:0 1px 2px rgba(15,26,9,.12)}
.ad-seg.full{display:grid;width:100%}
.ad-field{display:grid;gap:6px;margin:0 0 14px;min-width:0}
.ad-field:last-child{margin-bottom:0}
.ad-field>span,.ad-label{font-size:14.5px;font-weight:600}
.ad-input,.ad-select,.ad-textarea{width:100%;min-height:48px;padding:0 14px;border-radius:14px;border:1px solid rgba(15,26,9,.2);background:#fff;font-size:16px;color:var(--ink)}
.ad-textarea{min-height:88px;padding:12px 14px;line-height:1.5;resize:vertical}
.ad-input:focus,.ad-select:focus,.ad-textarea:focus{outline:none;border-color:var(--ink)}
.ad-input::placeholder,.ad-textarea::placeholder{color:rgba(15,26,9,.4)}
.ad-search{position:relative}
.ad-search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--ink-60);pointer-events:none}
.ad-search .ad-input{padding-left:44px;border-radius:999px;min-height:50px}
.ad-inline{display:flex;gap:8px}
.ad-inline .ad-input{flex:1}
.ad-check{display:flex;align-items:center;gap:10px;min-height:44px;font-weight:600;cursor:pointer}
.ad-check input{width:20px;height:20px;accent-color:var(--forest)}

/* ---------- KPI, pipeline, charts ---------- */
.ad-kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (min-width:900px){.ad-kpis{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}}
.ad-kpi{display:grid;gap:4px;align-content:start;padding:16px;border-radius:20px;background:#fff;box-shadow:var(--card-shadow);text-align:left;color:var(--ink)!important;min-width:0;transition:box-shadow .2s,transform .15s}
a.ad-kpi:hover{box-shadow:0 10px 24px -14px rgba(22,51,0,.45)}
a.ad-kpi:active{transform:scale(.98)}
.ad-kpi i{display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:var(--green-soft);color:var(--forest);margin-bottom:6px;font-style:normal}
.ad-kpi.warn i{background:#f9dcdc;color:var(--err)}
.ad-kpi.dark{background:var(--forest);color:#fff!important}
.ad-kpi.dark i{background:rgba(159,232,112,.2);color:var(--lime)}
.ad-kpi.dark span,.ad-kpi.dark small{color:rgba(255,255,255,.75)}
.ad-kpi b{font-size:28px;font-weight:600;line-height:1.1;font-variant-numeric:tabular-nums}
.ad-kpi span{font-size:14px;color:var(--ink-68)}
.ad-kpi small{font-size:12.5px;color:var(--ink-60);display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.ad-pipe{display:flex;height:16px;border-radius:999px;overflow:hidden;background:var(--grey);gap:2px}
.ad-pipe a{display:block;min-width:6px;transition:opacity .2s}
.ad-pipe a:hover{opacity:.75}
.ad-legend{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:14px}
@media (max-width:560px){.ad-legend{grid-template-columns:repeat(3,minmax(0,1fr))}}
.ad-legend a{display:grid;gap:2px;padding:8px 10px;border-radius:14px;background:var(--band-a);color:var(--ink)!important}
.ad-legend b{font-size:20px;font-weight:600;font-variant-numeric:tabular-nums}
.ad-legend span{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--ink-68)}
.ad-legend i{width:9px;height:9px;border-radius:999px;display:inline-block}
.c-new{background:var(--lime)}.c-contacted{background:#b9d99c}.c-quoted{background:#f0c75a}.c-booked{background:var(--forest)}.c-lost{background:#c9cac4}
.ad-chart{width:100%;height:auto;display:block}
.ad-chart text{font-family:"Instrument Sans",system-ui,sans-serif;font-size:11px;fill:var(--ink-60)}
.ad-chart .bar{fill:var(--lime);transition:fill .2s}
.ad-chart .bar:hover{fill:#7fd24c}
.ad-chart .bar-booked{fill:var(--forest)}
.ad-chart .grid{stroke:rgba(15,26,9,.08);stroke-width:1}
.ad-rank{display:grid;gap:12px;margin:0;padding:0;list-style:none}
.ad-rank li{display:grid;gap:6px}
.ad-rank div{display:flex;justify-content:space-between;gap:10px;font-size:15px}
.ad-rank div span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.ad-rank div span:last-child{font-variant-numeric:tabular-nums;color:var(--ink-68)}
.ad-rank u{display:block;height:8px;border-radius:999px;background:var(--grey);text-decoration:none;overflow:hidden}
.ad-rank u b{display:block;height:100%;border-radius:999px;background:var(--lime)}

/* ---------- lead lists ---------- */
.ad-list{display:grid;gap:10px}
.ad-list.flush{gap:0}
.ad-lead{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 12px;align-items:center;padding:14px;border-radius:18px;background:var(--band-a);color:var(--ink)!important}
.ad-card .ad-lead{background:var(--band-a)}
.ad-lead.on-grey{background:#fff;box-shadow:var(--card-shadow)}
.ad-lead:hover{background:var(--green-soft)}
.ad-lead-main{min-width:0;display:grid;gap:3px}
.ad-lead-main strong{font-size:16.5px;font-weight:600;overflow-wrap:anywhere;display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.ad-lead-main span{font-size:14px;color:var(--ink-68);overflow-wrap:anywhere}
.ad-lead-side{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
.ad-lead-acts{display:flex;gap:6px;align-items:center;grid-column:1/-1;flex-wrap:wrap}
.ad-lead-row{display:grid;gap:8px;padding:14px;border-radius:20px;background:#fff;box-shadow:var(--card-shadow)}
.ad-lead-row .ad-lead{padding:0;background:none}
.ad-lead-row .ad-lead:hover{background:none}
.ad-empty{display:grid;justify-items:center;gap:6px;padding:32px 16px;text-align:center}
.ad-empty i{display:grid;place-items:center;width:52px;height:52px;border-radius:18px;background:var(--green-soft);color:var(--forest);font-style:normal;margin-bottom:6px}
.ad-empty b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px}
.ad-empty p{margin:0 0 8px;max-width:340px;color:var(--ink-68);font-size:15px}
.ad-loading{padding:36px 0;text-align:center;color:var(--ink-68)}

/* ---------- kanban ---------- */
.ad-board{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(272px,1fr);gap:12px;overflow-x:auto;padding:2px 2px 14px;margin:0 -18px;padding-left:18px;padding-right:18px;scroll-snap-type:x proximity;align-items:start}
@media (min-width:1024px){.ad-board{margin:0;padding-left:2px;padding-right:2px;grid-auto-columns:minmax(0,1fr)}}
.ad-col{display:grid;gap:10px;align-content:start;padding:12px;border-radius:22px;background:rgba(255,255,255,.6);scroll-snap-align:start;min-width:0}
.ad-col-h{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 4px}
.ad-col-h b{display:flex;align-items:center;gap:8px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px}
.ad-col-h i{width:10px;height:10px;border-radius:999px;display:inline-block}
.ad-col-h span{min-width:26px;height:26px;padding:0 8px;border-radius:999px;background:#fff;font-size:13px;font-weight:700;display:grid;place-items:center}
.ad-kcard{display:grid;gap:6px;padding:14px;border-radius:18px;background:#fff;box-shadow:var(--card-shadow)}
.ad-kcard a.t{display:block;font-weight:600;font-size:16px;overflow-wrap:anywhere;color:var(--ink)!important}
.ad-kcard p{margin:0;font-size:13.5px;color:var(--ink-68);overflow-wrap:anywhere}
.ad-kcard-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.ad-kcard-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.ad-mini{display:inline-flex;align-items:center;justify-content:center;gap:4px;min-height:34px;padding:0 12px;border-radius:999px;border:1px solid rgba(15,26,9,.14);background:#fff;font-size:13px;font-weight:600;color:var(--ink)!important;cursor:pointer}
.ad-mini:hover{background:var(--grey)}
.ad-mini.lime{background:var(--lime);border-color:transparent}
.ad-mini.lime:hover{background:var(--lime-hover)}
.ad-mini:disabled{opacity:.5}
.ad-col-empty{padding:14px 8px;text-align:center;font-size:14px;color:var(--ink-60)}

/* ---------- calendar ---------- */
.ad-week{display:grid;gap:10px}
@media (min-width:1760px){.ad-week{grid-template-columns:repeat(7,minmax(0,1fr));align-items:start}}
.ad-day{display:grid;gap:8px;align-content:start;padding:12px;border-radius:20px;background:#fff;box-shadow:var(--card-shadow);min-width:0}
.ad-day.today{box-shadow:0 0 0 2px var(--lime),var(--card-shadow)}
.ad-day.empty{background:rgba(255,255,255,.55);box-shadow:none}
.ad-day-h{display:flex;align-items:center;gap:10px}
@media (min-width:1760px){.ad-day-h{flex-direction:column;align-items:flex-start;gap:2px}}
.ad-date{display:grid;place-content:center;width:46px;height:46px;border-radius:14px;background:var(--band-a);line-height:1.05;text-align:center;flex:none}
.ad-day.today .ad-date{background:var(--lime)}
.ad-date b{font-size:18px;font-weight:700}
.ad-date small{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-68)}
@media (min-width:1760px){.ad-date{width:auto;height:auto;background:none;display:flex;align-items:baseline;gap:6px;place-content:unset;text-align:left}.ad-day.today .ad-date{background:none}.ad-date b{font-size:20px}}
.ad-job{display:grid;gap:4px;padding:12px;border-radius:16px;background:var(--band-a)}
.ad-job a.t{font-weight:600;font-size:15.5px;overflow-wrap:anywhere;color:var(--ink)!important}
.ad-job p{margin:0;font-size:13.5px;color:var(--ink-68);overflow-wrap:anywhere}
.ad-job-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.ad-weeknav{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ad-weeknav b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:18px;min-width:0;flex:1}

/* ---------- lead detail ---------- */
.ad-detail{display:grid;gap:16px;max-width:980px}
@media (min-width:1000px){.ad-detail.wide{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);max-width:none;align-items:start}.ad-detail.wide>.ad-main{display:grid;gap:16px}.ad-detail.wide>.ad-side{display:grid;gap:16px}}
.ad-detail .ad-main,.ad-detail .ad-side{display:grid;gap:16px;min-width:0}
.ad-dl{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin:0;font-size:15px}
.ad-dl dt{color:var(--ink-68)}
.ad-dl dd{margin:0;font-weight:600;overflow-wrap:anywhere}
.ad-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ad-actions .ad-btn{padding:0 10px}
.ad-tl{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.ad-tl li{padding:12px 14px;border-radius:16px;background:var(--band-a);font-size:15px;line-height:1.5;overflow-wrap:anywhere}
.ad-tl li.note{background:var(--green-soft)}
.ad-tl small{display:block;margin-top:4px;font-size:12.5px;color:var(--ink-60)}
.ad-tpl{display:grid;gap:8px}
.ad-tpl-list{display:flex;flex-wrap:wrap;gap:8px}
.ad-tpl-box{margin:0;padding:12px 14px;border-radius:16px;background:var(--band-a);font:inherit;font-size:14.5px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
.ad-sticky{position:fixed;left:0;right:0;bottom:calc(74px + env(safe-area-inset-bottom));z-index:35;padding:8px 14px;background:rgba(255,255,255,.97);box-shadow:0 -1px 0 var(--line)}
.ad-sticky .ad-actions{max-width:520px;margin:0 auto;grid-template-columns:repeat(4,minmax(0,1fr))}
.ad-sticky .ad-btn{min-height:44px;font-size:14px;gap:6px}
@media (min-width:1024px){.ad-sticky{display:none}}

/* ---------- toast, sheets ---------- */
.ad-toast{position:fixed;left:12px;right:12px;bottom:calc(86px + env(safe-area-inset-bottom));z-index:65;margin:0 auto;max-width:440px;display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:22px;background:var(--forest);color:#fff;box-shadow:0 18px 40px -16px rgba(15,26,9,.6);animation:ad-in .25s ease}
@media (min-width:1024px){.ad-toast{left:auto;right:24px;bottom:24px;margin:0}}
.ad-toast i{display:grid;place-items:center;flex:none;width:40px;height:40px;border-radius:13px;background:var(--lime);color:var(--forest);font-style:normal}
.ad-toast small{display:block;font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--lime)}
.ad-toast b{display:block;font-size:17px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ad-toast span{display:block;font-size:13.5px;color:rgba(255,255,255,.75);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ad-toast a{display:inline-block;margin-top:6px;font-weight:700;color:var(--lime)!important;text-decoration:underline;text-underline-offset:3px}
.ad-toast button{border:0;background:none;color:rgba(255,255,255,.7);cursor:pointer;padding:2px}
@keyframes ad-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.ad-sheet{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-end;justify-content:center}
.ad-sheet>button.bg{position:absolute;inset:0;width:100%;border:0;background:rgba(15,26,9,.4)}
.ad-sheet-panel{position:relative;width:100%;max-width:520px;max-height:86dvh;overflow-y:auto;padding:18px 18px calc(18px + env(safe-area-inset-bottom));border-radius:24px 24px 0 0;background:#fff;display:grid;gap:12px}
@media (min-width:640px){.ad-sheet{align-items:center}.ad-sheet-panel{border-radius:24px}}
.ad-sheet-panel h2{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:22px}

/* ---------- settings ---------- */
.ad-set-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.ad-set-list li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:14px;background:var(--band-a);font-size:15px}
.ad-set-list li span:first-child{color:var(--ink-68)}
.ad-set-list li b{font-weight:600;overflow-wrap:anywhere;text-align:right}
.ad-code{margin:0;padding:12px 14px;border-radius:14px;background:var(--forest);color:var(--lime);font-size:13px;overflow-x:auto}
.ad-switch{display:flex;align-items:center;justify-content:space-between;gap:14px}
.ad-switch p{margin:0}

/* ---------- invoices ---------- */
.iv{display:grid;gap:16px;min-width:0}
.iv-card{background:#fff;border-radius:20px;padding:18px;box-shadow:var(--card-shadow)}
.iv-card h3{margin:0 0 14px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.01em}
.iv-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (min-width:900px){.iv-stats{grid-template-columns:repeat(4,minmax(0,1fr))}}
.iv-stat{display:grid;gap:4px;text-align:left;padding:16px;border:0;border-radius:20px;background:#fff;box-shadow:var(--card-shadow);color:var(--ink);cursor:pointer}
.iv-stat b{font-size:24px;font-weight:600;line-height:1.15;font-variant-numeric:tabular-nums}
.iv-stat span{font-size:13.5px;color:var(--ink-68)}
.iv-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;width:100%;padding:16px 18px;border:0;border-radius:20px;background:#fff;box-shadow:var(--card-shadow);text-align:left;color:var(--ink);cursor:pointer}
.iv-item strong{font-size:17px;font-weight:600;overflow-wrap:anywhere}
.iv-item small{font-size:14px;color:var(--ink-68)}
.iv-item .amt{font-size:18px;font-weight:600;text-align:right;white-space:nowrap}
.iv-item .row2{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:8px}
.iv-line{display:grid;gap:12px;padding:16px;border-radius:16px;background:var(--band-a)}
.iv-line-top{display:flex;gap:8px;align-items:center}
.iv-money{display:grid;gap:6px;padding:16px 18px;border-radius:20px;background:var(--band-a)}
.iv-money div{display:flex;justify-content:space-between;gap:12px;font-size:16px}
.iv-total{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:16px 18px;border-radius:20px;background:var(--lime);color:var(--ink)}
.iv-total b{font-size:26px;font-weight:600;font-variant-numeric:tabular-nums}
.iv-pay{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:var(--band-a);font-size:15.5px}
.iv-hist{display:grid;margin:0;padding:0;list-style:none}
.iv-hist li{display:grid;gap:2px;padding:10px 0;border-bottom:1px solid var(--line);font-size:15px}
.iv-hist li:last-child{border-bottom:0}
.iv-hist small{font-size:13px;color:var(--ink-68)}
.iv-bar{position:fixed;left:0;right:0;bottom:calc(74px + env(safe-area-inset-bottom));z-index:36;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px 14px;background:rgba(255,255,255,.97);box-shadow:0 -1px 0 var(--line)}
@media (min-width:1024px){.iv-bar{position:sticky;bottom:12px;left:auto;right:auto;border-radius:22px;box-shadow:var(--card-shadow);background:#fff;grid-template-columns:repeat(3,1fr)}}
.iv-grid{display:grid;gap:16px}
@media (min-width:1180px){.iv-grid{grid-template-columns:minmax(0,1fr) minmax(380px,460px);gap:28px;align-items:start}.iv-preview{position:sticky;top:24px}}
.iv-preview{display:none}
.iv-preview.is-open{display:block}
.iv-preview-modal{position:fixed;inset:0;z-index:70;overflow-y:auto;background:var(--band-a);padding:16px 16px 140px}
.iv-preview-top{display:flex;gap:10px;align-items:center;justify-content:space-between;margin:0 0 12px}
@media (min-width:1180px){.iv-preview{display:block}.iv-preview-top{display:none}.iv-preview-modal{position:static;padding:0;background:none;overflow:visible}}
.inv-doc{background:#fff;color:var(--ink);border-radius:20px;padding:22px;font-size:14.5px;line-height:1.5;box-shadow:var(--card-shadow)}
.inv-doc h4{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:22px;letter-spacing:-.02em}
.inv-doc .hd{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding-bottom:14px;border-bottom:3px solid var(--lime)}
.inv-doc .hd small{display:block;color:var(--ink-60)}
.inv-doc table{width:100%;border-collapse:collapse;margin-top:16px}
.inv-doc th{padding:8px 0;border-bottom:1px solid var(--ink);font-size:11px;letter-spacing:.08em;text-transform:uppercase;text-align:left}
.inv-doc td{padding:10px 0;border-bottom:1px solid rgba(15,26,9,.1);vertical-align:top}
.inv-doc .n{text-align:right;white-space:nowrap;padding-left:12px}
.inv-doc .dl{display:flex;justify-content:space-between;gap:12px;padding:3px 0}
.inv-doc .dl span:first-child{color:var(--ink-60)}
.inv-doc .due{margin-top:14px;padding:14px;border-radius:16px;background:var(--forest);color:#fff;display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.inv-doc .due b{font-size:24px;color:var(--lime)}
.inv-doc .note{margin-top:12px;font-size:13px;color:var(--ink-68);white-space:pre-wrap}

/* ---------- login ---------- */
.as-page{min-height:100dvh;display:grid;place-items:center;padding:28px 20px;background:var(--band-a)}
.as-box{width:100%;max-width:420px;display:grid;gap:18px}
.as-brand{color:var(--ink);text-decoration:none}
.as-brand b{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:22px;letter-spacing:-.02em}
.as-brand small{display:block;margin-top:2px;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-68)}
.as-box h1{margin:12px 0 0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:30px;letter-spacing:-.02em;line-height:1.15}
.as-box p.lead{margin:6px 0 0;color:var(--ink-68);font-size:15.5px}
.as-sep{display:flex;align-items:center;gap:12px;color:var(--ink-60);font-size:12.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.as-sep:before,.as-sep:after{content:"";flex:1;height:1px;background:var(--line-strong)}
.as-pass{position:relative}
.as-pass button{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:none;min-height:36px;padding:0 10px;font-size:13.5px;font-weight:700;color:var(--ink-68);cursor:pointer}
.as-foot{display:flex;gap:8px;font-size:13.5px;color:var(--ink-68);align-items:flex-start;line-height:1.5}
.as-foot svg{flex:none;margin-top:2px}
.ad-card .ad-lead-row{background:var(--band-a);box-shadow:none}
.ad-card .ad-kcard{background:var(--band-a);box-shadow:none}
@media (min-width:1180px){.lg-hide{display:none!important}}
.as-input:-webkit-autofill{-webkit-text-fill-color:var(--ink)!important;box-shadow:0 0 0 1000px #fff inset!important}
`;
