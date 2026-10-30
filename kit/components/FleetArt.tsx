import { LutonOnly } from './LutonVariants';

// Fleet side views in the site's final illustration style: thin ink lines, white bodies, one lime band.
// All four share one viewBox and scale, so the vans keep their real relative size. Ground is y=236.

const INK = '#0f1a09';
const LIME = '#9fe870';
const GREY = '#eef5e5';

const ln = { stroke: INK, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const faint = { stroke: INK, strokeWidth: 1.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, opacity: 0.45, fill: 'none' };

export type FleetKind = 'small' | 'lwb' | 'luton' | 'two';

function Wheels({ at }: { at: number[] }) {
  return (
    <>
      {at.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={215} r="21" fill={INK} />
          <circle cx={cx} cy={215} r="11" fill="#fff" {...ln} />
          <circle cx={cx} cy={215} r="4" fill={INK} />
        </g>
      ))}
    </>
  );
}

/** Cab front shared by both panel vans: glass, mirror, headlight, bumper. */
function CabFront() {
  return (
    <>
      <path d="M290 174 h10" fill="none" {...ln} />
      <path d="M328 146 L336 140" fill="none" {...ln} />
      <rect x="334" y="124" width="8" height="16" rx="3" fill="#fff" {...ln} />
      <rect x="360" y="172" width="8" height="9" rx="3" fill="#fff" {...ln} />
      <rect x="354" y="198" width="18" height="11" rx="3" fill={GREY} {...ln} />
    </>
  );
}

function SmallVan() {
  return (
    <g transform="translate(-56 0)">
      <path d="M148 110 H300 Q306 110 310 116 L334 152 L362 162 Q370 165 370 174 V210 H356 A24 24 0 0 0 308 210 H206 A24 24 0 0 0 158 210 H140 V118 Q140 110 148 110 Z" fill="#fff" {...ln} />
      <rect x="140" y="152" width="190" height="12" fill={LIME} {...ln} />
      <path d="M288 120 H303 L322 146 H288 Z" fill={GREY} {...ln} />
      <path d="M284 116 V206 M222 116 V206 M222 128 H284" {...faint} />
      <rect x="140" y="128" width="5" height="14" rx="2" fill={INK} />
      <CabFront />
      <Wheels at={[182, 332]} />
    </g>
  );
}

/** Long-wheelbase high-roof van: longer and taller than the small van, same cab. */
function LwbVan() {
  return (
    <g transform="translate(-21 0)">
      <path d="M78 92 H290 Q300 92 304 102 L334 152 L362 162 Q370 165 370 174 V210 H356 A24 24 0 0 0 308 210 H156 A24 24 0 0 0 108 210 H70 V100 Q70 92 78 92 Z" fill="#fff" {...ln} />
      <rect x="70" y="152" width="260" height="12" fill={LIME} {...ln} />
      <path d="M286 112 H302 L322 146 H286 Z" fill={GREY} {...ln} />
      <path d="M282 98 V206 M200 98 V206 M200 112 H282" {...faint} />
      <rect x="70" y="118" width="5" height="16" rx="2" fill={INK} />
      <CabFront />
      <Wheels at={[132, 332]} />
    </g>
  );
}

export function FleetArt({ kind }: { kind: FleetKind }) {
  return (
    <svg className="bk-van-svg" viewBox="10 50 380 196" aria-hidden="true">
      <path d="M20 236 H380" fill="none" {...ln} />
      {kind === 'small' && <SmallVan />}
      {kind === 'lwb' && <LwbVan />}
      {kind === 'luton' && (
        <>
          {/* tail lift folded up against the rear doors */}
          <rect x="19" y="146" width="10" height="58" rx="3" fill="#fff" {...ln} />
          <path d="M29 156 h-10 M29 194 h-10" {...faint} />
          <LutonOnly x={31} scale={1} variant="v2" />
        </>
      )}
      {kind === 'two' && (
        <>
          <LutonOnly x={22} scale={0.5} variant="v2" />
          <LutonOnly x={206} scale={0.5} variant="v2" />
        </>
      )}
    </svg>
  );
}
