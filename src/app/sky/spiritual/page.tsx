"use client";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";

export default function SpiritualPathPage() {
  const { lang } = useLang();

  const NODES: PathNode[] = lang === "ru" ? [
    { num: 1, label: "Meditatsiya",      sub: "Osnova",        desc: "Tishina uma — pervyy shag k soedineniyu s soboy",                   status: "done",    emblem: "/assets/node-emblems/spiritual/emblem-1-meditation.png",     x: 50, y: 82 },
    { num: 2, label: "Dykhanie",        sub: "Energiya",       desc: "Pranayama i dykhatelnye praktiki dlya probuzhdeniya zhiznennoy sily", status: "current", emblem: "/assets/node-emblems/spiritual/emblem-2-breathwork.png",     x: 21, y: 64 },
    { num: 3, label: "Vizualizatsiya",   sub: "Razum",         desc: "Sila voobrazheniya i rabota s obrazami dlya transformatsii",         status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-3-visualization.png",  x: 73, y: 64 },
    { num: 4, label: "Chakry",          sub: "Tsentry",        desc: "Sem energeticheskikh tsentrov — balans i garmoniya tela i dukha",    status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-4-chakras.png",         x: 18, y: 40 },
    { num: 5, label: "Mantry",         sub: "Zvuk",          desc: "Svyaschennye zvuki i vibratsii, izmenyayuschie sostoyanie soznaniya",      status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-5-mantras.png",         x: 75, y: 40 },
    { num: 6, label: "Ritual",         sub: "Namerenie",     desc: "Sozdanie svyaschennogo prostranstva i rabota s namereniem",         status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-6-ritual.png",          x: 13, y: 13 },
    { num: 7, label: "Ten",           sub: "Glubina",       desc: "Rabota s tenyu — integratsiya neprinyatykh chastey sebya",             status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-7-shadow.png",          x: 47, y:  8 },
    { num: 8, label: "Probuzhdenie",    sub: "Tselostnost",   desc: "Sintez praktik — zhizn iz sostoyaniya osoznannosti i sveta",      status: "locked",  emblem: "/assets/node-emblems/spiritual/emblem-8-awakening.png",       x: 80, y: 11 },
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

  const discipline = lang === "ru" ? "Dukhovnye praktiki" : "Spiritual Practices";
  return <NodePathPage discipline={discipline} disciplineKey="spiritual" nodes={NODES} lines={LINES} />;
}
