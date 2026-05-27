export type ZodiacSignKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces"
  | "unknown";

export type ZodiacSignInfo = {
  key: ZodiacSignKey;
  name: string;
  glyph: string;
  dateRange: string | null;
};

const fallbackSign: ZodiacSignInfo = {
  key: "unknown",
  name: "Unknown sign",
  glyph: "✦",
  dateRange: null,
};

const signs: Array<ZodiacSignInfo & { start: [number, number]; end: [number, number] }> = [
  { key: "aries", name: "Aries", glyph: "♈", dateRange: "Mar 21 – Apr 19", start: [3, 21], end: [4, 19] },
  { key: "taurus", name: "Taurus", glyph: "♉", dateRange: "Apr 20 – May 20", start: [4, 20], end: [5, 20] },
  { key: "gemini", name: "Gemini", glyph: "♊", dateRange: "May 21 – Jun 20", start: [5, 21], end: [6, 20] },
  { key: "cancer", name: "Cancer", glyph: "♋", dateRange: "Jun 21 – Jul 22", start: [6, 21], end: [7, 22] },
  { key: "leo", name: "Leo", glyph: "♌", dateRange: "Jul 23 – Aug 22", start: [7, 23], end: [8, 22] },
  { key: "virgo", name: "Virgo", glyph: "♍", dateRange: "Aug 23 – Sep 22", start: [8, 23], end: [9, 22] },
  { key: "libra", name: "Libra", glyph: "♎", dateRange: "Sep 23 – Oct 22", start: [9, 23], end: [10, 22] },
  { key: "scorpio", name: "Scorpio", glyph: "♏", dateRange: "Oct 23 – Nov 21", start: [10, 23], end: [11, 21] },
  { key: "sagittarius", name: "Sagittarius", glyph: "♐", dateRange: "Nov 22 – Dec 21", start: [11, 22], end: [12, 21] },
  { key: "capricorn", name: "Capricorn", glyph: "♑", dateRange: "Dec 22 – Jan 19", start: [12, 22], end: [1, 19] },
  { key: "aquarius", name: "Aquarius", glyph: "♒", dateRange: "Jan 20 – Feb 18", start: [1, 20], end: [2, 18] },
  { key: "pisces", name: "Pisces", glyph: "♓", dateRange: "Feb 19 – Mar 20", start: [2, 19], end: [3, 20] },
];

export const ZODIAC_SIGNS: ZodiacSignInfo[] = signs.map(({ key, name, glyph, dateRange }) => ({
  key,
  name,
  glyph,
  dateRange,
}));

export function getZodiacSignByKey(key: string | null | undefined): ZodiacSignInfo {
  const sign = ZODIAC_SIGNS.find((item) => item.key === key);
  return sign ?? fallbackSign;
}

function parseBirthDate(birthDate: string | Date | null | undefined) {
  if (!birthDate) return null;
  if (birthDate instanceof Date) {
    if (Number.isNaN(birthDate.getTime())) return null;
    return { month: birthDate.getMonth() + 1, day: birthDate.getDate() };
  }

  const value = birthDate.trim();
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const parsed = new Date(Number(isoMatch[1]), month - 1, day);
    if (parsed.getMonth() + 1 === month && parsed.getDate() === day) return { month, day };
    return null;
  }

  const dottedMatch = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dottedMatch) {
    const day = Number(dottedMatch[1]);
    const month = Number(dottedMatch[2]);
    const parsed = new Date(Number(dottedMatch[3]), month - 1, day);
    if (parsed.getMonth() + 1 === month && parsed.getDate() === day) return { month, day };
  }

  return null;
}

function isInRange(month: number, day: number, start: [number, number], end: [number, number]) {
  const value = month * 100 + day;
  const startValue = start[0] * 100 + start[1];
  const endValue = end[0] * 100 + end[1];
  if (startValue <= endValue) return value >= startValue && value <= endValue;
  return value >= startValue || value <= endValue;
}

export function getZodiacSign(birthDate: string | Date | null | undefined): ZodiacSignInfo {
  const parsed = parseBirthDate(birthDate);
  if (!parsed) return fallbackSign;

  const sign = signs.find((item) => isInRange(parsed.month, parsed.day, item.start, item.end));
  if (!sign) return fallbackSign;

  return {
    key: sign.key,
    name: sign.name,
    glyph: sign.glyph,
    dateRange: sign.dateRange,
  };
}
