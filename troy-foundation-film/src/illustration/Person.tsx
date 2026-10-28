import React from 'react';
import {COLORS, HAIR, SKIN} from '../config/theme';
import {circleD, ellipseD, GroundShadow, Ink, Limb, rectD, Stagger} from './primitives';

/**
 * Editorial figure. Feet at (0,0), faces +x (use `facing={-1}` to flip).
 * Deliberately faceless and calm: posture and gesture carry the feeling.
 */

export type Pose = 'stand' | 'walk' | 'sit';
export type Arm = 'down' | 'forward' | 'give' | 'up' | 'hold' | 'book' | 'pocket' | 'table' | 'raise' | 'hug';
export type HairStyle = 'short' | 'bun' | 'long' | 'curly' | 'cap' | 'ponytail' | 'coily' | 'bald' | 'wrap';
export type Item = 'none' | 'bag' | 'basket' | 'tote' | 'box' | 'coffee' | 'book' | 'letter' | 'bowl' | 'keys' | 'watering';

export type PersonProps = {
  x: number;
  y: number;
  size?: number;
  facing?: 1 | -1;
  pose?: Pose;
  age?: 'adult' | 'teen' | 'child';
  skin?: string;
  hair?: string;
  hairStyle?: HairStyle;
  top?: string;
  bottom?: string;
  skirt?: boolean;
  topDetail?: 'none' | 'jacket' | 'stripe' | 'cardigan' | 'apron';
  front?: Arm;
  back?: Arm;
  item?: Item;
  backpack?: string;
  shoes?: string;
  shadow?: boolean;
  lean?: number;
};

/** Offsets every "x,y" pair in a path string. */
const shift = (d: string, dx: number, dy: number) =>
  d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_m, a, b) => `${+a + dx},${+b + dy}`);

const darken = (hex: string, k = 0.86) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * k);
  const g = Math.round(((n >> 8) & 255) * k);
  const b = Math.round((n & 255) * k);
  return `rgb(${r},${g},${b})`;
};

const ARMS: Record<Arm, {d: string; hand: [number, number] | null}> = {
  down: {d: 'M18,-244 Q30,-200 27,-154', hand: [27, -150]},
  forward: {d: 'M18,-244 Q32,-198 64,-192', hand: [67, -191]},
  give: {d: 'M18,-244 Q44,-222 92,-216', hand: [96, -215]},
  up: {d: 'M18,-244 Q42,-290 42,-338', hand: [42, -343]},
  raise: {d: 'M18,-244 Q48,-268 70,-304', hand: [73, -308]},
  hold: {d: 'M18,-244 Q34,-200 40,-168', hand: [41, -165]},
  book: {d: 'M18,-244 Q28,-196 56,-202', hand: [59, -203]},
  pocket: {d: 'M18,-244 Q40,-208 22,-178', hand: null},
  table: {d: 'M18,-244 Q30,-196 74,-182', hand: [77, -181]},
  hug: {d: 'M18,-244 Q52,-226 30,-200', hand: [26, -199]},
};

const LEGS = {
  stand: 'M-27,-152 L27,-152 L24,-7 L5,-7 L1,-96 L-3,-7 L-24,-7 Z',
  walk: 'M-27,-152 L27,-152 L46,-9 L27,-5 L6,-98 L-16,-5 L-35,-9 Z',
  sit: 'M-30,-108 L-30,-72 L36,-66 L36,-6 L58,-6 L62,-82 Q62,-106 38,-108 Z',
};

const SHOES = {
  stand: ['M-27,-9 H-3 Q6,-9 8,0 H-27 Z', 'M3,-9 H24 Q33,-9 35,0 H3 Z'],
  walk: ['M-38,-10 H-14 Q-6,-9 -4,0 H-38 Z', 'M24,-10 H46 Q55,-9 57,0 H26 Z'],
  sit: ['M34,-8 H58 Q68,-8 70,0 H34 Z'],
};

export const Person: React.FC<PersonProps> = ({
  x,
  y,
  size = 1,
  facing = 1,
  pose = 'stand',
  age = 'adult',
  skin = SKIN[0],
  hair = HAIR.brown,
  hairStyle = 'short',
  top = COLORS.dusk,
  bottom = COLORS.inkSoft,
  skirt = false,
  topDetail = 'none',
  front = 'down',
  back = 'down',
  item = 'none',
  backpack,
  shoes = COLORS.ink,
  shadow = true,
  lean = 0,
}) => {
  const ageScale = age === 'child' ? 0.6 : age === 'teen' ? 0.9 : 1;
  const headScale = age === 'child' ? 1.32 : age === 'teen' ? 1.06 : 1;
  const dy = pose === 'sit' ? 44 : 0; // upper body drops when seated
  const hy = -290 + dy; // head centre
  const neckY = -262 + dy;
  const topDark = darken(top);
  const fa = ARMS[front];
  const ba = ARMS[back];

  const torso = `M-30,${-150 + dy} L-33,${-234 + dy} Q-33,${-256 + dy} -13,${-258 + dy} L13,${-258 + dy} Q33,${-256 + dy} 33,${-234 + dy} L30,${-150 + dy} Z`;

  const hairEl = (() => {
    switch (hairStyle) {
      case 'bald':
        return null;
      case 'coily':
        return null; // drawn behind head
      case 'curly':
        return (
          <>
            {[
              [-15, -14, 11],
              [-3, -21, 11],
              [10, -20, 10],
              [-21, -1, 10],
              [-17, 12, 8],
              [19, -11, 7],
            ].map(([cx, cy, r], i) => (
              <Ink key={i} d={circleD(cx, hy + cy, r)} fill={hair} sw={1.6} />
            ))}
          </>
        );
      case 'cap':
        return (
          <>
            <Ink d={`M-22,${hy - 3} Q-21,${hy - 28} 1,${hy - 27} Q21,${hy - 27} 22,${hy - 6} Z`} fill={hair} sw={2} />
            <Ink d={`M14,${hy - 9} L42,${hy - 5} Q36,${hy - 1} 20,${hy - 2} Z`} fill={darken(hair, 0.8)} sw={2} />
          </>
        );
      case 'wrap':
        return (
          <Ink
            d={`M-23,${hy + 6} Q-27,${hy - 30} 2,${hy - 29} Q24,${hy - 28} 22,${hy - 6} Q4,${hy - 12} -8,${hy - 2} Q-14,${hy + 6} -23,${hy + 6} Z`}
            fill={hair}
            sw={2}
          />
        );
      case 'long':
        return (
          <Ink
            d={`M-22,${hy} Q-25,${hy - 27} 1,${hy - 26} Q23,${hy - 25} 22,${hy - 6} Q8,${hy - 14} -2,${hy - 10} Q-8,${hy + 12} -4,${hy + 42} L-27,${hy + 42} Q-31,${hy + 16} -22,${hy} Z`}
            fill={hair}
            sw={2}
          />
        );
      default: {
        const base = (
          <Ink
            d={`M-22,${hy + 4} Q-25,${hy - 26} 0,${hy - 25} Q22,${hy - 25} 22,${hy - 8} Q10,${hy - 16} -4,${hy - 12} Q-12,${hy - 6} -14,${hy + 10} Z`}
            fill={hair}
            sw={2}
          />
        );
        if (hairStyle === 'bun')
          return (
            <>
              <Ink d={circleD(-19, hy - 19, 9)} fill={hair} sw={2} />
              {base}
            </>
          );
        if (hairStyle === 'ponytail')
          return (
            <>
              <Ink d={`M-20,${hy - 10} Q-42,${hy} -34,${hy + 28} Q-26,${hy + 8} -17,${hy + 2} Z`} fill={hair} sw={2} />
              {base}
            </>
          );
        return base;
      }
    }
  })();

  const itemEl = (() => {
    const h = fa.hand;
    if (!h) return null;
    const [hx, hyy] = [h[0], h[1] + dy];
    switch (item) {
      case 'bag':
        return (
          <>
            <Ink d={`M${hx - 20},${hyy + 4} L${hx + 22},${hyy + 4} L${hx + 25},${hyy + 70} L${hx - 23},${hyy + 70} Z`} fill={COLORS.sand} sw={2} />
            <Ink d={`M${hx - 20},${hyy + 4} l7,-6 l7,6 l7,-6 l7,6 l7,-6 l7,6`} sw={1.6} />
            <Ink d={`M${hx + 4},${hyy + 2} q6,-30 18,-34 q-4,16 -12,34 Z`} fill={COLORS.sage} sw={1.6} />
          </>
        );
      case 'basket':
        return (
          <>
            <Ink d={`M${hx - 30},${hyy + 8} L${hx + 30},${hyy + 8} L${hx + 22},${hyy + 44} L${hx - 22},${hyy + 44} Z`} fill={COLORS.wood} sw={2} />
            <Ink d={`M${hx - 24},${hyy + 8} Q${hx},${hyy - 22} ${hx + 24},${hyy + 8}`} sw={2.4} />
            <Ink d={circleD(hx - 8, hyy + 4, 8)} fill={COLORS.clay} sw={1.6} />
            <Ink d={circleD(hx + 9, hyy + 3, 7)} fill={COLORS.sage} sw={1.6} />
          </>
        );
      case 'tote':
        return (
          <>
            <Ink d={`M${hx - 8},${hyy} L${hx - 18},${hyy + 22} M${hx + 8},${hyy} L${hx + 18},${hyy + 22}`} sw={2} />
            <Ink d={rectD(hx - 24, hyy + 20, 48, 52, 4)} fill={COLORS.sand} sw={2} />
          </>
        );
      case 'coffee':
        return <Ink d={`M${hx - 6},${hyy - 22} L${hx + 10},${hyy - 22} L${hx + 8},${hyy + 4} L${hx - 4},${hyy + 4} Z`} fill={COLORS.paper} sw={1.8} />;
      case 'box':
        return <Ink d={rectD(hx - 62, hyy - 44, 70, 56, 2)} fill={COLORS.sand} sw={2.2} />;
      case 'book':
        return (
          <>
            <Ink d={`M${hx - 4},${hyy - 20} L${hx + 26},${hyy - 26} L${hx + 26},${hyy + 8} L${hx - 4},${hyy + 12} Z`} fill={COLORS.paper} sw={1.8} />
            <Ink d={`M${hx - 4},${hyy - 20} L${hx - 30},${hyy - 26} L${hx - 30},${hyy + 8} L${hx - 4},${hyy + 12}`} fill={COLORS.paper} sw={1.8} />
          </>
        );
      case 'letter':
        return <Ink d={rectD(hx - 10, hyy - 46, 40, 52, 1)} fill={COLORS.paper} sw={1.8} />;
      case 'bowl':
        return <Ink d={`M${hx - 26},${hyy - 8} L${hx + 26},${hyy - 8} Q${hx + 22},${hyy + 16} ${hx},${hyy + 16} Q${hx - 22},${hyy + 16} ${hx - 26},${hyy - 8} Z`} fill={COLORS.paper} sw={2} />;
      case 'keys':
        return <Ink d={`${circleD(hx + 6, hyy + 12, 6)} M${hx + 9},${hyy + 17} l5,14 l4,-2`} sw={2} stroke={COLORS.goldDeep} />;
      case 'watering':
        return (
          <>
            <Ink d={rectD(hx - 18, hyy + 4, 34, 34, 4)} fill={COLORS.sage} sw={2} />
            <Ink d={`M${hx + 16},${hyy + 14} L${hx + 40},${hyy - 4}`} sw={3} />
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <g transform={`translate(${x} ${y}) scale(${size * ageScale * facing} ${size * ageScale})`}>
      {shadow && <GroundShadow cx={pose === 'sit' ? 20 : 0} cy={0} rx={56} />}
      <g transform={lean ? `rotate(${lean} 0 0)` : undefined}>
        {/* back arm (behind torso) */}
        <Stagger at={[0.2, 0.8]}>
          <Limb d={shift(ba.d, -30, dy)} color={topDark} w={15} />
          {ba.hand && back !== 'down' && <Ink d={circleD(ba.hand[0] - 30, ba.hand[1] + dy, 8)} fill={skin} sw={1.8} />}
        </Stagger>
        {backpack && (
          <Stagger at={[0.2, 0.8]}>
            <Ink d={rectD(-58, -246 + dy, 30, 78, 9)} fill={backpack} sw={2.2} />
          </Stagger>
        )}
        {/* legs */}
        <Stagger at={[0, 0.6]}>
          {skirt && pose !== 'sit' ? (
            <>
              <Limb d="M-12,-70 L-13,-10" color={skin} w={9} />
              <Limb d="M12,-70 L13,-10" color={skin} w={9} />
              <Ink d={`M-27,-152 L27,-152 L38,-60 L-38,-60 Z`} fill={bottom} />
            </>
          ) : (
            <Ink d={LEGS[pose]} fill={bottom} />
          )}
          {SHOES[pose].map((d, i) => (
            <Ink key={i} d={d} fill={shoes} sw={1.8} />
          ))}
        </Stagger>
        {/* torso */}
        <Stagger at={[0.1, 0.7]}>
          <Ink d={torso} fill={top} />
          {topDetail === 'jacket' && <Ink d={`M0,${-256 + dy} L0,${-152 + dy} M-12,${-257 + dy} L0,${-236 + dy} L12,${-257 + dy}`} sw={1.8} />}
          {topDetail === 'cardigan' && <Ink d={`M-6,${-256 + dy} L-2,${-152 + dy} M6,${-256 + dy} L2,${-152 + dy}`} sw={1.6} />}
          {topDetail === 'stripe' && <Ink d={`M-32,${-214 + dy} L32,${-214 + dy} M-31,${-196 + dy} L31,${-196 + dy}`} sw={3} stroke={COLORS.paper} />}
          {topDetail === 'apron' && <Ink d={`M-18,${-236 + dy} L18,${-236 + dy} L22,${-120 + dy} L-22,${-120 + dy} Z`} fill={COLORS.paper} sw={1.8} />}
        </Stagger>
        {/* head */}
        <Stagger at={[0.3, 0.95]}>
          <g transform={headScale !== 1 ? `translate(0 ${neckY}) scale(${headScale}) translate(0 ${-neckY})` : undefined}>
            {hairStyle === 'coily' && <Ink d={ellipseD(-3, hy - 6, 28, 28)} fill={hair} sw={2} />}
            <Ink d={rectD(-7, neckY - 6, 14, 12)} fill={skin} sw={0} />
            <Ink d={circleD(0, hy, 21)} fill={skin} sw={2.2} />
            <Ink d={`M20,${hy - 2} q5,5 0,9`} sw={1.6} />
            {hairEl}
          </g>
        </Stagger>
        {/* front arm + item */}
        <Stagger at={[0.25, 0.85]}>
          <Limb d={shift(fa.d, 0, dy)} color={top} w={15} />
          {fa.hand && <Ink d={circleD(fa.hand[0], fa.hand[1] + dy, 8)} fill={skin} sw={1.8} />}
          {itemEl}
        </Stagger>
      </g>
    </g>
  );
};
