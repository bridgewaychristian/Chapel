import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Logo} from '../components/Logo';
import {Statement} from '../components/Statement';
import {BRAND} from '../config/assets';
import {COLORS, FONTS} from '../config/theme';
import {FINAL_CARD} from '../config/timing';
import {Glow, GoldLine, resample, Stage} from '../illustration/primitives';
import {cue, ease, easeOut, lerpPoints, prog, useTime} from '../lib/time';
import {NETWORK} from './Neighborhood';
import {FINAL_CY} from './S7Connected';

// The town's thread as it sits on screen at the end of Scene 7.
const NETWORK_ON_SCREEN = NETWORK.map(([x, y]) => [x, y - FINAL_CY + 540] as [number, number]);

const RULE_Y = 600;
const RULE: typeof NETWORK_ON_SCREEN = resample(
  [
    [780, RULE_Y],
    [1140, RULE_Y],
  ],
  NETWORK_ON_SCREEN.length,
);

const CTA: React.FC<{o: number; y: number}> = ({o, y}) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: 0,
      width: 1920,
      textAlign: 'center',
      fontFamily: FONTS.serif,
      fontSize: 60,
      color: COLORS.ink,
      opacity: o,
    }}
  >
    Give here. <span style={{fontStyle: 'italic'}}>Help change a life here.</span>
  </div>
);

const Url: React.FC<{o: number}> = ({o}) => (
  <div
    style={{
      position: 'absolute',
      top: 762,
      left: 0,
      width: 1920,
      textAlign: 'center',
      fontFamily: FONTS.sans,
      fontSize: 30,
      fontWeight: 500,
      letterSpacing: '0.12em',
      color: COLORS.goldDeep,
      opacity: o,
    }}
  >
    {BRAND.url}
  </div>
);

/** 8 · Resolve: the town gathers into a single line beneath the Foundation's name. */
export const S8Resolve: React.FC = () => {
  const t = useTime();
  const c29 = cue('c29');
  const c30 = cue('c30');
  const c31 = cue('c31');
  const c32 = cue('c32');
  const c33 = cue('c33');

  const wash = prog(t, c29.start - 1.4, c29.start - 0.2); // ivory settles over the town
  const gather = prog(t, c29.start - 1.0, c29.start + 0.6, ease);
  const pts = lerpPoints(NETWORK_ON_SCREEN, RULE, gather);

  // First pass: logo + call to action, spoken.
  const logo1 = prog(t, c29.start, c29.start + 1.2, easeOut) * (1 - prog(t, c31.end + 0.6, c32.start - 0.1));
  const give1 = Math.min(prog(t, c30.start - 0.1, c30.start + 0.7), 1 - prog(t, c31.end + 0.6, c32.start - 0.1));
  const life1 = Math.min(prog(t, c31.start - 0.1, c31.start + 0.8), 1 - prog(t, c31.end + 0.6, c32.start - 0.1));

  // Final card: composed by FINAL_CARD.fullAt, then held untouched.
  const card = prog(t, FINAL_CARD.inStart, FINAL_CARD.fullAt, easeOut);
  const glowPulse = prog(t, c33.start, c33.end) * (1 - prog(t, FINAL_CARD.inStart, FINAL_CARD.fullAt));

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: COLORS.ivory, opacity: wash}} />
      <Stage>
        {glowPulse > 0 && <Glow cx={960} cy={RULE_Y} r={150} opacity={glowPulse * 0.7} />}
        <GoldLine pts={pts} width={4} head={false} />
      </Stage>

      <div style={{position: 'absolute', top: 380, left: 0, width: 1920, opacity: Math.max(logo1, card)}}>
        <Logo />
      </div>

      {/* spoken CTA, line by line */}
      <div
        style={{
          position: 'absolute',
          top: 636,
          left: 0,
          width: 1920,
          textAlign: 'center',
          fontFamily: FONTS.serif,
          fontSize: 60,
          color: COLORS.ink,
          opacity: card > 0 ? 0 : 1,
        }}
      >
        <span style={{opacity: give1}}>Give here. </span>
        <span style={{opacity: life1, fontStyle: 'italic'}}>Help change a life here.</span>
      </div>

      {/* the last two sentences get the frame to themselves */}
      <Statement cue="c32" in={c32.start} out={FINAL_CARD.inStart + 0.2} y={440} size={74} italic inDur={1.2} />
      <Statement cue="c33" in={c33.start} out={FINAL_CARD.inStart + 0.2} y={640} size={74} weight={500} inDur={1.2} />

      <CTA o={card} y={636} />
      <Url o={prog(t, FINAL_CARD.inStart + 0.4, FINAL_CARD.fullAt, easeOut)} />
    </AbsoluteFill>
  );
};
