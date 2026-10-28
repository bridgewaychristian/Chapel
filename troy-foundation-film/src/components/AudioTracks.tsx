import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {AUDIO, TrackConfig} from '../config/assets';
import {CUES, FPS, TOTAL_SECONDS, sec} from '../config/timing';
import {fadeWindow} from '../lib/time';

const envelope = (track: TrackConfig, tAbs: number) => {
  const fin = track.fadeIn > 0 ? interpolate(tAbs, [track.startAt, track.startAt + track.fadeIn], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const fout = track.fadeOut > 0 ? interpolate(tAbs, [TOTAL_SECONDS - track.fadeOut, TOTAL_SECONDS], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return track.volume * fin * fout;
};

/** Separate voiceover and licensed-music tracks. Absent files = silent (no request made). */
export const AudioTracks: React.FC = () => {
  const {voiceover, music} = AUDIO;
  return (
    <>
      {voiceover.src && (
        <Sequence from={sec(voiceover.startAt)} name="Voiceover" layout="none">
          <Audio src={staticFile(voiceover.src)} volume={(f) => envelope(voiceover, voiceover.startAt + f / FPS)} />
        </Sequence>
      )}
      {music.src && (
        <Sequence from={sec(music.startAt)} name="Music" layout="none">
          <Audio
            src={staticFile(music.src)}
            volume={(f) => {
              const t = music.startAt + f / FPS;
              // Duck under narration only when a voiceover is actually present.
              const speaking = voiceover.src
                ? Math.max(0, ...Object.values(CUES).map((c) => fadeWindow(t, c.start - 0.25, c.end + 0.5, 0.25, 0.45)))
                : 0;
              return envelope(music, t) * (1 - (1 - music.duckUnderVoice) * speaking);
            }}
          />
        </Sequence>
      )}
    </>
  );
};
