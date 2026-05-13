"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function NumerologyPathPage() {
  const { lang, t } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Число пути",      sub: "Основа",          desc: "Твоё число судьбы — главная вибрация жизненного пути",         status: "done",    emblem: "/assets/node-emblems/numerology/emblem-1-path-number.png",      x: 50, y: 82 },
    { num: 2, label: "Число души",      sub: "Внутренний мир",  desc: "Интуиция, желания и твой внутренний голос",                    status: "current", emblem: "/assets/node-emblems/numerology/emblem-2-soul-number.png",      x: 21, y: 64 },
    { num: 3, label: "Число личности",  sub: "Внешний образ",   desc: "Как тебя воспринимает окружающий мир",                         status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-3-personality-number.png", x: 73, y: 64 },
    { num: 4, label: "Матрица",         sub: "Потенциал",       desc: "Квадрат Пифагора — карта твоих скрытых возможностей",          status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-4-matrix.png",            x: 18, y: 40 },
    { num: 5, label: "Циклы",           sub: "Периоды",         desc: "Личные циклы и периоды жизни по нумерологии",                  status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-5-cycles.png",            x: 75, y: 40 },
    { num: 6, label: "Карма",           sub: "Уроки",           desc: "Кармические долги и уроки, которые несёт твоя душа",           status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-6-karma.png",             x: 13, y: 13 },
    { num: 7, label: "Мастер-числа",    sub: "Сила",            desc: "Особые вибрации 11, 22, 33 и их значение в твоей карте",       status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-7-master-number.png",     x: 47, y:  8 },
    { num: 8, label: "Личный код",      sub: "Целостность",     desc: "Синтез всех чисел — твоя полная нумерологическая картина",     status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-8-personal-code.png",     x: 80, y: 11 },
  ] : [
    { num: 1, label: "Life Path",       sub: "Foundation",      desc: "Your destiny number — the core vibration of your life path",   status: "done",    emblem: "/assets/node-emblems/numerology/emblem-1-path-number.png",      x: 50, y: 82 },
    { num: 2, label: "Soul Number",     sub: "Inner world",     desc: "Intuition, desires and your inner voice",                      status: "current", emblem: "/assets/node-emblems/numerology/emblem-2-soul-number.png",      x: 21, y: 64 },
    { num: 3, label: "Personality",     sub: "Outer image",     desc: "How the world perceives you",                                 status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-3-personality-number.png", x: 73, y: 64 },
    { num: 4, label: "Matrix",          sub: "Potential",       desc: "Pythagoras square — a map of your hidden possibilities",      status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-4-matrix.png",            x: 18, y: 40 },
    { num: 5, label: "Cycles",          sub: "Periods",         desc: "Personal cycles and life periods through numerology",         status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-5-cycles.png",            x: 75, y: 40 },
    { num: 6, label: "Karma",           sub: "Lessons",         desc: "Karmic debts and lessons carried by your soul",              status: "locked",  emblem: "/assets/node-emblems/numerology/emblem-6-karma.png",             x: 13, y: 13 },
    { num: 7, label: "Master Numbers",  sub: "Power",           desc: "Special vibrations 11, 22, 33 and their meaning in your chart", status: "locked", emblem: "/assets/node-emblems/numerology/emblem-7-master-number.png",     x: 47, y:  8 },
    { num: 8, label: "Personal Code",   sub: "Wholeness",       desc: "Synthesis of all numbers — your complete numerological picture", status: "locked", emblem: "/assets/node-emblems/numerology/emblem-8-personal-code.png",     x: 80, y: 11 },
  ];

  const LINES: [number, number][] = [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [3, 6],
    [4, 6], [4, 7],
  ];

  const discipline = lang === "ru" ? "Нумерология" : "Numerology";

  return <NodePathPage discipline={discipline} disciplineKey="numerology" nodes={NODES} lines={LINES} />;
}
