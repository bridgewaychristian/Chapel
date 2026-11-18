// Renders a countdown page (flipboard.html by default, or --page led-wall.html)
// frame-by-frame to MP4 via ffmpeg. Canvas size comes from the page's window.__size.
// Odd sizes are padded with one black row/column (H.264 needs even dimensions).
// Usage: node render.js [out.mp4] [fps]            full render (silent video)
//        node render.js --stills 0,150.1,295 ...   PNG stills into frames/
//        node render.js --flaps                    dump flap times to flaps-<page>.json (for soundtrack.py)
//        node render.js out.mp4 30 --range 288,306 render only part of the timeline
//        --out-size 3840x1080   render at a higher pixel density (scale = width / page width),
//                               then crop/pad to exactly that size
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
  const pageFile = opt('--page') || 'flipboard.html';
  const base = path.basename(pageFile, '.html');

  const outSize = opt('--out-size') ? opt('--out-size').split('x').map(Number) : null;
  // big tile-memory budget so high-resolution frames are fully rasterized
  const browser = await chromium.launch({ args: ['--force-gpu-mem-available-mb=8192', '--disable-partial-raster'] });
  // page width/height is read from the page itself; the scale has to be fixed at context creation
  const probe = await browser.newPage();
  await probe.goto('file://' + path.resolve(__dirname, pageFile) + '?capture');
  const [pw, ph] = await probe.evaluate(() => window.__size || [1920, 1080]);
  await probe.close();
  const dpr = outSize ? outSize[0] / pw : 1;
  const ctx = await browser.newContext({ viewport: { width: pw, height: ph }, deviceScaleFactor: dpr });
  const page = await ctx.newPage();
  await page.goto('file://' + path.resolve(__dirname, pageFile) + '?capture');
  await page.evaluate(async () => { await document.fonts.ready; });

  if (args.includes('--flaps')) {
    fs.writeFileSync(path.join(__dirname, `flaps-${base}.json`), JSON.stringify(await page.evaluate(() => ({ duration: window.__duration, flaps: window.__flaps }))));
    await browser.close(); return;
  }
  if (stills) {
    fs.mkdirSync(path.join(__dirname, 'frames'), { recursive: true });
    for (const t of stills) {
      await page.evaluate(t => window.__render(t), t);
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(__dirname, `frames/${base}_${t.toFixed(2)}.png`) });
    }
    await browser.close(); return;
  }

  const duration = await page.evaluate(() => window.__duration);
  const [a, b] = range || [0, duration];
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-vf', outSize ? `crop=min(iw\\,${outSize[0]}):min(ih\\,${outSize[1]}):0:0,pad=${outSize[0]}:${outSize[1]}:0:0:black` : 'pad=ceil(iw/2)*2:ceil(ih/2)*2:0:0:black', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', String(fps), out],
    { stdio: ['pipe', 'ignore', 'inherit'] });
  const f0 = Math.round(a * fps), f1 = Math.round(b * fps);
  // a renderer can't be trusted to be stateless across seeks, so warm up from f0
  let buf = null;
  for (let f = f0; f < f1; f++) {
    const changed = await page.evaluate(t => window.__render(t), f / fps);
    if (changed || !buf) {
      // let the compositor finish rasterizing (matters at high pixel density)
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      if (!buf) await page.waitForTimeout(1500);
      buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    }
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) process.stderr.write(`frame ${f}/${f1}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
})();
