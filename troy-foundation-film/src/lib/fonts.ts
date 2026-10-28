import {continueRender, delayRender, staticFile} from 'remotion';
import {FONT_FILES} from '../config/assets';

let loaded = false;

/** Loads the locally bundled OFL fonts (no network needed at render time). */
export const ensureFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    FONT_FILES.map((f) =>
      new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, {
        weight: f.weight,
        style: f.style,
      })
        .load()
        .then((face) => document.fonts.add(face)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
