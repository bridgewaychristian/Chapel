import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../config/theme';
import {FPS} from '../config/timing';

/** Review slate: makes it explicit that this is a silent animatic with estimated VO timing. */
export const AnimaticSlate: React.FC<{logoPlaceholder: boolean}> = ({logoPlaceholder}) => {
  const frame = useCurrentFrame();
  const s = Math.floor(frame / FPS);
  const tc = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(frame % FPS).padStart(2, '0')}`;
  const style: React.CSSProperties = {
    position: 'absolute',
    top: 34,
    fontFamily: FONTS.sans,
    fontSize: 17,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: COLORS.inkSoft,
    opacity: 0.62,
  };
  return (
    <>
      <div style={{...style, left: 44}}>
        Silent animatic · estimated narration timing · no voiceover recorded
        {logoPlaceholder ? ' · placeholder logo' : ''}
      </div>
      <div style={{...style, right: 44, fontVariantNumeric: 'tabular-nums'}}>{tc}</div>
    </>
  );
};
