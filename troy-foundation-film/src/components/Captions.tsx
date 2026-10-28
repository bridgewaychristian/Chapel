import React from 'react';
import {COLORS, FONTS} from '../config/theme';
import {CUES, CueId} from '../config/timing';
import {lin, useTime} from '../lib/time';
import {useNarration} from '../narration/narration';

/** Optional burned-in closed captions, driven by the same cue table as the edit. */
export const Captions: React.FC = () => {
  const t = useTime();
  const narration = useNarration();
  const active = (Object.keys(CUES) as CueId[]).find((id) => t >= CUES[id].start - 0.1 && t < CUES[id].end + 0.35);
  if (!active) return null;
  const {start, end} = CUES[active];
  const o = Math.min(lin(t, start - 0.1, start + 0.1), 1 - lin(t, end + 0.2, end + 0.35));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 92,
        display: 'flex',
        justifyContent: 'center',
        opacity: o,
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          padding: '12px 28px 14px',
          borderRadius: 10,
          background: 'rgba(30, 35, 48, 0.78)',
          color: COLORS.paper,
          fontFamily: FONTS.sans,
          fontSize: 34,
          fontWeight: 400,
          lineHeight: 1.3,
          textAlign: 'center',
          textWrap: 'balance',
        } as React.CSSProperties}
      >
        {narration[active]}
      </div>
    </div>
  );
};
