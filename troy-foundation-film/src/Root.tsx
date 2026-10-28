import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './config/timing';

export const Root: React.FC = () => (
  <>
    <Composition
      id="CloserThanYouKnow"
      component={Film}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{captions: false, slate: true}}
    />
    <Composition
      id="CloserThanYouKnow-Captioned"
      component={Film}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{captions: true, slate: true}}
    />
  </>
);
