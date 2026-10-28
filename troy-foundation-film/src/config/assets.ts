/**
 * ASSET PATHS (relative to /public). Set a path to `null` when the asset is
 * not available — the film then uses a clearly labelled placeholder (logo) or
 * renders silently (audio).
 */

export const BRAND = {
  /** Approved Foundation logo, e.g. 'brand/troy-foundation-logo.svg'. null = placeholder. */
  logo: null as string | null,
  /** Logo display width on the end card, in px. */
  logoWidth: 620,
  /** Show the small "placeholder" tag under the stand-in logo. */
  labelPlaceholders: true,
  url: 'thetroyfoundation.org',
};

export type TrackConfig = {
  /** Path inside /public, e.g. 'audio/voiceover.wav'. null = track absent. */
  src: string | null;
  /** Linear gain 0..1. */
  volume: number;
  /** Seconds on the master timeline where the track starts. */
  startAt: number;
  fadeIn: number;
  fadeOut: number;
};

export const AUDIO: {
  voiceover: TrackConfig;
  music: TrackConfig & {
    /** Gain multiplier applied to music while a narration cue is speaking. */
    duckUnderVoice: number;
  };
} = {
  // Approved VO read of public/narration/script.txt. Not yet recorded.
  voiceover: {src: null, volume: 1, startAt: 0, fadeIn: 0, fadeOut: 0.5},
  // Licensed music only. None is included with this project.
  music: {src: null, volume: 0.32, startAt: 0, fadeIn: 2.5, fadeOut: 5, duckUnderVoice: 0.7},
};

export const FONT_FILES = [
  {family: 'Cormorant Garamond', weight: '400', style: 'normal', file: 'fonts/cormorant-garamond-latin-400-normal.woff2'},
  {family: 'Cormorant Garamond', weight: '400', style: 'italic', file: 'fonts/cormorant-garamond-latin-400-italic.woff2'},
  {family: 'Cormorant Garamond', weight: '500', style: 'normal', file: 'fonts/cormorant-garamond-latin-500-normal.woff2'},
  {family: 'Cormorant Garamond', weight: '500', style: 'italic', file: 'fonts/cormorant-garamond-latin-500-italic.woff2'},
  {family: 'Cormorant Garamond', weight: '600', style: 'normal', file: 'fonts/cormorant-garamond-latin-600-normal.woff2'},
  {family: 'Cormorant Garamond', weight: '600', style: 'italic', file: 'fonts/cormorant-garamond-latin-600-italic.woff2'},
  {family: 'Inter', weight: '300', style: 'normal', file: 'fonts/inter-latin-300-normal.woff2'},
  {family: 'Inter', weight: '400', style: 'normal', file: 'fonts/inter-latin-400-normal.woff2'},
  {family: 'Inter', weight: '500', style: 'normal', file: 'fonts/inter-latin-500-normal.woff2'},
  {family: 'Inter', weight: '600', style: 'normal', file: 'fonts/inter-latin-600-normal.woff2'},
] as const;
