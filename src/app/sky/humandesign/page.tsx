"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function HumanDesignPathPage() {
  const { lang } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Tip",            sub: "Osnova",        desc: "Tvoy tip — klyuch k ponimaniyu svoey prirody i strategii zhizni",     status: "done",    emblem: "/assets/node-emblems/humandesign/emblem-1-type.png",      x: 50, y: 82 },
    { num: 2, label: "Avtoritet",      sub: "Reshenie",       desc: "Vnutrenniy avtoritet — kak ty prinimaesh vernye resheniya",         status: "current", emblem: "/assets/node-emblems/humandesign/emblem-2-authority.png", x: 21, y: 64 },
    { num: 3, label: "Profil",        sub: "Rol",          desc: "Tvoy arkhetip i rol, kotoruyu ty igraesh v etoy zhizni",            status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-3-profile.png",   x: 73, y: 64 },
    { num: 4, label: "Tsentry",         sub: "Energiya",       desc: "Opredelennye i neopredelennye tsentry — gde tvoya sila",            status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-4-centers.png",   x: 18, y: 40 },
    { num: 5, label: "Kanaly",         sub: "Potok",         desc: "Kanaly svyazyvayut tsentry i formiruyut tvoyu unikalnost",           status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-5-channels.png",  x: 75, y: 40 },
    { num: 6, label: "Vrata",          sub: "Temy",          desc: "64 vrata I-Tszin — geneticheskie kody tvoego dizayna",              status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-6-gates.png",     x: 13, y: 13 },
    { num: 7, label: "Tsikly",          sub: "Vremya",         desc: "Planetarnye tranzity i tvoi lichnye tsikly dizayna",                status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-7-cycles.png",    x: 47, y:  8 },
    { num: 8, label: "Zhizn po Dizaynu", sub: "Tselostnost", desc: "Sintez vsekh elementov — zhizn v sootvetstvii so svoey prirodoy",  status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-8-living.png",    x: 80, y: 11 },
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

  const discipline = lang === "ru" ? "Dizayn cheloveka" : "Human Design";
  return <NodePathPage discipline={discipline} disciplineKey="humandesign" nodes={NODES} lines={LINES} />;
}
