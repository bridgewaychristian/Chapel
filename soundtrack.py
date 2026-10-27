"""Synthesizes the soundtrack for chapel-intro (26s, 120 BPM) and writes soundtrack.wav.

Every cue is timed to the animation in chapel-intro.html.
"""
import wave
import numpy as np

SR = 44100
DUR = 26.0
BEAT = 0.5  # 120 BPM
N = int(SR * DUR)
out = np.zeros(N)
rng = np.random.default_rng(3)


def hz(note):
    """'C4' / 'F#3' / 'Bb2' -> frequency."""
    names = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    n = names[note[0]]
    rest = note[1:]
    if rest[0] == '#':
        n += 1; rest = rest[1:]
    elif rest[0] == 'b':
        n -= 1; rest = rest[1:]
    return 440 * 2 ** ((n + 12 * (int(rest) + 1) - 69) / 12)


def add(t0, sig, gain=1.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    out[i:i + len(sig)] += sig * gain


def env(n, a=0.005, d=0.2, s=0.0, r=0.05, hold=None):
    """ADSR envelope of length n samples."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-6), 1.0)
    dec = np.exp(-(t - a) / max(d, 1e-6)) * (1 - s) + s
    e = np.where(t >= a, dec, e)
    if hold is not None:
        rel = np.clip(1 - (t - hold) / r, 0, 1)
        e = e * np.where(t > hold, rel, 1)
    return e


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def osc(f, dur, kind='sine', vib=0.0, vibrate=5.0):
    t = np.arange(int(dur * SR)) / SR
    if callable(f):
        ph = 2 * np.pi * np.cumsum(f(t)) / SR
    else:
        ph = 2 * np.pi * f * t
    if vib:
        ph = ph + vib * np.sin(2 * np.pi * vibrate * t)
    if kind == 'sine':
        return np.sin(ph)
    if kind == 'tri':
        return 2 / np.pi * np.arcsin(np.sin(ph))
    if kind == 'saw':  # band-limited-ish additive saw
        return sum(np.sin(k * ph) / k for k in range(1, 9)) * 0.6
    if kind == 'square':
        return sum(np.sin(k * ph) / k for k in range(1, 10, 2)) * 0.8


# ---------- instruments ----------
def kick(t0, g=0.9):
    d = 0.35
    t = np.arange(int(d * SR)) / SR
    f = 50 + 110 * np.exp(-t * 30)
    add(t0, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9), g)


def snare(t0, g=0.45):
    d = 0.22
    t = np.arange(int(d * SR)) / SR
    noise = rng.uniform(-1, 1, len(t)) * np.exp(-t * 18)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25)
    add(t0, noise * 0.8 + tone * 0.5, g)


def hat(t0, g=0.12, d=0.05):
    t = np.arange(int(d * SR)) / SR
    n = rng.uniform(-1, 1, len(t))
    n = n - lowpass(n, 6000)  # crude high-pass
    add(t0, n * np.exp(-t * 60), g)


def crash(t0, g=0.35):
    d = 2.5
    t = np.arange(int(d * SR)) / SR
    n = rng.uniform(-1, 1, len(t))
    n = n - lowpass(n, 4000)
    add(t0, n * np.exp(-t * 1.6), g)


def pluck(t0, note, d=0.3, g=0.18, kind='tri'):
    add(t0, osc(hz(note), d, kind) * env(int(d * SR), 0.003, d / 3), g)


def bell(t0, note, d=1.0, g=0.15):
    f = hz(note)
    t = np.arange(int(d * SR)) / SR
    s = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)
         + 0.25 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 10))
    add(t0, s * np.exp(-t * 3.5), g)


def pad(t0, notes, d, g=0.06, a=0.6, kind='saw', cutoff=1800):
    n = int(d * SR)
    s = sum(osc(hz(x) * (1 + dt), d, kind) for x in notes for dt in (-0.003, 0.003))
    s = lowpass(s, cutoff)
    add(t0, s * env(n, a, 10, 1.0, min(0.6, d / 2), hold=d - min(0.6, d / 2)), g)


def stab(t0, notes, d=0.35, g=0.09):
    n = int(d * SR)
    s = sum(osc(hz(x), d, 'saw') for x in notes)
    add(t0, lowpass(s, 3000) * env(n, 0.005, d / 3), g)


def bass(t0, note, d=0.45, g=0.25):
    n = int(d * SR)
    s = lowpass(osc(hz(note), d, 'saw'), 700)
    add(t0, s * env(n, 0.005, 0.25, 0.4, 0.05, hold=d - 0.05), g)


def pop(t0, g=0.25, f=900):
    d = 0.08
    t = np.arange(int(d * SR)) / SR
    ff = f * (1 + 2 * np.exp(-t * 60))
    add(t0, np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 50), g)


def whoosh(t0, d, up=True, g=0.2):
    n = int(d * SR)
    x = rng.uniform(-1, 1, n)
    t = np.arange(n) / SR
    # sweep a one-pole lowpass cutoff
    cut = np.linspace(300, 6000, n) if up else np.linspace(6000, 300, n)
    y = np.empty(n); acc = 0.0
    for i in range(n):
        a = np.exp(-2 * np.pi * cut[i] / SR)
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    shape = np.sin(np.pi * t / d) ** 2
    add(t0, y * shape * 3, g)


def sad_horn(t0, note, d, g=0.16, bend=0.0):
    f0 = hz(note)
    fn = lambda t: f0 * (1 + bend * t / d)
    n = int(d * SR)
    s = lowpass(osc(fn, d, 'saw', vib=0.0), 1100)
    t = np.arange(n) / SR
    s = s * (1 + 0.25 * np.sin(2 * np.pi * 6 * t) * (t > d * 0.5))  # wobble on the long note
    add(t0, s * env(n, 0.04, 10, 1.0, 0.12, hold=d - 0.12), g)


def groove(t0, t1, chords, hats=True, snares=True):
    """4-on-the-floor groove with plucked chords, one chord per bar (4 beats)."""
    b = 0
    t = t0
    while t < t1 - 1e-6:
        kick(t)
        if snares and b % 2 == 1:
            snare(t)
        if hats:
            hat(t + BEAT / 2)
        chord = chords[(b // 4) % len(chords)]
        bass(t, chord[0], 0.4)
        for k, nt in enumerate(chord[1:]):
            pluck(t + k * 0.08 * (b % 2), nt, 0.28, 0.07)
        b += 1
        t += BEAT


C = ['C2', 'C4', 'E4', 'G4']
G = ['G1', 'B3', 'D4', 'G4']
Am = ['A1', 'A3', 'C4', 'E4']
F = ['F1', 'A3', 'C4', 'F4']

# ---------- S1: THIS WEEK (0 - 2.5) ----------
pop(0.12, 0.3, 700)
for i, nt in enumerate(['C5', 'E5', 'G5', 'C6', 'G5', 'E5', 'G5', 'C6']):
    pluck(0.5 + i * 0.25, nt, 0.25, 0.08, 'sine')
for i in range(8):
    hat(0.5 + i * 0.25, 0.05 + i * 0.01)
for i in range(10):
    pop(0.55 + i * 0.06, 0.08, 1000 + i * 60)
whoosh(1.9, 0.6, True, 0.25)

# ---------- S2: UPS (2.5 - 6) ----------
crash(2.5, 0.25)
groove(2.5, 6.0, [C, G])
for i in range(4):
    pop(2.85 + i * 0.08, 0.2, 800 + i * 200)
for i in range(14):  # emoji launches
    whoosh(2.65 + i * 0.16, 0.35, True, 0.05)
for i, nt in enumerate(['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'E6']):
    bell(3.0 + i * 0.12, nt, 0.6, 0.06)

# ---------- S3: DOWNS (6 - 9.5) ----------
whoosh(5.8, 0.5, False, 0.2)
sad_horn(6.3, 'D4', 0.45)
sad_horn(6.85, 'C#4', 0.45)
sad_horn(7.4, 'C4', 0.45)
sad_horn(7.95, 'B3', 1.3, bend=-0.06)
for i in range(6):
    t = 6.0 + i * 0.5
    kick(t, 0.6)
    if i % 2:
        snare(t, 0.25)
bass(6.0, 'Bb1', 1.0, 0.18); bass(7.0, 'A1', 1.0, 0.18); bass(8.0, 'Ab1', 1.4, 0.18)
for i in range(12):  # thuds of falling emoji
    t = 6.4 + i * 0.22
    d = 0.12
    tt = np.arange(int(d * SR)) / SR
    add(t, np.sin(2 * np.pi * (90 + 60 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 25), 0.18)
whoosh(9.1, 0.45, True, 0.2)

# ---------- S4: wins / worries / coffee (9.5 - 12.5) ----------
groove(9.5, 12.5, [Am, F, C])
bell(9.75, 'C6', 0.8, 0.14)
bell(10.5, 'E6', 0.8, 0.14)
bell(11.25, 'G6', 0.8, 0.14)
# jittery coffee buzz
d = 0.9
tt = np.arange(int(d * SR)) / SR
add(11.3, osc(lambda t: 220 + 40 * np.sin(2 * np.pi * 18 * t), d, 'square') * np.exp(-tt * 2) * (0.5 + 0.5 * np.sin(2 * np.pi * 24 * tt)), 0.05)
whoosh(12.15, 0.4, False, 0.2)

# ---------- S5: right here, right now ... breathe (12.5 - 15.5) ----------
# alarm ring then tick-tock, music stops
d = 0.75
tt = np.arange(int(d * SR)) / SR
ring = (np.sin(2 * np.pi * 2200 * tt) + np.sin(2 * np.pi * 2650 * tt)) * (np.sin(2 * np.pi * 30 * tt) > 0)
add(12.55, ring * np.exp(-tt * 2.5), 0.06)
for i in range(4):
    t = 13.3 + i * 0.3
    pop(t, 0.12, 2400 if i % 2 == 0 else 1800)
pad(14.0, ['C4', 'E4', 'G4', 'B4'], 1.7, 0.035, a=0.8, kind='tri', cutoff=2500)
bell(14.1, 'E6', 1.4, 0.05); bell(14.5, 'B5', 1.2, 0.04)

# ---------- S6: WE GATHER / WORSHIP / LET GO (15.5 - 20) ----------
hits = [(15.5, ['C3', 'C4', 'E4', 'G4', 'C5']),
        (17.0, ['F2', 'F3', 'A4', 'C5', 'F5']),
        (18.5, ['G2', 'G3', 'B4', 'D5', 'G5'])]
for t, chord in hits:
    kick(t, 1.0); crash(t, 0.18); stab(t + 0.1, chord[1:], 0.6, 0.08); bass(t, chord[0], 1.2, 0.3)
    for k in range(2):
        kick(t + 0.5 + k * 0.5, 0.7); hat(t + 0.75 + k * 0.5)
    snare(t + 1.0, 0.35)
# snare roll build into the finale
t = 19.3
step = 0.12
while t < 20.0:
    snare(t, 0.15 + (t - 19.3) * 0.35)
    t += step
    step = max(0.04, step * 0.85)
whoosh(19.2, 0.85, True, 0.3)

# ---------- S7: IT'S TIME FOR CHAPEL (20 - 26) ----------
for i, nt in enumerate(['G4', 'A4', 'B4']):
    stab(20.05 + i * 0.3, [nt, nt[0] + str(int(nt[1]) + 1)], 0.25, 0.06)
kick(21.0, 1.1); crash(21.0, 0.45)
pad(21.0, ['C3', 'G3', 'C4', 'E4', 'G4', 'C5'], 4.6, 0.05, a=0.02, cutoff=3200)
for i, nt in enumerate(['C', 'H', 'A', 'P', 'E', 'L']):
    pop(21.0 + i * 0.09, 0.18, 700 + i * 150)
groove(21.0, 25.0, [C, F, G, C])
for i, nt in enumerate(['C6', 'E6', 'G6', 'C7']):
    bell(22.0 + i * 0.12, nt, 0.9, 0.07)
for i, nt in enumerate(['E5', 'G5', 'C6', 'E6', 'G6', 'C7']):
    bell(24.0 + i * 0.08, nt, 1.5, 0.06)
kick(25.0, 1.0); crash(25.0, 0.3)
stab(25.0, ['C4', 'E4', 'G4', 'C5'], 1.0, 0.1)
bass(25.0, 'C2', 0.9, 0.3)

# ---------- mix ----------
# cheap room reverb: a few decaying echoes
wet = np.zeros_like(out)
for dly, g in [(0.029, 0.35), (0.047, 0.3), (0.071, 0.25), (0.113, 0.18), (0.161, 0.12), (0.233, 0.08)]:
    k = int(dly * SR)
    wet[k:] += out[:-k] * g
mix = out + wet * 0.6
# fade the last half second
fade = int(0.5 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
mix = np.tanh(mix * 1.2)  # soft clip
mix = mix / np.max(np.abs(mix)) * 0.9
# stereo with slight Haas width on the wet signal
L = mix
R = np.concatenate([np.zeros(int(0.012 * SR)), mix])[:N] * 0.5 + mix * 0.5
pcm = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
with wave.open('soundtrack.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote soundtrack.wav')
