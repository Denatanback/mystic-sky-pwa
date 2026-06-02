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
    name: { en: "The Leader", ru: "Lider" },
    traits: [
      { title: { en: "Independent", ru: "Nezavisimyy" }, body: { en: "You carve your own path with originality and drive.", ru: "Ty prokladyvaesh svoy put s originalnostyu i reshimostyu." } },
      { title: { en: "Pioneer", ru: "Pervoprokhodets" }, body: { en: "New ideas and bold starts are your natural territory.", ru: "Novye idei i smelye nachinaniya — tvoya stikhiya." } },
    ],
  },
  2: {
    name: { en: "The Mediator", ru: "Mirotvorets" },
    traits: [
      { title: { en: "Diplomatic", ru: "Diplomatichnyy" }, body: { en: "You sense tension before it forms and smooth it with grace.", ru: "Ty chuvstvuesh napryazhenie prezhde, chem ono vozniknet, i sglazhivaesh ego." } },
      { title: { en: "Intuitive", ru: "Intuitivnyy" }, body: { en: "Your emotional radar is finely tuned to those around you.", ru: "Tvoy emotsionalnyy radar tochno nastroen na okruzhayuschikh." } },
    ],
  },
  3: {
    name: { en: "The Creator", ru: "Tvorets" },
    traits: [
      { title: { en: "Expressive", ru: "Vyrazitelnyy" }, body: { en: "Joy, art and communication are your gifts to the world.", ru: "Radost, iskusstvo i obschenie — tvoi dary miru." } },
      { title: { en: "Optimistic", ru: "Optimist" }, body: { en: "Your sunny outlook is contagious and uplifting.", ru: "Tvoy solnechnyy vzglyad na mir zarazitelen i voodushevlyaet." } },
    ],
  },
  4: {
    name: { en: "The Builder", ru: "Stroitel" },
    traits: [
      { title: { en: "Disciplined", ru: "Distsiplinirovannyy" }, body: { en: "You build lasting foundations through consistent effort.", ru: "Ty stroish prochnye osnovy cherez posledovatelnyy trud." } },
      { title: { en: "Reliable", ru: "Nadezhnyy" }, body: { en: "Others know they can count on you — always.", ru: "Drugie znayut, chto mogut na tebya rasschityvat — vsegda." } },
    ],
  },
  5: {
    name: { en: "The Adventurer", ru: "Iskatel" },
    traits: [
      { title: { en: "Freedom-loving", ru: "Svobodolyubivyy" }, body: { en: "Variety, travel and change are the oxygen you breathe.", ru: "Raznoobrazie, puteshestviya i peremeny — kislorod, kotorym ty dyshish." } },
      { title: { en: "Versatile", ru: "Raznostoronniy" }, body: { en: "You adapt instantly and thrive in dynamic environments.", ru: "Ty mgnovenno adaptirueshsya i protsvetaesh v dinamichnykh usloviyakh." } },
    ],
  },
  6: {
    name: { en: "The Nurturer", ru: "Opekun" },
    traits: [
      { title: { en: "Caring", ru: "Zabotlivyy" }, body: { en: "Love, family and service are the core of your being.", ru: "Lyubov, semya i sluzhenie — osnova tvoego suschestva." } },
      { title: { en: "Responsible", ru: "Otvetstvennyy" }, body: { en: "You take duty seriously and carry it with quiet grace.", ru: "Ty serezno otnosishsya k dolgu i nesesh ego s tikhim izyaschestvom." } },
    ],
  },
  7: {
    name: { en: "The Seeker", ru: "Iskatel istiny" },
    traits: [
      { title: { en: "Analytical", ru: "Analiticheskiy" }, body: { en: "You dig beneath surfaces to find the truth that matters.", ru: "Ty kopaesh pod poverkhnostyu v poiskakh vazhnoy istiny." } },
      { title: { en: "Spiritual", ru: "Dukhovnyy" }, body: { en: "Your path is inward — wisdom, solitude and deep knowing.", ru: "Tvoy put — vnutrenniy: mudrost, uedinenie i glubokoe znanie." } },
    ],
  },
  8: {
    name: { en: "The Achiever", ru: "Dostigator" },
    traits: [
      { title: { en: "Ambitious", ru: "Ambitsioznyy" }, body: { en: "Power, success and abundance flow naturally toward you.", ru: "Vlast, uspekh i izobilie estestvenno tekut k tebe." } },
      { title: { en: "Executive", ru: "Upravlenets" }, body: { en: "You see the big picture and command the resources to reach it.", ru: "Ty vidish obschuyu kartinu i upravlyaesh resursami dlya ee dostizheniya." } },
    ],
  },
  9: {
    name: { en: "The Humanitarian", ru: "Gumanist" },
    traits: [
      { title: { en: "Compassionate", ru: "Sostradatelnyy" }, body: { en: "Universal love flows through you — your heart holds the world.", ru: "Cherez tebya techet universalnaya lyubov — tvoe serdtse vmeschaet ves mir." } },
      { title: { en: "Wise", ru: "Mudryy" }, body: { en: "Old-soul insight and a broad perspective define your vision.", ru: "Mudrost staroy dushi i shirokiy krugozor opredelyayut tvoe videnie." } },
    ],
  },
  11: {
    name: { en: "The Illuminator", ru: "Prosvetitel" },
    traits: [
      { title: { en: "Intuitive Master", ru: "Master intuitsii" }, body: { en: "You carry a rare gift for inspiration and spiritual perception.", ru: "Ty nesesh redkiy dar vdokhnoveniya i dukhovnogo vospriyatiya." } },
      { title: { en: "Visionary", ru: "Providets" }, body: { en: "11 is a master number — your potential is extraordinary.", ru: "11 — master-chislo. Tvoy potentsial neobychaen." } },
    ],
  },
  22: {
    name: { en: "The Master Builder", ru: "Master-stroitel" },
    traits: [
      { title: { en: "Architect", ru: "Arkhitektor" }, body: { en: "You can build systems and structures that outlast generations.", ru: "Ty mozhesh stroit sistemy, kotorye perezhivut pokoleniya." } },
      { title: { en: "Pragmatic Visionary", ru: "Pragmatichnyy providets" }, body: { en: "22 bridges spiritual insight with tangible achievement.", ru: "22 soedinyaet dukhovnoe prozrenie s materialnym dostizheniem." } },
    ],
  },
  33: {
    name: { en: "The Master Teacher", ru: "Master-uchitel" },
    traits: [
      { title: { en: "Selfless", ru: "Samootverzhennyy" }, body: { en: "Your life mission is to uplift and heal humanity.", ru: "Missiya tvoey zhizni — podnyat i istselit chelovechestvo." } },
      { title: { en: "Compassionate Leader", ru: "Lider-sostradayuschiy" }, body: { en: "33 carries the highest vibration of love and service.", ru: "33 neset vysshuyu vibratsiyu lyubvi i sluzheniya." } },
    ],
  },
};
