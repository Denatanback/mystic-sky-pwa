"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function PastLifePathPage() {
  const { lang } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Vozrast dushi",      sub: "Nachalo",       desc: "Uroven evolyutsii tvoey dushi i ee opyt proshlykh voploscheniy",      status: "done",    emblem: "/assets/node-emblems/pastlife/emblem-1-soul-age.png",    x: 50, y: 82 },
    { num: 2, label: "Karma",             sub: "Patterny",     desc: "Povtoryayuschiesya temy i karmicheskie patterny iz proshlykh zhizney",   status: "current", emblem: "/assets/node-emblems/pastlife/emblem-2-karma.png",       x: 21, y: 64 },
    { num: 3, label: "Znak proshloy zhizni", sub: "Pamyat",      desc: "Astrologicheskie sledy proshlykh voploscheniy v tvoey karte",        status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-3-sign.png",        x: 73, y: 64 },
    { num: 4, label: "Lunnye uzly",       sub: "Put",         desc: "Yuzhnyy uzel — proshloe, Severnyy — tvoya evolyutsiya v etoy zhizni",   status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-4-nodes.png",       x: 18, y: 40 },
    { num: 5, label: "Karmicheskie dolgi", sub: "Uroki",        desc: "Nezavershennye uroki, kotorye tvoya dusha prishla zavershit",       status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-5-debts.png",       x: 75, y: 40 },
    { num: 6, label: "Kontrakty dush",     sub: "Svyazi",        desc: "Dogovorennosti mezhdu dushami, zaklyuchennye do rozhdeniya",          status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-6-contracts.png",   x: 13, y: 13 },
    { num: 7, label: "Talanty",           sub: "Dary",         desc: "Sposobnosti i dary, prinesennye iz proshlykh voploscheniy",         status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-7-talents.png",     x: 47, y:  8 },
    { num: 8, label: "Integratsiya",        sub: "Tselostnost",  desc: "Sintez urokov proshlogo i sozdanie garmonichnogo buduschego",       status: "locked",  emblem: "/assets/node-emblems/pastlife/emblem-8-integration.png", x: 80, y: 11 },
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

  const discipline = lang === "ru" ? "Proshlaya zhizn" : "Past Life";
  return <NodePathPage discipline={discipline} disciplineKey="pastlife" nodes={NODES} lines={LINES} />;
}
