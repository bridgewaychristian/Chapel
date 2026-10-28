import React from 'react';
import {Statement} from '../components/Statement';
import {cue, prog, slow, useTime} from '../lib/time';
import {AMBER_WORLD, END_CAM_X, StreetWorld} from './StreetWorld';

const ZOOM_AT: [number, number] = [900, 640];
const zoomAt = (t: number) => 1 + 0.06 * prog(t, cue('c05').start - 0.8, cue('c05').end + 3, slow);

/** Where the stoplight's amber lamp sits on screen (Scene 3 irises open from it). */
export const amberOnScreen = (t: number): [number, number] => {
  const z = zoomAt(t);
  const sx = AMBER_WORLD[0] - END_CAM_X;
  const sy = AMBER_WORLD[1];
  return [ZOOM_AT[0] + (sx - ZOOM_AT[0]) * z, ZOOM_AT[1] + (sy - ZOOM_AT[1]) * z];
};

/** 2 · The quiet pause. The street falls away; two strangers keep waiting. */
export const S2NeverKnow: React.FC = () => {
  const t = useTime();
  const c05 = cue('c05');
  return (
    <>
      <StreetWorld
        camX={END_CAM_X}
        t={t}
        ground={1}
        market={1}
        sidewalk={1}
        stop={1}
        walkers={1}
        dim={prog(t, c05.start - 0.6, c05.start + 1.0)}
        zoom={zoomAt(t)}
        zoomAt={ZOOM_AT}
        amber={0.35 + 0.65 * prog(t, c05.end + 0.6, c05.end + 2.0)}
      />
      <Statement cue="c05" in={c05.start - 0.1} out={c05.end + 2.0} y={118} size={88} italic inDur={1.3} outDur={1.0} />
    </>
  );
};
