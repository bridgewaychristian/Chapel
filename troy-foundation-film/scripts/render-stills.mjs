// Renders representative frames from every scene into out/stills/ for review.
// Usage: npm run stills              (default review set)
//        npm run stills -- 12.5 80   (specific times in seconds)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const FPS = 30;
const DEFAULT_TIMES = [
  2.4, 5.0, 7.0, 9.6, // 1 encounters
  12.4, 14.9, // 2 never know (+ iris)
  18.0, 21.8, 23.5, 25.6, 29.0, 32.2, 35.2, // 3 moments
  37.2, 40.5, 44.2, 49.6, 52.6, // 4 golden line
  55.8, 57.6, 58.4, 60.6, // 5 personal
  64.0, 66.4, 68.6, 72.0, // 6 ripple
  76.2, 78.6, 81.0, 83.6, 87.0, 90.5, // 7 connected
  92.6, 94.2, 97.5, 100.4, 103.0, 106.0, 110.4, // 8 resolve + final hold
];

const times = process.argv.slice(2).length ? process.argv.slice(2).map(Number) : DEFAULT_TIMES;
const compId = process.env.COMP ?? 'CloserThanYouKnow';
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const composition = await selectComposition({serveUrl, id: compId, browserExecutable});

for (const s of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * FPS));
  const output = path.join(outDir, `t${s.toFixed(1).padStart(5, '0')}_f${String(frame).padStart(4, '0')}.png`);
  await renderStill({serveUrl, composition, frame, output, browserExecutable, scale: Number(process.env.SCALE ?? 0.5)});
  console.log('rendered', output);
}
