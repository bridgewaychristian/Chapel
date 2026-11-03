"""Synthesizes the split-flap clatter for flipboard.html and writes soundtrack.wav.

Reads flaps.json (dumped with `node render.js --flaps`): one click per flap,
a deeper thunk for the big countdown tiles, and a soft chord when the
WELCOME TO BRIDGEWAY CHAPEL message lands.
"""
import json
import wave
import numpy as np

SR = 44100
data = json.load(open('flaps.json'))
DUR = data['duration']
N = int(SR * DUR)
out = np.zeros(N)
rng = np.random.default_rng(7)


def add(t0, sig, gain=1.0):
    i = int(t0 * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    out[i:i + len(sig)] += sig * gain


def click(length, decay, tone, bright):
    n = int(SR * length)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    # crude high-pass for brightness: difference of noise
    noise = noise * (1 - bright) + np.diff(noise, prepend=0) * bright
    body = np.sin(2 * np.pi * tone * t) * 0.6
    return (noise + body) * np.exp(-t / decay)


for t, big in data['flaps']:
    if big:
        # big flap: release click, then the leaf slapping down
        add(t, click(0.03, 0.006, 900, 0.7), 0.25)
        add(t + 0.1, click(0.08, 0.018, 160 + rng.uniform(-10, 10), 0.3), 0.7)
    else:
        add(t + rng.uniform(0, 0.03), click(0.02, 0.004, rng.uniform(1400, 2600), 0.8), 0.09)

# welcome chord (Dmaj9-ish pad) as the message settles
T = 300 + 4.2
for i, f in enumerate([146.83, 220.0, 293.66, 369.99, 440.0, 659.25]):
    n = int(SR * (DUR - T))
    tt = np.arange(n) / SR
    e = np.minimum(1, tt / 1.5) * np.exp(-tt / 6)
    sig = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * e
    add(T + i * 0.12, sig, 0.06)

# soft limiter
peak = np.max(np.abs(out))
out = np.tanh(out / max(peak, 1e-9) * 1.6) * 0.85
pcm = (out * 32767).astype(np.int16)
with wave.open('soundtrack.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote soundtrack.wav', DUR, 's,', len(data['flaps']), 'flaps')
