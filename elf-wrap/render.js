// Renders elf-wrap.html (a <canvas> animation) to MP4 via ffmpeg.
// Usage: node render.js out.mp4 [fps] [--range a,b]   silent video (or a slice of it)
//        node render.js --stills 1.2,4.3,...           PNG stills into frames/
//        node render.js --sfx                          dump timing + sound cues to cues.json
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const args = process.argv.slice(2);
  const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
  const out = pos[0] || 'elf-wrap-silent.mp4';
  const fps = Number(pos[1]) || 30;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 3840, height: 1080 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await page.goto('file://' + path.resolve(__dirname, 'elf-wrap.html') + '?capture');
  await page.evaluate(() => window.__ready);
  const grab = async t => {
    const b64 = await page.evaluate(t => { window.__render(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]; }, t);
    return Buffer.from(b64, 'base64');
  };

  if (args.includes('--sfx')) {
    fs.writeFileSync(path.join(__dirname, 'cues.json'), JSON.stringify(await page.evaluate(() => ({ timing: window.__timing, sfx: window.__sfx }))));
    await browser.close(); return;
  }
  if (opt('--stills')) {
    fs.mkdirSync(path.join(__dirname, 'frames'), { recursive: true });
    for (const t of opt('--stills').split(',').map(Number)) fs.writeFileSync(path.join(__dirname, `frames/still_${t.toFixed(2)}.jpg`), await grab(t));
    await browser.close(); return;
  }
  const duration = await page.evaluate(() => window.__duration);
  const [a, b] = opt('--range') ? opt('--range').split(',').map(Number) : [0, duration];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', String(fps), out], { stdio: ['pipe', 'ignore', 'inherit'] });
  const f0 = Math.round(a * fps), f1 = Math.round(b * fps);
  for (let f = f0; f < f1; f++) {
    const buf = await grab(f / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) process.stderr.write(`frame ${f}/${f1}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
})();
