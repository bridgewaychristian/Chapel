import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Statement} from '../components/Statement';
import {COLORS, HAIR, SKIN} from '../config/theme';
import {Person} from '../illustration/Person';
import {Bowl, Chair, House, Tree} from '../illustration/props';
import {Camera, GoldLine, GroundShadow, Ink, rectD, resample, Reveal, spline, Stage, trim} from '../illustration/primitives';
import {cue, ease, lerpPoints, lin, prog, slow, useTime} from '../lib/time';
import {HORIZON, HORIZON_Y} from './S5Personal';

const G = HORIZON_Y;
const V = [1300, 2300, 3300];

const RIPPLE = resample(
  spline(
    [
      [160, G],
      [900, G],
      [1150, G - 2],
      [1256, G - 112],
      [1370, G],
      [2050, G],
      [2330, G - 2],
      [2466, G - 178],
      [2600, G],
      [3100, G],
      [3352, G - 200],
      [3480, G - 60],
      [3640, G],
      [4800, G],
    ],
    20,
  ),
  900,
);
const F0 = RIPPLE.findIndex((p) => p[0] >= 1760) / (RIPPLE.length - 1);
const FIRST = resample(trim(RIPPLE, 0, F0), HORIZON.length);

/** 6 · The impact keeps going: the thread passes from hand to hand. */
export const S6Ripple: React.FC = () => {
  const t = useTime();
  const c19 = cue('c19');
  const c20 = cue('c20');
  const c21 = cue('c21');
  const c22 = cue('c22');

  const morph = prog(t, c19.start - 0.4, c19.start + 1.2, ease);
  const grow = lin(t, c19.start + 1.2, c22.start + 2.6);

  const camX =
    960 +
    340 * prog(t, c19.start, c20.start + 0.2, slow) +
    1000 * prog(t, c20.end - 0.6, c21.start + 0.7, slow) +
    1000 * prog(t, c21.end - 0.7, c22.start + 0.6, slow);

  const v1 = prog(t, c20.start - 1.0, c20.start + 0.8);
  const v2 = prog(t, c21.start - 1.2, c21.start + 0.6);
  const v3 = prog(t, c22.start - 1.2, c22.start + 0.6);
  const fadeOut = 1 - prog(t, c22.end + 0.3, c22.end + 1.1);

  return (
    <AbsoluteFill style={{opacity: fadeOut}}>
      <Stage>
        <Camera cx={camX} cy={540}>
          {/* 1 · a child grows in confidence: reading aloud */}
          <Reveal p={v1}>
            <Ink d={rectD(V[0] - 260, G - 300, 160, 120)} fill={COLORS.paper} sw={2} />
            <Ink d={`M${V[0] - 240},${G - 210} q30,-50 60,-20 q20,-30 50,0`} sw={2} stroke={COLORS.clay} />
            <Ink d={`M${V[0] - 180},${G - 180} L${V[0] - 230},${G} M${V[0] - 180},${G - 180} L${V[0] - 130},${G}`} sw={3} stroke={COLORS.woodDeep} />
            <Person x={V[0] - 60} y={G} size={0.95} age="child" skin={SKIN[1]} hair={HAIR.black} hairStyle="curly" top={COLORS.clay} front="book" item="book" back="down" />
            <Chair x={V[0] + 140} y={G} facing={-1} />
            <Person x={V[0] + 150} y={G - 4} size={0.92} pose="sit" facing={-1} skin={SKIN[4]} hair={HAIR.auburn} hairStyle="bun" top={COLORS.dusk} topDetail="cardigan" front="down" shadow={false} />
            <Ink d={rectD(V[0] + 236, G - 60, 70, 60, 6)} fill={COLORS.wood} />
            <Person x={V[0] + 260} y={G} size={0.92} age="child" pose="sit" facing={-1} skin={SKIN[3]} hair={HAIR.black} hairStyle="ponytail" top={COLORS.sage} front="down" shadow={false} />
          </Reveal>

          {/* 2 · a family finds its footing: first evening at a new front door */}
          <Reveal p={v2}>
            <House x={V[1] + 110} y={G} w={330} h={260} body={COLORS.wallWarm} roof={COLORS.sageDeep} porch />
            <Tree x={V[1] + 520} y={G} s={0.8} />
            <Person x={V[1] - 200} y={G} size={0.92} pose="walk" skin={SKIN[5]} hair={HAIR.black} hairStyle="short" top={COLORS.duskDeep} front="forward" back="forward" item="box" />
            <Person x={V[1] - 70} y={G} size={0.92} age="child" pose="walk" skin={SKIN[5]} hair={HAIR.black} hairStyle="coily" top={COLORS.rose} front="forward" item="box" />
            <Person x={V[1] + 100} y={G} size={0.92} skin={SKIN[5]} hair={HAIR.black} hairStyle="wrap" top={COLORS.plum} front="forward" item="keys" />
          </Reveal>

          {/* 3 · someone who once needed a hand offers one */}
          <Reveal p={v3}>
            <GroundShadow cx={V[2] + 60} cy={G} rx={260} />
            <Ink d={rectD(V[2] - 120, G - 110, 360, 16, 3)} fill={COLORS.wood} />
            <Ink d={`M${V[2] - 100},${G - 94} V${G} M${V[2] + 220},${G - 94} V${G}`} sw={5} stroke={COLORS.woodDeep} />
            <Bowl x={V[2] - 60} y={G - 108} s={0.7} />
            <Bowl x={V[2] + 10} y={G - 108} s={0.7} soup={COLORS.sage} />
            <Ink d={`M${V[2] + 160},${G - 110} L${V[2] + 164},${G - 160} Q${V[2] + 176},${G - 168} ${V[2] + 188},${G - 160} L${V[2] + 192},${G - 110} Z`} fill={COLORS.dusk} />
            <Person x={V[2] - 40} y={G} size={0.95} skin={SKIN[2]} hair={HAIR.brown} hairStyle="short" top={COLORS.sage} topDetail="apron" front="give" item="bowl" />
            <Person x={V[2] + 240} y={G} size={0.92} facing={-1} skin={SKIN[0]} hair={HAIR.white} hairStyle="short" top={COLORS.duskDeep} topDetail="jacket" front="forward" />
          </Reveal>

          {morph < 1 ? (
            <GoldLine pts={lerpPoints(HORIZON, FIRST, morph)} width={4} />
          ) : (
            <GoldLine pts={RIPPLE} to={F0 + (1 - F0) * grow} width={4} />
          )}
        </Camera>
      </Stage>

      <Statement cue="c19" in={c19.start} out={c19.end + 0.5} y={770} size={62} italic />
      <Statement cue="c20" in={c20.start} out={c20.end + 0.4} y={770} size={62} italic />
      <Statement cue="c21" in={c21.start} out={c21.end + 0.4} y={770} size={62} italic />
      <Statement cue="c22" in={c22.start} out={c22.end + 0.6} y={770} size={58} italic width={1536} />
    </AbsoluteFill>
  );
};
