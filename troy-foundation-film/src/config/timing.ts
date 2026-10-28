/**
 * CENTRAL TIMING CONFIGURATION
 *
 * All times are in SECONDS on the film's master timeline.
 *
 * NARRATION_IS_ESTIMATED = true means no voiceover recording exists yet and the
 * cue times below are estimates (~150 wpm, restrained read with breaths).
 * When the approved VO is recorded:
 *   1. Drop the file in public/audio/ and set AUDIO.voiceover.src in assets.ts.
 *   2. Replace each cue's start/end with the measured times from the recording
 *      (a DAW marker list or a forced-alignment pass works well).
 *   3. Nudge SCENES boundaries if a read runs long; scene animation is keyed to
 *      these cue times, so most motion follows automatically.
 *   4. Set NARRATION_IS_ESTIMATED = false to remove the animatic slate.
 *
 * This file has no imports so Node scripts (caption export) can read it directly.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const NARRATION_IS_ESTIMATED = true;

export type CueId =
  | 'c01' | 'c02' | 'c03' | 'c04' | 'c05' | 'c06' | 'c07' | 'c08' | 'c09' | 'c10'
  | 'c11' | 'c12' | 'c13' | 'c14' | 'c15' | 'c16' | 'c17' | 'c18' | 'c19' | 'c20'
  | 'c21' | 'c22' | 'c23' | 'c24' | 'c25' | 'c26' | 'c27' | 'c28' | 'c29' | 'c30'
  | 'c31' | 'c32' | 'c33';

export type Span = {start: number; end: number};

/** Narration cue windows (estimated). Text lives in public/narration/script.txt. */
export const CUES: Record<CueId, Span> = {
  c01: {start: 1.2, end: 3.4}, //   You might pass them tomorrow.
  c02: {start: 4.1, end: 5.5}, //   At the grocery store.
  c03: {start: 6.0, end: 7.2}, //   On the sidewalk.
  c04: {start: 7.8, end: 9.8}, //   Waiting beside you at a stoplight.
  c05: {start: 11.4, end: 12.8}, // And never know.            (quiet pause follows)
  c06: {start: 15.2, end: 20.9}, // ...family ... dinner
  c07: {start: 21.6, end: 24.9}, // ...safe to go after school.
  c08: {start: 25.6, end: 30.3}, // ...student ... a place for them.
  c09: {start: 31.2, end: 33.0}, // You may never see those moments.
  c10: {start: 33.6, end: 35.6}, // But you can help make them possible.
  c11: {start: 36.6, end: 42.4}, // When you give to support Troy...
  c12: {start: 43.0, end: 44.6}, // Through local organizations.
  c13: {start: 45.1, end: 47.0}, // Through people who know our neighbors.
  c14: {start: 47.5, end: 50.3}, // Through opportunities...
  c15: {start: 51.0, end: 53.9}, // Together, our gifts...
  c16: {start: 55.0, end: 56.4}, // Food on a table.
  c17: {start: 57.1, end: 58.6}, // A door that stays open.
  c18: {start: 59.3, end: 61.1}, // A chance to begin again.
  c19: {start: 63.0, end: 64.8}, // And the impact keeps going.
  c20: {start: 65.5, end: 67.2}, // A child grows in confidence.
  c21: {start: 67.9, end: 69.5}, // A family finds its footing.
  c22: {start: 70.2, end: 73.9}, // Someone who once needed a hand...
  c23: {start: 74.9, end: 76.7}, // You may never know their name.
  c24: {start: 77.5, end: 79.2}, // They may never know yours.
  c25: {start: 80.0, end: 82.0}, // But your lives are connected.  (CLIMAX)
  c26: {start: 83.2, end: 84.1}, // By a gift.
  c27: {start: 84.7, end: 85.7}, // By this place.
  c28: {start: 86.4, end: 89.4}, // By the belief...
  c29: {start: 93.0, end: 94.4}, // The Troy Foundation.
  c30: {start: 95.2, end: 96.0}, // Give here.
  c31: {start: 96.4, end: 98.0}, // Help change a life here.
  c32: {start: 99.2, end: 101.0}, // You may never see the moment.
  c33: {start: 101.8, end: 103.6}, // But someone will live it.
};

export type SceneId =
  | 'encounters'
  | 'neverKnow'
  | 'moments'
  | 'goldenLine'
  | 'personal'
  | 'ripple'
  | 'connected'
  | 'resolve';

/**
 * Scene windows. Neighbouring scenes overlap; the incoming scene owns the
 * transition (mask, iris or line hand-off) during the overlap.
 */
export const SCENES: Record<SceneId, Span> = {
  encounters: {start: 0, end: 11.0},
  neverKnow: {start: 10.6, end: 16.4},
  moments: {start: 14.6, end: 36.8},
  goldenLine: {start: 35.6, end: 55.0},
  personal: {start: 54.0, end: 63.0},
  ripple: {start: 62.2, end: 75.2},
  connected: {start: 74.2, end: 93.4},
  resolve: {start: 91.6, end: 110.5},
};

/** Final end card: fully composed at `fullAt`, then held untouched for `hold` seconds. */
export const FINAL_CARD = {inStart: 104.2, fullAt: 105.4, hold: 5.1};

export const TOTAL_SECONDS = FINAL_CARD.fullAt + FINAL_CARD.hold; // 110.5 s
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);

export const sec = (s: number) => Math.round(s * FPS);
