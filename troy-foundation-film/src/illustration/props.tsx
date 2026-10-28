import React from 'react';
import {COLORS} from '../config/theme';
import {circleD, ellipseD, Glow, GroundShadow, Ink, rectD} from './primitives';

/* Shared environment pieces, all built from Ink so they draw on. Coordinates are
 * absolute in the caller's space; `s` scales about the anchor where provided. */

export const Tree: React.FC<{x: number; y: number; s?: number; tone?: string}> = ({x, y, s = 1, tone = COLORS.sage}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <GroundShadow cx={0} cy={0} rx={70} />
    <Ink d="M-6,0 L-5,-120 Q-4,-150 -24,-176 M-5,-120 Q4,-160 26,-182 M6,0 L5,-130" sw={2.4} />
    <Ink
      d="M-70,-200 Q-96,-240 -66,-276 Q-60,-330 -4,-334 Q44,-352 70,-300 Q106,-280 88,-232 Q96,-180 40,-170 Q0,-150 -36,-168 Q-80,-166 -70,-200 Z"
      fill={tone}
    />
    <Ink d="M-30,-250 q14,-10 28,0 M18,-226 q12,-8 24,2" sw={1.6} opacity={0.6} />
  </g>
);

export const Window: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  lit?: number;
  frame?: string;
  pane?: string;
  sw?: number;
}> = ({x, y, w, h, lit = 0, frame = COLORS.paper, pane = COLORS.dusk, sw = 2.2}) => (
  <g>
    {lit > 0 && <Glow cx={x + w / 2} cy={y + h / 2} r={Math.max(w, h) * 0.9} opacity={lit * 0.8} />}
    <Ink d={rectD(x, y, w, h)} fill={frame} sw={sw} />
    <Ink d={rectD(x + w * 0.08, y + h * 0.08, w * 0.84, h * 0.84)} fill={pane} sw={sw * 0.7} />
    {lit > 0 && <rect x={x + w * 0.08} y={y + h * 0.08} width={w * 0.84} height={h * 0.84} fill={COLORS.goldLight} opacity={lit} />}
    <Ink d={`M${x + w / 2},${y + h * 0.08} V${y + h * 0.92} M${x + w * 0.08},${y + h / 2} H${x + w * 0.92}`} sw={sw * 0.7} />
  </g>
);

export const House: React.FC<{
  x: number;
  y: number; // ground
  w?: number;
  h?: number;
  body?: string;
  roof?: string;
  lit?: number[]; // per-window light 0..1
  door?: 'closed' | 'open';
  porch?: boolean;
  sw?: number;
}> = ({x, y, w = 260, h = 180, body = COLORS.wall, roof = COLORS.duskDeep, lit = [], door = 'closed', porch = false, sw = 2.2}) => {
  const top = y - h;
  const ww = w * 0.2;
  const wh = h * 0.28;
  return (
    <g>
      <GroundShadow cx={x + w / 2} cy={y} rx={w * 0.6} />
      <Ink d={rectD(x, top, w, h)} fill={body} sw={sw} />
      <Ink d={`M${x - w * 0.06},${top} L${x + w / 2},${top - h * 0.55} L${x + w * 1.06},${top} Z`} fill={roof} sw={sw} />
      <Ink d={rectD(x + w * 0.66, top - h * 0.5, w * 0.1, h * 0.28)} fill={COLORS.clayDeep} sw={sw} />
      <Window x={x + w * 0.1} y={top + h * 0.18} w={ww} h={wh} lit={lit[0] ?? 0} sw={sw * 0.9} />
      <Window x={x + w * 0.7} y={top + h * 0.18} w={ww} h={wh} lit={lit[1] ?? 0} sw={sw * 0.9} />
      {door === 'open' && <Glow cx={x + w * 0.5} cy={y - h * 0.2} r={w * 0.25} opacity={0.8} />}
      <Ink
        d={rectD(x + w * 0.4, y - h * 0.42, w * 0.2, h * 0.42)}
        fill={door === 'open' ? COLORS.goldLight : COLORS.clayDeep}
        sw={sw}
      />
      {door === 'open' && (
        <Ink d={`M${x + w * 0.4},${y - h * 0.42} L${x + w * 0.34},${y - h * 0.45} L${x + w * 0.34},${y + h * 0.02} L${x + w * 0.4},${y}`} fill={COLORS.clayDeep} sw={sw} />
      )}
      {porch && (
        <Ink d={`M${x + w * 0.3},${y - h * 0.5} H${x + w * 0.7} M${x + w * 0.32},${y - h * 0.5} V${y} M${x + w * 0.68},${y - h * 0.5} V${y}`} sw={sw} />
      )}
    </g>
  );
};

export const PendantLamp: React.FC<{x: number; y: number; on?: number}> = ({x, y, on = 1}) => (
  <g>
    <Glow cx={x} cy={y + 60} r={260} opacity={0.75 * on} />
    <Ink d={`M${x},-20 L${x},${y - 60}`} sw={2} />
    <Ink d={`M${x - 70},${y} Q${x - 62},${y - 62} ${x},${y - 64} Q${x + 62},${y - 62} ${x + 70},${y} Z`} fill={COLORS.goldDeep} />
    <ellipse cx={x} cy={y} rx={66} ry={8} fill={COLORS.goldLight} opacity={on} />
  </g>
);

export const Bowl: React.FC<{x: number; y: number; s?: number; fill?: string; soup?: string}> = ({x, y, s = 1, fill = COLORS.paper, soup = COLORS.clay}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Ink d={ellipseD(0, -30, 46, 9)} fill={soup} sw={1.8} />
    <Ink d="M-46,-30 Q-42,0 0,2 Q42,0 46,-30" fill={fill} sw={2.2} />
  </g>
);

export const Steam: React.FC<{x: number; y: number; t: number; s?: number}> = ({x, y, t, s = 1}) => {
  // Very slow, looping rise; low amplitude so it reads as warmth, not motion.
  const phase = (t * 0.35) % 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.5 * Math.sin(Math.PI * phase)}>
      <path
        d={`M-10,${-10 - phase * 30} q-10,-16 0,-30 q10,-14 0,-30 M10,${-4 - phase * 30} q-10,-16 0,-30 q10,-14 0,-28`}
        stroke={COLORS.inkFaint}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
};

export const Chair: React.FC<{x: number; y: number; facing?: 1 | -1}> = ({x, y, facing = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${facing} 1)`}>
    <Ink d="M-44,-196 L-40,-98" sw={6} stroke={COLORS.woodDeep} />
    <Ink d="M-44,-98 L56,-98 M-34,-98 L-34,0 M48,-98 L48,0" sw={6} stroke={COLORS.woodDeep} />
  </g>
);

export const StopLight: React.FC<{x: number; y: number; amber?: number; s?: number}> = ({x, y, amber = 0.3, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Ink d="M-6,0 L-6,-380 L6,-380 L6,0 Z" fill={COLORS.inkSoft} sw={2} />
    <Ink d={rectD(-34, -520, 68, 180, 12)} fill={COLORS.ink} sw={2} />
    <Ink d={circleD(0, -486, 18)} fill="#7C5A55" sw={1.5} />
    <Glow cx={0} cy={-430} r={70} opacity={amber} />
    <Ink d={circleD(0, -430, 18)} fill={COLORS.goldDeep} sw={1.5} />
    <circle cx={0} cy={-430} r={17} fill={COLORS.goldLight} opacity={amber} />
    <Ink d={circleD(0, -374, 18)} fill="#5E6F64" sw={1.5} />
    {/* pedestrian signal */}
    <Ink d={rectD(10, -300, 44, 56, 6)} fill={COLORS.ink} sw={2} />
    <Ink d="M24,-286 h16 v26 h-16 Z" fill="#8C6A52" sw={0} />
  </g>
);

export const Bench: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 200}) => (
  <g>
    <GroundShadow cx={x + w / 2} cy={y} rx={w * 0.55} />
    <Ink d={rectD(x, y - 100, w, 14, 3)} fill={COLORS.wood} />
    <Ink d={rectD(x, y - 66, w, 12, 3)} fill={COLORS.wood} />
    <Ink d={`M${x + 16},${y - 54} V${y} M${x + w - 16},${y - 54} V${y}`} sw={5} stroke={COLORS.ink} />
  </g>
);

export const Lamppost: React.FC<{x: number; y: number; on?: number}> = ({x, y, on = 0}) => (
  <g>
    {on > 0 && <Glow cx={x} cy={y - 420} r={90} opacity={on} />}
    <Ink d={`M${x - 5},${y} V${y - 400} M${x + 5},${y} V${y - 400}`} sw={2} />
    <Ink d={`M${x - 22},${y - 400} L${x + 22},${y - 400} L${x + 14},${y - 450} L${x - 14},${y - 450} Z`} fill={COLORS.ink} sw={2} />
    <rect x={x - 14} y={y - 446} width={28} height={40} fill={COLORS.goldLight} opacity={0.4 + on * 0.6} />
  </g>
);

export const Crate: React.FC<{x: number; y: number; fruit: string; w?: number}> = ({x, y, fruit, w = 120}) => (
  <g>
    {Array.from({length: 5}).map((_, i) => (
      <Ink key={i} d={circleD(x + 16 + i * ((w - 32) / 4), y - 46 - (i % 2) * 6, 14)} fill={fruit} sw={1.6} />
    ))}
    <Ink d={rectD(x, y - 42, w, 42)} fill={COLORS.wood} />
    <Ink d={`M${x},${y - 21} H${x + w}`} sw={1.6} />
  </g>
);

export const Plant: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Ink d="M-22,-50 L22,-50 L16,0 L-16,0 Z" fill={COLORS.clay} />
    <Ink d="M0,-50 Q-30,-90 -40,-120 Q-10,-104 0,-50 M0,-50 Q20,-110 44,-130 Q30,-84 0,-50 M0,-50 Q-4,-120 6,-150 Q16,-110 0,-50" fill={COLORS.sageDeep} sw={1.8} />
  </g>
);

export const Bookshelf: React.FC<{x: number; y: number; w?: number; h?: number}> = ({x, y, w = 260, h = 420}) => {
  const tones = [COLORS.dusk, COLORS.clay, COLORS.sage, COLORS.sand, COLORS.plum, COLORS.rose, COLORS.duskDeep];
  const rows = 4;
  return (
    <g>
      <GroundShadow cx={x + w / 2} cy={y} rx={w * 0.55} />
      <Ink d={rectD(x, y - h, w, h)} fill={COLORS.wood} />
      {Array.from({length: rows}).map((_, r) => {
        const sy = y - h + 14 + r * ((h - 20) / rows);
        const sh = (h - 20) / rows - 10;
        return (
          <g key={r}>
            <Ink d={rectD(x + 12, sy, w - 24, sh)} fill={COLORS.woodDeep} sw={1.6} />
            {Array.from({length: 7}).map((_, i) => {
              const bw = 18 + ((i * 7 + r * 3) % 4) * 4;
              const bx = x + 18 + i * ((w - 40) / 7);
              const bh = sh - 8 - ((i + r) % 3) * 8;
              return <Ink key={i} d={rectD(bx, sy + sh - bh, bw, bh, 1)} fill={tones[(i + r * 2) % tones.length]} sw={1.4} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

export const WallClock: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 34}) => (
  <g>
    <Ink d={circleD(x, y, r)} fill={COLORS.paper} sw={2.4} />
    {/* half past three */}
    <Ink d={`M${x},${y} L${x + r * 0.42},${y + r * 0.22} M${x},${y} L${x},${y + r * 0.72}`} sw={2.4} />
  </g>
);

export const Envelope: React.FC<{x: number; y: number; open: number; glow?: number}> = ({x, y, open, glow = 0}) => {
  // open: 0 = sealed, 1 = flap up with letter rising
  const flapY = y - 70 * (open * 2 - 1); // flap tip moves from inside to above
  const letterRise = Math.max(0, open - 0.4) / 0.6;
  return (
    <g>
      {glow > 0 && <Glow cx={x} cy={y - 40 - letterRise * 60} r={170} opacity={glow} />}
      <Ink d={rectD(x - 110, y - 10 - letterRise * 90, 220, 140)} fill={COLORS.paper} sw={2} at={[0, 1]} opacity={open > 0.35 ? 1 : 0} />
      {letterRise > 0.5 && (
        <g opacity={(letterRise - 0.5) * 2}>
          <path d={`M${x - 80},${y + 20 - letterRise * 90} h120 M${x - 80},${y + 44 - letterRise * 90} h160 M${x - 80},${y + 68 - letterRise * 90} h140`} stroke={COLORS.inkFaint} strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
      <Ink d={rectD(x - 130, y, 260, 160, 4)} fill={COLORS.sand} />
      <Ink d={`M${x - 130},${y + 160} L${x},${y + 70} L${x + 130},${y + 160}`} sw={2} />
      <Ink d={`M${x - 130},${y} L${x},${flapY} L${x + 130},${y} Z`} fill={COLORS.ivoryDeep} />
    </g>
  );
};

export const Fence: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => {
  const n = Math.floor(w / 26);
  let d = `M${x},${y - 60} H${x + w} M${x},${y - 26} H${x + w}`;
  for (let i = 0; i <= n; i++) d += ` M${x + i * 26},${y} V${y - 78} l6,-8 l6,8`;
  return <Ink d={d} sw={1.8} />;
};
