import React, {createContext, useContext} from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from '../config/theme';
import {clamp01, mix, Pt} from '../lib/time';

/* ------------------------------------------------------------------ */
/* Reveal context: every Ink element draws its outline, then fills.    */
/* ------------------------------------------------------------------ */

const RevealCtx = createContext(1);

/** Sets the reveal progress (0..1) for all Ink inside. */
export const Reveal: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <RevealCtx.Provider value={p}>{children}</RevealCtx.Provider>
);

/** Maps the parent reveal into a sub-range, for staggering parts of a drawing. */
export const Stagger: React.FC<{at: [number, number]; children: React.ReactNode}> = ({at, children}) => {
  const p = useContext(RevealCtx);
  return <RevealCtx.Provider value={clamp01((p - at[0]) / (at[1] - at[0]))}>{children}</RevealCtx.Provider>;
};

export const useReveal = () => useContext(RevealCtx);

type InkProps = {
  d: string;
  fill?: string;
  stroke?: string;
  sw?: number;
  at?: [number, number];
  opacity?: number;
  fillOpacity?: number;
  dash?: string;
};

/** The core line-art element: an ink outline that draws on, then a flat fill that settles in. */
export const Ink: React.FC<InkProps> = ({
  d,
  fill = 'none',
  stroke = COLORS.line,
  sw = 2.4,
  at = [0, 1],
  opacity = 1,
  fillOpacity = 1,
  dash,
}) => {
  const base = useContext(RevealCtx);
  const local = clamp01((base - at[0]) / (at[1] - at[0]));
  if (local <= 0) return null;
  const sp = clamp01(local / 0.6);
  const fp = clamp01((local - 0.3) / 0.7);
  return (
    <g opacity={opacity}>
      {fill !== 'none' && <path d={d} fill={fill} opacity={fp * fillOpacity} />}
      {stroke !== 'none' && sw > 0 && (
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={dash ?? (sp < 1 ? '1 1' : undefined)}
          strokeDashoffset={dash ? undefined : 1 - sp}
          opacity={dash ? sp : clamp01(sp * 8)}
        />
      )}
    </g>
  );
};

/** An outlined limb: ink stroke with a coloured core (arms, legs of figures, straps). */
export const Limb: React.FC<{d: string; color: string; w?: number; at?: [number, number]}> = ({
  d,
  color,
  w = 15,
  at = [0, 1],
}) => {
  const base = useContext(RevealCtx);
  const local = clamp01((base - at[0]) / (at[1] - at[0]));
  if (local <= 0) return null;
  const sp = clamp01(local / 0.7);
  const common = {
    d,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    pathLength: 1,
    strokeDasharray: sp < 1 ? '1 1' : undefined,
    strokeDashoffset: 1 - sp,
  };
  return (
    <g opacity={clamp01(sp * 8)}>
      <path {...common} stroke={COLORS.line} strokeWidth={w + 5} />
      <path {...common} stroke={color} strokeWidth={w} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Shape helpers (return path data so everything can "draw on").       */
/* ------------------------------------------------------------------ */

export const rectD = (x: number, y: number, w: number, h: number, r = 0) =>
  r <= 0
    ? `M${x},${y} H${x + w} V${y + h} H${x} Z`
    : `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;

export const ellipseD = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy} Z`;

export const circleD = (cx: number, cy: number, r: number) => ellipseD(cx, cy, r, r);

export const polyD = (pts: Pt[], close = false) =>
  pts.length === 0
    ? ''
    : `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')}${close ? ' Z' : ''}`;

/** Catmull-Rom spline through control points, sampled densely. */
export const spline = (ctrl: Pt[], samplesPerSeg = 24): Pt[] => {
  const out: Pt[] = [];
  const P = (i: number) => ctrl[Math.max(0, Math.min(ctrl.length - 1, i))];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let s = 0; s < samplesPerSeg; s++) {
      const t = s / samplesPerSeg, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(ctrl[ctrl.length - 1]);
  return out;
};

/** Resample a polyline to exactly n points evenly spaced by arc length (for morphing). */
export const resample = (pts: Pt[], n: number): Pt[] => {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = cum[cum.length - 1] || 1;
  const out: Pt[] = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / (n - 1)) * total;
    while (j < cum.length - 2 && cum[j + 1] < target) j++;
    const seg = cum[j + 1] - cum[j] || 1;
    const u = (target - cum[j]) / seg;
    out.push([mix(pts[j][0], pts[j + 1][0], u), mix(pts[j][1], pts[j + 1][1], u)]);
  }
  return out;
};

/** Portion of a polyline between fractions a..b of its length (points assumed evenly spaced). */
export const trim = (pts: Pt[], a: number, b: number): Pt[] => {
  if (b <= a) return [];
  const n = pts.length - 1;
  const at = (f: number): Pt => {
    const x = f * n;
    const i = Math.min(n - 1, Math.floor(x));
    const u = x - i;
    return [mix(pts[i][0], pts[i + 1][0], u), mix(pts[i][1], pts[i + 1][1], u)];
  };
  const out: Pt[] = [at(a)];
  for (let i = Math.ceil(a * n); i <= Math.floor(b * n); i++) out.push(pts[i]);
  out.push(at(b));
  return out;
};

/* ------------------------------------------------------------------ */
/* The golden line                                                     */
/* ------------------------------------------------------------------ */

/**
 * Generosity, drawn as a single warm line. Pass evenly spaced points
 * (see resample) and a draw range [from, to] in 0..1 of its length.
 */
export const GoldLine: React.FC<{
  pts: Pt[];
  from?: number;
  to?: number;
  width?: number;
  glow?: number;
  opacity?: number;
  head?: boolean;
}> = ({pts, from = 0, to = 1, width = 4, glow = 1, opacity = 1, head = true}) => {
  const seg = trim(pts, clamp01(from), clamp01(to));
  if (seg.length < 2) return null;
  const d = polyD(seg);
  const tip = seg[seg.length - 1];
  const drawing = to < 0.999 && to > 0.001;
  return (
    <g opacity={opacity}>
      {glow > 0 && (
        <path
          d={d}
          fill="none"
          stroke={COLORS.goldGlow}
          strokeWidth={width * 5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{filter: `blur(${width * 2.2}px)`}}
          opacity={0.55 * glow}
        />
      )}
      <path d={d} fill="none" stroke={COLORS.gold} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={d}
        fill="none"
        stroke={COLORS.goldLight}
        strokeWidth={width * 0.35}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      {head && drawing && (
        <g>
          <circle cx={tip[0]} cy={tip[1]} r={width * 4} fill={COLORS.goldGlow} style={{filter: `blur(${width * 2}px)`}} />
          <circle cx={tip[0]} cy={tip[1]} r={width * 0.9} fill="#FFF3D6" />
        </g>
      )}
    </g>
  );
};

/** Soft warm light pool (lamp glow, lit windows). */
export const Glow: React.FC<{cx: number; cy: number; r: number; opacity?: number; color?: string}> = ({
  cx,
  cy,
  r,
  opacity = 1,
  color = COLORS.goldGlow,
}) => <circle cx={cx} cy={cy} r={r} fill={color} opacity={opacity} style={{filter: `blur(${r * 0.45}px)`}} />;

/** Contact shadow under figures and furniture. */
export const GroundShadow: React.FC<{cx: number; cy: number; rx: number; opacity?: number}> = ({
  cx,
  cy,
  rx,
  opacity = 1,
}) => {
  const p = useReveal();
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.12} fill={COLORS.shadow} opacity={opacity * clamp01(p * 2 - 0.6)} />;
};

/* ------------------------------------------------------------------ */
/* Frame-level texture                                                 */
/* ------------------------------------------------------------------ */

export const Paper: React.FC<{color?: string}> = ({color = COLORS.ivory}) => (
  <AbsoluteFill style={{backgroundColor: color}} />
);

/** Static paper grain + gentle vignette. Kept static on purpose: no shimmer. */
export const PaperTexture: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <svg width="1920" height="1080" style={{position: 'absolute', mixBlendMode: 'multiply', opacity: 0.32}}>
      <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.45  0 0 0 0 0.40  0 0 0 0 0.33  0 0 0 0.55 0"
        />
      </filter>
      <filter id="paper-fibre" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="3" seed="3" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.48  0 0 0 0 0.38  0 0 0 0.22 0" />
      </filter>
      <rect width="1920" height="1080" filter="url(#paper-fibre)" />
      <rect width="1920" height="1080" filter="url(#paper-grain)" />
    </svg>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(70,52,30,0.16) 100%)',
      }}
    />
  </AbsoluteFill>
);

/** Full-frame SVG stage in 1920x1080 units. */
export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg
    viewBox="0 0 1920 1080"
    width="1920"
    height="1080"
    style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}
  >
    {children}
  </svg>
);

/** Camera: zooms by `scale` about world point (cx, cy), which lands at screen centre (sx, sy). */
export const Camera: React.FC<{
  cx: number;
  cy: number;
  scale?: number;
  sx?: number;
  sy?: number;
  children: React.ReactNode;
}> = ({cx, cy, scale = 1, sx = 960, sy = 540, children}) => (
  <g transform={`translate(${sx} ${sy}) scale(${scale}) translate(${-cx} ${-cy})`}>{children}</g>
);
