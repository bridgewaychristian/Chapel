import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Statement} from '../components/Statement';
import {COLORS, SAFE} from '../config/theme';
import {GoldLine, resample, spline, Stage} from '../illustration/primitives';
import {cue, ease, mix, prog, Pt, slow, useTime} from '../lib/time';
import {AfterSchoolRoom, DinnerRoom, LAMP, StudentScene} from './rooms';
import {amberOnScreen} from './S2NeverKnow';

export const PANELS = [
  {x: 192, y: 290},
  {x: 720, y: 290},
  {x: 1248, y: 290},
];
export const PANEL_SCALE = 0.25;

/** The first golden line: a thread beneath the three moments. Scene 4 picks it up. */
export const MOMENTS_THREAD: Pt[] = resample(
  spline([
    [60, 650],
    [456, 616],
    [960, 650],
    [1464, 616],
    [1860, 650],
  ]),
  240,
);

const mask = (img: string): React.CSSProperties => ({maskImage: img, WebkitMaskImage: img});

const Panel: React.FC<{i: number; p: number; opacity: number; children: React.ReactNode; lift?: number}> = ({
  i,
  p,
  opacity,
  children,
  lift = 0,
}) => {
  // p: 0 = full frame, 1 = framed panel
  const {x, y} = PANELS[i];
  const s = mix(1, PANEL_SCALE, p);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        overflow: 'hidden',
        transformOrigin: '0 0',
        transform: `translate(${mix(0, x, p)}px, ${mix(0, y, p) - lift}px) scale(${s})`,
        outline: `${36 * p}px solid rgba(251, 248, 241, ${p})`,
        boxShadow: `0 ${60 * p}px ${140 * p}px rgba(40, 30, 20, ${0.22 * p})`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

/** 3 · Intimate moments: dinner, an after-school room, an envelope opening. */
export const S3Moments: React.FC = () => {
  const t = useTime();
  const c06 = cue('c06');
  const c07 = cue('c07');
  const c08 = cue('c08');
  const c09 = cue('c09');
  const c10 = cue('c10');

  // Iris opens from the stoplight's amber lamp into the dinner lamp.
  const irisStart = c06.start - 0.6;
  const [ax, ay] = amberOnScreen(irisStart);
  const irisP = prog(t, irisStart, irisStart + 1.8, ease);
  const irisR = mix(0, 2400, irisP);
  const cx = mix(ax, LAMP[0], irisP);
  const cy = mix(ay, LAMP[1] - 32, irisP);

  const wipe1 = prog(t, c07.start - 0.6, c07.start + 0.8, ease);
  const wipe2 = prog(t, c08.start - 0.6, c08.start + 0.8, ease);
  const panelize = prog(t, c09.start - 0.8, c09.start + 0.6, slow);
  const othersIn = prog(t, c09.start - 0.2, c09.start + 1.0);
  const out = prog(t, c10.end, c10.end + 1.0);
  const panelOpacity = 1 - out;
  const dimmed = 1 - 0.25 * prog(t, c09.start + 0.4, c09.end) + 0.25 * prog(t, c10.start, c10.start + 1);

  const dinnerZoom = 1 + 0.05 * prog(t, irisStart, c07.start, slow);

  const dinner = <DinnerRoom t={t} p={prog(t, irisStart - 0.2, irisStart + 2.2)} />;
  const afterSchool = <AfterSchoolRoom t={t} p={prog(t, c07.start - 1.3, c07.start + 0.9)} />;
  const student = (
    <StudentScene
      t={t}
      p={prog(t, c08.start - 1.3, c08.start + 0.8)}
      open={prog(t, c08.start + 0.8, c08.start + 3.0)}
      glow={prog(t, c08.start + 2.4, c08.end)}
    />
  );

  return (
    <AbsoluteFill>
      {/* full-frame sequence */}
      {panelize < 1 && (
        <AbsoluteFill style={{opacity: 1 - othersIn}}>
          <AbsoluteFill
            style={{
              ...mask(`radial-gradient(circle at ${cx}px ${cy}px, black ${irisR - 70}px, transparent ${irisR}px)`),
              transform: `scale(${dinnerZoom})`,
              transformOrigin: `${LAMP[0]}px ${LAMP[1]}px`,
            }}
          >
            {dinner}
          </AbsoluteFill>
          {wipe1 > 0 && (
            <AbsoluteFill
              style={mask(`linear-gradient(to right, transparent ${mix(2040, -140, wipe1) - 70}px, black ${mix(2040, -140, wipe1) + 70}px)`)}
            >
              {afterSchool}
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}

      {/* framed moments */}
      {othersIn > 0 && (
        <>
          <Panel i={0} p={1} opacity={othersIn * panelOpacity * dimmed} lift={(1 - othersIn) * -16 + out * 20}>
            {dinner}
          </Panel>
          <Panel i={1} p={1} opacity={othersIn * panelOpacity * dimmed} lift={(1 - othersIn) * -16 + out * 20}>
            {afterSchool}
          </Panel>
        </>
      )}
      {wipe2 > 0 && (
        <AbsoluteFill
          style={
            panelize > 0
              ? undefined
              : mask(`linear-gradient(to bottom, transparent ${mix(1220, -140, wipe2) - 70}px, black ${mix(1220, -140, wipe2) + 70}px)`)
          }
        >
          <Panel i={2} p={panelize} opacity={panelOpacity * (panelize > 0.99 ? dimmed : 1)} lift={out * 20}>
            {student}
          </Panel>
        </AbsoluteFill>
      )}

      {/* Fragments of the narration, set quietly in the negative space */}
      <Statement text="with a little less worry." in={c06.start + 2.6} out={c06.end + 0.2} x={SAFE.x} width={760} align="left" y={120} size={58} italic color={COLORS.inkSoft} />
      <Statement text="somewhere safe to go after school." in={c07.start + 0.9} out={c07.end + 0.2} x={1090} width={640} align="left" y={140} size={54} italic color={COLORS.inkSoft} />
      <Statement text="a place for them." in={c08.start + 2.4} out={c08.end + 0.1} x={640} width={700} align="left" y={130} size={62} italic color={COLORS.inkSoft} />

      <Statement cue="c09" in={c09.start} out={c09.end + 0.5} y={700} size={66} />
      <Statement cue="c10" in={c10.start} out={c10.end + 1.0} y={700} size={66} />

      <Stage>
        <GoldLine pts={MOMENTS_THREAD} to={prog(t, c10.start + 0.1, c10.end - 0.2, ease)} width={4} />
      </Stage>
    </AbsoluteFill>
  );
};
