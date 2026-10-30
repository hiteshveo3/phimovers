import type { ReactNode } from 'react';

// Illustration drafts for the design lab (/design-lab/). Four moving subjects drawn in three styles so
// the owner can pick one. Palette is Alpha's: lime and ink with white and grey, no shadows.

export type ArtStyle = 'line' | 'blueprint';
export type ArtSubject = 'van' | 'hoist' | 'stairs' | 'sofa';

const INK = '#0f1a09';
const LIME = '#9fe870';

export type Tone = { body: string; accent: string; soft: string; stroke: number; ground: string; label: boolean; dash?: string };

export const TONES: Record<ArtStyle, Tone> = {
  line: { body: '#ffffff', accent: LIME, soft: '#eef5e5', stroke: 1.6, ground: INK, label: false },
  blueprint: { body: 'none', accent: 'none', soft: 'none', stroke: 1.6, ground: INK, label: true, dash: '5 4' },
};

export function Wheel({ cx, cy, t }: { cx: number; cy: number; t: Tone }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={20} fill={t.stroke ? '#fff' : INK} stroke={INK} strokeWidth={t.stroke || 0} />
      <circle cx={cx} cy={cy} r={7} fill={t.stroke ? INK : '#fff'} />
    </g>
  );
}

function Van({ t }: { t: Tone }) {
  const s = { stroke: INK, strokeWidth: t.stroke, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  return (
    <>
      <line x1="20" y1="236" x2="380" y2="236" stroke={t.ground} strokeWidth={t.stroke || 2} strokeLinecap="round" />
      <rect x="40" y="70" width="210" height="140" rx={t.stroke ? 10 : 12} fill={t.body} {...s} />
      <path d="M250 110 h58 q10 0 16 8 l26 38 q4 6 4 14 v40 h-104 z" fill={t.accent} {...s} />
      <path d="M262 122 h42 q6 0 10 6 l16 26 h-68 z" fill={t.stroke ? '#fff' : '#fff'} {...s} />
      <rect x="40" y="198" width="304" height="14" rx="4" fill={t.soft} {...s} />
      <line x1="70" y1="100" x2="220" y2="100" stroke={INK} strokeWidth={t.stroke ? 2 : 1.5} strokeDasharray={t.dash ?? '0'} opacity=".5" />
      <line x1="70" y1="120" x2="190" y2="120" stroke={INK} strokeWidth={t.stroke ? 2 : 1.5} strokeDasharray={t.dash ?? '0'} opacity=".5" />
      <Wheel cx={110} cy={216} t={t} />
      <Wheel cx={290} cy={216} t={t} />
    </>
  );
}

type Sty = { stroke: string; strokeWidth: number; strokeLinejoin: 'round'; strokeLinecap: 'round' };
const styOf = (t: Tone): Sty => ({ stroke: INK, strokeWidth: t.stroke, strokeLinejoin: 'round', strokeLinecap: 'round' });

/** A mover standing on the ground or a step. Origin is the feet. Hands reach a point in scene coordinates. */
export function Person({ x, y, hand, t, flip = 1 }: { x: number; y: number; hand?: [number, number]; t: Tone; flip?: 1 | -1 }) {
  const limb = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const s = styOf(t);
  const [hx, hy] = hand ?? [x - flip * 8, y - 36];
  return (
    <g>
      <path d={`M${x - 5} ${y - 38} L${x - 7} ${y} M${x + 5} ${y - 38} L${x + 7} ${y}`} {...limb} />
      <path d={`M${x - 13} ${y} h12 M${x + 1} ${y} h12`} {...limb} />
      <rect x={x - 13} y={y - 70} width="26" height="34" rx="9" fill={t.accent} {...s} />
      <circle cx={x} cy={y - 84} r="11" fill="#fff" {...s} />
      <path d={`M${x - 11} ${y - 87} q11 -14 22 0 z`} fill={INK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={`M${x} ${y - 62} L${hx} ${hy}`} {...limb} />
    </g>
  );
}

function Hoist({ t }: { t: Tone }) {
  const s = styOf(t);
  const limb = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  // Ladder rails run from the ground up to the sill of the lower window; the platform stays level on them.
  const px = 190;
  const py = 244 - ((px - 100) / 150) * 96;
  return (
    <>
      <line x1="20" y1="244" x2="380" y2="244" stroke={t.ground} strokeWidth={t.stroke || 2} strokeLinecap="round" />
      <rect x="250" y="24" width="120" height="220" fill={t.soft} {...s} />
      <rect x="274" y="48" width="64" height="56" fill="#fff" {...s} />
      <rect x="274" y="136" width="64" height="64" fill="#fff" {...s} />
      <path d="M306 136 v64 M274 168 h64" fill="none" stroke={INK} strokeWidth={t.stroke ? 1.6 : 1.2} opacity=".5" />
      <path d="M100 244 L254 148 M130 244 L254 166" fill="none" {...s} strokeWidth={t.stroke ? t.stroke + 0.5 : 4} stroke={INK} />
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((k) => (
        <path key={k} d={`M${100 + 154 * k} ${244 - 96 * k} L${130 + 124 * k} ${244 - 78 * k}`} {...limb} strokeWidth={t.stroke ? 2 : 2.5} />
      ))}
      <rect x="86" y="236" width="56" height="10" rx="4" fill={t.accent} {...s} />
      {/* level platform on the rails with the wrapped sofa standing on it */}
      <rect x={px - 40} y={py - 6} width="80" height="8" rx="3" fill="#fff" {...s} />
      <rect x={px - 30} y={py - 50} width="60" height="44" rx="12" fill={t.accent} {...s} />
      <rect x={px - 40} y={py - 36} width="16" height="30" rx="7" fill={t.accent} {...s} />
      <rect x={px + 24} y={py - 36} width="16" height="30" rx="7" fill={t.accent} {...s} />
      <rect x={px - 24} y={py - 30} width="48" height="24" rx="8" fill="#fff" {...s} />
      <path d={`M${px} ${py - 50} v44`} fill="none" stroke={INK} strokeWidth={t.stroke ? 2 : 1.5} opacity=".6" />
      {/* one mover on the ground, one at the window, each on solid footing */}
      <Person x={64} y={244} hand={[84, 220]} t={t} flip={1} />
      <g>
        <circle cx="306" cy="162" r="10" fill="#fff" {...s} />
        <path d="M295 159 q11 -14 22 0 z" fill={INK} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="294" y="174" width="26" height="26" rx="8" fill={t.accent} {...s} />
        <path d="M296 182 L262 176" {...limb} />
      </g>
    </>
  );
}

function Stairs({ t }: { t: Tone }) {
  const s = styOf(t);
  // Steps: floor at y=236, then risers of 30 every 50. Both movers stand on a step top, facing up the stairs.
  const loX = 178, loY = 176;   // lower mover on step 2
  const hiX = 248, hiY = 146;   // upper mover on step 3
  const cx = (loX + hiX) / 2 + 8, cy = (loY + hiY) / 2 - 58;
  const angle = -(Math.atan(30 / 50) * 180) / Math.PI;
  return (
    <>
      <path d="M20 236 H110 V206 H160 V176 H210 V146 H260 V116 H310 V86 H380 V236 Z" fill={t.soft} {...s} />
      <Person x={loX} y={loY} hand={[cx - 18, cy + 8]} t={t} />
      <Person x={hiX} y={hiY} hand={[cx + 24, cy - 6]} t={t} flip={-1} />
      <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
        <rect x="-34" y="-22" width="68" height="44" rx="5" fill={t.accent} {...s} />
        <path d="M-6 -22 v44 M6 -22 v44" fill="none" stroke={INK} strokeWidth={t.stroke ? 2 : 1.5} opacity=".6" />
      </g>
    </>
  );
}

function Sofa({ t }: { t: Tone }) {
  const s = { stroke: INK, strokeWidth: t.stroke, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  return (
    <>
      <line x1="20" y1="244" x2="380" y2="244" stroke={t.ground} strokeWidth={t.stroke || 2} strokeLinecap="round" />
      <rect x="44" y="104" width="200" height="104" rx="22" fill={t.accent} {...s} />
      <rect x="30" y="140" width="40" height="88" rx="16" fill={t.accent} {...s} />
      <rect x="218" y="140" width="40" height="88" rx="16" fill={t.accent} {...s} />
      <rect x="62" y="156" width="164" height="60" rx="14" fill="#fff" {...s} />
      {[78, 112, 146].map((y) => <path key={y} d={`M40 ${y} Q150 ${y - 14} 262 ${y + 8}`} fill="none" stroke={INK} strokeWidth={t.stroke ? 1.6 : 1.2} opacity=".55" strokeDasharray={t.dash ?? '0'} />)}
      <rect x="288" y="180" width="76" height="64" rx="6" fill={t.body} {...s} />
      <line x1="288" y1="204" x2="364" y2="204" {...s} strokeWidth={t.stroke ? 2 : 1.5} />
      <rect x="302" y="128" width="58" height="52" rx="6" fill={t.body} {...s} />
      <line x1="302" y1="148" x2="360" y2="148" {...s} strokeWidth={t.stroke ? 2 : 1.5} />
    </>
  );
}

const SUBJECTS: Record<ArtSubject, (p: { t: Tone }) => ReactNode> = { van: Van, hoist: Hoist, stairs: Stairs, sofa: Sofa };

export const SUBJECT_LABEL: Record<ArtSubject, string> = { van: 'Luton van', hoist: 'Sofa hoisting', stairs: 'Stair carry', sofa: 'Wrapped sofa and boxes' };

export function Art({ subject, style, label }: { subject: ArtSubject; style: ArtStyle; label?: string }) {
  const t = TONES[style];
  const Draw = SUBJECTS[subject];
  return (
    <svg viewBox="0 0 400 270" role="img" aria-label={label ?? SUBJECT_LABEL[subject]} width="100%" style={{ display: 'block', height: 'auto' }}>
      <rect width="400" height="270" fill={style === 'blueprint' ? '#fff' : '#f2f8e9'} />
      <Draw t={t} />
    </svg>
  );
}
