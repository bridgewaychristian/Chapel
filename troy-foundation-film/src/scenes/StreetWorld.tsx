import React from 'react';
import {COLORS, HAIR, SKIN} from '../config/theme';
import {Person} from '../illustration/Person';
import {Bench, Crate, House, Lamppost, StopLight, Tree} from '../illustration/props';
import {GroundShadow, Ink, rectD, Reveal, Stage} from '../illustration/primitives';

/**
 * One continuous street, panned across in Scene 1 and held in Scene 2.
 * World is ~4400 wide; ground (sidewalk edge) at y = 800.
 */

export const GROUND = 800;
export const STOP_X = 3560;
export const AMBER_WORLD: [number, number] = [STOP_X, GROUND - 430];
export const END_CAM_X = 2420; // world x at screen left when the pan settles

// The woman we meet at the market, and again at the stoplight.
export const marketWoman = {
  skin: SKIN[2],
  hair: HAIR.black,
  hairStyle: 'bun' as const,
  top: COLORS.clay,
  bottom: COLORS.duskDeep,
};
export const workerMan = {
  skin: SKIN[3],
  hair: HAIR.black,
  hairStyle: 'short' as const,
  top: COLORS.sageDeep,
  bottom: COLORS.ink,
  topDetail: 'jacket' as const,
};

type Props = {
  camX: number;
  t: number;
  ground: number; // ground line draw progress
  market: number;
  sidewalk: number;
  stop: number;
  dim?: number; // 0..1 fades everything but the waiting pair
  amber?: number;
  zoom?: number;
  zoomAt?: [number, number];
  walkers?: number; // 0..1 drift of the sidewalk walkers
};

const Awning: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => {
  const n = 20;
  const sw = w / n;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => (
        <Ink
          key={i}
          d={`M${x + i * sw},${y} H${x + (i + 1) * sw} V${y + 56} Q${x + (i + 0.5) * sw},${y + 76} ${x + i * sw},${y + 56} Z`}
          fill={i % 2 ? COLORS.paper : COLORS.sage}
          sw={1.6}
        />
      ))}
      <Ink d={`M${x - 10},${y} H${x + w + 10}`} sw={3} />
    </g>
  );
};

export const StreetWorld: React.FC<Props> = ({
  camX,
  t,
  ground,
  market,
  sidewalk,
  stop,
  dim = 0,
  amber = 0.35,
  zoom = 1,
  zoomAt = [960, 600],
  walkers = 0,
}) => {
  const others = 1 - dim * 0.9;
  const par = (depth: number) => `translate(${-camX * depth} 0)`;
  return (
    <Stage>
      <g transform={`translate(${zoomAt[0]} ${zoomAt[1]}) scale(${zoom}) translate(${-zoomAt[0]} ${-zoomAt[1]})`}>
        {/* far layer: rooftops behind the sidewalk (parallax 0.82) */}
        <g transform={par(0.82)} opacity={others * 0.85}>
          <Reveal p={sidewalk}>
            <House x={1500} y={GROUND} w={300} h={230} body={COLORS.wallWarm} roof={COLORS.clayDeep} />
            <House x={1900} y={GROUND} w={260} h={200} body={COLORS.wall} roof={COLORS.duskDeep} porch />
            <House x={2240} y={GROUND} w={280} h={240} body={COLORS.ivoryDeep} roof={COLORS.sageDeep} />
          </Reveal>
          <Reveal p={stop}>
            <House x={3300} y={GROUND} w={300} h={260} body={COLORS.wallWarm} roof={COLORS.duskDeep} />
          </Reveal>
        </g>

        <g transform={par(1)}>
          {/* street */}
          <Reveal p={ground}>
            <Ink d={`M-200,${GROUND} H4800`} sw={2.6} />
          </Reveal>
          <g opacity={others}>
            <Reveal p={ground}>
              <Ink d={rectD(-200, GROUND + 34, 5000, 260)} fill={COLORS.ivoryDeep} sw={0} />
              <Ink d={`M-200,${GROUND + 34} H4800`} sw={1.6} />
            </Reveal>
            <Reveal p={stop}>
              {Array.from({length: 7}).map((_, i) => (
                <Ink key={i} d={rectD(3640 + i * 48, GROUND + 60, 26, 210)} fill={COLORS.paper} sw={0} />
              ))}
            </Reveal>

            {/* ---- Market ---- */}
            <Reveal p={market}>
              <Ink d={rectD(240, 320, 1260, GROUND - 320)} fill={COLORS.wallWarm} />
              <Ink d={rectD(228, 300, 1284, 24)} fill={COLORS.clayDeep} />
              <Ink d={rectD(640, 352, 460, 62, 4)} fill={COLORS.paper} sw={2} />
              <text x={870} y={396} textAnchor="middle" fontFamily="Inter" fontWeight={500} fontSize={30} letterSpacing={14} fill={COLORS.ink} opacity={Math.min(1, market * 1.4 - 0.4)}>
                MARKET
              </text>
              <Awning x={270} y={440} w={1200} />
              <Ink d={rectD(300, 530, 1140, GROUND - 530)} fill="#DCE1DE" sw={2} />
              <Ink d={`M300,620 H1440 M300,700 H1440 M870,530 V${GROUND}`} sw={1.4} opacity={0.6} />
              {Array.from({length: 18}).map((_, i) => (
                <Ink key={i} d={rectD(320 + i * 62, 584 + (i % 3) * 4, 30, 34 - (i % 3) * 4, 2)} fill={[COLORS.rose, COLORS.sand, COLORS.dusk][i % 3]} sw={1} opacity={0.75} />
              ))}
              {/* produce stand */}
              <GroundShadow cx={680} cy={GROUND} rx={340} />
              <Ink d={rectD(380, 700, 600, 18)} fill={COLORS.wood} />
              <Ink d={`M400,718 V${GROUND} M960,718 V${GROUND}`} sw={5} stroke={COLORS.woodDeep} />
              <Crate x={400} y={700} fruit={COLORS.clay} />
              <Crate x={540} y={700} fruit={COLORS.sage} />
              <Crate x={680} y={700} fruit={COLORS.rose} />
              <Crate x={820} y={700} fruit={COLORS.sand} />
              <Person x={1080} y={GROUND} size={0.95} facing={-1} {...marketWoman} front="hold" back="forward" item="basket" />
              <Person
                x={1330}
                y={GROUND}
                size={0.95}
                facing={1}
                pose="walk"
                skin={SKIN[4]}
                hair={COLORS.inkSoft}
                hairStyle="cap"
                top={COLORS.dusk}
                bottom={COLORS.inkSoft}
                topDetail="cardigan"
                front="hold"
                item="bag"
              />
            </Reveal>

            {/* ---- Sidewalk ---- */}
            <Reveal p={sidewalk}>
              <Tree x={1640} y={GROUND} s={1.15} />
              <Bench x={1740} y={GROUND} w={230} />
              <Person x={1790} y={GROUND - 4} pose="sit" size={0.95} skin={SKIN[4]} hair={HAIR.gray} hairStyle="bun" top={COLORS.plum} bottom={COLORS.sand} front="book" item="book" shadow={false} />
              <Person
                x={2020 + walkers * 60}
                y={GROUND}
                size={1}
                pose="walk"
                skin={SKIN[3]}
                hair={HAIR.black}
                hairStyle="coily"
                top={COLORS.duskDeep}
                bottom={COLORS.sand}
                topDetail="jacket"
                backpack={COLORS.clay}
                front="down"
              />
              <Lamppost x={2330} y={GROUND} />
              <Person
                x={2560 - walkers * 60}
                y={GROUND}
                size={0.98}
                facing={-1}
                pose="walk"
                skin={SKIN[0]}
                hair={HAIR.blond}
                hairStyle="long"
                top={COLORS.rose}
                bottom={COLORS.ink}
                front="hold"
                item="tote"
              />
              <Tree x={2760} y={GROUND} s={0.95} tone={COLORS.sageDeep} />
            </Reveal>

            {/* ---- Corner storefront ---- */}
            <Reveal p={stop}>
              <Ink d={rectD(3960, 300, 800, GROUND - 300)} fill={COLORS.wall} />
              <Ink d={rectD(4020, 470, 300, GROUND - 470)} fill="#DCE1DE" sw={2} />
              <Ink d={`M4020,560 H4320`} sw={1.4} opacity={0.6} />
            </Reveal>
          </g>

          {/* ---- Stoplight: the waiting pair stays lit through the pause ---- */}
          <Reveal p={stop}>
            <StopLight x={STOP_X} y={GROUND} amber={amber} />
            <Person x={3220} y={GROUND} size={1} {...marketWoman} front="hold" item="bag" />
            <Person x={3390} y={GROUND} size={1.02} {...workerMan} front="hold" back="pocket" item="coffee" />
          </Reveal>
        </g>

      </g>
      {/* time is accepted for future ambient detail; intentionally unused to keep stillness */}
      <g data-t={t} />
    </Stage>
  );
};
