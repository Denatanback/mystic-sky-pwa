"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function SoulmatePathPage() {
  const { lang } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Venera",          sub: "Lyubov",        desc: "Venera v tvoey karte — tvoya priroda lyubvi i privlecheniya",        status: "done",    emblem: "/assets/node-emblems/soulmate/emblem-1-venus.png",    x: 50, y: 82 },
    { num: 2, label: "Liniya serdtsa",    sub: "Svyaz",         desc: "Emotsionalnaya svyaz — chto otkryvaet tvoe serdtse",               status: "current", emblem: "/assets/node-emblems/soulmate/emblem-2-heart.png",    x: 21, y: 64 },
    { num: 3, label: "Sinastriya",       sub: "Sovmestimost", desc: "Nalozhenie kart dvukh lyudey — patterny i dinamika otnosheniy",      status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-3-synastry.png", x: 73, y: 64 },
    { num: 4, label: "Kompozit",        sub: "Soyuz",          desc: "Karta otnosheniy — energiya soyuza dvukh lyudey",                    status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-4-composite.png", x: 18, y: 40 },
    { num: 5, label: "Kontrakt dushi",   sub: "Svyaz",         desc: "Karmicheskie dogovorennosti mezhdu tvoey dushoy i partnerom",       status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-5-contract.png", x: 75, y: 40 },
    { num: 6, label: "Dvoynoe plamya",   sub: "Zerkalo",       desc: "Vstrecha s zerkalnoy dushoy — glubochayshiy soyuz i vyzov",          status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-6-twin.png",     x: 13, y: 13 },
    { num: 7, label: "Tsikly lyubvi",     sub: "Vremya",         desc: "Lichnye tsikly otkrytosti i zakrytosti dlya otnosheniy",             status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-7-cycles.png",   x: 47, y:  8 },
    { num: 8, label: "Svyaschennyy soyuz",  sub: "Tselostnost",   desc: "Lyubov kak put k dukhovnomu rostu i edinstvu",                  status: "locked",  emblem: "/assets/node-emblems/soulmate/emblem-8-union.png",    x: 80, y: 11 },
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

  const discipline = lang === "ru" ? "Rodstvennaya dusha" : "Soulmate";
  return <NodePathPage discipline={discipline} disciplineKey="soulmate" nodes={NODES} lines={LINES} />;
}
