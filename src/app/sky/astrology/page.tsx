"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function AstrologyPathPage() {
  const { lang, t } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Солнце",    sub: "Начало пути",       desc: "Солнечная энергия — основа личности и жизненной силы",         status: "done",    emblem: "/assets/node-emblems/astrology/emblem-1-sun.png",       x: 50, y: 82 },
    { num: 2, label: "Луна",      sub: "Эмоции, интуиция",  desc: "Эмоции, интуиция, внутренний мир",                             status: "current", emblem: "/assets/node-emblems/astrology/emblem-2-moon.png",      x: 21, y: 64 },
    { num: 3, label: "Аспекты",   sub: "Взаимосвязи",       desc: "Углы и взаимодействие планет в натальной карте",               status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-3-aspects.png",   x: 73, y: 64 },
    { num: 4, label: "Дома",      sub: "Среда жизни",       desc: "Двенадцать домов — сферы жизни и деятельности",               status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-4-house-v2.png",  x: 18, y: 40 },
    { num: 5, label: "Планеты",   sub: "Энергии",           desc: "Изучи энергии и символы планет",                              status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-5-plantes.png",   x: 75, y: 40 },
    { num: 6, label: "Транзиты",  sub: "Будущее",           desc: "Текущее движение планет и их влияние на жизнь",               status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-6-transit.png",   x: 13, y: 13 },
    { num: 7, label: "Аспекты",   sub: "Структура",         desc: "Глубокие структуры и паттерны натальной карты",               status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-7-aspect-v2.png", x: 47, y:  8 },
    { num: 8, label: "Синтез",    sub: "Целостность",       desc: "Целостное понимание натальной карты и твоего пути",            status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-8-syntez.png",    x: 80, y: 11 },
  ] : [
    { num: 1, label: "Sun",       sub: "Beginning",         desc: "Solar energy — the foundation of personality and life force",  status: "done",    emblem: "/assets/node-emblems/astrology/emblem-1-sun.png",       x: 50, y: 82 },
    { num: 2, label: "Moon",      sub: "Emotions & intuition", desc: "Emotions, intuition and inner world",                      status: "current", emblem: "/assets/node-emblems/astrology/emblem-2-moon.png",      x: 21, y: 64 },
    { num: 3, label: "Aspects",   sub: "Connections",       desc: "Angles and interactions between planets in the natal chart",  status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-3-aspects.png",   x: 73, y: 64 },
    { num: 4, label: "Houses",    sub: "Life areas",        desc: "Twelve houses — spheres of life and activity",               status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-4-house-v2.png",  x: 18, y: 40 },
    { num: 5, label: "Planets",   sub: "Energies",          desc: "Explore the energies and symbols of the planets",            status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-5-plantes.png",   x: 75, y: 40 },
    { num: 6, label: "Transits",  sub: "Future",            desc: "Current planetary movement and its influence on life",       status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-6-transit.png",   x: 13, y: 13 },
    { num: 7, label: "Patterns",  sub: "Structure",         desc: "Deep structures and patterns in the natal chart",            status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-7-aspect-v2.png", x: 47, y:  8 },
    { num: 8, label: "Synthesis", sub: "Wholeness",         desc: "A holistic understanding of the natal chart and your path",  status: "locked",  emblem: "/assets/node-emblems/astrology/emblem-8-syntez.png",    x: 80, y: 11 },
  ];

  const LINES: [number, number][] = [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [3, 6],
    [4, 6], [4, 7],
  ];

  const discipline = lang === "ru" ? "Астрология" : "Astrology";

  return <NodePathPage discipline={discipline} disciplineKey="astrology" nodes={NODES} lines={LINES} />;
}
