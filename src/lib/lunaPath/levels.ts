import type { LunaPathLevel } from "./types";

export const lunaPathLevels: LunaPathLevel[] = [
  {
    key: "spark",
    title: "Искра",
    requiredMoonlight: 0,
    description: "Первые шаги. Открываются карта дня и базовая рефлексия.",
  },
  {
    key: "observer",
    title: "Наблюдатель",
    requiredMoonlight: 300,
    description: "Ты начинаешь видеть повторяющиеся состояния и внутренние ритмы.",
  },
  {
    key: "seeker",
    title: "Искатель",
    requiredMoonlight: 900,
    description: "Открываются недельные ритуалы и более глубокие вопросы.",
  },
  {
    key: "keeper",
    title: "Хранитель ритма",
    requiredMoonlight: 1800,
    description: "Становится доступен личный календарь состояний.",
  },
  {
    key: "guide",
    title: "Лунный проводник",
    requiredMoonlight: 3200,
    description: "Открывается предпросмотр Оракула и расширенные подсказки.",
  },
  {
    key: "mirror",
    title: "Зеркало Луны",
    requiredMoonlight: 5000,
    description: "Открываются глубокие интерпретации карт и личные паттерны.",
  },
  {
    key: "oracle",
    title: "Пробуждённый Оракул",
    requiredMoonlight: 7500,
    description: "Полный путь к диалогу с Оракулом eLuna.",
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
