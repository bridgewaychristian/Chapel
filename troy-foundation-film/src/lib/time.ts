import {createContext, useContext} from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {CUES, CueId, FPS} from '../config/timing';

/** Frame offset of the enclosing <Sequence>, so scenes can think in master-timeline seconds. */
export const SceneOffsetCtx = createContext(0);

/** Current time in master-timeline seconds (deterministic, frame based). */
export const useTime = () => {
  const frame = useCurrentFrame();
  const offset = useContext(SceneOffsetCtx);
  return (frame + offset) / FPS;
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const ease = Easing.bezier(0.45, 0, 0.2, 1); // gentle in-out
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.5, 0, 0.75, 0);
export const slow = Easing.bezier(0.6, 0, 0.25, 1); // camera moves

/** 0..1 progress between two times (seconds), eased. */
export const prog = (t: number, a: number, b: number, fn: (x: number) => number = ease) =>
  fn(clamp01((t - a) / (b - a)));

/** Linear 0..1 progress. */
export const lin = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** Fade window: rises over [a, a+inD], falls over [b-outD, b]. */
export const fadeWindow = (t: number, a: number, b: number, inD = 0.8, outD = 0.8) =>
  Math.min(prog(t, a, a + inD), 1 - prog(t, b - outD, b));

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export const cue = (id: CueId) => CUES[id];

export const lerpPoints = (a: Pt[], b: Pt[], p: number): Pt[] =>
  a.map((pt, i) => [mix(pt[0], b[i][0], p), mix(pt[1], b[i][1], p)]);

export type Pt = [number, number];
