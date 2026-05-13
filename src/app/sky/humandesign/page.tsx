"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function HumanDesignPathPage() {
  const { lang } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Тип",            sub: "Основа",        desc: "Твой тип — ключ к пониманию своей природы и стратегии жизни",     status: "done",    emblem: "/assets/node-emblems/humandesign/emblem-1-type.png",      x: 50, y: 82 },
    { num: 2, label: "Авторитет",      sub: "Решение",       desc: "Внутренний авторитет — как ты принимаешь верные решения",         status: "current", emblem: "/assets/node-emblems/humandesign/emblem-2-authority.png", x: 21, y: 64 },
    { num: 3, label: "Профиль",        sub: "Роль",          desc: "Твой архетип и роль, которую ты играешь в этой жизни",            status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-3-profile.png",   x: 73, y: 64 },
    { num: 4, label: "Центры",         sub: "Энергия",       desc: "Определённые и неопределённые центры — где твоя сила",            status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-4-centers.png",   x: 18, y: 40 },
    { num: 5, label: "Каналы",         sub: "Поток",         desc: "Каналы связывают центры и формируют твою уникальность",           status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-5-channels.png",  x: 75, y: 40 },
    { num: 6, label: "Врата",          sub: "Темы",          desc: "64 врата И-Цзин — генетические коды твоего дизайна",              status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-6-gates.png",     x: 13, y: 13 },
    { num: 7, label: "Циклы",          sub: "Время",         desc: "Планетарные транзиты и твои личные циклы дизайна",                status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-7-cycles.png",    x: 47, y:  8 },
    { num: 8, label: "Жизнь по Дизайну", sub: "Целостность", desc: "Синтез всех элементов — жизнь в соответствии со своей природой",  status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-8-living.png",    x: 80, y: 11 },
  ] : [
    { num: 1, label: "Type",           sub: "Foundation",    desc: "Your type — the key to understanding your nature and life strategy", status: "done",    emblem: "/assets/node-emblems/humandesign/emblem-1-type.png",      x: 50, y: 82 },
    { num: 2, label: "Authority",      sub: "Decision",      desc: "Inner authority — how you make the right decisions",               status: "current", emblem: "/assets/node-emblems/humandesign/emblem-2-authority.png", x: 21, y: 64 },
    { num: 3, label: "Profile",        sub: "Role",          desc: "Your archetype and the role you play in this lifetime",            status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-3-profile.png",   x: 73, y: 64 },
    { num: 4, label: "Centers",        sub: "Energy",        desc: "Defined and undefined centers — where your power lives",           status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-4-centers.png",   x: 18, y: 40 },
    { num: 5, label: "Channels",       sub: "Flow",          desc: "Channels connect centers and form your unique design",             status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-5-channels.png",  x: 75, y: 40 },
    { num: 6, label: "Gates",          sub: "Themes",        desc: "64 I-Ching gates — the genetic codes of your design",             status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-6-gates.png",     x: 13, y: 13 },
    { num: 7, label: "Cycles",         sub: "Timing",        desc: "Planetary transits and your personal design cycles",              status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-7-cycles.png",    x: 47, y:  8 },
    { num: 8, label: "Living Design",  sub: "Wholeness",     desc: "Synthesis of all elements — living in alignment with your nature", status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-8-living.png",    x: 80, y: 11 },
  ];

  const LINES: [number, number][] = [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [3, 6],
    [4, 6], [4, 7],
  ];

  const discipline = lang === "ru" ? "Дизайн человека" : "Human Design";
  return <NodePathPage discipline={discipline} disciplineKey="humandesign" nodes={NODES} lines={LINES} />;
}
