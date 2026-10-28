import React from 'react';
import {COLORS, HAIR, SKIN} from '../config/theme';
import {Person, PersonProps} from '../illustration/Person';
import {Bench, House, Lamppost, StopLight, Tree, Window} from '../illustration/props';
import {GroundShadow, Ink, rectD, resample, Reveal, spline} from '../illustration/primitives';
import {prog, Pt} from '../lib/time';
import {marketWoman, workerMan} from './StreetWorld';

/**
 * The whole neighbourhood, seen at the climax. World space = final screen
 * space (1920x1080). Rows: back (ground 560), middle (720), street (900).
 * Every earlier scene has a home here: the market, the stoplight, the lit
 * dinner window, the after-school building, the open door.
 */

export const BACK = 560;
export const MID = 720;
export const STREET = 900;

export const A_POS: Pt = [810, STREET];
export const B_POS: Pt = [1110, STREET];
const FIG = 0.16;
export const A_HAND: Pt = [A_POS[0] + 96 * FIG, STREET - 215 * FIG];
export const B_HAND: Pt = [B_POS[0] - 96 * FIG, STREET - 215 * FIG];
export const ORIGIN: Pt = [960, 866];

export const NETWORK: Pt[] = resample(
  spline(
    [
      [-60, 640],
      [130, 690],
      [300, 600],
      [470, 488],
      [600, 560],
      [640, 690],
      [740, 830],
      A_HAND,
      [960, 880],
      B_HAND,
      [1170, 800],
      [1170, 650],
      [1290, 600],
      [1420, 680],
      [1530, 500],
      [1640, 600],
      [1560, 820],
      [1700, 870],
      [1840, 760],
      [1990, 700],
    ],
    30,
  ),
  900,
);

const nearest = (p: Pt) => {
  let best = 0;
  let bd = Infinity;
  NETWORK.forEach((q, i) => {
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return best / (NETWORK.length - 1);
};
export const FA = nearest(A_HAND);
export const FB = nearest(B_HAND);

/** Reveal starts later the further an element is from the two strangers. */
export const revealAt = (x: number, y: number, start: number, spread: number) =>
  start + (Math.hypot(x - ORIGIN[0], (y - ORIGIN[1]) * 1.4) / 1150) * spread;

type Props = {t: number; start: number; spread: number};

const R: React.FC<{x: number; y: number; t: number; start: number; spread: number; children: React.ReactNode; dur?: number}> = ({
  x,
  y,
  t,
  start,
  spread,
  children,
  dur = 1.4,
}) => {
  const a = revealAt(x, y, start, spread);
  return <Reveal p={prog(t, a, a + dur)}>{children}</Reveal>;
};

const litAt = (t: number, x: number, y: number, start: number, spread: number, k: number) =>
  prog(t, revealAt(x, y, start, spread) + 1.0 + k * 0.35, revealAt(x, y, start, spread) + 2.2 + k * 0.35);

const BACK_HOUSES: [number, number, number, string, string, number[]][] = [
  [40, 150, 100, COLORS.wall, COLORS.duskDeep, [1, 0]],
  [210, 140, 90, COLORS.wallWarm, COLORS.clayDeep, [0, 1]],
  [690, 150, 100, COLORS.ivoryDeep, COLORS.sageDeep, [1, 1]],
  [860, 130, 110, COLORS.wall, COLORS.duskDeep, [0, 1]],
  [1020, 160, 95, COLORS.wallWarm, COLORS.plum, [1, 0]],
  [1210, 150, 105, COLORS.wall, COLORS.clayDeep, [1, 1]],
  [1390, 140, 90, COLORS.ivoryDeep, COLORS.duskDeep, [0, 1]],
  [1560, 160, 110, COLORS.wallWarm, COLORS.sageDeep, [1, 0]],
  [1750, 150, 100, COLORS.wall, COLORS.clayDeep, [1, 1]],
];

const MID_HOUSES: [number, number, number, string, string, number[], boolean][] = [
  [20, 200, 140, COLORS.wallWarm, COLORS.sageDeep, [1, 0], false],
  [250, 190, 130, COLORS.wall, COLORS.duskDeep, [0, 1], true],
  [880, 200, 150, COLORS.ivoryDeep, COLORS.clayDeep, [1, 0], false],
  [1100, 210, 150, COLORS.wallWarm, COLORS.duskDeep, [1, 1], true], // the dinner window
  [1350, 190, 140, COLORS.wall, COLORS.plum, [0, 1], false], // the open door
  [1600, 200, 150, COLORS.ivoryDeep, COLORS.sageDeep, [1, 0], true],
];

const tiny = (p: Omit<PersonProps, 'size'>) => <Person size={FIG} {...p} />;

export const Neighborhood: React.FC<Props> = ({t, start, spread}) => {
  const r = {t, start, spread};
  return (
    <g>
      {/* back row (lighter, further away) */}
      <g opacity={0.8}>
        <R x={960} y={BACK} {...r}>
          <Ink d={`M-200,${BACK} H2120`} sw={1.2} />
        </R>
        {BACK_HOUSES.map(([x, w, h, body, roof, lit], i) => (
          <R key={i} x={x + w / 2} y={BACK} {...r}>
            <House x={x} y={BACK} w={w} h={h} body={body} roof={roof} sw={1.2} lit={lit.map((l, k) => l * litAt(t, x, BACK, start, spread, k + i * 0.3))} />
          </R>
        ))}
        {/* the after-school building, with its clock */}
        <R x={510} y={BACK} {...r}>
          <Ink d={rectD(380, BACK - 150, 270, 150)} fill={COLORS.wallWarm} sw={1.2} />
          <Ink d={`M370,${BACK - 150} H660 L640,${BACK - 172} H390 Z`} fill={COLORS.duskDeep} sw={1.2} />
          <Ink d={`M480,${BACK - 172} V${BACK - 196} L515,${BACK - 214} L550,${BACK - 196} V${BACK - 172}`} fill={COLORS.wall} sw={1.2} />
          <Ink d={`M515,${BACK - 190} m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0`} fill={COLORS.paper} sw={1} />
          {[0, 1, 2, 3].map((k) => (
            <Window key={k} x={400 + k * 62} y={BACK - 120} w={44} h={50} sw={1} lit={litAt(t, 510, BACK, start, spread, k)} />
          ))}
          <Ink d={rectD(495, BACK - 56, 40, 56)} fill={COLORS.clayDeep} sw={1.2} />
        </R>
        {[190, 670, 1190, 1545].map((x, i) => (
          <R key={i} x={x} y={BACK} {...r}>
            <Tree x={x} y={BACK} s={0.34} tone={i % 2 ? COLORS.sage : COLORS.sageDeep} />
          </R>
        ))}
      </g>

      {/* middle row */}
      <R x={960} y={MID} {...r}>
        <Ink d={rectD(-200, MID, 2320, 30)} fill={COLORS.ivoryDeep} sw={0} />
        <Ink d={`M-200,${MID} H2120`} sw={1.2} />
      </R>
      {MID_HOUSES.map(([x, w, h, body, roof, lit, porch], i) => (
        <R key={i} x={x + w / 2} y={MID} {...r}>
          <House
            x={x}
            y={MID}
            w={w}
            h={h}
            body={body}
            roof={roof}
            sw={1.2}
            porch={porch}
            door={i === 4 ? 'open' : 'closed'}
            lit={lit.map((l, k) => (i === 3 ? 1 : l) * litAt(t, x, MID, start, spread, k))}
          />
        </R>
      ))}
      {/* the market */}
      <R x={640} y={MID} {...r}>
        <GroundShadow cx={640} cy={MID} rx={190} />
        <Ink d={rectD(480, MID - 170, 320, 170)} fill={COLORS.wallWarm} sw={1.2} />
        <Ink d={rectD(474, MID - 178, 332, 10)} fill={COLORS.clayDeep} sw={1.2} />
        {Array.from({length: 10}).map((_, k) => (
          <Ink key={k} d={`M${490 + k * 30},${MID - 128} h30 v18 q-15,8 -30,0 Z`} fill={k % 2 ? COLORS.paper : COLORS.sage} sw={0.8} />
        ))}
        <Ink d={rectD(500, MID - 96, 280, 96)} fill="#DCE1DE" sw={1.2} />
        <rect x={500} y={MID - 96} width={280} height={96} fill={COLORS.goldLight} opacity={0.5 * litAt(t, 640, MID, start, spread, 1)} />
      </R>
      {[230, 840, 1330, 1580, 1830].map((x, i) => (
        <R key={i} x={x} y={MID} {...r}>
          <Tree x={x} y={MID} s={0.5} tone={i % 2 ? COLORS.sageDeep : COLORS.sage} />
        </R>
      ))}
      <R x={560} y={MID} {...r}>
        {tiny({x: 560, y: MID, ...marketWoman, front: 'hold', item: 'basket'})}
      </R>
      <R x={1130} y={MID} {...r}>
        {tiny({x: 1060, y: MID, skin: SKIN[2], hair: HAIR.black, hairStyle: 'curly', top: COLORS.sage, age: 'child', back: 'up'})}
      </R>
      <R x={1400} y={MID} {...r}>
        {tiny({x: 1420, y: MID, skin: SKIN[3], hair: HAIR.black, hairStyle: 'curly', top: COLORS.sageDeep, front: 'give'})}
        {tiny({x: 1490, y: MID, facing: -1, skin: SKIN[0], hair: HAIR.brown, top: COLORS.duskDeep, front: 'hold', item: 'tote', pose: 'walk'})}
      </R>

      {/* street */}
      <R x={960} y={STREET} {...r}>
        <Ink d={rectD(-200, STREET + 30, 2320, 260)} fill={COLORS.ivoryDeep} sw={0} />
        <Ink d={`M-200,${STREET} H2120 M-200,${STREET + 30} H2120`} sw={1.2} />
        <Ink d={`M-200,${STREET + 110} H2120`} sw={1.2} dash="18 22" stroke={COLORS.inkFaint} />
      </R>
      <R x={1640} y={STREET} {...r}>
        {Array.from({length: 6}).map((_, k) => (
          <Ink key={k} d={rectD(1580 + k * 26, STREET + 44, 14, 130)} fill={COLORS.paper} sw={0} />
        ))}
        <StopLight x={1500} y={STREET} s={0.3} amber={0.9} />
        {tiny({x: 1395, y: STREET, ...marketWoman, front: 'hold', item: 'bag'})}
        {tiny({x: 1430, y: STREET, ...workerMan, front: 'hold', back: 'pocket', item: 'coffee'})}
      </R>
      <R x={300} y={STREET} {...r}>
        <g transform={`translate(300 ${STREET}) scale(0.32) translate(-300 ${-STREET})`}>
          <Bench x={200} y={STREET} w={230} />
        </g>
        {tiny({x: 300, y: STREET - 2, pose: 'sit', skin: SKIN[4], hair: HAIR.gray, hairStyle: 'bun', top: COLORS.plum, bottom: COLORS.sand, front: 'book', item: 'book', shadow: false})}
      </R>
      {[640, 1280].map((x) => (
        <R key={x} x={x} y={STREET} {...r}>
          <g transform={`translate(${x} ${STREET}) scale(0.32) translate(${-x} ${-STREET})`}>
            <Lamppost x={x} y={STREET} on={0.6} />
          </g>
        </R>
      ))}
      {[100, 1850].map((x) => (
        <R key={x} x={x} y={STREET} {...r}>
          <Tree x={x} y={STREET} s={0.75} />
        </R>
      ))}
    </g>
  );
};

/** The two strangers. Drawn separately so they can appear before the town. */
export const Strangers: React.FC<{p: number}> = ({p}) => (
  <Reveal p={p}>
    {tiny({x: A_POS[0], y: A_POS[1], skin: SKIN[4], hair: HAIR.brown, hairStyle: 'short', top: COLORS.duskDeep, topDetail: 'jacket', bottom: COLORS.ink, front: 'give'})}
    {tiny({x: B_POS[0], y: B_POS[1], facing: -1, skin: SKIN[3], hair: HAIR.black, hairStyle: 'long', top: COLORS.clay, bottom: COLORS.inkSoft, front: 'give'})}
  </Reveal>
);
