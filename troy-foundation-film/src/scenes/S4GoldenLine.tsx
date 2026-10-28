import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Statement} from '../components/Statement';
import {COLORS, FONTS, HAIR, SKIN} from '../config/theme';
import {Person} from '../illustration/Person';
import {Fence, House, Plant, Tree} from '../illustration/props';
import {GoldLine, GroundShadow, Ink, rectD, resample, Reveal, spline, Stage} from '../illustration/primitives';
import {cue, ease, lerpPoints, prog, Pt, useTime} from '../lib/time';
import {MOMENTS_THREAD} from './S3Moments';

const N = 240;
const BASE = 700;

/* A small-town roofline, generic on purpose (not a portrait of real buildings). */
type Bldg = {w: number; h: number; roof: 'flat' | 'gable' | 'tower' | 'tree' | 'bridge' | 'gap'};
const SKYLINE: Bldg[] = [
  {w: 110, h: 0, roof: 'gap'},
  {w: 120, h: 100, roof: 'gable'},
  {w: 90, h: 80, roof: 'flat'},
  {w: 120, h: 110, roof: 'tree'},
  {w: 70, h: 130, roof: 'flat'},
  {w: 80, h: 190, roof: 'tower'},
  {w: 90, h: 120, roof: 'flat'},
  {w: 100, h: 140, roof: 'flat'},
  {w: 130, h: 110, roof: 'gable'},
  {w: 300, h: 50, roof: 'bridge'},
  {w: 90, h: 110, roof: 'flat'},
  {w: 110, h: 120, roof: 'gable'},
  {w: 90, h: 80, roof: 'flat'},
  {w: 110, h: 110, roof: 'tree'},
  {w: 100, h: 0, roof: 'gap'},
];

const skyline = () => {
  const pts: Pt[] = [];
  const shapes: {d: string; fill: string}[] = [];
  let x = 60;
  pts.push([x, BASE]);
  const tones = [COLORS.wallWarm, COLORS.wall, COLORS.ivoryDeep, COLORS.sand];
  SKYLINE.forEach((b, i) => {
    const top = BASE - b.h;
    const x2 = x + b.w;
    switch (b.roof) {
      case 'gap':
        pts.push([x2, BASE]);
        break;
      case 'flat':
        pts.push([x, top], [x2, top]);
        shapes.push({d: rectD(x, top, b.w, b.h), fill: tones[i % 4]});
        break;
      case 'gable': {
        const eave = top + b.h * 0.35;
        pts.push([x, eave], [x + b.w / 2, top], [x2, eave]);
        shapes.push({d: `M${x},${BASE} V${eave} L${x + b.w / 2},${top} L${x2},${eave} V${BASE} Z`, fill: tones[(i + 1) % 4]});
        break;
      }
      case 'tower': {
        const shoulder = top + 70;
        pts.push([x, shoulder], [x + 18, shoulder], [x + 18, top + 30], [x + b.w / 2, top], [x2 - 18, top + 30], [x2 - 18, shoulder], [x2, shoulder]);
        shapes.push({d: `M${x},${BASE} V${shoulder} H${x + 18} V${top + 30} L${x + b.w / 2},${top} L${x2 - 18},${top + 30} V${shoulder} H${x2} V${BASE} Z`, fill: COLORS.wall});
        break;
      }
      case 'tree':
        spline([[x, BASE - 30], [x + b.w * 0.2, top + 20], [x + b.w * 0.5, top], [x + b.w * 0.8, top + 20], [x2, BASE - 30]], 8).forEach((p) => pts.push(p));
        shapes.push({d: `M${x},${BASE} Q${x},${top - 10} ${x + b.w / 2},${top} Q${x2},${top - 10} ${x2},${BASE} Z`, fill: COLORS.sage});
        break;
      case 'bridge':
        // A river crossing: the line dips to the water and arcs over it.
        pts.push([x, BASE - 10]);
        spline([[x, BASE - 10], [x + b.w * 0.25, BASE - b.h], [x + b.w * 0.5, BASE - b.h - 12], [x + b.w * 0.75, BASE - b.h], [x2, BASE - 10]], 10).forEach((p) => pts.push(p));
        shapes.push({d: `M${x},${BASE + 2} Q${x + b.w / 2},${BASE - b.h * 1.6} ${x2},${BASE + 2} L${x2},${BASE + 22} L${x},${BASE + 22} Z`, fill: COLORS.dusk});
        break;
    }
    x = x2;
  });
  pts.push([1860, BASE]);
  return {pts: resample(pts, N), shapes};
};

const SKY = skyline();

/* The thread through three community vignettes. */
const V = [420, 960, 1500];
const GROUND = 730;
const NODES_THREAD = resample(
  spline([
    [40, 742],
    [240, 742],
    [420, 744],
    [600, 742],
    [690, 650],
    [800, 742],
    [960, 744],
    [1120, 742],
    [1230, 650],
    [1340, 742],
    [1500, 744],
    [1700, 742],
    [1880, 742],
  ]),
  N,
);

/** Straight line at table height: becomes the edge of the table in Scene 5. */
export const TABLE_LINE: Pt[] = resample([[160, 700], [1760, 700]], N);

const Label: React.FC<{x: number; text: string; o: number}> = ({x, text, o}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 220,
      top: 790,
      width: 440,
      textAlign: 'center',
      fontFamily: FONTS.sans,
      fontSize: 23,
      fontWeight: 500,
      letterSpacing: '0.04em',
      lineHeight: 1.35,
      color: COLORS.inkSoft,
      opacity: o,
      textWrap: 'balance',
    } as React.CSSProperties}
  >
    {text}
  </div>
);

/** 4 · The golden line appears: generosity moving through local life. */
export const S4GoldenLine: React.FC = () => {
  const t = useTime();
  const c11 = cue('c11');
  const c12 = cue('c12');
  const c13 = cue('c13');
  const c14 = cue('c14');
  const c15 = cue('c15');

  // Morph keyframes: thread under the moments -> roofline -> through the vignettes -> table edge
  const m1 = prog(t, c11.start + 0.2, c11.start + 2.6, ease);
  const m2 = prog(t, c12.start - 0.8, c12.start + 0.6, ease);
  const m3 = prog(t, c15.start - 0.4, c15.start + 1.6, ease);
  let pts = lerpPoints(MOMENTS_THREAD, SKY.pts, m1);
  if (m2 > 0) pts = lerpPoints(SKY.pts, NODES_THREAD, m2);
  if (m3 > 0) pts = lerpPoints(NODES_THREAD, TABLE_LINE, m3);

  const town = prog(t, c11.start + 1.8, c11.start + 4.0) * (1 - prog(t, c12.start - 1.0, c12.start - 0.2));
  const v1 = prog(t, c12.start - 0.3, c12.start + 1.4);
  const v2 = prog(t, c13.start - 0.3, c13.start + 1.4);
  const v3 = prog(t, c14.start - 0.3, c14.start + 1.4);
  const nodesOut = 1 - prog(t, c15.start - 0.6, c15.start + 0.4);

  // A brighter pulse travels the thread from node to node.
  const pulse = prog(t, c12.start, c14.end, (x) => x);

  return (
    <AbsoluteFill>
      <Stage>
        {/* roofline washes */}
        <g opacity={town * 0.75}>
          <Reveal p={town}>
            {SKY.shapes.map((s, i) => (
              <Ink key={i} d={s.d} fill={s.fill} sw={1.6} stroke={COLORS.inkSoft} />
            ))}
          </Reveal>
        </g>

        <g opacity={nodesOut}>
          {/* 1 · local organizations: a community building with its doors open */}
          <Reveal p={v1}>
            <GroundShadow cx={V[0]} cy={GROUND} rx={220} />
            <Ink d={rectD(V[0] - 170, GROUND - 230, 340, 230)} fill={COLORS.wallWarm} />
            <Ink d={`M${V[0] - 190},${GROUND - 230} L${V[0]},${GROUND - 320} L${V[0] + 190},${GROUND - 230} Z`} fill={COLORS.duskDeep} />
            <Ink d={rectD(V[0] - 110, GROUND - 200, 220, 34, 3)} fill={COLORS.paper} sw={1.8} />
            <Ink d={rectD(V[0] - 46, GROUND - 130, 92, 130)} fill={COLORS.goldLight} />
            <Ink d={`M${V[0] - 46},${GROUND - 130} L${V[0] - 70},${GROUND - 140} L${V[0] - 70},${GROUND + 4} L${V[0] - 46},${GROUND}`} fill={COLORS.clayDeep} sw={1.8} />
            <Ink d={`M${V[0] + 46},${GROUND - 130} L${V[0] + 70},${GROUND - 140} L${V[0] + 70},${GROUND + 4} L${V[0] + 46},${GROUND}`} fill={COLORS.clayDeep} sw={1.8} />
            <Ink d={rectD(V[0] - 150, GROUND - 140, 60, 60)} fill={COLORS.dusk} sw={1.8} />
            <Ink d={rectD(V[0] + 90, GROUND - 140, 60, 60)} fill={COLORS.dusk} sw={1.8} />
            <Person x={V[0] - 120} y={GROUND} size={0.52} skin={SKIN[1]} hair={HAIR.brown} hairStyle="ponytail" top={COLORS.sage} front="forward" />
            <Person x={V[0] - 86} y={GROUND} size={0.52} age="child" skin={SKIN[1]} hair={HAIR.brown} hairStyle="short" top={COLORS.clay} back="up" />
          </Reveal>

          {/* 2 · people who know our neighbors: a dish handed over the fence */}
          <Reveal p={v2}>
            <House x={V[1] + 40} y={GROUND} w={200} h={150} body={COLORS.wall} roof={COLORS.clayDeep} />
            <Fence x={V[1] - 30} y={GROUND} w={60} />
            <Person x={V[1] - 80} y={GROUND} size={0.56} skin={SKIN[3]} hair={HAIR.gray} hairStyle="short" top={COLORS.dusk} topDetail="cardigan" front="give" item="bowl" />
            <Person x={V[1] + 66} y={GROUND} size={0.56} facing={-1} skin={SKIN[4]} hair={HAIR.auburn} hairStyle="long" top={COLORS.rose} front="forward" />
            <Tree x={V[1] - 180} y={GROUND} s={0.6} />
          </Reveal>

          {/* 3 · opportunities: a shared garden, someone showing someone else how */}
          <Reveal p={v3}>
            <GroundShadow cx={V[2]} cy={GROUND} rx={220} />
            <Ink d={rectD(V[2] - 150, GROUND - 46, 300, 46)} fill={COLORS.wood} />
            {[-110, -50, 10, 70, 125].map((dx, i) => (
              <Plant key={i} x={V[2] + dx} y={GROUND - 44} s={0.45 + (i % 2) * 0.08} />
            ))}
            <Person x={V[2] - 200} y={GROUND} size={0.56} skin={SKIN[5]} hair={HAIR.white} hairStyle="wrap" top={COLORS.plum} topDetail="apron" front="hold" item="watering" />
            <Person x={V[2] + 200} y={GROUND} size={0.56} age="teen" facing={-1} skin={SKIN[0]} hair={HAIR.black} hairStyle="cap" top={COLORS.sageDeep} front="forward" />
          </Reveal>
        </g>

        <GoldLine pts={pts} width={4} />
        {pulse > 0 && pulse < 1 && <GoldLine pts={pts} from={pulse - 0.05} to={pulse + 0.02} width={6} glow={1.4} />}
      </Stage>

      <Statement
        text="When you give to support Troy through The Troy Foundation"
        in={c11.start}
        out={c11.end + 0.4}
        y={170}
        font="sans"
        size={24}
        weight={500}
        tracking={0.14}
        uppercase
        color={COLORS.inkSoft}
      />
      <Statement text="your generosity gets to work right here." in={c11.start + 2.6} out={c11.end + 0.4} y={224} size={70} italic />

      <Label x={V[0]} text="Local organizations" o={v1 * nodesOut} />
      <Label x={V[1]} text="People who know our neighbors" o={v2 * nodesOut} />
      <Label x={V[2]} text="Opportunities that help this community thrive" o={v3 * nodesOut} />

      <Statement cue="c15" in={c15.start} out={c15.end + 0.6} y={360} size={70} width={1536} />
    </AbsoluteFill>
  );
};

