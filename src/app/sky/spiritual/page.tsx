"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function SpiritualPathPage() {
  const { lang } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Медитация",      sub: "Основа",        desc: "Тишина ума — первый шаг к соединению с собой",                   status: "done",    emblem: "/assets/node-emblems/spiritual/emblem-1-meditation.png",     x: 50, y: 82 },
    { num: 2, label: "Дыхание",        sub: "Энергия",       desc: "Пранаяма и дыхательные практики для пробуждения жизненной силы", status: "current", emblem: "/assets/node-emblems/spiritual/emblem-2-breathwork.png",     x: 21, y: 64 },
    { num: 3, label: "Визуализация",   sub: "Разум",         desc: "Сила воображения и работа с образами для трансформации",         status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-3-visualization.png",  x: 73, y: 64 },
    { num: 4, label: "Чакры",          sub: "Центры",        desc: "Семь энергетических центров — баланс и гармония тела и духа",    status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-4-chakras.png",         x: 18, y: 40 },
    { num: 5, label: "Мантры",         sub: "Звук",          desc: "Священные звуки и вибрации, изменяющие состояние сознания",      status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-5-mantras.png",         x: 75, y: 40 },
    { num: 6, label: "Ритуал",         sub: "Намерение",     desc: "Создание священного пространства и работа с намерением",         status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-6-ritual.png",          x: 13, y: 13 },
    { num: 7, label: "Тень",           sub: "Глубина",       desc: "Работа с тенью — интеграция непринятых частей себя",             status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-7-shadow.png",          x: 47, y:  8 },
    { num: 8, label: "Пробуждение",    sub: "Целостность",   desc: "Синтез практик — жизнь из состояния осознанности и света",      status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-8-awakening.png",       x: 80, y: 11 },
  ] : [
    { num: 1, label: "Meditation",     sub: "Foundation",    desc: "Stillness of mind — the first step toward connecting with yourself", status: "done",    emblem: "/assets/node-emblems/spiritual/emblem-1-meditation.png",     x: 50, y: 82 },
    { num: 2, label: "Breathwork",     sub: "Energy",        desc: "Pranayama and breathing practices to awaken life force",          status: "current", emblem: "/assets/node-emblems/spiritual/emblem-2-breathwork.png",     x: 21, y: 64 },
    { num: 3, label: "Visualisation",  sub: "Mind",          desc: "The power of imagination and working with images for transformation", status: "locked", emblem: "/assets/node-emblems/spiritual/emblem-3-visualization.png",  x: 73, y: 64 },
    { num: 4, label: "Chakras",        sub: "Centers",       desc: "Seven energy centers — balance and harmony of body and spirit",   status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-4-chakras.png",         x: 18, y: 40 },
    { num: 5, label: "Mantras",        sub: "Sound",         desc: "Sacred sounds and vibrations that shift states of consciousness", status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-5-mantras.png",         x: 75, y: 40 },
    { num: 6, label: "Ritual",         sub: "Intention",     desc: "Creating sacred space and working with intention",               status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-6-ritual.png",          x: 13, y: 13 },
    { num: 7, label: "Shadow Work",    sub: "Depth",         desc: "Shadow integration — embracing the unaccepted parts of yourself", status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-7-shadow.png",          x: 47, y:  8 },
    { num: 8, label: "Awakening",      sub: "Wholeness",     desc: "Synthesis of practices — living from awareness and inner light", status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-8-awakening.png",       x: 80, y: 11 },
  ];

  const LINES: [number, number][] = [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [3, 6],
    [4, 6], [4, 7],
  ];

  const discipline = lang === "ru" ? "Духовные практики" : "Spiritual Practices";
  return <NodePathPage discipline={discipline} disciplineKey="spiritual" nodes={NODES} lines={LINES} />;
}
