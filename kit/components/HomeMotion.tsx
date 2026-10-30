import { Fragment, useEffect, type CSSProperties } from 'react';
import { Ico } from './Ico';
import { ArrowRight as ArrowRightIcon } from 'iconsax-reactjs';

// Homepage motion kit: words that rise in, odometer numbers, scroll reveals and an arrow that swaps on
// hover. Motion only where it explains something; no marquee, no magnetic buttons. CSS driven; the hook only
// flips data attributes. Without JavaScript, or with reduced motion, everything is simply visible.

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Splits a line into words that rise in one after another. `start` continues the count across nodes. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mo-word" style={{ '--w': start + i } as Vars}>{w}</span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Digits roll up from zero like an odometer. `view` waits until the number scrolls into sight.
 * The real digit stays in the text (transparent) and the rolling column is CSS generated content,
 * so headings and search engines read "£90", not a run of 0–9.
 */
export function Odo({ value, view = false }: { value: string; view?: boolean }) {
  let n = 0;
  return (
    <span className={view ? 'mo-odo mo-odo--view' : 'mo-odo'}>
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="mo-odo-d">
            <span className="mo-odo-end">{ch}</span>
            <span className="mo-odo-col" aria-hidden="true" style={{ '--d': Number(ch), '--i': n++ } as Vars} />
          </span>
        ) : (
          ch
        ),
      )}
    </span>
  );
}

/** Arrow in a circle: the arrow slides out and a new one slides in on hover. */
export function CtaMark({ size = 16 }: { size?: number }) {
  const a = <Ico icon={ArrowRightIcon} size={size} aria-hidden="true" />;
  return (
    <span className="mo-cta-mark" aria-hidden="true">
      <span>{a}</span>
      <span>{a}</span>
    </span>
  );
}

/** Wires up reveals, section heads and odometers inside the homepage. */
export function useHomeMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('js-reveal');
    const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal], .mo-head, .mo-lead, .mo-odo--view, [data-seen-watch]')];
    const show = (el: HTMLElement) => {
      if (el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'in');
      else { el.removeAttribute('data-armed'); el.setAttribute('data-seen', ''); }
    };
    let io: IntersectionObserver | undefined;
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(show);
    } else {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { show(e.target as HTMLElement); io?.unobserve(e.target); } }),
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      );
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) { show(el); return; }
        if (el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'out');
        else el.setAttribute('data-armed', '');
        io?.observe(el);
      });
    }

    return () => {
      io?.disconnect();
      root.classList.remove('js-reveal');
    };
  }, []);
}

export const MOTION_CSS = `
:root{--ease-soft:cubic-bezier(.2,.7,.2,1)}
.dc-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.mo-word{display:inline-block}
.mo-odo{display:inline-flex;align-items:baseline}
.mo-odo-d{position:relative;display:inline-block;clip-path:inset(-.06em -.3em)}
.mo-odo-end{color:transparent}
.mo-odo-col{position:absolute;inset:0 0 auto;text-align:center;line-height:1;transform:translateY(calc(var(--d) * -1em))}
.mo-odo-col::before{content:"0\\A 1\\A 2\\A 3\\A 4\\A 5\\A 6\\A 7\\A 8\\A 9";white-space:pre;display:block}
.mo-cta-mark{display:inline-grid;place-items:center;overflow:hidden;width:30px;height:30px;border-radius:999px;flex:none}
.mo-cta-mark>*{grid-area:1/1;display:grid;place-items:center;transition:translate .4s var(--ease-soft),opacity .25s}
.mo-cta-mark>:last-child{opacity:0;translate:-14px}
.mo-btn:hover .mo-cta-mark>:first-child{opacity:0;translate:14px}
.mo-btn:hover .mo-cta-mark>:last-child{opacity:1;translate:0}
.mo-link{text-decoration:none;background:linear-gradient(var(--ink),var(--ink)) no-repeat 0 100%/0% 1.5px,linear-gradient(rgba(15,26,9,.3),rgba(15,26,9,.3)) no-repeat 0 100%/100% 1.5px;transition:background-size .4s var(--ease-soft);padding-bottom:2px}
.mo-link:hover{background-size:100% 1.5px,100% 1.5px}
@keyframes mo-word{0%{opacity:0;transform:translateY(.45em)}}
@keyframes mo-lead{0%{opacity:0;transform:translateY(10px)}}
@keyframes mo-odo{0%{transform:translateY(0)}}
@keyframes ih-rise{0%{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes ih-pop{0%{opacity:0;transform:scale(.6)}70%{opacity:1;transform:scale(1.08)}to{opacity:1;transform:none}}
@keyframes ih-flip{0%{opacity:0;transform:rotateX(90deg)}to{opacity:1;transform:none}}
@keyframes ih-draw{to{stroke-dashoffset:0}}
@keyframes ih-grow{0%{transform:scaleY(0)}}
@media (prefers-reduced-motion:no-preference){
  .mo-title .mo-word{animation:mo-word .7s var(--ease-soft) both;animation-delay:calc(80ms + min(var(--w,0),14) * 45ms)}
  .mo-head[data-armed] .mo-word,.mo-lead[data-armed]{opacity:0}
  .mo-head[data-seen] .mo-word{animation:mo-word .7s var(--ease-soft) both;animation-delay:calc(min(var(--w,0),14) * 45ms)}
  .mo-lead[data-seen]{animation:mo-lead .7s var(--ease-soft) .18s both}
  .mo-odo-col{animation:mo-odo 1.5s var(--ease-soft) calc(.35s + var(--i,0) * .14s) backwards}
  .mo-odo--view .mo-odo-col{animation:none}
  .mo-odo--view[data-seen] .mo-odo-col{animation:mo-odo 1.4s var(--ease-soft) calc(.1s + var(--i,0) * .14s) backwards}
  .js-reveal [data-reveal=out]{opacity:0;transform:translateY(18px)}
  .js-reveal [data-reveal=in]{animation:ih-rise .7s var(--ease-soft) both;animation-delay:calc(var(--i,0) * 70ms)}
  .js-reveal [data-reveal=out] .icon-pop{opacity:0;transform:scale(.6)}
  .js-reveal [data-reveal=in] .icon-pop{animation:ih-pop .7s var(--ease-soft) .15s both}
  .flip-in{display:inline-block;animation:ih-flip .6s var(--ease-soft) both}
  .rise-in{animation:ih-rise .5s var(--ease-soft) both}
}
`;
