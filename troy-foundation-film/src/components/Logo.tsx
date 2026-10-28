import React from 'react';
import {Img, staticFile} from 'remotion';
import {BRAND} from '../config/assets';
import {COLORS, FONTS} from '../config/theme';

/**
 * The Foundation's logo. Uses BRAND.logo when an approved file is provided;
 * otherwise a typeset stand-in that is clearly tagged as a placeholder.
 */
export const Logo: React.FC<{width?: number}> = ({width = BRAND.logoWidth}) => {
  if (BRAND.logo) {
    return <Img src={staticFile(BRAND.logo)} style={{width, height: 'auto', display: 'block', margin: '0 auto'}} />;
  }
  return (
    <div style={{width, margin: '0 auto', textAlign: 'center', color: COLORS.ink}}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: '0.42em',
          paddingLeft: '0.42em',
          color: COLORS.inkSoft,
        }}
      >
        THE
      </div>
      <div style={{fontFamily: FONTS.serif, fontSize: 84, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.0, marginTop: 6}}>
        Troy Foundation
      </div>
      {BRAND.labelPlaceholders && (
        <div
          style={{
            display: 'inline-block',
            marginTop: 14,
            padding: '3px 10px',
            border: `1px dashed ${COLORS.inkFaint}`,
            borderRadius: 3,
            fontFamily: FONTS.sans,
            fontSize: 13,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.inkFaint,
          }}
        >
          Placeholder · replace with approved logo
        </div>
      )}
    </div>
  );
};
