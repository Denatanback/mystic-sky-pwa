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

  if (p < 0.03 || p > 0.97)      { name = { en: "New Moon",          ru: "Novolunie"          }; emoji = "🌑"; energy = 45; }
  else if (p < 0.22)              { name = { en: "Waxing Crescent",   ru: "Rastuschiy serp"      }; emoji = "🌒"; energy = 58; }
  else if (p < 0.28)              { name = { en: "First Quarter",     ru: "Pervaya chetvert"    }; emoji = "🌓"; energy = 70; }
  else if (p < 0.47)              { name = { en: "Waxing Gibbous",    ru: "Pribyvayuschaya luna"   }; emoji = "🌔"; energy = 82; }
  else if (p < 0.53)              { name = { en: "Full Moon",         ru: "Polnolunie"         }; emoji = "🌕"; energy = 95; }
  else if (p < 0.72)              { name = { en: "Waning Gibbous",    ru: "Ubyvayuschaya luna"     }; emoji = "🌖"; energy = 75; }
  else if (p < 0.78)              { name = { en: "Last Quarter",      ru: "Poslednyaya chetvert" }; emoji = "🌗"; energy = 60; }
  else                            { name = { en: "Waning Crescent",   ru: "Ubyvayuschiy serp"     }; emoji = "🌘"; energy = 48; }

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
  { en: "Sun",     ru: "Solntse",  symbol: "☉", day: "Sunday"    },
  { en: "Moon",    ru: "Luna",    symbol: "☽", day: "Monday"    },
  { en: "Mars",    ru: "Mars",    symbol: "♂", day: "Tuesday"   },
  { en: "Mercury", ru: "Merkuriy",symbol: "☿", day: "Wednesday" },
  { en: "Jupiter", ru: "Yupiter", symbol: "♃", day: "Thursday"  },
  { en: "Venus",   ru: "Venera",  symbol: "♀", day: "Friday"    },
  { en: "Saturn",  ru: "Saturn",  symbol: "♄", day: "Saturday"  },
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
  1: { theme: { en: "New beginnings",   ru: "Novye nachala"     }, tip: { en: "Take the first step on something you have been postponing.", ru: "Sdelay pervyy shag v tom, chto otkladyval." } },
  2: { theme: { en: "Harmony",          ru: "Garmoniya"         }, tip: { en: "Listen more than you speak. Connections deepen today.",      ru: "Slushay bolshe, chem govorish. Svyazi uglublyayutsya." } },
  3: { theme: { en: "Creativity",       ru: "Tvorchestvo"       }, tip: { en: "Express yourself — write, draw, create something.",          ru: "Vyrazhay sebya — pishi, risuy, sozdavay chto-to." } },
  4: { theme: { en: "Structure",        ru: "Struktura"        }, tip: { en: "Organise, plan, build foundations. Details matter.",          ru: "Organizuy, planiruy, stroy osnovu. Detali vazhny." } },
  5: { theme: { en: "Movement",         ru: "Dvizhenie"         }, tip: { en: "Embrace change. Unexpected turns bring gifts.",               ru: "Primi peremeny. Neozhidannye povoroty nesut podarki." } },
  6: { theme: { en: "Care",             ru: "Zabota"           }, tip: { en: "Nurture yourself and those you love. Home energy is strong.", ru: "Pozabotsya o sebe i blizkikh. Energiya doma silna." } },
  7: { theme: { en: "Inner knowing",    ru: "Vnutrennee znanie"}, tip: { en: "Go inward. Meditation or journaling will bring insights.",    ru: "Uydi vglub sebya. Meditatsiya ili zhurnal dadut insayty." } },
  8: { theme: { en: "Power",            ru: "Sila"             }, tip: { en: "Act with intention. Your energy can move mountains today.",   ru: "Deystvuy osoznanno. Tvoya energiya segodnya osobenno silna." } },
  9: { theme: { en: "Completion",       ru: "Zavershenie"       }, tip: { en: "Let go of what no longer serves you. Cycles close today.",   ru: "Otpusti to, chto bolshe ne sluzhit tebe." } },
  11: { theme: { en: "Intuition",       ru: "Intuitsiya"         }, tip: { en: "Master number day — trust your gut above all reason.",       ru: "Den master-chisla. Doveryay intuitsii bolshe, chem logike." } },
  22: { theme: { en: "Manifestation",   ru: "Voploschenie"       }, tip: { en: "Master builder day — your ideas can become real today.",     ru: "Den mastera-stroitelya. Idei segodnya mogut stat realnostyu." } },
};

// ── Daily forecast ────────────────────────────────────────────────────────────
// Moon phase theme (base for everyone) + sun-sign-element twist

const PHASE_THEME: Record<string, { en: string; ru: string }> = {
  "New Moon":          { en: "New seeds are planted in the invisible.",       ru: "Novye semena seyutsya v nevidimom." },
  "Waxing Crescent":   { en: "What you started is quietly gathering force.",  ru: "To, chto ty nachal, tikho nabiraet silu." },
  "First Quarter":     { en: "A crossroads asks you to choose and act.",      ru: "Perekrestok prosit vybrat i deystvovat." },
  "Waxing Gibbous":    { en: "Refinement — almost there, adjust the aim.",    ru: "Shlifovka. Ty pochti u tseli, skorrektiruy pritsel." },
  "Full Moon":         { en: "What was hidden is now fully illuminated.",     ru: "Skrytoe seychas polnostyu osvescheno." },
  "Waning Gibbous":    { en: "Gratitude opens you to receive more.",          ru: "Blagodarnost otkryvaet tebya dlya bolshego." },
  "Last Quarter":      { en: "Release what no longer fits who you are.",      ru: "Otpusti to, chto bolshe ne sootvetstvuet tebe." },
  "Waning Crescent":   { en: "Rest, reflect, and let the cycle complete.",    ru: "Otdokhni, porazmysli, pozvol tsiklu zavershitsya." },
};

const ELEMENT_TWIST: Record<string, { en: string; ru: string }> = {
  fire:  { en: "Your fire wants to lead — channel it consciously.",      ru: "Tvoy ogon khochet vesti. Naprav ego osoznanno." },
  earth: { en: "Ground yourself before moving. Steady wins.",            ru: "Zazemlis pered dvizheniem. Stabilnost pobezhdaet." },
  air:   { en: "Your mind is sharp today — use words with care.",        ru: "Tvoy um segodnya oster. Ispolzuy slova ostorozhno." },
  water: { en: "Feel before you think. Your intuition is accurate.",     ru: "Pochuvstvuy prezhde, chem podumat. Tvoya intuitsiya tochna." },
};

const SIGN_TWIST: Record<string, { en: string; ru: string }> = {
  aries:        { en: "Your boldness is an asset — initiate.",           ru: "Tvoya smelost — tvoy aktiv. Initsiiruy." },
  taurus:       { en: "Patience today brings lasting reward.",           ru: "Terpenie segodnya prineset dolgosrochnuyu nagradu." },
  gemini:       { en: "Two ideas are better than one — explore both.",   ru: "Dve idei luchshe odnoy. Issleduy obe." },
  cancer:       { en: "Home and heart are your anchors today.",          ru: "Dom i serdtse — tvoi yakorya segodnya." },
  leo:          { en: "Let your light shine without apology.",           ru: "Pozvol svoemu svetu siyat bez izvineniy." },
  virgo:        { en: "Small precise actions create big results.",       ru: "Malenkie tochnye deystviya dayut bolshie rezultaty." },
  libra:        { en: "Balance is found in motion, not stillness.",      ru: "Balans nakhoditsya v dvizhenii, a ne v nepodvizhnosti." },
  scorpio:      { en: "Depth is your gift. Go beneath the surface.",     ru: "Glubina — tvoy dar. Idi pod poverkhnost." },
  sagittarius:  { en: "The bigger picture is calling your attention.",   ru: "Bolshaya kartina zovet tvoe vnimanie." },
  capricorn:    { en: "Discipline today is tomorrow's freedom.",         ru: "Distsiplina segodnya — zavtrashnyaya svoboda." },
  aquarius:     { en: "Your unconventional angle is the right one.",     ru: "Tvoy nestandartnyy ugol zreniya — pravilnyy." },
  pisces:       { en: "The boundary between dream and reality thins.",   ru: "Granitsa mezhdu mechtoy i realnostyu istonchaetsya." },
};

export function getDailyForecast(
  sunSign: ZodiacSign,
  moonPhaseInfo: MoonPhaseInfo,
  moonSign: ZodiacSign,
  lang: "en" | "ru"
): string {
  const phase = PHASE_THEME[moonPhaseInfo.name.en] ?? PHASE_THEME["Full Moon"];
  const sign  = SIGN_TWIST[sunSign.key] ?? ELEMENT_TWIST[sunSign.element];
  const moonLine = false
    ? `Luna v ${moonSign.ru} ${moonPhaseInfo.emoji}`
    : `Moon in ${moonSign.en} ${moonPhaseInfo.emoji}`;
  return `${moonLine}\n${phase[lang]} ${sign[lang]}`;
}

// ── Moon-in-sign short description ───────────────────────────────────────────
export const MOON_IN_SIGN: Record<string, { en: string; ru: string }> = {
  aries:       { en: "Energy peaks. Take initiative.", ru: "Energiya na pike. Deystvuy." },
  taurus:      { en: "Seek comfort and slow pleasure.", ru: "Ischi uyut i medlennye udovolstviya." },
  gemini:      { en: "Curiosity and conversations flow.", ru: "Lyubopytstvo i razgovory tekut svobodno." },
  cancer:      { en: "Emotions run deep. Be gentle.", ru: "Emotsii gluboki. Bud myagche." },
  leo:         { en: "Creativity and warmth shine.", ru: "Tvorchestvo i teplo siyayut." },
  virgo:       { en: "Details and health come into focus.", ru: "Detali i zdorove v fokuse." },
  libra:       { en: "Harmony and beauty are needed.", ru: "Nuzhny garmoniya i krasota." },
  scorpio:     { en: "Intensity and depth. Transformation.", ru: "Intensivnost i glubina. Transformatsiya." },
  sagittarius: { en: "Optimism and adventure call.", ru: "Zovet optimizm i priklyucheniya." },
  capricorn:   { en: "Ambition and structure ground you.", ru: "Ambitsii i struktura zazemlyayut tebya." },
  aquarius:    { en: "Independent thinking inspires.", ru: "Nezavisimoe myshlenie vdokhnovlyaet." },
  pisces:      { en: "Dreams and empathy are amplified.", ru: "Mechty i empatiya usileny." },
};
