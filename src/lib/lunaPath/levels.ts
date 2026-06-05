import type { LunaPathLevel } from "./types";

export const lunaPathLevels: LunaPathLevel[] = [
  {
    key: "spark",
    title: "Spark",
    requiredMoonlight: 0,
    description: "First steps. Daily card and basic reflection become part of your rhythm.",
  },
  {
    key: "observer",
    title: "Observer",
    requiredMoonlight: 300,
    description: "You begin to notice repeating states and inner rhythms.",
  },
  {
    key: "seeker",
    title: "Seeker",
    requiredMoonlight: 900,
    description: "Weekly rituals and deeper reflection questions start to open.",
  },
  {
    key: "keeper",
    title: "Rhythm Keeper",
    requiredMoonlight: 1800,
    description: "Your personal state calendar becomes more meaningful.",
  },
  {
    key: "guide",
    title: "Lunar Guide",
    requiredMoonlight: 3200,
    description: "Oracle preview and expanded prompts begin to appear.",
  },
  {
    key: "mirror",
    title: "Moon Mirror",
    requiredMoonlight: 5000,
    description: "Deeper card interpretations and personal patterns become visible.",
  },
  {
    key: "oracle",
    title: "Awakened Oracle",
    requiredMoonlight: 7500,
    description: "The full path toward deeper dialogue with the eLuna Oracle.",
  },
];

export function getLevelProgress(moonlightTotal: number) {
  const currentLevel = [...lunaPathLevels]
    .reverse()
    .find((level) => moonlightTotal >= level.requiredMoonlight) ?? lunaPathLevels[0];
  const currentIndex = lunaPathLevels.findIndex((level) => level.key === currentLevel.key);
  const nextLevel = lunaPathLevels[currentIndex + 1] ?? null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel,
      progressPercent: 100,
      remainingMoonlight: 0,
    };
  }

  const levelSpan = nextLevel.requiredMoonlight - currentLevel.requiredMoonlight;
  const earnedInLevel = moonlightTotal - currentLevel.requiredMoonlight;

  return {
    currentLevel,
    nextLevel,
    progressPercent: Math.max(0, Math.min(100, Math.round((earnedInLevel / levelSpan) * 100))),
    remainingMoonlight: Math.max(0, nextLevel.requiredMoonlight - moonlightTotal),
  };
}
