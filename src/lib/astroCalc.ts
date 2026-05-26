// Astronomical calculations — zodiac signs, approximate moon sign

export type ZodiacSign = {
  key: string;
  en: string;
  ru: string;
  symbol: string;
  element: "fire" | "earth" | "air" | "water";
  quality: "cardinal" | "fixed" | "mutable";
  ruling: string;
  color: string;
};

export const ZODIAC: ZodiacSign[] = [
  { key: "aries",       en: "Aries",       ru: "Овен",        symbol: "♈", element: "fire",  quality: "cardinal", ruling: "Mars",    color: "#e84040" },
  { key: "taurus",      en: "Taurus",      ru: "Телец",       symbol: "♉", element: "earth", quality: "fixed",    ruling: "Venus",   color: "#7ab04a" },
  { key: "gemini",      en: "Gemini",      ru: "Близнецы",    symbol: "♊", element: "air",   quality: "mutable",  ruling: "Mercury", color: "#d8a85f" },
  { key: "cancer",      en: "Cancer",      ru: "Рак",         symbol: "♋", element: "water", quality: "cardinal", ruling: "Moon",    color: "#7ab8d8" },
  { key: "leo",         en: "Leo",         ru: "Лев",         symbol: "♌", element: "fire",  quality: "fixed",    ruling: "Sun",     color: "#f0b03a" },
  { key: "virgo",       en: "Virgo",       ru: "Дева",        symbol: "♍", element: "earth", quality: "mutable",  ruling: "Mercury", color: "#8ab87a" },
  { key: "libra",       en: "Libra",       ru: "Весы",        symbol: "♎", element: "air",   quality: "cardinal", ruling: "Venus",   color: "#c0a0d8" },
  { key: "scorpio",     en: "Scorpio",     ru: "Скорпион",    symbol: "♏", element: "water", quality: "fixed",    ruling: "Pluto",   color: "#7040b0" },
  { key: "sagittarius", en: "Sagittarius", ru: "Стрелец",     symbol: "♐", element: "fire",  quality: "mutable",  ruling: "Jupiter", color: "#d05030" },
  { key: "capricorn",   en: "Capricorn",   ru: "Козерог",     symbol: "♑", element: "earth", quality: "cardinal", ruling: "Saturn",  color: "#708090" },
  { key: "aquarius",    en: "Aquarius",    ru: "Водолей",     symbol: "♒", element: "air",   quality: "fixed",    ruling: "Uranus",  color: "#4090c0" },
  { key: "pisces",      en: "Pisces",      ru: "Рыбы",        symbol: "♓", element: "water", quality: "mutable",  ruling: "Neptune", color: "#6070c8" },
];

// Sun sign ranges (inclusive month/day)
const SUN_RANGES: { sign: string; from: [number, number]; to: [number, number] }[] = [
  { sign: "capricorn",   from: [12, 22], to: [1,  19] },
  { sign: "aquarius",    from: [1,  20], to: [2,  18] },
  { sign: "pisces",      from: [2,  19], to: [3,  20] },
  { sign: "aries",       from: [3,  21], to: [4,  19] },
  { sign: "taurus",      from: [4,  20], to: [5,  20] },
  { sign: "gemini",      from: [5,  21], to: [6,  20] },
  { sign: "cancer",      from: [6,  21], to: [7,  22] },
  { sign: "leo",         from: [7,  23], to: [8,  22] },
  { sign: "virgo",       from: [8,  23], to: [9,  22] },
  { sign: "libra",       from: [9,  23], to: [10, 22] },
  { sign: "scorpio",     from: [10, 23], to: [11, 21] },
  { sign: "sagittarius", from: [11, 22], to: [12, 21] },
];

export function getSunSign(birthDate: string): ZodiacSign | null {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  const m = d.getMonth() + 1, day = d.getDate();
  for (const r of SUN_RANGES) {
    const [fm, fd] = r.from, [tm, td] = r.to;
    if (fm <= tm) {
      if ((m === fm && day >= fd) || (m > fm && m < tm) || (m === tm && day <= td)) {
        return ZODIAC.find(z => z.key === r.sign) ?? null;
      }
    } else {
      // wraps December → January (capricorn)
      if ((m === fm && day >= fd) || m > fm || m < tm || (m === tm && day <= td)) {
        return ZODIAC.find(z => z.key === r.sign) ?? null;
      }
    }
  }
  return null;
}

// Approximate Venus sign — Venus stays ~3–6 weeks per sign; use simplified lookup
// Based on year of birth cycle (rough approximation for MVP)
export function getVenusSign(birthDate: string): ZodiacSign | null {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  const year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate();
  // Use a simple modular offset: Venus cycle ≈ 225 days ≈ 7.5 months
  // Days since epoch, mod 225, map to 12 signs
  const epoch = new Date(1970, 0, 1).getTime();
  const days = Math.floor((d.getTime() - epoch) / 86400000);
  const idx = Math.floor((days % 225) / (225 / 12)) % 12;
  // Offset so it feels more "natural" — shift by 2 from sun sign
  const sunSign = getSunSign(birthDate);
  const sunIdx = sunSign ? ZODIAC.findIndex(z => z.key === sunSign.key) : 0;
  const venusIdx = (sunIdx + idx % 3) % 12; // Venus is within 2 signs of Sun
  return ZODIAC[venusIdx];
}

export type ElementTraits = { en: string[]; ru: string[] };
export const ELEMENT_TRAITS: Record<string, ElementTraits> = {
  fire:  { en: ["passionate", "spontaneous", "inspiring", "bold"],    ru: ["страстный", "спонтанный", "вдохновляющий", "смелый"] },
  earth: { en: ["grounded", "reliable", "patient", "practical"],      ru: ["заземлённый", "надёжный", "терпеливый", "практичный"] },
  air:   { en: ["intellectual", "social", "curious", "adaptable"],    ru: ["интеллектуальный", "общительный", "любопытный", "гибкий"] },
  water: { en: ["intuitive", "empathetic", "deep", "sensitive"],      ru: ["интуитивный", "эмпатичный", "глубокий", "чувствительный"] },
};

export type SunTraitCards = { title: { en: string; ru: string }; body: { en: string; ru: string } }[];

export const SUN_TRAITS: Record<string, SunTraitCards> = {
  aries:       [
    { title: { en: "Pioneer", ru: "Первопроходец" }, body: { en: "You charge ahead where others hesitate. New beginnings energise you.", ru: "Ты идёшь вперёд там, где другие колеблются. Новые начала наполняют тебя энергией." } },
    { title: { en: "Leader", ru: "Лидер" }, body: { en: "Natural courage makes you a catalyst for action and inspiration.", ru: "Природная смелость делает тебя катализатором действий и вдохновения." } },
    { title: { en: "Passionate", ru: "Страстный" }, body: { en: "You pursue your desires with intensity and wholehearted commitment.", ru: "Ты преследуешь свои желания с интенсивностью и полной самоотдачей." } },
  ],
  taurus:      [
    { title: { en: "Steadfast", ru: "Стойкий" }, body: { en: "Your roots run deep. You build lasting things with patience and care.", ru: "Твои корни уходят глубоко. Ты строишь долговечное с терпением и заботой." } },
    { title: { en: "Sensual", ru: "Чувственный" }, body: { en: "Beauty, comfort and the pleasures of life speak to your soul.", ru: "Красота, комфорт и радости жизни говорят твоей душе." } },
    { title: { en: "Loyal", ru: "Верный" }, body: { en: "Once committed, your devotion is unwavering and deeply felt.", ru: "Однажды приняв обязательство, твоя преданность непоколебима." } },
  ],
  gemini:      [
    { title: { en: "Curious", ru: "Любопытный" }, body: { en: "Your mind is a kaleidoscope — always turning, always discovering.", ru: "Твой ум — калейдоскоп: всегда вращается, всегда открывает новое." } },
    { title: { en: "Versatile", ru: "Разносторонний" }, body: { en: "You move between worlds with ease, connecting ideas no one else sees.", ru: "Ты легко перемещаешься между мирами, соединяя идеи, которых никто не видит." } },
    { title: { en: "Witty", ru: "Остроумный" }, body: { en: "Words are your playground — quick, bright, and endlessly entertaining.", ru: "Слова — твоя игровая площадка: быстрые, яркие, бесконечно занимательные." } },
  ],
  cancer:      [
    { title: { en: "Nurturing", ru: "Заботливый" }, body: { en: "You carry the warmth of home wherever you go, healing those around you.", ru: "Ты несёшь тепло дома везде, куда идёшь, исцеляя окружающих." } },
    { title: { en: "Intuitive", ru: "Интуитивный" }, body: { en: "You sense the unspoken — emotions, moods, needs others can't express.", ru: "Ты чувствуешь невысказанное — эмоции, настроения, потребности других." } },
    { title: { en: "Protective", ru: "Защитник" }, body: { en: "Your love creates a sanctuary. Those close to you feel truly safe.", ru: "Твоя любовь создаёт убежище. Те, кто рядом, чувствуют себя в безопасности." } },
  ],
  leo:         [
    { title: { en: "Radiant", ru: "Сияющий" }, body: { en: "You were born to shine. Your presence lights up every room.", ru: "Ты рождён сиять. Твоё присутствие освещает каждую комнату." } },
    { title: { en: "Generous", ru: "Щедрый" }, body: { en: "Your heart is large — you give freely, love deeply, celebrate others.", ru: "Твоё сердце велико — ты даёшь щедро, любишь глубоко, празднуешь других." } },
    { title: { en: "Creative", ru: "Творческий" }, body: { en: "Self-expression is your life force. Art, play and drama flow through you.", ru: "Самовыражение — твоя жизненная сила. Искусство, игра и драма текут через тебя." } },
  ],
  virgo:       [
    { title: { en: "Discerning", ru: "Проницательный" }, body: { en: "You see what others miss — patterns, improvements, hidden potential.", ru: "Ты видишь то, что упускают другие — паттерны, улучшения, скрытый потенциал." } },
    { title: { en: "Devoted", ru: "Преданный" }, body: { en: "When you care about something, you give it your absolute best.", ru: "Когда тебе что-то важно, ты отдаёшь этому всё лучшее." } },
    { title: { en: "Healing", ru: "Целительный" }, body: { en: "You carry a quiet gift for restoring order and wellbeing around you.", ru: "Ты несёшь тихий дар восстановления порядка и благополучия вокруг." } },
  ],
  libra:       [
    { title: { en: "Harmonious", ru: "Гармоничный" }, body: { en: "You seek balance in all things — beauty, fairness, and peace.", ru: "Ты ищешь баланс во всём — красоту, справедливость и мир." } },
    { title: { en: "Diplomatic", ru: "Дипломатичный" }, body: { en: "You see every side, hold space for all, and bridge differences with grace.", ru: "Ты видишь каждую сторону и соединяешь различия с изяществом." } },
    { title: { en: "Romantic", ru: "Романтичный" }, body: { en: "Love, art and beauty are not luxuries for you — they are necessities.", ru: "Любовь, искусство и красота — не роскошь для тебя, а необходимость." } },
  ],
  scorpio:     [
    { title: { en: "Depth", ru: "Глубина" }, body: { en: "You are drawn to what is hidden — truth, transformation, the soul beneath.", ru: "Тебя привлекает скрытое — истина, трансформация, душа под поверхностью." } },
    { title: { en: "Magnetic", ru: "Магнетический" }, body: { en: "Your presence carries an invisible power that draws people in.", ru: "Твоё присутствие несёт невидимую силу, которая притягивает людей." } },
    { title: { en: "Transformative", ru: "Трансформирующий" }, body: { en: "You have faced the dark and emerged renewed. This is your greatest gift.", ru: "Ты смотрел в темноту и выходил обновлённым. Это твой величайший дар." } },
  ],
  sagittarius: [
    { title: { en: "Explorer", ru: "Исследователь" }, body: { en: "Horizons call you — physical journeys, philosophies, new worlds of meaning.", ru: "Горизонты зовут тебя — путешествия, философии, новые миры смысла." } },
    { title: { en: "Optimistic", ru: "Оптимист" }, body: { en: "Your faith in possibility is a light others navigate by.", ru: "Твоя вера в возможности — свет, по которому ориентируются другие." } },
    { title: { en: "Truthful", ru: "Правдивый" }, body: { en: "You speak your truth boldly, even when it is uncomfortable.", ru: "Ты говоришь свою правду смело, даже когда это неудобно." } },
  ],
  capricorn:   [
    { title: { en: "Ambitious", ru: "Целеустремлённый" }, body: { en: "You build your dreams with discipline, brick by patient brick.", ru: "Ты строишь мечты с дисциплиной, кирпич за терпеливым кирпичом." } },
    { title: { en: "Resilient", ru: "Стойкий" }, body: { en: "Setbacks are data, not defeats. You always find a way forward.", ru: "Неудачи — это данные, не поражения. Ты всегда находишь путь вперёд." } },
    { title: { en: "Wise", ru: "Мудрый" }, body: { en: "You carry an old soul's wisdom — practical, grounded and hard-won.", ru: "Ты несёшь мудрость старой души — практичную, заземлённую, выстраданную." } },
  ],
  aquarius:    [
    { title: { en: "Visionary", ru: "Провидец" }, body: { en: "You see the future before it arrives and work to make it real.", ru: "Ты видишь будущее до того, как оно приходит, и работаешь, чтобы воплотить его." } },
    { title: { en: "Humanitarian", ru: "Гуманист" }, body: { en: "The wellbeing of all lives in your heart. Collective progress is personal.", ru: "Благополучие всех живёт в твоём сердце. Коллективный прогресс — это личное." } },
    { title: { en: "Original", ru: "Оригинальный" }, body: { en: "You refuse to be a copy. Your uniqueness is your most valuable asset.", ru: "Ты отказываешься быть копией. Твоя уникальность — твой самый ценный актив." } },
  ],
  pisces:      [
    { title: { en: "Mystical", ru: "Мистичный" }, body: { en: "You live at the edge of the visible world, touching the unseen.", ru: "Ты живёшь на краю видимого мира, касаясь невидимого." } },
    { title: { en: "Compassionate", ru: "Сострадательный" }, body: { en: "Your empathy has no boundaries — you feel with the whole world.", ru: "Твоя эмпатия не знает границ — ты чувствуешь вместе со всем миром." } },
    { title: { en: "Dreamer", ru: "Мечтатель" }, body: { en: "Your inner world is a vast ocean of images, music and meaning.", ru: "Твой внутренний мир — огромный океан образов, музыки и смысла." } },
  ],
};
