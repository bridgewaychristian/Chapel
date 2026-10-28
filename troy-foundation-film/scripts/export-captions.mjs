// Writes out/captions.srt and out/captions.vtt from the narration script and the cue table.
// Usage: npm run captions
import fs from 'node:fs';
import path from 'node:path';

const timing = fs.readFileSync(path.resolve('src/config/timing.ts'), 'utf8');
const cues = [...timing.matchAll(/(c\d{2}):\s*\{start:\s*([\d.]+),\s*end:\s*([\d.]+)\}/g)].map((m) => ({
  id: m[1],
  start: Number(m[2]),
  end: Number(m[3]),
}));
const script = Object.fromEntries(
  fs
    .readFileSync(path.resolve('public/narration/script.txt'), 'utf8')
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*(c\d{2})\s*\|\s*(.+?)\s*$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]]),
);

const ts = (s, sep) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${sec}${sep}${String(ms % 1000).padStart(3, '0')}`;
};

const missing = cues.filter((c) => !script[c.id]).map((c) => c.id);
if (missing.length) throw new Error(`No narration text for cues: ${missing.join(', ')}`);

const hold = 0.35; // keep captions up a touch after the line ends
const srt = cues.map((c, i) => `${i + 1}\n${ts(c.start, ',')} --> ${ts(c.end + hold, ',')}\n${script[c.id]}\n`).join('\n');
const vtt = 'WEBVTT\n\n' + cues.map((c) => `${c.id}\n${ts(c.start, '.')} --> ${ts(c.end + hold, '.')}\n${script[c.id]}\n`).join('\n');

fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/captions.srt', srt);
fs.writeFileSync('out/captions.vtt', vtt);
console.log(`Wrote ${cues.length} cues to out/captions.srt and out/captions.vtt`);
