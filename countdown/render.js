// Renders flipboard.html frame-by-frame to MP4 via ffmpeg.
// Usage: node render.js [out.mp4] [fps]            full render (silent video)
//        node render.js --stills 0,150.1,295 ...   PNG stills into frames/
//        node render.js --flaps                    dump flap times to flaps.json (for soundtrack.py)
//        node render.js out.mp4 30 --range 288,306 render only part of the timeline
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const stills = opt('--stills') ? opt('--stills').split(',').map(Number) : null;
  const range = opt('--range') ? opt('--range').split(',').map(Number) : null;
  const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
  const out = pos[0] || 'countdown-silent.mp4';
  const fps = Number(pos[1]) || 30;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.resolve(__dirname, 'flipboard.html') + '?capture');
  await page.evaluate(async () => { await document.fonts.ready; });

  if (args.includes('--flaps')) {
    fs.writeFileSync(path.join(__dirname, 'flaps.json'), JSON.stringify(await page.evaluate(() => ({ duration: window.__duration, flaps: window.__flaps }))));
    await browser.close(); return;
  }
  if (stills) {
    fs.mkdirSync(path.join(__dirname, 'frames'), { recursive: true });
    for (const t of stills) {
      await page.evaluate(t => window.__render(t), t);
      await page.screenshot({ path: path.join(__dirname, `frames/still_${t.toFixed(2)}.png`) });
    }
    await browser.close(); return;
  }

  const duration = await page.evaluate(() => window.__duration);
  const [a, b] = range || [0, duration];
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', String(fps), out],
    { stdio: ['pipe', 'ignore', 'inherit'] });
  const f0 = Math.round(a * fps), f1 = Math.round(b * fps);
  // a renderer can't be trusted to be stateless across seeks, so warm up from f0
  let buf = null;
  for (let f = f0; f < f1; f++) {
    const changed = await page.evaluate(t => window.__render(t), f / fps);
    if (changed || !buf) buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) process.stderr.write(`frame ${f}/${f1}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
})();
