import React from 'react';
import {COLORS, HAIR, SKIN} from '../config/theme';
import {Person} from '../illustration/Person';
import {Bookshelf, Bowl, Envelope, PendantLamp, Plant, Steam, WallClock, Window} from '../illustration/props';
import {ellipseD, Glow, GroundShadow, Ink, rectD, Reveal, Stage, Stagger} from '../illustration/primitives';

/* Three intimate interiors, reused full-frame in Scene 3 and as framed
 * "moments" at the end of it. Each shares a table/counter edge at y = 760,
 * which is the line the wipes travel along. */

export const TABLE_Y = 760;
export const LAMP: [number, number] = [1154, 386];

export const DinnerRoom: React.FC<{t: number; p: number}> = ({t, p}) => (
  <Stage>
    <Reveal p={p}>
      <rect width="1920" height="1080" fill={COLORS.wallWarm} />
      <Stagger at={[0, 0.5]}>
        <Ink d={`M0,880 H1920`} sw={2} />
        <Window x={230} y={250} w={260} h={270} pane={COLORS.night} />
        <Ink d={rectD(1520, 250, 170, 130)} fill={COLORS.paper} sw={2.2} />
        <Ink d="M1540,360 L1585,300 L1615,335 L1640,312 L1670,360 Z" fill={COLORS.sage} sw={1.4} />
      </Stagger>
      <PendantLamp x={LAMP[0]} y={LAMP[1]} on={Math.min(1, p * 1.5)} />
      <Stagger at={[0.15, 0.85]}>
        <Person x={470} y={905} size={1.25} pose="sit" skin={SKIN[1]} hair={HAIR.gray} hairStyle="bun" top={COLORS.plum} bottom={COLORS.inkSoft} front="table" shadow={false} />
        <Person x={800} y={862} size={1.25} age="child" pose="sit" skin={SKIN[2]} hair={HAIR.black} hairStyle="curly" top={COLORS.sage} front="table" shadow={false} />
        <Person x={1090} y={866} size={1.25} age="child" pose="sit" facing={-1} skin={SKIN[2]} hair={HAIR.brown} hairStyle="ponytail" top={COLORS.rose} front="table" shadow={false} />
        <Person x={1440} y={905} size={1.25} pose="sit" facing={-1} skin={SKIN[1]} hair={HAIR.black} hairStyle="short" top={COLORS.dusk} topDetail="stripe" front="table" back="down" shadow={false} />
      </Stagger>
      {/* the table */}
      <Stagger at={[0.05, 0.6]}>
        <Ink d={rectD(330, TABLE_Y, 1260, 400)} fill={COLORS.paper} />
        <Ink d={`M330,${TABLE_Y + 34} H1590`} sw={1.4} opacity={0.5} />
      </Stagger>
      <Stagger at={[0.45, 1]}>
        <Bowl x={600} y={TABLE_Y + 4} />
        <Bowl x={860} y={TABLE_Y + 4} s={0.8} soup={COLORS.sage} />
        <Bowl x={1040} y={TABLE_Y + 4} s={0.8} />
        <Bowl x={1330} y={TABLE_Y + 4} />
        <Ink d={`M920,${TABLE_Y - 4} Q930,${TABLE_Y - 44} 990,${TABLE_Y - 46} Q1050,${TABLE_Y - 44} 1060,${TABLE_Y - 4} Z`} fill={COLORS.wood} />
        <Ink d={`M1200,${TABLE_Y} L1206,${TABLE_Y - 80} Q1222,${TABLE_Y - 92} 1238,${TABLE_Y - 80} L1244,${TABLE_Y} Z`} fill={COLORS.dusk} />
      </Stagger>
      <Steam x={600} y={TABLE_Y - 30} t={t} />
      <Steam x={1330} y={TABLE_Y - 30} t={t + 1.3} />
    </Reveal>
  </Stage>
);

export const AfterSchoolRoom: React.FC<{t: number; p: number}> = ({p}) => (
  <Stage>
    <Reveal p={p}>
      <rect width="1920" height="1080" fill="#ECE6D6" />
      <Stagger at={[0, 0.5]}>
        <Ink d={rectD(0, 640, 1920, 240)} fill={COLORS.ivoryDeep} sw={0} />
        <Ink d="M0,640 H1920 M0,900 H1920" sw={2} />
        <Window x={280} y={170} w={520} h={380} pane="#EADFC4" frame={COLORS.paper} />
        <path d="M300,550 L780,550 L980,900 L180,900 Z" fill={COLORS.goldLight} opacity={0.22 * p} />
        <WallClock x={1010} y={250} />
        <Ink d="M1080,360 H1340" sw={4} stroke={COLORS.woodDeep} />
        <Ink d={rectD(1110, 362, 54, 80, 14)} fill={COLORS.clay} sw={2} />
        <Ink d="M1230,362 Q1196,400 1210,470 L1268,470 Q1282,400 1250,362 Z" fill={COLORS.dusk} sw={2} />
        <Ink d={ellipseD(760, 950, 520, 46)} fill={COLORS.sand} sw={1.6} />
      </Stagger>
      <Bookshelf x={1440} y={900} w={280} h={460} />
      <Plant x={1340} y={900} s={1.1} />
      <Stagger at={[0.15, 0.85]}>
        <Person x={300} y={940} size={1.2} pose="sit" skin={SKIN[3]} hair={HAIR.black} hairStyle="coily" top={COLORS.duskDeep} bottom={COLORS.ink} front="book" item="book" topDetail="cardigan" shadow={false} />
        <Person x={560} y={930} size={1.2} age="child" pose="sit" facing={-1} skin={SKIN[1]} hair={HAIR.auburn} hairStyle="short" top={COLORS.clay} front="down" shadow={false} />
        <Person x={880} y={922} size={1.2} age="child" pose="sit" skin={SKIN[5]} hair={HAIR.black} hairStyle="wrap" top={COLORS.sage} front="table" shadow={false} />
      </Stagger>
      {/* low stools */}
      <Stagger at={[0.1, 0.6]}>
        <Ink d={rectD(250, 880, 150, 60, 6)} fill={COLORS.wood} />
        <Ink d={rectD(520, 880, 110, 50, 6)} fill={COLORS.wood} />
      </Stagger>
      <Stagger at={[0.05, 0.6]}>
        <GroundShadow cx={1000} cy={940} rx={300} />
        <Ink d={rectD(760, TABLE_Y, 480, 22, 4)} fill={COLORS.wood} />
        <Ink d={`M790,${TABLE_Y + 22} V940 M1210,${TABLE_Y + 22} V940`} sw={6} stroke={COLORS.woodDeep} />
      </Stagger>
      <Stagger at={[0.5, 1]}>
        <Ink d={`M940,${TABLE_Y} L1080,${TABLE_Y - 6} L1090,${TABLE_Y - 2} L950,${TABLE_Y + 4} Z`} fill={COLORS.paper} sw={1.4} />
        <Ink d={`M1120,${TABLE_Y - 2} l60,-8`} sw={4} stroke={COLORS.gold} />
        <Ink d={rectD(1150, TABLE_Y - 40, 40, 40, 4)} fill={COLORS.dusk} sw={1.6} />
      </Stagger>
    </Reveal>
  </Stage>
);

export const StudentScene: React.FC<{t: number; p: number; open: number; glow: number}> = ({p, open, glow}) => (
  <Stage>
    <Reveal p={p}>
      <rect width="1920" height="1080" fill={COLORS.wall} />
      <Stagger at={[0, 0.5]}>
        <Window x={1380} y={150} w={340} h={420} pane="#E9DCC0" frame={COLORS.paper} />
        <Ink d={`M0,${TABLE_Y + 100} H1920`} sw={2} />
        <Ink d={rectD(0, TABLE_Y + 100, 1920, 300)} fill={COLORS.wood} sw={0} />
        <Ink d={`M0,${TABLE_Y + 100} H1920`} sw={2.4} />
      </Stagger>
      <Stagger at={[0.1, 0.9]}>
        <Person x={560} y={1330} size={3} age="teen" skin={SKIN[2]} hair={HAIR.black} hairStyle="ponytail" top={COLORS.dusk} front="give" back="forward" shadow={false} />
      </Stagger>
      <Stagger at={[0.35, 1]}>
        <g transform="translate(1000 560) scale(1.35) translate(-1000 -560)">
          <Envelope x={1000} y={560} open={open} glow={glow} />
        </g>
        <Ink d={ellipseD(1172, 768, 24, 22)} fill={SKIN[2]} sw={2.2} />
      </Stagger>
      {glow > 0 && <Glow cx={1000} cy={430} r={240} opacity={glow * 0.6} />}
    </Reveal>
  </Stage>
);
