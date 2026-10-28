/** Colours, type and layout constants. Brand values are best-guess placeholders
 *  (thetroyfoundation.org was not reachable from the build environment) — swap
 *  in official values from the Foundation's brand guide when available. */

export const COLORS = {
  ivory: '#F5EFE3',
  ivoryDeep: '#ECE3D2',
  paper: '#FBF8F1',
  ink: '#1E2330',
  inkSoft: '#4B5160',
  inkFaint: '#8E8F94',
  line: '#2A2F3B',
  gold: '#C29A45',
  goldLight: '#E2C47E',
  goldDeep: '#9C7A2E',
  goldGlow: 'rgba(226, 190, 110, 0.55)',
  // Muted illustration palette
  sage: '#A9B39A',
  sageDeep: '#7F8C72',
  clay: '#C8977A',
  clayDeep: '#A8735A',
  dusk: '#8FA1B3',
  duskDeep: '#62758A',
  sand: '#DCCBAB',
  rose: '#D6A595',
  plum: '#8C7487',
  wall: '#EDE4D3',
  wallWarm: '#F1E2C8',
  wood: '#B98F68',
  woodDeep: '#8F6A4B',
  night: '#5D6C80',
  shadow: 'rgba(30, 35, 48, 0.10)',
};

export const SKIN = ['#EBC8A6', '#D3A07A', '#A9714E', '#7B4E36', '#F2D5B9', '#5F3B28'];
export const HAIR = {
  black: '#2B2A2E',
  brown: '#5A3F2E',
  auburn: '#8A4B32',
  blond: '#C9A66B',
  gray: '#B9B6B0',
  white: '#E3DED6',
};

export const FONTS = {
  serif: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
  sans: '"Inter", "Helvetica Neue", Arial, sans-serif',
};

/** Title-safe area (10% margins at 1920x1080). Keep all text inside. */
export const SAFE = {x: 192, y: 108, w: 1536, h: 864};
