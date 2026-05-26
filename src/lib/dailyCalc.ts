// Daily engine: moon phase, moon sign, planetary ruler, personal day number, forecasts
import { ZODIAC, ZodiacSign, getSunSign } from "./astroCalc";
import { reduce } from "./numerologyCalc";

// ── Moon phase ────────────────────────────────────────────────────────────────
// Reference new moon: 2000-01-06 18:14 UTC  (JD 2451550.259)
const REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);
const LUNAR_CYCLE_MS  = 29.53059 * 24 * 3600 * 1000;

/** 0 = new moon, 0.5 = full moon, 1 = back to new */
export function getMoonPhase(date: Date = new Date()): number {
  const elapsed = date.getTime() - REF_NEW_MOON_MS;
  return ((elapsed % LUNAR_CYCLE_MS) + LUNAR_CYCLE_MS) % LUNAR_CYCLE_MS / LUNAR_CYCLE_MS;
}

export type MoonPhaseInfo = {
  phase: number;       // 0-1
  name: { en: string; ru: string };
  emoji: string;
  illumination: number; // 0-100 %
  energy: number;       // 0-100 qualitative
};

export function getMoonPhaseInfo(date: Date = new Date()): MoonPhaseInfo {
  const p = getMoonPhase(date);
  const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * p)));
  let name: { en: string; ru: string };
  let emoji: string;
  let energy: number;

  if (p < 0.03 || p > 0.97)      { name = { en: "New Moon",          ru: "Новолуние"          }; emoji = "🌑"; energy = 45; }
  else if (p < 0.22)              { name = { en: "Waxing Crescent",   ru: "Растущий серп"      }; emoji = "🌒"; energy = 58; }
  else if (p < 0.28)              { name = { en: "First Quarter",     ru: "Первая четверть"    }; emoji = "🌓"; energy = 70; }
  else if (p < 0.47)              { name = { en: "Waxing Gibbous",    ru: "Прибывающая луна"   }; emoji = "🌔"; energy = 82; }
  else if (p < 0.53)              { name = { en: "Full Moon",         ru: "Полнолуние"         }; emoji = "🌕"; energy = 95; }
  else if (p < 0.72)              { name = { en: "Waning Gibbous",    ru: "Убывающая луна"     }; emoji = "🌖"; energy = 75; }
  else if (p < 0.78)              { name = { en: "Last Quarter",      ru: "Последняя четверть" }; emoji = "🌗"; energy = 60; }
  else                            { name = { en: "Waning Crescent",   ru: "Убывающий серп"     }; emoji = "🌘"; energy = 48; }

  return { phase: p, name, emoji, illumination, energy };
}

// ── Moon sign ────────────────────────────────────────────────────────────────
// Moon traverses the zodiac in ~27.32 days (sidereal month).
// Reference: 2000-01-01 00:00 UTC — moon was approximately at 0 deg Taurus (sign index 1).
const REF_MOON_SIGN_MS   = Date.UTC(2000, 0, 1, 0, 0, 0);
const SIDEREAL_MONTH_MS  = 27.32166 * 24 * 3600 * 1000;
const DEGREES_PER_SIGN   = 30;
const REF_MOON_DEG       = 37; // ~7 deg Taurus = 30 + 7

export function getTodayMoonSign(date: Date = new Date()): ZodiacSign {
  const elapsed = date.getTime() - REF_MOON_SIGN_MS;
  const totalDeg = REF_MOON_DEG + (elapsed / SIDEREAL_MONTH_MS) * 360;
  const idx = Math.floor(((totalDeg % 360) + 360) % 360 / DEGREES_PER_SIGN) % 12;
  return ZODIAC[idx];
}

// ── Planetary day ruler ───────────────────────────────────────────────────────
const PLANETARY_DAYS = [
  { en: "Sun",     ru: "Солнце",  symbol: "☉", day: "Sunday"    },
  { en: "Moon",    ru: "Луна",    symbol: "☽", day: "Monday"    },
  { en: "Mars",    ru: "Марс",    symbol: "♂", day: "Tuesday"   },
  { en: "Mercury", ru: "Меркурий",symbol: "☿", day: "Wednesday" },
  { en: "Jupiter", ru: "Юпитер", symbol: "♃", day: "Thursday"  },
  { en: "Venus",   ru: "Венера",  symbol: "♀", day: "Friday"    },
  { en: "Saturn",  ru: "Сатурн",  symbol: "♄", day: "Saturday"  },
];

export function getPlanetaryDay(date: Date = new Date()) {
  return PLANETARY_DAYS[date.getDay()];
}

// ── Personal day number ───────────────────────────────────────────────────────
export function getPersonalDayNumber(date: Date, birthDate: string): number {
  const d = date.getDate() + (date.getMonth() + 1) + date.getFullYear();
  const bParts = birthDate.split("."); // DD.MM.YYYY
  const bSum = parseInt(bParts[0] || "0") + parseInt(bParts[1] || "0");
  return reduce(d + bSum, false);
}

// ── Personal number meanings ──────────────────────────────────────────────────
export const PERSONAL_DAY: Record<number, { theme: { en: string; ru: string }; tip: { en: string; ru: string } }> = {
  1: { theme: { en: "New beginnings",   ru: "Новые начала"     }, tip: { en: "Take the first step on something you have been postponing.", ru: "Сделай первый шаг в том, что откладывал." } },
  2: { theme: { en: "Harmony",          ru: "Гармония"         }, tip: { en: "Listen more than you speak. Connections deepen today.",      ru: "Слушай больше, чем говоришь. Связи углубляются." } },
  3: { theme: { en: "Creativity",       ru: "Творчество"       }, tip: { en: "Express yourself — write, draw, create something.",          ru: "Выражай себя — пиши, рисуй, создавай что-то." } },
  4: { theme: { en: "Structure",        ru: "Структура"        }, tip: { en: "Organise, plan, build foundations. Details matter.",          ru: "Организуй, планируй, строй основу. Детали важны." } },
  5: { theme: { en: "Movement",         ru: "Движение"         }, tip: { en: "Embrace change. Unexpected turns bring gifts.",               ru: "Прими перемены. Неожиданные повороты несут подарки." } },
  6: { theme: { en: "Care",             ru: "Забота"           }, tip: { en: "Nurture yourself and those you love. Home energy is strong.", ru: "Позаботься о себе и близких. Энергия дома сильна." } },
  7: { theme: { en: "Inner knowing",    ru: "Внутреннее знание"}, tip: { en: "Go inward. Meditation or journaling will bring insights.",    ru: "Уйди вглубь себя. Медитация или журнал дадут инсайты." } },
  8: { theme: { en: "Power",            ru: "Сила"             }, tip: { en: "Act with intention. Your energy can move mountains today.",   ru: "Действуй осознанно. Твоя энергия сегодня особенно сильна." } },
  9: { theme: { en: "Completion",       ru: "Завершение"       }, tip: { en: "Let go of what no longer serves you. Cycles close today.",   ru: "Отпусти то, что больше не служит тебе." } },
  11: { theme: { en: "Intuition",       ru: "Интуиция"         }, tip: { en: "Master number day — trust your gut above all reason.",       ru: "День мастер-числа. Доверяй интуиции больше, чем логике." } },
  22: { theme: { en: "Manifestation",   ru: "Воплощение"       }, tip: { en: "Master builder day — your ideas can become real today.",     ru: "День мастера-строителя. Идеи сегодня могут стать реальностью." } },
};

// ── Daily forecast ────────────────────────────────────────────────────────────
// Moon phase theme (base for everyone) + sun-sign-element twist

const PHASE_THEME: Record<string, { en: string; ru: string }> = {
  "New Moon":          { en: "New seeds are planted in the invisible.",       ru: "Новые семена сеются в невидимом." },
  "Waxing Crescent":   { en: "What you started is quietly gathering force.",  ru: "То, что ты начал, тихо набирает силу." },
  "First Quarter":     { en: "A crossroads asks you to choose and act.",      ru: "Перекресток просит выбрать и действовать." },
  "Waxing Gibbous":    { en: "Refinement — almost there, adjust the aim.",    ru: "Шлифовка. Ты почти у цели, скорректируй прицел." },
  "Full Moon":         { en: "What was hidden is now fully illuminated.",     ru: "Скрытое сейчас полностью освещено." },
  "Waning Gibbous":    { en: "Gratitude opens you to receive more.",          ru: "Благодарность открывает тебя для большего." },
  "Last Quarter":      { en: "Release what no longer fits who you are.",      ru: "Отпусти то, что больше не соответствует тебе." },
  "Waning Crescent":   { en: "Rest, reflect, and let the cycle complete.",    ru: "Отдохни, поразмысли, позволь циклу завершиться." },
};

const ELEMENT_TWIST: Record<string, { en: string; ru: string }> = {
  fire:  { en: "Your fire wants to lead — channel it consciously.",      ru: "Твой огонь хочет вести. Направь его осознанно." },
  earth: { en: "Ground yourself before moving. Steady wins.",            ru: "Заземлись перед движением. Стабильность побеждает." },
  air:   { en: "Your mind is sharp today — use words with care.",        ru: "Твой ум сегодня остер. Используй слова осторожно." },
  water: { en: "Feel before you think. Your intuition is accurate.",     ru: "Почувствуй прежде, чем подумать. Твоя интуиция точна." },
};

const SIGN_TWIST: Record<string, { en: string; ru: string }> = {
  aries:        { en: "Your boldness is an asset — initiate.",           ru: "Твоя смелость — твой актив. Инициируй." },
  taurus:       { en: "Patience today brings lasting reward.",           ru: "Терпение сегодня принесет долгосрочную награду." },
  gemini:       { en: "Two ideas are better than one — explore both.",   ru: "Две идеи лучше одной. Исследуй обе." },
  cancer:       { en: "Home and heart are your anchors today.",          ru: "Дом и сердце — твои якоря сегодня." },
  leo:          { en: "Let your light shine without apology.",           ru: "Позволь своему свету сиять без извинений." },
  virgo:        { en: "Small precise actions create big results.",       ru: "Маленькие точные действия дают большие результаты." },
  libra:        { en: "Balance is found in motion, not stillness.",      ru: "Баланс находится в движении, а не в неподвижности." },
  scorpio:      { en: "Depth is your gift. Go beneath the surface.",     ru: "Глубина — твой дар. Иди под поверхность." },
  sagittarius:  { en: "The bigger picture is calling your attention.",   ru: "Большая картина зовет твое внимание." },
  capricorn:    { en: "Discipline today is tomorrow's freedom.",         ru: "Дисциплина сегодня — завтрашняя свобода." },
  aquarius:     { en: "Your unconventional angle is the right one.",     ru: "Твой нестандартный угол зрения — правильный." },
  pisces:       { en: "The boundary between dream and reality thins.",   ru: "Граница между мечтой и реальностью истончается." },
};

export function getDailyForecast(
  sunSign: ZodiacSign,
  moonPhaseInfo: MoonPhaseInfo,
  moonSign: ZodiacSign,
  lang: "en" | "ru"
): string {
  const phase = PHASE_THEME[moonPhaseInfo.name.en] ?? PHASE_THEME["Full Moon"];
  const sign  = SIGN_TWIST[sunSign.key] ?? ELEMENT_TWIST[sunSign.element];
  const moonLine = lang === "ru"
    ? `Луна в ${moonSign.ru} ${moonPhaseInfo.emoji}`
    : `Moon in ${moonSign.en} ${moonPhaseInfo.emoji}`;
  return `${moonLine}\n${phase[lang]} ${sign[lang]}`;
}

// ── Moon-in-sign short description ───────────────────────────────────────────
export const MOON_IN_SIGN: Record<string, { en: string; ru: string }> = {
  aries:       { en: "Energy peaks. Take initiative.", ru: "Энергия на пике. Действуй." },
  taurus:      { en: "Seek comfort and slow pleasure.", ru: "Ищи уют и медленные удовольствия." },
  gemini:      { en: "Curiosity and conversations flow.", ru: "Любопытство и разговоры текут свободно." },
  cancer:      { en: "Emotions run deep. Be gentle.", ru: "Эмоции глубоки. Будь мягче." },
  leo:         { en: "Creativity and warmth shine.", ru: "Творчество и тепло сияют." },
  virgo:       { en: "Details and health come into focus.", ru: "Детали и здоровье в фокусе." },
  libra:       { en: "Harmony and beauty are needed.", ru: "Нужны гармония и красота." },
  scorpio:     { en: "Intensity and depth. Transformation.", ru: "Интенсивность и глубина. Трансформация." },
  sagittarius: { en: "Optimism and adventure call.", ru: "Зовет оптимизм и приключения." },
  capricorn:   { en: "Ambition and structure ground you.", ru: "Амбиции и структура заземляют тебя." },
  aquarius:    { en: "Independent thinking inspires.", ru: "Независимое мышление вдохновляет." },
  pisces:      { en: "Dreams and empathy are amplified.", ru: "Мечты и эмпатия усилены." },
};
