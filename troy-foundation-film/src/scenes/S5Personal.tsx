import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Statement} from '../components/Statement';
import {COLORS, HAIR, SAFE, SKIN} from '../config/theme';
import {Person} from '../illustration/Person';
import {Bowl, Tree} from '../illustration/props';
import {ellipseD, Glow, GoldLine, Ink, Limb, resample, Reveal, Stage} from '../illustration/primitives';
import {cue, ease, lerpPoints, prog, Pt, useTime} from '../lib/time';
import {TABLE_LINE} from './S4GoldenLine';

const N = 240;
const FLOOR = 860;

const DOOR: Pt[] = resample(
  [
    [700, FLOOR],
    [700, 300],
    [1220, 300],
    [1220, FLOOR],
  ],
  N,
);

/** Horizon with a rising sun: the line Scene 6 travels along. */
export const HORIZON_Y = 690;
const arc: Pt[] = Array.from({length: 41}, (_, i) => {
  const a = Math.PI - (i / 40) * Math.PI;
  return [960 + Math.cos(a) * 170, HORIZON_Y - Math.sin(a) * 170];
});
export const HORIZON: Pt[] = resample([[160, HORIZON_Y], [790, HORIZON_Y], ...arc, [1130, HORIZON_Y], [1760, HORIZON_Y]], N);

/** 5 · Deeply personal: the line becomes a table's edge, a door frame, a new horizon. */
export const S5Personal: React.FC = () => {
  const t = useTime();
  const c16 = cue('c16');
  const c17 = cue('c17');
  const c18 = cue('c18');

  const toDoor = prog(t, c17.start - 0.5, c17.start + 0.9, ease);
  const toHorizon = prog(t, c18.start - 0.4, c18.start + 1.0, ease);
  let pts = lerpPoints(TABLE_LINE, DOOR, toDoor);
  if (toHorizon > 0) pts = lerpPoints(DOOR, HORIZON, toHorizon);

  const table = prog(t, c16.start - 0.8, c16.start + 1.0) * (1 - prog(t, c16.end + 0.1, c17.start - 0.2));
  const door = prog(t, c17.start + 0.2, c17.start + 1.4) * (1 - prog(t, c17.end + 0.1, c18.start - 0.1));
  const dawn = prog(t, c18.start + 0.4, c18.start + 1.8);

  return (
    <AbsoluteFill>
      <Stage>
        {/* Food on a table */}
        <g opacity={Math.min(1, table * 2)}>
          <Reveal p={table}>
            <Ink d={`M160,700 H1760 L1920,1080 H0 Z`} fill={COLORS.paper} sw={0} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Ink key={i} d={`M${330 + i * 252},700 L${150 + i * 324},1080`} sw={1.2} stroke={COLORS.sand} />
            ))}
            <Ink d="M0,880 H1920" sw={1.2} stroke={COLORS.sand} />
            <Ink d={ellipseD(960, 800, 170, 46)} fill={COLORS.wood} />
            <Ink d="M850,792 Q860,744 960,742 Q1060,744 1070,792 Q960,806 850,792 Z" fill={COLORS.sand} />
            <Ink d="M900,770 l20,-14 M960,764 l20,-14 M1020,770 l20,-14" sw={1.6} />
            <Ink d="M470,790 L480,700 Q500,686 520,700 L530,790 Z" fill={COLORS.dusk} />
            <Ink d={ellipseD(1480, 790, 80, 22)} fill={COLORS.paper} />
            {[-34, 0, 34, -16, 18].map((dx, i) => (
              <Ink key={i} d={ellipseD(1480 + dx, 776 - (i > 2 ? 18 : 0), 18, 16)} fill={i % 2 ? COLORS.clay : COLORS.rose} sw={1.6} />
            ))}
            <Bowl x={700} y={905} s={1.5} />
            <Bowl x={1250} y={925} s={1.5} soup={COLORS.sage} />
            <Limb d="M220,1140 Q420,1010 620,912" color={COLORS.rose} w={46} />
            <Ink d={ellipseD(626, 904, 30, 24)} fill={SKIN[2]} />
            <Limb d="M1760,1140 Q1560,1020 1340,930" color={COLORS.dusk} w={46} />
            <Ink d={ellipseD(1330, 926, 30, 24)} fill={SKIN[0]} />
          </Reveal>
        </g>

        {/* A door that stays open */}
        <g opacity={Math.min(1, door * 2)}>
          <Reveal p={door}>
            <Ink d={`M160,${FLOOR} H1760`} sw={2} />
            <path d={`M700,${FLOOR} L1220,${FLOOR} L1440,1080 L480,1080 Z`} fill={COLORS.goldLight} opacity={0.22 * door} />
            <rect x={700} y={300} width={520} height={FLOOR - 300} fill={COLORS.goldLight} opacity={0.34 * door} />
            <Glow cx={960} cy={560} r={300} opacity={0.5 * door} />
            <Ink d={`M700,300 L800,334 L800,${FLOOR - 20} L700,${FLOOR} Z`} fill={COLORS.clayDeep} />
            <Ink d={`M780,600 l-10,0`} sw={4} stroke={COLORS.goldDeep} />
            <Person x={1010} y={FLOOR} size={0.95} skin={SKIN[3]} hair={HAIR.black} hairStyle="curly" top={COLORS.sageDeep} topDetail="cardigan" front="give" />
            <Person x={1470} y={FLOOR} size={0.95} facing={-1} pose="walk" skin={SKIN[0]} hair={HAIR.brown} hairStyle="short" top={COLORS.duskDeep} topDetail="jacket" front="hold" item="tote" />
          </Reveal>
        </g>

        {/* A chance to begin again */}
        <g opacity={Math.min(1, dawn * 2)}>
          <Reveal p={dawn}>
            <Glow cx={960} cy={HORIZON_Y - 60} r={260} opacity={0.6 * dawn} />
            <path d={`M790,${HORIZON_Y} A170,170 0 0 1 1130,${HORIZON_Y} Z`} fill={COLORS.goldLight} opacity={0.35 * dawn} />
            <Ink d={`M700,1080 L950,${HORIZON_Y} M1240,1080 L970,${HORIZON_Y}`} sw={2} />
            <Ink d={`M700,1080 L950,${HORIZON_Y} L970,${HORIZON_Y} L1240,1080 Z`} fill={COLORS.sand} sw={0} fillOpacity={0.6} />
            <Ink d={`M160,760 Q500,748 860,746 M1080,746 Q1420,748 1760,760 M160,860 Q420,840 800,830 M1120,830 Q1500,840 1760,860`} sw={1.2} stroke={COLORS.inkFaint} />
            <Tree x={330} y={HORIZON_Y} s={0.32} />
            <Tree x={420} y={HORIZON_Y} s={0.26} tone={COLORS.sageDeep} />
            <Tree x={1560} y={HORIZON_Y} s={0.3} />
            <Person x={1090} y={1000} size={0.82} facing={-1} pose="walk" skin={SKIN[1]} hair={HAIR.black} hairStyle="ponytail" top={COLORS.clay} bottom={COLORS.ink} front="hold" item="tote" />
          </Reveal>
        </g>

        <GoldLine pts={pts} width={4} />
      </Stage>

      <Statement cue="c16" in={c16.start - 0.1} out={c16.end + 0.5} x={SAFE.x} width={900} align="left" y={190} size={80} italic />
      <Statement cue="c17" in={c17.start - 0.1} out={c17.end + 0.5} x={SAFE.x} width={900} align="left" y={190} size={80} italic />
      <Statement cue="c18" in={c18.start - 0.1} out={c18.end + 1.2} x={SAFE.x} width={900} align="left" y={190} size={80} italic />
    </AbsoluteFill>
  );
};
