# Moon Phase Assets

Source archive: `moon_phases_16_sliced.zip`

Product path: `src/assets/moon-phases/`

The product uses the WEBP files only. PNG files and `manifest.json` from the source archive are not required in the app bundle.

## Expected Files

- `01-new-moon.webp`
- `02-waxing-crescent-thin.webp`
- `03-waxing-crescent.webp`
- `04-waxing-crescent-heavy.webp`
- `05-first-quarter.webp`
- `06-waxing-gibbous-soft.webp`
- `07-waxing-gibbous.webp`
- `08-waxing-gibbous-near-full.webp`
- `09-full-moon.webp`
- `10-full-moon-bright.webp`
- `11-waning-gibbous-near-full.webp`
- `12-waning-gibbous.webp`
- `13-last-quarter.webp`
- `14-waning-crescent-heavy.webp`
- `15-waning-crescent.webp`
- `16-waning-crescent-thin.webp`

## Supported Phases

The app supports 16 visual moon phases. The mapping lives in `src/lib/astrology/moonPhaseAssets.ts`.

Selection uses:

- `phaseName`, when available.
- `illumination`, as a percentage from 0 to 100.
- `waxing`, as a boolean direction hint when `phaseName` is missing or too broad.

`phaseName` takes priority for new moon, full moon, first quarter, last quarter, waxing crescent, waxing gibbous, waning gibbous, and waning crescent. Illumination then selects the thin/medium/heavy or near-full variant.

Fallback phase: `waxing-gibbous`.

## UI Notes

The moon image is rendered by `PremiumMoonPhase`.

The zodiac glyph is not part of the moon image. It remains a separate UI element next to the moon sign/phase label.

Future improvement: regenerate each phase individually with transparent background for even cleaner production assets.
