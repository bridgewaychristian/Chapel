import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Statement} from '../components/Statement';
import {COLORS} from '../config/theme';
import {Camera, GoldLine, Stage} from '../illustration/primitives';
import {cue, ease, mix, prog, slow, useTime} from '../lib/time';
import {FA, FB, Neighborhood, NETWORK, ORIGIN, Strangers} from './Neighborhood';

export const START_SCALE = 4;
/** Final camera centre y: < 540 sits the town lower, leaving the sky for type. */
export const FINAL_CY = 476;

/** Pullback progress 0..1 (shared with Scene 8 so the hand-off is exact). */
export const pullback = (t: number) => prog(t, cue('c25').start - 0.4, cue('c28').start + 0.9, slow);

/** 7 · The climax: two strangers, then the whole neighbourhood they share. */
export const S7Connected: React.FC = () => {
  const t = useTime();
  const c23 = cue('c23');
  const c24 = cue('c24');
  const c25 = cue('c25');
  const c26 = cue('c26');
  const c27 = cue('c27');
  const c28 = cue('c28');

  const p = pullback(t);
  const scale = Math.pow(START_SCALE, 1 - p); // log-space zoom reads as constant speed
  const cx = mix(ORIGIN[0], 960, p);
  const cy = mix(ORIGIN[1], FINAL_CY, p);

  const strangers = prog(t, c23.start - 0.6, c23.start + 0.8);
  const bridge = prog(t, c24.start - 0.2, c24.end, ease); // line between the two hands
  const spread = prog(t, c25.start - 0.2, c28.end - 0.6, ease); // line reaches the whole town

  const mid = (FA + FB) / 2;
  const from = mix(mix(mid, FA, bridge), 0, spread);
  const to = mix(mix(mid, FB, bridge), 1, spread);

  return (
    <AbsoluteFill style={{opacity: prog(t, c23.start - 0.8, c23.start)}}>
      <Stage>
        <Camera cx={cx} cy={cy} scale={scale}>
          <Neighborhood t={t} start={c25.start - 0.3} spread={5.6} />
          <Strangers p={strangers} />
          <GoldLine pts={NETWORK} from={from} to={to} width={4.2 / scale + 0.6 * p} head={false} />
        </Camera>
      </Stage>
      {/* soft sky wash keeps the climax type legible as rooftops rise beneath it */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, ${COLORS.ivory} 0px, rgba(245,239,227,0.92) 250px, rgba(245,239,227,0) 400px)`,
          opacity: prog(t, c25.start, c25.start + 1.2),
        }}
      />

      <Statement cue="c23" in={c23.start} out={c23.end + 0.4} y={200} size={70} italic />
      <Statement cue="c24" in={c24.start} out={c24.end + 0.5} y={200} size={70} italic />

      <Statement cue="c25" in={c25.start} out={99} y={104} size={84} weight={500} inDur={1.4} />
      <Statement cue="c26" in={c26.start} out={99} x={360} width={560} align="right" y={222} size={50} italic color={COLORS.inkSoft} />
      <Statement cue="c27" in={c27.start} out={99} x={1000} width={560} align="left" y={222} size={50} italic color={COLORS.inkSoft} />
      <Statement cue="c28" in={c28.start} out={99} y={282} size={50} italic color={COLORS.inkSoft} />
    </AbsoluteFill>
  );
};
