// Pythagorean numerology calculations

// Reduce number to single digit (or master number 11, 22, 33)
export function reduce(n: number, keepMaster = true): number {
  if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
  if (n < 10) return n;
  return reduce(
    String(n).split("").reduce((acc, d) => acc + parseInt(d), 0),
    keepMaster
  );
}

// Life Path Number from birthDate "YYYY-MM-DD"
export function lifePathNumber(birthDate: string): { steps: string[]; result: number } {
  if (!birthDate) return { steps: [], result: 0 };
  const d = new Date(birthDate);
  const day   = d.getDate();
  const month = d.getMonth() + 1;
  const year  = d.getFullYear();

  const rDay   = reduce(day, false);
  const rMonth = reduce(month, false);
  const rYear  = reduce(
    String(year).split("").reduce((a, c) => a + parseInt(c), 0),
    false
  );
  const total  = rDay + rMonth + rYear;
  const result = reduce(total);

  return {
    steps: [
      `${day} → ${rDay}`,
      `${month} → ${rMonth}`,
      `${year} → ${String(year).split("").join("+")} = ${rYear}`,
      `${rDay} + ${rMonth} + ${rYear} = ${total}`,
    ],
    result,
  };
}

// Pythagorean letter-to-number map
const PYTH: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8,
};
const VOWELS = new Set(["A","E","I","O","U"]);

// Soul Urge (Heart's Desire) Number from name
export function soulNumber(name: string): { vowels: { letter: string; value: number }[]; steps: string[]; result: number } {
  const upper = name.toUpperCase().replace(/[^A-Z]/g, "");
  const vowels = upper.split("").filter(c => VOWELS.has(c)).map(c => ({ letter: c, value: PYTH[c] ?? 0 }));
  const sum = vowels.reduce((a, v) => a + v.value, 0);
  const result = reduce(sum);
  return {
    vowels,
    steps: [`${vowels.map(v => v.value).join(" + ")} = ${sum}`],
    result,
  };
}

export type NumeroTraits = { title: { en: string; ru: string }; body: { en: string; ru: string } };
export const NUMBER_TRAITS: Record<number, { name: { en: string; ru: string }; traits: NumeroTraits[] }> = {
  1: {
    name: { en: "The Leader", ru: "Лидер" },
    traits: [
      { title: { en: "Independent", ru: "Независимый" }, body: { en: "You carve your own path with originality and drive.", ru: "Ты прокладываешь свой путь с оригинальностью и решимостью." } },
      { title: { en: "Pioneer", ru: "Первопроходец" }, body: { en: "New ideas and bold starts are your natural territory.", ru: "Новые идеи и смелые начинания — твоя стихия." } },
    ],
  },
  2: {
    name: { en: "The Mediator", ru: "Миротворец" },
    traits: [
      { title: { en: "Diplomatic", ru: "Дипломатичный" }, body: { en: "You sense tension before it forms and smooth it with grace.", ru: "Ты чувствуешь напряжение прежде, чем оно возникнет, и сглаживаешь его." } },
      { title: { en: "Intuitive", ru: "Интуитивный" }, body: { en: "Your emotional radar is finely tuned to those around you.", ru: "Твой эмоциональный радар точно настроен на окружающих." } },
    ],
  },
  3: {
    name: { en: "The Creator", ru: "Творец" },
    traits: [
      { title: { en: "Expressive", ru: "Выразительный" }, body: { en: "Joy, art and communication are your gifts to the world.", ru: "Радость, искусство и общение — твои дары миру." } },
      { title: { en: "Optimistic", ru: "Оптимист" }, body: { en: "Your sunny outlook is contagious and uplifting.", ru: "Твой солнечный взгляд на мир заразителен и воодушевляет." } },
    ],
  },
  4: {
    name: { en: "The Builder", ru: "Строитель" },
    traits: [
      { title: { en: "Disciplined", ru: "Дисциплинированный" }, body: { en: "You build lasting foundations through consistent effort.", ru: "Ты строишь прочные основы через последовательный труд." } },
      { title: { en: "Reliable", ru: "Надёжный" }, body: { en: "Others know they can count on you — always.", ru: "Другие знают, что могут на тебя рассчитывать — всегда." } },
    ],
  },
  5: {
    name: { en: "The Adventurer", ru: "Искатель" },
    traits: [
      { title: { en: "Freedom-loving", ru: "Свободолюбивый" }, body: { en: "Variety, travel and change are the oxygen you breathe.", ru: "Разнообразие, путешествия и перемены — кислород, которым ты дышишь." } },
      { title: { en: "Versatile", ru: "Разносторонний" }, body: { en: "You adapt instantly and thrive in dynamic environments.", ru: "Ты мгновенно адаптируешься и процветаешь в динамичных условиях." } },
    ],
  },
  6: {
    name: { en: "The Nurturer", ru: "Опекун" },
    traits: [
      { title: { en: "Caring", ru: "Заботливый" }, body: { en: "Love, family and service are the core of your being.", ru: "Любовь, семья и служение — основа твоего существа." } },
      { title: { en: "Responsible", ru: "Ответственный" }, body: { en: "You take duty seriously and carry it with quiet grace.", ru: "Ты серьёзно относишься к долгу и несёшь его с тихим изяществом." } },
    ],
  },
  7: {
    name: { en: "The Seeker", ru: "Искатель истины" },
    traits: [
      { title: { en: "Analytical", ru: "Аналитический" }, body: { en: "You dig beneath surfaces to find the truth that matters.", ru: "Ты копаешь под поверхностью в поисках важной истины." } },
      { title: { en: "Spiritual", ru: "Духовный" }, body: { en: "Your path is inward — wisdom, solitude and deep knowing.", ru: "Твой путь — внутренний: мудрость, уединение и глубокое знание." } },
    ],
  },
  8: {
    name: { en: "The Achiever", ru: "Достигатор" },
    traits: [
      { title: { en: "Ambitious", ru: "Амбициозный" }, body: { en: "Power, success and abundance flow naturally toward you.", ru: "Власть, успех и изобилие естественно текут к тебе." } },
      { title: { en: "Executive", ru: "Управленец" }, body: { en: "You see the big picture and command the resources to reach it.", ru: "Ты видишь общую картину и управляешь ресурсами для её достижения." } },
    ],
  },
  9: {
    name: { en: "The Humanitarian", ru: "Гуманист" },
    traits: [
      { title: { en: "Compassionate", ru: "Сострадательный" }, body: { en: "Universal love flows through you — your heart holds the world.", ru: "Через тебя течёт универсальная любовь — твоё сердце вмещает весь мир." } },
      { title: { en: "Wise", ru: "Мудрый" }, body: { en: "Old-soul insight and a broad perspective define your vision.", ru: "Мудрость старой души и широкий кругозор определяют твоё видение." } },
    ],
  },
  11: {
    name: { en: "The Illuminator", ru: "Просветитель" },
    traits: [
      { title: { en: "Intuitive Master", ru: "Мастер интуиции" }, body: { en: "You carry a rare gift for inspiration and spiritual perception.", ru: "Ты несёшь редкий дар вдохновения и духовного восприятия." } },
      { title: { en: "Visionary", ru: "Провидец" }, body: { en: "11 is a master number — your potential is extraordinary.", ru: "11 — мастер-число. Твой потенциал необычаен." } },
    ],
  },
  22: {
    name: { en: "The Master Builder", ru: "Мастер-строитель" },
    traits: [
      { title: { en: "Architect", ru: "Архитектор" }, body: { en: "You can build systems and structures that outlast generations.", ru: "Ты можешь строить системы, которые переживут поколения." } },
      { title: { en: "Pragmatic Visionary", ru: "Прагматичный провидец" }, body: { en: "22 bridges spiritual insight with tangible achievement.", ru: "22 соединяет духовное прозрение с материальным достижением." } },
    ],
  },
  33: {
    name: { en: "The Master Teacher", ru: "Мастер-учитель" },
    traits: [
      { title: { en: "Selfless", ru: "Самоотверженный" }, body: { en: "Your life mission is to uplift and heal humanity.", ru: "Миссия твоей жизни — поднять и исцелить человечество." } },
      { title: { en: "Compassionate Leader", ru: "Лидер-сострадающий" }, body: { en: "33 carries the highest vibration of love and service.", ru: "33 несёт высшую вибрацию любви и служения." } },
    ],
  },
};
