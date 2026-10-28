import React from 'react';
import {Statement} from '../components/Statement';
import {cue, prog, slow, useTime} from '../lib/time';
import {END_CAM_X, StreetWorld} from './StreetWorld';

/** 1 · Ordinary encounters: a single ink line becomes a street we travel along. */
export const S1Encounters: React.FC = () => {
  const t = useTime();
  const c01 = cue('c01');
  const c02 = cue('c02');
  const c03 = cue('c03');
  const c04 = cue('c04');

  // Three overlapping slow moves: drift at the market, glide to the sidewalk, settle at the light.
  const camX =
    280 * prog(t, c02.start - 0.8, c02.end + 0.2, slow) +
    1150 * prog(t, c02.end - 0.6, c03.end, slow) +
    (END_CAM_X - 1430) * prog(t, c03.end - 0.6, c04.end - 0.3, slow);

  return (
    <>
      <StreetWorld
        camX={camX}
        t={t}
        ground={prog(t, 0.3, 2.6)}
        market={prog(t, c01.end + 0.35, c02.start + 1.0)}
        sidewalk={prog(t, c02.end - 0.6, c03.start + 0.8)}
        stop={prog(t, c03.end - 0.6, c04.start + 1.0)}
        walkers={prog(t, c02.end, c04.end)}
      />
      <Statement cue="c01" in={c01.start - 0.2} out={c01.end + 0.5} y={300} size={78} italic />
    </>
  );
};
