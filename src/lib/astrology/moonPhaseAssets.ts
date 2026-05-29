import type { StaticImageData } from "next/image";
import newMoon from "@/assets/moon-phases/01-new-moon.webp";
import waxingCrescentThin from "@/assets/moon-phases/02-waxing-crescent-thin.webp";
import waxingCrescent from "@/assets/moon-phases/03-waxing-crescent.webp";
import waxingCrescentHeavy from "@/assets/moon-phases/04-waxing-crescent-heavy.webp";
import firstQuarter from "@/assets/moon-phases/05-first-quarter.webp";
import waxingGibbousSoft from "@/assets/moon-phases/06-waxing-gibbous-soft.webp";
import waxingGibbous from "@/assets/moon-phases/07-waxing-gibbous.webp";
import waxingGibbousNearFull from "@/assets/moon-phases/08-waxing-gibbous-near-full.webp";
import fullMoon from "@/assets/moon-phases/09-full-moon.webp";
import fullMoonBright from "@/assets/moon-phases/10-full-moon-bright.webp";
import waningGibbousNearFull from "@/assets/moon-phases/11-waning-gibbous-near-full.webp";
import waningGibbous from "@/assets/moon-phases/12-waning-gibbous.webp";
import lastQuarter from "@/assets/moon-phases/13-last-quarter.webp";
import waningCrescentHeavy from "@/assets/moon-phases/14-waning-crescent-heavy.webp";
import waningCrescent from "@/assets/moon-phases/15-waning-crescent.webp";
import waningCrescentThin from "@/assets/moon-phases/16-waning-crescent-thin.webp";

export type MoonPhaseAssetKey =
  | "new-moon"
  | "waxing-crescent-thin"
  | "waxing-crescent"
  | "waxing-crescent-heavy"
  | "first-quarter"
  | "waxing-gibbous-soft"
  | "waxing-gibbous"
  | "waxing-gibbous-near-full"
  | "full-moon"
  | "full-moon-bright"
  | "waning-gibbous-near-full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent-heavy"
  | "waning-crescent"
  | "waning-crescent-thin";

export const moonPhaseAssets: Record<MoonPhaseAssetKey, StaticImageData> = {
  "new-moon": newMoon,
  "waxing-crescent-thin": waxingCrescentThin,
  "waxing-crescent": waxingCrescent,
  "waxing-crescent-heavy": waxingCrescentHeavy,
  "first-quarter": firstQuarter,
  "waxing-gibbous-soft": waxingGibbousSoft,
  "waxing-gibbous": waxingGibbous,
  "waxing-gibbous-near-full": waxingGibbousNearFull,
  "full-moon": fullMoon,
  "full-moon-bright": fullMoonBright,
  "waning-gibbous-near-full": waningGibbousNearFull,
  "waning-gibbous": waningGibbous,
  "last-quarter": lastQuarter,
  "waning-crescent-heavy": waningCrescentHeavy,
  "waning-crescent": waningCrescent,
  "waning-crescent-thin": waningCrescentThin,
};

function clampIllumination(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return Math.max(0, Math.min(100, value));
}

function crescentKey(illumination: number, waxing: boolean): MoonPhaseAssetKey {
  if (waxing) {
    if (illumination <= 12) return "waxing-crescent-thin";
    if (illumination <= 25) return "waxing-crescent";
    return "waxing-crescent-heavy";
  }
  if (illumination >= 26) return "waning-crescent-heavy";
  if (illumination >= 13) return "waning-crescent";
  return "waning-crescent-thin";
}

function gibbousKey(illumination: number, waxing: boolean): MoonPhaseAssetKey {
  if (waxing) {
    if (illumination >= 89) return "waxing-gibbous-near-full";
    if (illumination >= 73) return "waxing-gibbous";
    return "waxing-gibbous-soft";
  }
  if (illumination >= 89) return "waning-gibbous-near-full";
  return "waning-gibbous";
}

export function getMoonPhaseAssetKey(params: {
  phaseName?: string;
  illumination?: number;
  waxing?: boolean;
}): MoonPhaseAssetKey {
  const phaseName = params.phaseName?.toLowerCase().trim() ?? "";
  const illumination = clampIllumination(params.illumination) ?? 75;
  const waxing = params.waxing ?? true;

  if (phaseName.includes("new")) return "new-moon";
  if (phaseName.includes("first quarter")) return "first-quarter";
  if (phaseName.includes("last quarter") || phaseName.includes("third quarter")) return "last-quarter";
  if (phaseName.includes("waxing crescent")) return crescentKey(illumination, true);
  if (phaseName.includes("waxing gibbous")) return gibbousKey(illumination, true);
  if (phaseName.includes("waning gibbous")) return gibbousKey(illumination, false);
  if (phaseName.includes("waning crescent")) return crescentKey(illumination, false);
  if (phaseName.includes("full")) return illumination >= 99 ? "full-moon-bright" : "full-moon";

  if (illumination <= 3) return "new-moon";
  if (illumination >= 98) return "full-moon";

  if (waxing) {
    if (illumination <= 12) return "waxing-crescent-thin";
    if (illumination <= 25) return "waxing-crescent";
    if (illumination <= 42) return "waxing-crescent-heavy";
    if (illumination <= 57) return "first-quarter";
    if (illumination <= 72) return "waxing-gibbous-soft";
    if (illumination <= 88) return "waxing-gibbous";
    return "waxing-gibbous-near-full";
  }

  if (illumination >= 89) return "waning-gibbous-near-full";
  if (illumination >= 58) return "waning-gibbous";
  if (illumination >= 43) return "last-quarter";
  if (illumination >= 26) return "waning-crescent-heavy";
  if (illumination >= 13) return "waning-crescent";
  if (illumination >= 4) return "waning-crescent-thin";

  return "waxing-gibbous";
}

export function getMoonPhaseAsset(params: {
  phaseName?: string;
  illumination?: number;
  waxing?: boolean;
}) {
  return moonPhaseAssets[getMoonPhaseAssetKey(params)];
}
