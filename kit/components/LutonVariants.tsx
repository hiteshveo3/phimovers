import { TONES, type ArtStyle, type Tone } from './Illustrations';

// Six versions of the Luton van side view, in the line and blueprint styles. No text, no shadows.
// The drawing follows a real Luton: the box runs forward over the cab roof (the Luton peak), the rear
// axle sits under the box with a long rear overhang, and the front wheel sits in an arch under the cab.

const INK = '#0f1a09';

type Fill = 'white' | 'lime' | 'grey';
type Livery = { box: Fill; peak: Fill; cab: Fill; band?: boolean; ribs?: boolean; lift?: boolean; rounded?: boolean; hub?: Fill };

const fillOf = (f: Fill, t: Tone) => (f === 'lime' ? t.accent : f === 'white' ? t.body : t.soft);
const sty = (t: Tone) => ({ stroke: INK, strokeWidth: t.stroke, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const });
const fine = (t: Tone) => ({ stroke: INK, strokeWidth: 1.2, strokeLinecap: 'round' as const, strokeDasharray: t.dash ?? '0', opacity: 0.45, fill: 'none' });

// Ground is y=236. Rear of the box x=28, front of the peak x=306, front of the cab x=366.
const BOX_SQUARE = 'M34 60 H300 Q306 60 306 66 V112 H250 V190 H34 Q28 190 28 184 V66 Q28 60 34 60 Z';
const BOX_ROUND = 'M42 60 H280 Q306 60 306 86 V104 Q306 112 298 112 H250 V190 H42 Q28 190 28 176 V74 Q28 60 42 60 Z';
const PEAK_SQUARE = 'M250 60 H300 Q306 60 306 66 V112 H250 Z';
const PEAK_ROUND = 'M250 60 H280 Q306 60 306 86 V104 Q306 112 298 112 H250 Z';
const CAB = 'M250 112 H302 L334 158 Q338 162 344 163 L358 165 Q366 166 366 174 V208 H356 A26 26 0 0 0 304 208 H250 Z';

function Wheel({ cx, t, hub }: { cx: number; t: Tone; hub: Fill }) {
  const s = sty(t);
  const solid = t.body !== 'none';
  return (
    <g>
      <circle cx={cx} cy={215} r={21} fill={solid ? INK : 'none'} {...s} />
      <circle cx={cx} cy={215} r={11} fill={solid ? '#fff' : 'none'} {...s} strokeWidth={t.stroke * 0.8} />
      <circle cx={cx} cy={215} r={4.5} fill={solid ? (hub === 'lime' ? t.accent : INK) : 'none'} stroke={INK} strokeWidth={1.2} />
    </g>
  );
}

function LutonSide({ t, l, blueprint, ground = true }: { t: Tone; l: Livery; blueprint: boolean; ground?: boolean }) {
  const s = sty(t);
  const f = fine(t);
  const cabFill = fillOf(l.cab, t);
  const glass = t.body === 'none' ? 'none' : l.cab === 'lime' ? '#fff' : t.soft;
  return (
    <>
      {ground && <line x1="10" y1="236" x2="390" y2="236" stroke={t.ground} strokeWidth={t.stroke} strokeLinecap="round" />}
      {ground && blueprint && (
        <g {...f} opacity={0.6}>
          <path d="M28 252 H366 M28 246 V258 M366 246 V258" />
          <path d="M384 60 V236 M378 60 H390 M378 236 H390" />
        </g>
      )}

      {/* chassis rail under the box */}
      <rect x="34" y="190" width="218" height="10" rx="3" fill={t.soft} {...s} />
      {l.lift && (
        <g>
          <rect x="16" y="146" width="10" height="58" rx="3" fill={t.body} {...s} />
          <path d="M26 156 h-10 M26 194 h-10" {...f} />
        </g>
      )}

      {/* the box, including the peak over the cab */}
      <path d={l.rounded ? BOX_ROUND : BOX_SQUARE} fill={fillOf(l.box, t)} {...s} />
      {l.peak !== l.box && <path d={l.rounded ? PEAK_ROUND : PEAK_SQUARE} fill={fillOf(l.peak, t)} {...s} />}
      {l.band && <rect x="28" y="156" width="222" height="16" fill={t.accent} {...s} />}
      {l.ribs && <path d="M72 64 V186 M116 64 V186 M160 64 V186 M204 64 V186" {...f} />}
      <rect x="31" y="172" width="6" height="12" rx="2" fill={t.body === 'none' ? 'none' : INK} stroke={INK} strokeWidth={1.2} />

      {/* cab under the peak */}
      <path d={CAB} fill={cabFill} {...s} />
      <path d="M263 123 H298 L317 151 H263 Z" fill={glass} {...s} strokeWidth={t.stroke * 0.8} />
      <path d="M298 204 H258 V118 H300 L322 150 V182" fill="none" {...s} strokeWidth={t.stroke * 0.8} />
      <path d="M265 166 h10" fill="none" {...s} strokeWidth={t.stroke * 0.8} />
      <path d="M330 150 L338 144" fill="none" {...s} strokeWidth={t.stroke * 0.8} />
      <rect x="336" y="127" width="9" height="18" rx="3" fill={t.body} {...s} strokeWidth={t.stroke * 0.8} />
      <rect x="356" y="172" width="9" height="10" rx="3" fill={t.body} {...s} strokeWidth={t.stroke * 0.8} />
      <rect x="352" y="196" width="18" height="12" rx="3" fill={t.soft} {...s} />
      <rect x="262" y="208" width="28" height="5" rx="2" fill={t.soft} {...s} strokeWidth={t.stroke * 0.8} />

      <Wheel cx={104} t={t} hub={l.hub ?? 'grey'} />
      <Wheel cx={330} t={t} hub={l.hub ?? 'grey'} />
    </>
  );
}

export const LUTON_VARIANTS: { id: string; label: string; livery: Livery }[] = [
  { id: 'v1', label: '1 · Classic: white box, lime cab', livery: { box: 'white', peak: 'white', cab: 'lime' } },
  { id: 'v2', label: '2 · Lime band along the box', livery: { box: 'white', peak: 'white', cab: 'white', band: true } },
  { id: 'v3', label: '3 · Lime peak over the cab', livery: { box: 'white', peak: 'lime', cab: 'white' } },
  { id: 'v4', label: '4 · Panelled box with tail lift', livery: { box: 'white', peak: 'white', cab: 'lime', ribs: true, lift: true } },
  { id: 'v5', label: '5 · Rounded peak, lime hubs', livery: { box: 'white', peak: 'white', cab: 'lime', rounded: true, hub: 'lime' } },
  { id: 'v6', label: '6 · Lime box, white cab', livery: { box: 'lime', peak: 'lime', cab: 'white' } },
];

export function LutonArt({ variant, style }: { variant: string; style: ArtStyle }) {
  // Thin lines in both styles; the line style keeps its white and lime fills.
  const t: Tone = style === 'line' ? { ...TONES.line, stroke: 1.6 } : TONES.blueprint;
  const v = LUTON_VARIANTS.find((x) => x.id === variant) ?? LUTON_VARIANTS[0];
  return (
    <svg viewBox="0 0 400 270" role="img" aria-label={`Luton van, side view, ${v.label}`} width="100%" style={{ display: 'block', height: 'auto' }}>
      <rect width="400" height="270" fill={style === 'blueprint' ? '#fff' : '#f2f8e9'} />
      <LutonSide t={t} l={v.livery} blueprint={style === 'blueprint'} />
    </svg>
  );
}

/** The line-style Luton for use inside other scenes. Rear of the box lands at x; wheels stay on y=236. */
export function LutonOnly({ x, scale, variant = 'v1' }: { x: number; scale: number; variant?: string }) {
  const t: Tone = { ...TONES.line, stroke: 1.6 / scale };
  const v = LUTON_VARIANTS.find((item) => item.id === variant) ?? LUTON_VARIANTS[0];
  return (
    <g transform={`translate(${x - 28 * scale} ${236 * (1 - scale)}) scale(${scale})`}>
      <LutonSide t={t} l={v.livery} blueprint={false} ground={false} />
    </g>
  );
}
