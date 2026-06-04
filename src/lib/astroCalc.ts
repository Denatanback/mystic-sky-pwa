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
  { key: "aries",       en: "Aries",       ru: "Oven",        symbol: "♈", element: "fire",  quality: "cardinal", ruling: "Mars",    color: "#e84040" },
  { key: "taurus",      en: "Taurus",      ru: "Telets",       symbol: "♉", element: "earth", quality: "fixed",    ruling: "Venus",   color: "#7ab04a" },
  { key: "gemini",      en: "Gemini",      ru: "Bliznetsy",    symbol: "♊", element: "air",   quality: "mutable",  ruling: "Mercury", color: "#d8a85f" },
  { key: "cancer",      en: "Cancer",      ru: "Rak",         symbol: "♋", element: "water", quality: "cardinal", ruling: "Moon",    color: "#7ab8d8" },
  { key: "leo",         en: "Leo",         ru: "Lev",         symbol: "♌", element: "fire",  quality: "fixed",    ruling: "Sun",     color: "#f0b03a" },
  { key: "virgo",       en: "Virgo",       ru: "Deva",        symbol: "♍", element: "earth", quality: "mutable",  ruling: "Mercury", color: "#8ab87a" },
  { key: "libra",       en: "Libra",       ru: "Vesy",        symbol: "♎", element: "air",   quality: "cardinal", ruling: "Venus",   color: "#c0a0d8" },
  { key: "scorpio",     en: "Scorpio",     ru: "Skorpion",    symbol: "♏", element: "water", quality: "fixed",    ruling: "Pluto",   color: "#7040b0" },
  { key: "sagittarius", en: "Sagittarius", ru: "Strelets",     symbol: "♐", element: "fire",  quality: "mutable",  ruling: "Jupiter", color: "#d05030" },
  { key: "capricorn",   en: "Capricorn",   ru: "Kozerog",     symbol: "♑", element: "earth", quality: "cardinal", ruling: "Saturn",  color: "#708090" },
  { key: "aquarius",    en: "Aquarius",    ru: "Vodoley",     symbol: "♒", element: "air",   quality: "fixed",    ruling: "Uranus",  color: "#4090c0" },
  { key: "pisces",      en: "Pisces",      ru: "Ryby",        symbol: "♓", element: "water", quality: "mutable",  ruling: "Neptune", color: "#6070c8" },
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
  fire:  { en: ["passionate", "spontaneous", "inspiring", "bold"],    ru: ["strastnyy", "spontannyy", "vdokhnovlyayuschiy", "smelyy"] },
  earth: { en: ["grounded", "reliable", "patient", "practical"],      ru: ["zazemlennyy", "nadezhnyy", "terpelivyy", "praktichnyy"] },
  air:   { en: ["intellectual", "social", "curious", "adaptable"],    ru: ["intellektualnyy", "obschitelnyy", "lyubopytnyy", "gibkiy"] },
  water: { en: ["intuitive", "empathetic", "deep", "sensitive"],      ru: ["intuitivnyy", "empatichnyy", "glubokiy", "chuvstvitelnyy"] },
};

export type SunTraitCards = { title: { en: string; ru: string }; body: { en: string; ru: string } }[];

export const SUN_TRAITS: Record<string, SunTraitCards> = {
  aries:       [
    { title: { en: "Pioneer", ru: "Pervoprokhodets" }, body: { en: "You charge ahead where others hesitate. New beginnings energise you.", ru: "Ty idesh vpered tam, gde drugie koleblyutsya. Novye nachala napolnyayut tebya energiey." } },
    { title: { en: "Leader", ru: "Lider" }, body: { en: "Natural courage makes you a catalyst for action and inspiration.", ru: "Prirodnaya smelost delaet tebya katalizatorom deystviy i vdokhnoveniya." } },
    { title: { en: "Passionate", ru: "Strastnyy" }, body: { en: "You pursue your desires with intensity and wholehearted commitment.", ru: "Ty presleduesh svoi zhelaniya s intensivnostyu i polnoy samootdachey." } },
  ],
  taurus:      [
    { title: { en: "Steadfast", ru: "Stoykiy" }, body: { en: "Your roots run deep. You build lasting things with patience and care.", ru: "Tvoi korni ukhodyat gluboko. Ty stroish dolgovechnoe s terpeniem i zabotoy." } },
    { title: { en: "Sensual", ru: "Chuvstvennyy" }, body: { en: "Beauty, comfort and the pleasures of life speak to your soul.", ru: "Krasota, komfort i radosti zhizni govoryat tvoey dushe." } },
    { title: { en: "Loyal", ru: "Vernyy" }, body: { en: "Once committed, your devotion is unwavering and deeply felt.", ru: "Odnazhdy prinyav obyazatelstvo, tvoya predannost nepokolebima." } },
  ],
  gemini:      [
    { title: { en: "Curious", ru: "Lyubopytnyy" }, body: { en: "Your mind is a kaleidoscope — always turning, always discovering.", ru: "Tvoy um — kaleydoskop: vsegda vraschaetsya, vsegda otkryvaet novoe." } },
    { title: { en: "Versatile", ru: "Raznostoronniy" }, body: { en: "You move between worlds with ease, connecting ideas no one else sees.", ru: "Ty legko peremeschaeshsya mezhdu mirami, soedinyaya idei, kotorykh nikto ne vidit." } },
    { title: { en: "Witty", ru: "Ostroumnyy" }, body: { en: "Words are your playground — quick, bright, and endlessly entertaining.", ru: "Slova — tvoya igrovaya ploschadka: bystrye, yarkie, beskonechno zanimatelnye." } },
  ],
  cancer:      [
    { title: { en: "Nurturing", ru: "Zabotlivyy" }, body: { en: "You carry the warmth of home wherever you go, supporting those around you.", ru: "Ty nesesh teplo doma vezde, kuda idesh, podderzhivaya okruzhayuschikh." } },
    { title: { en: "Intuitive", ru: "Intuitivnyy" }, body: { en: "You sense the unspoken — emotions, moods, needs others can't express.", ru: "Ty chuvstvuesh nevyskazannoe — emotsii, nastroeniya, potrebnosti drugikh." } },
    { title: { en: "Protective", ru: "Zaschitnik" }, body: { en: "Your love creates a sanctuary. Those close to you feel truly safe.", ru: "Tvoya lyubov sozdaet ubezhische. Te, kto ryadom, chuvstvuyut sebya v bezopasnosti." } },
  ],
  leo:         [
    { title: { en: "Radiant", ru: "Siyayuschiy" }, body: { en: "You were born to shine. Your presence lights up every room.", ru: "Ty rozhden siyat. Tvoe prisutstvie osveschaet kazhduyu komnatu." } },
    { title: { en: "Generous", ru: "Schedryy" }, body: { en: "Your heart is large — you give freely, love deeply, celebrate others.", ru: "Tvoe serdtse veliko — ty daesh schedro, lyubish gluboko, prazdnuesh drugikh." } },
    { title: { en: "Creative", ru: "Tvorcheskiy" }, body: { en: "Self-expression is your life force. Art, play and drama flow through you.", ru: "Samovyrazhenie — tvoya zhiznennaya sila. Iskusstvo, igra i drama tekut cherez tebya." } },
  ],
  virgo:       [
    { title: { en: "Discerning", ru: "Pronitsatelnyy" }, body: { en: "You see what others miss — patterns, improvements, hidden potential.", ru: "Ty vidish to, chto upuskayut drugie — patterny, uluchsheniya, skrytyy potentsial." } },
    { title: { en: "Devoted", ru: "Predannyy" }, body: { en: "When you care about something, you give it your absolute best.", ru: "Kogda tebe chto-to vazhno, ty otdaesh etomu vse luchshee." } },
    { title: { en: "Healing", ru: "Tselitelnyy" }, body: { en: "You carry a quiet gift for restoring order and wellbeing around you.", ru: "Ty nesesh tikhiy dar vosstanovleniya poryadka i blagopoluchiya vokrug." } },
  ],
  libra:       [
    { title: { en: "Harmonious", ru: "Garmonichnyy" }, body: { en: "You seek balance in all things — beauty, fairness, and peace.", ru: "Ty ischesh balans vo vsem — krasotu, spravedlivost i mir." } },
    { title: { en: "Diplomatic", ru: "Diplomatichnyy" }, body: { en: "You see every side, hold space for all, and bridge differences with grace.", ru: "Ty vidish kazhduyu storonu i soedinyaesh razlichiya s izyaschestvom." } },
    { title: { en: "Romantic", ru: "Romantichnyy" }, body: { en: "Love, art and beauty are not luxuries for you — they are necessities.", ru: "Lyubov, iskusstvo i krasota — ne roskosh dlya tebya, a neobkhodimost." } },
  ],
  scorpio:     [
    { title: { en: "Depth", ru: "Glubina" }, body: { en: "You are drawn to what is hidden — truth, transformation, the soul beneath.", ru: "Tebya privlekaet skrytoe — istina, transformatsiya, dusha pod poverkhnostyu." } },
    { title: { en: "Magnetic", ru: "Magneticheskiy" }, body: { en: "Your presence carries an invisible power that draws people in.", ru: "Tvoe prisutstvie neset nevidimuyu silu, kotoraya prityagivaet lyudey." } },
    { title: { en: "Transformative", ru: "Transformiruyuschiy" }, body: { en: "You have faced the dark and emerged renewed. This is your greatest gift.", ru: "Ty smotrel v temnotu i vykhodil obnovlennym. Eto tvoy velichayshiy dar." } },
  ],
  sagittarius: [
    { title: { en: "Explorer", ru: "Issledovatel" }, body: { en: "Horizons call you — physical journeys, philosophies, new worlds of meaning.", ru: "Gorizonty zovut tebya — puteshestviya, filosofii, novye miry smysla." } },
    { title: { en: "Optimistic", ru: "Optimist" }, body: { en: "Your faith in possibility is a light others navigate by.", ru: "Tvoya vera v vozmozhnosti — svet, po kotoromu orientiruyutsya drugie." } },
    { title: { en: "Truthful", ru: "Pravdivyy" }, body: { en: "You speak your truth boldly, even when it is uncomfortable.", ru: "Ty govorish svoyu pravdu smelo, dazhe kogda eto neudobno." } },
  ],
  capricorn:   [
    { title: { en: "Ambitious", ru: "Tseleustremlennyy" }, body: { en: "You build your dreams with discipline, brick by patient brick.", ru: "Ty stroish mechty s distsiplinoy, kirpich za terpelivym kirpichom." } },
    { title: { en: "Resilient", ru: "Stoykiy" }, body: { en: "Setbacks are data, not defeats. You always find a way forward.", ru: "Neudachi — eto dannye, ne porazheniya. Ty vsegda nakhodish put vpered." } },
    { title: { en: "Wise", ru: "Mudryy" }, body: { en: "You carry an old soul's wisdom — practical, grounded and hard-won.", ru: "Ty nesesh mudrost staroy dushi — praktichnuyu, zazemlennuyu, vystradannuyu." } },
  ],
  aquarius:    [
    { title: { en: "Visionary", ru: "Providets" }, body: { en: "You see the future before it arrives and work to make it real.", ru: "Ty vidish buduschee do togo, kak ono prikhodit, i rabotaesh, chtoby voplotit ego." } },
    { title: { en: "Humanitarian", ru: "Gumanist" }, body: { en: "The wellbeing of all lives in your heart. Collective progress is personal.", ru: "Blagopoluchie vsekh zhivet v tvoem serdtse. Kollektivnyy progress — eto lichnoe." } },
    { title: { en: "Original", ru: "Originalnyy" }, body: { en: "You refuse to be a copy. Your uniqueness is your most valuable asset.", ru: "Ty otkazyvaeshsya byt kopiey. Tvoya unikalnost — tvoy samyy tsennyy aktiv." } },
  ],
  pisces:      [
    { title: { en: "Mystical", ru: "Mistichnyy" }, body: { en: "You live at the edge of the visible world, touching the unseen.", ru: "Ty zhivesh na krayu vidimogo mira, kasayas nevidimogo." } },
    { title: { en: "Compassionate", ru: "Sostradatelnyy" }, body: { en: "Your empathy has no boundaries — you feel with the whole world.", ru: "Tvoya empatiya ne znaet granits — ty chuvstvuesh vmeste so vsem mirom." } },
    { title: { en: "Dreamer", ru: "Mechtatel" }, body: { en: "Your inner world is a vast ocean of images, music and meaning.", ru: "Tvoy vnutrenniy mir — ogromnyy okean obrazov, muzyki i smysla." } },
  ],
};
