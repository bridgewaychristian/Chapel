"""Soundtrack for elf-wrap.html: "Deck the Halls" (traditional, public domain)
arranged and synthesized from scratch, plus sound effects timed to the animation.

Usage: python3 soundtrack.py [cues.json] [out.wav]
cues.json comes from `node render.js --sfx` and carries the tempo, section
times and every sound cue, so the music and picture always line up.
"""
import json
import sys
import wave
import numpy as np

IN = sys.argv[1] if len(sys.argv) > 1 else 'cues.json'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'elf-wrap-soundtrack.wav'
cues = json.load(open(IN))
T = cues['timing']
SR = 44100
DUR = T['DURATION']
N = int(SR * DUR)
L = np.zeros(N); Rr = np.zeros(N)       # stereo
rng = np.random.default_rng(11)
BEAT = 60 / T['BPM']


def add(t0, sig, gain=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= N or len(sig) == 0:
        return
    if i < 0:
        sig = sig[-i:]; i = 0
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    Rr[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def tt(d):
    return np.arange(int(SR * d)) / SR


def band(x, lo, hi):
    """Brick-wall band-pass via FFT (fine for short sounds)."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def midi(n):
    p = NOTE[n[0]]; rest = n[1:]
    if rest[0] == '#': p += 1; rest = rest[1:]
    elif rest[0] == 'b': p -= 1; rest = rest[1:]
    return p + 12 * (int(rest) + 1)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------------- instruments ----------------
def glock(f, d=1.2):
    t = tt(d)
    s = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)
         + .15 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12))
    return s * np.exp(-t * 3.2) * np.minimum(1, t * 800)


def celesta(f, d=.9):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) + .5 * np.sin(4 * np.pi * f * t) * np.exp(-t * 5) + .2 * np.sin(6 * np.pi * f * t) * np.exp(-t * 9)
    return s * np.exp(-t * 4) * np.minimum(1, t * 600)


def pluck_bass(f, d=.5):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) + .45 * np.sin(4 * np.pi * f * t) * np.exp(-t * 8) + .2 * np.sin(6 * np.pi * f * t) * np.exp(-t * 14)
    return s * np.exp(-t * 4.5) * np.minimum(1, t * 300)


def piano(f, d=.6):
    t = tt(d)
    s = sum(np.sin(2 * np.pi * f * h * t) * np.exp(-t * (2.5 + h * 1.6)) / h for h in range(1, 6))
    return s * np.minimum(1, t * 500)


def pad(f, d):
    t = tt(d)
    s = sum(np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6)) / h ** 1.3 for h in range(1, 7))
    s += .5 * sum(np.sin(2 * np.pi * f * 1.004 * h * t) / h ** 1.3 for h in range(1, 5))
    env = np.minimum(1, t / .25) * np.minimum(1, (d - t) / .3)
    return s * env


def sleigh(d=.12):
    t = tt(d)
    n = rng.standard_normal(len(t))
    n = band(n, 6000, 14000)
    jing = sum(np.sin(2 * np.pi * rng.uniform(5000, 9000) * t + rng.uniform(0, 6)) for _ in range(5)) * .08
    return (n * .6 + jing) * np.exp(-t * 30)


def kick():
    t = tt(.3)
    f = 120 * np.exp(-t * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def brush():
    t = tt(.18)
    return band(rng.standard_normal(len(t)), 1500, 9000) * np.exp(-t * 18) * .5


# ---------------- song: Deck the Halls ----------------
lineA = [('G4', 1.5), ('F4', .5), ('E4', 1), ('D4', 1), ('C4', 1), ('D4', 1), ('E4', 1), ('C4', 1),
         ('D4', .5), ('E4', .5), ('F4', .5), ('D4', .5), ('E4', 1.5), ('D4', .5), ('C4', 1), ('B3', 1), ('C4', 2)]
lineB = [('D4', 1.5), ('E4', .5), ('F4', 1), ('D4', 1), ('E4', 1.5), ('F#4', .5), ('G4', 1), ('D4', 1),
         ('E4', .5), ('F#4', .5), ('G4', 1), ('A4', .5), ('B4', .5), ('C5', 1), ('B4', 1), ('A4', 1), ('G4', 2)]
lineC = [('G4', 1.5), ('F4', .5), ('E4', 1), ('D4', 1), ('C4', 1), ('D4', 1), ('E4', 1), ('C4', 1),
         ('A4', .5), ('A4', .5), ('A4', .5), ('A4', .5), ('G4', 1.5), ('F4', .5), ('E4', 1), ('D4', 1), ('C4', 2)]
MEL = lineA + lineA + lineB + lineC
CH = {'C': [0, 4, 7], 'G7': [7, 11, 14, 17], 'G': [7, 11, 14], 'Dm': [2, 5, 9], 'Am': [9, 12, 16], 'D7': [2, 6, 9, 12], 'F': [5, 9, 12]}
HALF = (['C', 'G7', 'C', 'C', 'G7', 'C', 'G7', 'C'] * 2 + ['Dm', 'G7', 'Am', 'D7', 'G', 'D7', 'G', 'G'] + ['C', 'G7', 'C', 'C', 'F', 'G7', 'C', 'C'])


def verse(t0, beat, shift, big):
    # melody
    tb = 0
    for n, d in MEL:
        m = midi(n) + shift
        add(t0 + tb * beat, glock(hz(m + 12), 1.4), .30, -.15)
        if big:
            add(t0 + tb * beat, celesta(hz(m), 1.0), .16, .2)
        tb += d
    # harmony a third below in verse 2
    if big:
        tb = 0
        for n, d in MEL:
            m = midi(n) + shift
            add(t0 + tb * beat + .004, celesta(hz(m - 4 if (m % 12) in (4, 9, 11) else m - 3), .8), .08, .35)
            tb += d
    for i, ch in enumerate(HALF):
        tc = t0 + i * 2 * beat
        root = CH[ch][0]
        base = 36 + shift
        # bass: root on 1, fifth on 2 (walking in verse 2)
        add(tc, pluck_bass(hz(base + root)), .55)
        add(tc + beat, pluck_bass(hz(base + root + (7 if big else 12))), .4)
        # oom-pah chords on the off-beats
        for k in (beat * .5, beat * 1.5):
            for iv in CH[ch]:
                add(tc + k, piano(hz(60 + shift + iv - 12 * (iv > 12)), .45), .07, .1)
        if big:
            for iv in CH[ch][:3]:
                add(tc, pad(hz(48 + shift + iv), 2 * beat + .05), .035, -.3)
    nbeats = int(sum(d for _, d in MEL))
    for b in range(nbeats * 2):   # sleigh bells on eighths (quarters in verse 1)
        if big or b % 2 == 0:
            add(t0 + b * beat / 2, sleigh(), .22 if b % 2 == 0 else .12, .45)
    if big:
        for b in range(nbeats):
            if b % 2 == 0:
                add(t0 + b * beat, kick(), .5)
            else:
                add(t0 + b * beat, brush(), .35, -.2)


M0, V2, V3, TB = T['M0'], T['V2'], T['V3'], T['TAGBEAT']
verse(M0, BEAT, 0, False)
verse(V2, BEAT, 2, True)
# tag (in D): "fa la la la la, la la la la" slowed down, final chord rings out
tag = [('A4', .5), ('A4', .5), ('A4', .5), ('A4', .5), ('G4', 1.5), ('F4', .5), ('E4', 1), ('D4', 1), ('C4', 4)]
tb = 0
for n, d in tag:
    m = midi(n) + 2
    add(V3 + tb * TB, glock(hz(m + 12), 2.5 if d >= 4 else 1.4), .32, -.15)
    add(V3 + tb * TB, celesta(hz(m), 1.5), .16, .2)
    tb += d
tagCh = [(0, [7, 11, 14]), (2, [7, 11, 14, 17]), (4, [0, 4, 7]), (5, [7, 11, 14, 17])]
for b, ivs in tagCh:
    for iv in ivs:
        add(V3 + b * TB, pad(hz(50 + iv), 2 * TB + .1), .04)
    add(V3 + b * TB, pluck_bass(hz(38 + ivs[0])), .5)
FIN = T['FINAL']
for iv in [0, 4, 7, 12, 16, 19]:
    add(FIN, pad(hz(50 + iv), DUR - FIN), .045)
    add(FIN, piano(hz(62 + iv), 3.0), .09)
add(FIN, pluck_bass(hz(38), 3.0), .6)
for i in range(16):   # bell glissando on the final chord
    add(FIN + i * .045, glock(hz(74 + [0, 4, 7, 12][i % 4] + 12 * (i // 4)), 1.8), .12, (i % 5 - 2) / 3)
for b in range(int((DUR - FIN) / .25)):
    add(FIN + b * .25, sleigh(.2), .12 * np.exp(-b * .12), .45)

# ---------------- sound effects ----------------
def whistle(d):
    t = tt(d)
    f = 1900 * (1 - t / d) + 500 + 25 * np.sin(2 * np.pi * 6 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t * 20) * np.minimum(1, (d - t) * 20)


def thud(big=1.0):
    t = tt(.4)
    f = 90 * np.exp(-t * 10) + 40
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) + band(rng.standard_normal(len(t)), 60, 800) * np.exp(-t * 25) * .5) * big


def snap():
    t = tt(.08)
    return band(rng.standard_normal(len(t)), 1800, 6500) * np.exp(-t * 90) * 1.8


def whoosh(d=.9):
    t = tt(d)
    n = rng.standard_normal(len(t))
    lo = band(n, 200, 1200); hi = band(n, 1200, 6000)
    p = t / d
    env = np.sin(np.pi * p) ** 2
    return (lo * (1 - p) + hi * p) * env


def sparkle(d=1.0, base=1200, n=24):
    out = np.zeros(int(SR * (d + .6)))
    for i in range(n):
        f = base * 2 ** (i / n * 2.5) * rng.uniform(.97, 1.03)
        s = glock(f, .5) * .25
        j = int(i / n * d * SR)
        out[j:j + len(s)] += s[: len(out) - j]
    return out


def pop():
    t = tt(.12)
    f = 300 + 900 * t / .12
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 25)


def boing(size):
    t = tt(.16)
    f0 = 900 - size * 3
    f = f0 * (1 + .25 * np.sin(2 * np.pi * 18 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 18)


def clack():
    t = tt(.08)
    return (np.sin(2 * np.pi * 820 * t) + .7 * np.sin(2 * np.pi * 1330 * t)) * np.exp(-t * 60) + band(rng.standard_normal(len(t)), 800, 4000) * np.exp(-t * 80) * .5


def zip_(d):
    t = tt(d)
    f = 500 + 900 * t / d
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * .3
    return (whoosh(d) * .8 + tone) * np.minimum(1, (d - t) * 10)


def roll(d):
    t = tt(d)
    return band(rng.standard_normal(len(t)), 40, 300) * (.6 + .4 * np.sin(2 * np.pi * 7 * t)) * np.minimum(1, t * 5) * np.minimum(1, (d - t) * 5)


def chime(a=1):
    return glock(2093, 1.0) * .5 + glock(3136, 1.0) * .3


def thump():
    t = tt(.15)
    return np.sin(2 * np.pi * 140 * t) * np.exp(-t * 30) + band(rng.standard_normal(len(t)), 100, 1500) * np.exp(-t * 40) * .3


def power():
    t = tt(.35)
    buzz = np.sign(np.sin(2 * np.pi * 60 * t)) * .3 * np.exp(-t * 8)
    zap = band(rng.standard_normal(len(t)), 2000, 9000) * np.exp(-t * 12)
    return buzz + zap


def zing(d):
    t = tt(d)
    f = 1500 + 1500 * (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * .15 * np.minimum(1, t * 10) * np.minimum(1, (d - t) * 4)


boings = 0
for t0, kind, a, b in cues['sfx']:
    if kind == 'whistle': add(t0, whistle(a), .16, 0)
    elif kind == 'thud': add(t0, thud(), .8)
    elif kind == 'swish': add(t0, whoosh(.4), .25)
    elif kind == 'snap': add(t0, snap(), .9); add(t0, sparkle(.35, 2400, 8), .5)
    elif kind == 'wrap': add(t0, whoosh(1.0), .5); add(t0, sparkle(1.0, 900, 30), .6)
    elif kind == 'pop': add(t0, pop(), .45, rng.uniform(-.5, .5))
    elif kind == 'boing':
        if a >= 200: add(t0, boing(60) * 1.0, .4)
        else: add(t0, boing(a), .05, rng.uniform(-.8, .8))
    elif kind == 'clack': add(t0, clack(), .35, rng.uniform(-.6, .6))
    elif kind == 'zip': add(t0, zip_(a), .12, rng.uniform(-.6, .6))
    elif kind == 'roll': add(t0, roll(a), .3)
    elif kind == 'whoosh': add(t0, whoosh(.8), .18)
    elif kind == 'chime': add(t0, chime(), .07 * (a or 1), rng.uniform(-.6, .6))
    elif kind == 'thump': add(t0, thump(), .15, rng.uniform(-.6, .6))
    elif kind == 'zing': add(t0, zing(a), .25)
    elif kind == 'sparkleBig': add(t0, sparkle(1.4, 900, 40), .7)
# power on: zap + shimmer right on the verse-2 downbeat
add(V2 - .02, power(), .5); add(V2, sparkle(1.2, 700, 36), .5)

# ---------------- mix: reverb + limiter ----------------
def reverb(x, secs=1.8, mix=.22):
    n = int(SR * secs)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2)
    ir[0] = 0
    m = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)[: len(x)]
    y *= np.sqrt(np.mean(x ** 2) / max(np.mean(y ** 2), 1e-12))
    return x * (1 - mix) + y * mix


L = reverb(L); Rr = reverb(Rr)
st = np.stack([L, Rr], 1)
st /= np.max(np.abs(st)) + 1e-9
st = np.tanh(st * 1.5) / np.tanh(1.5) * .9
fade = np.ones(N); fn = int(SR * 1.5); fade[-fn:] = np.linspace(1, 0, fn)
st *= fade[:, None]
pcm = (st * 32767).astype(np.int16)
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', OUT, DUR, 's')
