# Closer Than You Know

A motion-graphic fundraising film for **The Troy Foundation** (Troy, Ohio),
built with [Remotion](https://www.remotion.dev/), React and TypeScript.

1920×1080 at 30 fps, 110.5 s. The last five seconds are a held end card.

> **Status: silent animatic.** No voiceover has been recorded. Narration timing
> is **estimated** (about 150 wpm, read with restraint), and the film carries an
> on-screen slate saying so. The logo is a **labelled placeholder** because
> thetroyfoundation.org could not be reached from the build environment. No
> music is included.

## Quick start

```bash
npm install
npm run preview          # Remotion Studio: scrub, edit, live reload
npm run render           # → out/closer-than-you-know.mp4
```

Remotion downloads its own headless Chrome on first render. On a machine that
can't download it (offline or sandboxed CI), point it at a local Chrome or
chrome-headless-shell:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell npm run render
```

Other commands:

| Command | What it does |
|---|---|
| `npm run render:draft` | Half-resolution MP4 for quick review |
| `npx remotion render src/index.ts CloserThanYouKnow-Captioned out/captioned.mp4` | Version with burned-in captions |
| `npm run captions` | Writes `out/captions.srt` and `out/captions.vtt` (sidecar closed captions) |
| `npm run stills` | Renders review frames from every scene to `out/stills/` (`npm run stills -- 12.5 80` for specific seconds) |
| `npm run typecheck` | TypeScript check |

## The film

A continuous line runs through ordinary moments. It starts as ink (a street, a
table edge, a counter). At "But you can help make them possible" it turns to
**gold**: generosity moving through local life. The gold line then traces
the town's roofline, runs through three community vignettes, and becomes the
edge of a table, a door frame and a horizon. It passes from hand to hand. At
the climax, a pullback shows two strangers on the same sidewalk, and the line
connects them to a whole neighborhood. Every earlier scene has a place there:
the market, the stoplight, a lit dinner window, the after-school building and
the open door.

| # | Scene | Component | Visual idea |
|---|---|---|---|
| 1 | Ordinary encounters | `S1Encounters` | A single ink line becomes a street; slow pan with parallax: market → sidewalk → stoplight |
| 2 | "And never know." | `S2NeverKnow` | The street falls away; two strangers keep waiting; the amber lamp warms |
| 3 | Intimate moments | `S3Moments` | Iris from the amber lamp into a dinner lamp; masked wipes along a shared table line; envelope opens; scenes settle into three framed "moments"; first gold thread |
| 4 | The golden line | `S4GoldenLine` | Thread rises into a roofline; then three vignettes (organizations, neighbors, opportunities) |
| 5 | Deeply personal | `S5Personal` | Gold line becomes table edge → door frame → sunrise horizon |
| 6 | Impact keeps going | `S6Ripple` | Line passes hand to hand: confidence, footing, a hand offered |
| 7 | **Connected** (climax) | `S7Connected` | Two strangers; log-space pullback (4× → 1×) as the neighborhood draws outward from them |
| 8 | Resolve | `S8Resolve` | Town gathers into one gold rule under the logo; final two sentences get the frame alone; end card held 5 s |

The human scenes are **illustrations**, not real beneficiary stories. The
film adds no statistics, testimonials or claims about how funds are restricted.

## Project layout

```
public/
  narration/script.txt   ← approved VO script, verbatim (editable text)
  fonts/                 ← Cormorant Garamond + Inter (OFL, bundled locally)
  audio/                 ← put voiceover / licensed music here (see README there)
  brand/                 ← put the approved logo here (see README there)
src/
  config/timing.ts       ← CENTRAL TIMING: cue times, scene windows, end-card hold
  config/theme.ts        ← colours, fonts, title-safe area
  config/assets.ts       ← logo, audio paths, volumes, fades, ducking
  narration/             ← loads and parses script.txt
  illustration/
    primitives.tsx       ← Ink (draw-on line art), Limb, GoldLine, Camera, paper texture, spline/resample helpers
    Person.tsx           ← parametric editorial figure (pose, age, gesture, clothing, hair, items)
    props.tsx            ← houses, trees, lamps, table things, stoplight, envelope…
  components/            ← Scene (timeline placement), Statement (typography), Captions, Logo, AudioTracks, AnimaticSlate
  scenes/                ← S1–S8 plus shared worlds (StreetWorld, rooms, Neighborhood)
  Film.tsx, Root.tsx     ← composition: CloserThanYouKnow and CloserThanYouKnow-Captioned
scripts/
  render-stills.mjs, export-captions.mjs
```

## Editing

**Wording.** Change narration only in `public/narration/script.txt`
(`cNN | text`). On-screen type and captions read from it by cue id. Some
on-screen fragments are set inline in the scenes (for example "a place for
them."). Search the scene files for the phrase if the script changes.

**Timing.** All times are in seconds in `src/config/timing.ts`:
- `CUES` gives each narration line's start and end. Scene animation is keyed
  to these, so moving a cue moves its motion and type.
- `SCENES` gives each scene's window on the master timeline. Neighbouring
  scenes overlap, and the incoming scene owns the transition.
- `FINAL_CARD` sets when the end card is fully composed and how long it holds
  (5.1 s). Total length is derived from it.

**Look.** Colours and fonts are in `src/config/theme.ts`. Figures are built
from `<Person …/>` props. Every drawable element is an `<Ink>` path, so it
draws its outline and then settles its fill under a `<Reveal p={0..1}>`.

**Preview.** `npm run preview` opens the Studio. The two compositions accept
props `captions` and `slate` in the right-hand panel.

## Audio placement

1. Put the approved VO at `public/audio/voiceover.wav`, then set
   `AUDIO.voiceover.src = 'audio/voiceover.wav'` in `src/config/assets.ts`.
2. **Re-time to the recording.** Replace each cue's `start`/`end` in
   `timing.ts` with the measured times. Use DAW markers, or a forced-alignment
   or transcription pass with word timestamps. If the read runs long, widen
   `SCENES` windows and `FINAL_CARD` to match. Then set
   `NARRATION_IS_ESTIMATED = false`, which removes the animatic slate.
3. Add **licensed** music at `public/audio/music.wav` and set
   `AUDIO.music.src`. Tune `volume`, `fadeIn`, `fadeOut` and `duckUnderVoice`
   (music gain while narration plays).
4. Re-export captions with `npm run captions`.

When `src` is `null`, a track is skipped entirely. No silent stand-in audio is
added.

## Final export

```bash
npm run render                                   # H.264, CRF 16, yuv420p (remotion.config.ts)
npm run captions                                 # sidecar SRT/VTT for platforms
npx remotion render src/index.ts CloserThanYouKnow out/master.mov --codec=prores --prores-profile=hq   # mezzanine, if needed
```

Before final delivery: approved logo in place, VO re-timed, music licensed,
`NARRATION_IS_ESTIMATED = false`. Check stills from every scene
(`npm run stills`), and confirm the end card holds untouched for its last
five seconds.

## Fonts

Cormorant Garamond (serif, emotional statements) and Inter (sans, supporting
information) are bundled under the SIL Open Font License. Licences are in
`public/fonts/`. If the Foundation's brand uses other typefaces, swap the
files and `FONTS` in `theme.ts`.
