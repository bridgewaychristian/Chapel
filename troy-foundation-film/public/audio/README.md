# Audio

No audio ships with this project. Nothing here was generated or downloaded.

| Track      | Suggested file              | Configure in                          |
|------------|-----------------------------|---------------------------------------|
| Voiceover  | `public/audio/voiceover.wav` | `AUDIO.voiceover` in `src/config/assets.ts` |
| Music      | `public/audio/music.wav`     | `AUDIO.music` in `src/config/assets.ts`     |

* **Voiceover** — the approved read of `public/narration/script.txt`, as one file
  starting at 0:00 of the film (or set `startAt`). After adding it, re-time the
  cues in `src/config/timing.ts` to the recording and set
  `NARRATION_IS_ESTIMATED = false`.
* **Music** — licensed tracks only, with the licence on file. `volume`,
  `fadeIn`, `fadeOut` and `duckUnderVoice` (music gain while narration speaks)
  are all in `assets.ts`. Ducking only engages when a voiceover is present.
