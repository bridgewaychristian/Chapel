import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SCENES, SceneId, sec} from '../config/timing';
import {SceneOffsetCtx} from '../lib/time';

/** Places a scene on the master timeline using the central SCENES config. */
export const Scene: React.FC<{id: SceneId; children: React.ReactNode}> = ({id, children}) => {
  const from = sec(SCENES[id].start);
  const duration = sec(SCENES[id].end) - from;
  return (
    <Sequence from={from} durationInFrames={duration} name={id} layout="none">
      <SceneOffsetCtx.Provider value={from}>
        <AbsoluteFill>{children}</AbsoluteFill>
      </SceneOffsetCtx.Provider>
    </Sequence>
  );
};
