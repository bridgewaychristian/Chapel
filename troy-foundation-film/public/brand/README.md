# Brand assets

`thetroyfoundation.org` could not be reached from the build environment, so no
official logo, colours or fonts were retrieved. The end card currently shows a
typeset **placeholder** wordmark tagged "Placeholder · replace with approved logo".

To use the approved logo:

1. Put the file here, e.g. `public/brand/troy-foundation-logo.svg` (SVG or a
   transparent PNG at least 1600 px wide).
2. In `src/config/assets.ts` set `BRAND.logo = 'brand/troy-foundation-logo.svg'`
   and adjust `BRAND.logoWidth`.
3. Swap the placeholder palette in `src/config/theme.ts` (`COLORS.ink`,
   `COLORS.gold`, …) for the brand guide values if they differ.
