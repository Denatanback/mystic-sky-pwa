"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function PastLifePathPage() {
  const { lang } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Возраст души",      sub: "Начало",       desc: "Уровень эволюции твоей души и её опыт прошлых воплощений",      status: "done",    emblem: "/assets/node-emblems/pastlife/emblem-1-soul-age.png",    x: 50, y: 82 },
    { num: 2, label: "Карма",             sub: "Паттерны",     desc: "Повторяющиеся темы и кармические паттерны из прошлых жизней",   status: "current", emblem: "/assets/node-emblems/pastlife/emblem-2-karma.png",       x: 21, y: 64 },
    { num: 3, label: "Знак прошлой жизни", sub: "Память",      desc: "Астрологические следы прошлых воплощений в твоей карте",        status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-3-sign.png",        x: 73, y: 64 },
    { num: 4, label: "Лунные узлы",       sub: "Путь",         desc: "Южный узел — прошлое, Северный — твоя эволюция в этой жизни",   status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-4-nodes.png",       x: 18, y: 40 },
    { num: 5, label: "Кармические долги", sub: "Уроки",        desc: "Незавершённые уроки, которые твоя душа пришла завершить",       status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-5-debts.png",       x: 75, y: 40 },
    { num: 6, label: "Контракты душ",     sub: "Связи",        desc: "Договорённости между душами, заключённые до рождения",          status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-6-contracts.png",   x: 13, y: 13 },
    { num: 7, label: "Таланты",           sub: "Дары",         desc: "Способности и дары, принесённые из прошлых воплощений",         status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-7-talents.png",     x: 47, y:  8 },
    { num: 8, label: "Интеграция",        sub: "Целостность",  desc: "Синтез уроков прошлого и создание гармоничного будущего",       status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-8-integration.png", x: 80, y: 11 },
  ] : [
    { num: 1, label: "Soul Age",          sub: "Beginning",    desc: "The evolution level of your soul and its past incarnations",     status: "done",    emblem: "/assets/node-emblems/pastlife/emblem-1-soul-age.png",    x: 50, y: 82 },
    { num: 2, label: "Karma",             sub: "Patterns",     desc: "Recurring themes and karmic patterns from past lives",           status: "current", emblem: "/assets/node-emblems/pastlife/emblem-2-karma.png",       x: 21, y: 64 },
    { num: 3, label: "Past Life Sign",    sub: "Memory",       desc: "Astrological imprints of past incarnations in your chart",      status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-3-sign.png",        x: 73, y: 64 },
    { num: 4, label: "Lunar Nodes",       sub: "Direction",    desc: "South Node — the past; North Node — your evolution this life",   status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-4-nodes.png",       x: 18, y: 40 },
    { num: 5, label: "Karmic Debts",      sub: "Lessons",      desc: "Unfinished lessons your soul came to complete in this lifetime", status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-5-debts.png",       x: 75, y: 40 },
    { num: 6, label: "Soul Contracts",    sub: "Bonds",        desc: "Agreements between souls made before birth",                    status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-6-contracts.png",   x: 13, y: 13 },
    { num: 7, label: "Talents",           sub: "Gifts",        desc: "Abilities and gifts carried forward from past incarnations",     status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-7-talents.png",     x: 47, y:  8 },
    { num: 8, label: "Integration",       sub: "Wholeness",    desc: "Synthesising past lessons and creating a harmonious future",    status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-8-integration.png", x: 80, y: 11 },
  ];

  const LINES: [number, number][] = [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [3, 6],
    [4, 6], [4, 7],
  ];

  const discipline = lang === "ru" ? "Прошлая жизнь" : "Past Life";
  return <NodePathPage discipline={discipline} disciplineKey="pastlife" nodes={NODES} lines={LINES} />;
}
