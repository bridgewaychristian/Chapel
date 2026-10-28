import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AnimaticSlate} from './components/AnimaticSlate';
import {AudioTracks} from './components/AudioTracks';
import {Captions} from './components/Captions';
import {Scene} from './components/Scene';
import {AUDIO, BRAND} from './config/assets';
import {COLORS} from './config/theme';
import {NARRATION_IS_ESTIMATED} from './config/timing';
import {ensureFonts} from './lib/fonts';
import {Paper, PaperTexture} from './illustration/primitives';
import {NarrationProvider} from './narration/narration';
import {S1Encounters} from './scenes/S1Encounters';
import {S2NeverKnow} from './scenes/S2NeverKnow';
import {S3Moments} from './scenes/S3Moments';
import {S4GoldenLine} from './scenes/S4GoldenLine';
import {S5Personal} from './scenes/S5Personal';
import {S6Ripple} from './scenes/S6Ripple';
import {S7Connected} from './scenes/S7Connected';
import {S8Resolve} from './scenes/S8Resolve';

ensureFonts();

export type FilmProps = {
  /** Burn in the closed-caption track. */
  captions: boolean;
  /** Show the "silent animatic" review slate (auto-hidden once a VO is set and timing is final). */
  slate: boolean;
};

export const Film: React.FC<FilmProps> = ({captions, slate}) => {
  const showSlate = slate && (NARRATION_IS_ESTIMATED || !AUDIO.voiceover.src);
  return (
    <NarrationProvider>
      <AbsoluteFill style={{backgroundColor: COLORS.ivory}}>
        <Paper />
        <Scene id="encounters">
          <S1Encounters />
        </Scene>
        <Scene id="neverKnow">
          <S2NeverKnow />
        </Scene>
        <Scene id="moments">
          <S3Moments />
        </Scene>
        <Scene id="goldenLine">
          <S4GoldenLine />
        </Scene>
        <Scene id="personal">
          <S5Personal />
        </Scene>
        <Scene id="ripple">
          <S6Ripple />
        </Scene>
        <Scene id="connected">
          <S7Connected />
        </Scene>
        <Scene id="resolve">
          <S8Resolve />
        </Scene>
        <PaperTexture />
        {captions && <Captions />}
        {showSlate && <AnimaticSlate logoPlaceholder={!BRAND.logo} />}
        <AudioTracks />
      </AbsoluteFill>
    </NarrationProvider>
  );
};
