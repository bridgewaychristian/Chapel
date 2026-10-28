import React from 'react';
import {COLORS, FONTS, SAFE} from '../config/theme';
import type {CueId} from '../config/timing';
import {easeOut, prog, useTime} from '../lib/time';
import {useLine} from '../narration/narration';

type Props = {
  /** Narration cue whose text to set (from public/narration/script.txt)… */
  cue?: CueId;
  /** …or explicit text (a fragment of the approved script). */
  text?: string;
  in: number;
  out: number;
  y: number;
  x?: number;
  width?: number;
  align?: 'center' | 'left' | 'right';
  size?: number;
  italic?: boolean;
  weight?: number;
  font?: 'serif' | 'sans';
  color?: string;
  tracking?: number;
  uppercase?: boolean;
  lineHeight?: number;
  inDur?: number;
  outDur?: number;
  /** Rise distance in px on entry. */
  rise?: number;
};

/**
 * Typography is set selectively, never the whole narration. Entrances are a
 * slow fade with a few pixels of rise and focus-pull; no bounce, no scale.
 */
export const Statement: React.FC<Props> = ({
  cue,
  text,
  in: tin,
  out: tout,
  y,
  x = SAFE.x,
  width = SAFE.w,
  align = 'center',
  size = 64,
  italic = false,
  weight = 400,
  font = 'serif',
  color = COLORS.ink,
  tracking = 0,
  uppercase = false,
  lineHeight = 1.18,
  inDur = 1.0,
  outDur = 0.8,
  rise = 12,
}) => {
  const t = useTime();
  const line = useLine(cue ?? 'c01');
  const content = text ?? (cue ? line : '');
  const a = prog(t, tin, tin + inDur, easeOut);
  const b = 1 - prog(t, tout - outDur, tout);
  const o = Math.min(a, b);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        fontFamily: font === 'serif' ? FONTS.serif : FONTS.sans,
        fontSize: size,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        textTransform: uppercase ? 'uppercase' : 'none',
        lineHeight,
        color,
        opacity: o,
        transform: `translateY(${(1 - a) * rise}px)`,
        filter: a < 1 ? `blur(${(1 - a) * 5}px)` : undefined,
        textWrap: 'balance',
      } as React.CSSProperties}
    >
      {content}
    </div>
  );
};
