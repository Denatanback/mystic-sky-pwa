"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function SoulmatePathPage() {
  const { lang } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Венера",          sub: "Любовь",        desc: "Венера в твоей карте — твоя природа любви и привлечения",        status: "done",    emblem: "/assets/node-emblems/soulmate/emblem-1-venus.png",    x: 50, y: 82 },
    { num: 2, label: "Линия сердца",    sub: "Связь",         desc: "Эмоциональная связь — что открывает твоё сердце",               status: "current", emblem: "/assets/node-emblems/soulmate/emblem-2-heart.png",    x: 21, y: 64 },
    { num: 3, label: "Синастрия",       sub: "Совместимость", desc: "Наложение карт двух людей — паттерны и динамика отношений",      status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-3-synastry.png", x: 73, y: 64 },
    { num: 4, label: "Композит",        sub: "Союз",          desc: "Карта отношений — энергия союза двух людей",                    status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-4-composite.png", x: 18, y: 40 },
    { num: 5, label: "Контракт души",   sub: "Связь",         desc: "Кармические договорённости между твоей душой и партнёром",       status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-5-contract.png", x: 75, y: 40 },
    { num: 6, label: "Двойное пламя",   sub: "Зеркало",       desc: "Встреча с зеркальной душой — глубочайший союз и вызов",          status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-6-twin.png",     x: 13, y: 13 },
    { num: 7, label: "Циклы любви",     sub: "Время",         desc: "Личные циклы открытости и закрытости для отношений",             status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-7-cycles.png",   x: 47, y:  8 },
    { num: 8, label: "Священный союз",  sub: "Целостность",   desc: "Любовь как путь к духовному росту и единству",                  status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-8-union.png",    x: 80, y: 11 },
  ] : [
    { num: 1, label: "Venus",           sub: "Love",          desc: "Venus in your chart — your nature of love and attraction",       status: "done",    emblem: "/assets/node-emblems/soulmate/emblem-1-venus.png",    x: 50, y: 82 },
    { num: 2, label: "Heart Line",      sub: "Connection",    desc: "Emotional connection — what opens your heart",                  status: "current", emblem: "/assets/node-emblems/soulmate/emblem-2-heart.png",    x: 21, y: 64 },
    { num: 3, label: "Synastry",        sub: "Compatibility", desc: "Overlaying two charts — patterns and dynamics of a relationship", status: "locked", emblem: "/assets/node-emblems/soulmate/emblem-3-synastry.png", x: 73, y: 64 },
    { num: 4, label: "Composite",       sub: "Union",         desc: "The relationship chart — the energy of two souls united",       status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-4-composite.png", x: 18, y: 40 },
    { num: 5, label: "Soul Contract",   sub: "Bond",          desc: "Karmic agreements between your soul and your partner",          status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-5-contract.png", x: 75, y: 40 },
    { num: 6, label: "Twin Flame",      sub: "Mirror",        desc: "Meeting the mirror soul — the deepest union and challenge",     status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-6-twin.png",     x: 13, y: 13 },
    { num: 7, label: "Love Cycles",     sub: "Timing",        desc: "Personal cycles of openness and readiness for relationship",    status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-7-cycles.png",   x: 47, y:  8 },
    { num: 8, label: "Sacred Union",    sub: "Wholeness",     desc: "Love as a path to spiritual growth and oneness",               status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-8-union.png",    x: 80, y: 11 },
  ];

  const LINES: [number, number][] = [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [3, 6],
    [4, 6], [4, 7],
  ];

  const discipline = lang === "ru" ? "Родственная душа" : "Soulmate";
  return <NodePathPage discipline={discipline} disciplineKey="soulmate" nodes={NODES} lines={LINES} />;
}
