"use client";
import { useEffect, useState } from "react";
import { NodePathPage, PathNode } from "@/components/sky/NodePathPage";
import { useLang } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/profile/currentProfile";
import humanDesignMan from "@/assets/human-design-background/human_design_background_man.png";
import humanDesignWoman from "@/assets/human-design-background/human_design_background_woman.png";

export default function HumanDesignPathPage() {
  const { lang } = useLang();
  const [gender, setGender] = useState<"female" | "male">("female");

  useEffect(() => {
    let cancelled = false;
    void getCurrentProfile().then((profile) => {
      if (!cancelled && profile?.gender === "male") setGender("male");
    });
    return () => { cancelled = true; };
  }, []);

  const NODES: PathNode[] = false ? [
    { num: 1, label: "Energy Type",            sub: "Osnova",        desc: "How your energy naturally moves through the world",     status: "done",    emblem: "/assets/node-emblems/humandesign/emblem-1-type.png",      x: 50, y: 13 },
    { num: 2, label: "Avtoritet",      sub: "Reshenie",       desc: "Vnutrenniy avtoritet — kak ty prinimaesh vernye resheniya",         status: "current", emblem: "/assets/node-emblems/humandesign/emblem-2-authority.png", x: 50, y: 22 },
    { num: 3, label: "Profil",        sub: "Rol",          desc: "Tvoy arkhetip i rol, kotoruyu ty igraesh v etoy zhizni",            status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-3-profile.png",   x: 50, y: 32 },
    { num: 4, label: "Tsentry",         sub: "Energiya",       desc: "Opredelennye i neopredelennye tsentry — gde tvoya sila",            status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-4-centers.png",   x: 49, y: 44 },
    { num: 5, label: "Kanaly",         sub: "Potok",         desc: "Kanaly svyazyvayut tsentry i formiruyut tvoyu unikalnost",           status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-5-channels.png",  x: 63, y: 48 },
    { num: 6, label: "Vrata",          sub: "Temy",          desc: "64 vrata I-Tszin — geneticheskie kody tvoego dizayna",              status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-6-gates.png",     x: 50, y: 55 },
    { num: 7, label: "Tsikly",          sub: "Vremya",         desc: "Planetarnye tranzity i tvoi lichnye tsikly dizayna",                status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-7-cycles.png",    x: 63, y: 63 },
    { num: 8, label: "Zhizn po Dizaynu", sub: "Tselostnost", desc: "Sintez vsekh elementov — zhizn v sootvetstvii so svoey prirodoy",  status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-8-living.png",    x: 50, y: 84 },
  ] : [
    { num: 1, label: "Energy Type",           sub: "Foundation",    desc: "How your energy naturally moves through the world", status: "done",    emblem: "/assets/node-emblems/humandesign/emblem-1-type.png",      x: 50, y: 13 },
    { num: 2, label: "Authority",      sub: "Decision",      desc: "Inner authority — how you make the right decisions",               status: "current", emblem: "/assets/node-emblems/humandesign/emblem-2-authority.png", x: 50, y: 22 },
    { num: 3, label: "Profile",        sub: "Role",          desc: "Your archetype and the role you play in this lifetime",            status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-3-profile.png",   x: 50, y: 32 },
    { num: 4, label: "Centers",        sub: "Energy",        desc: "Defined and undefined centers — where your power lives",           status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-4-centers.png",   x: 49, y: 44 },
    { num: 5, label: "Channels",       sub: "Flow",          desc: "Channels connect centers and form your unique design",             status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-5-channels.png",  x: 63, y: 48 },
    { num: 6, label: "Gates",          sub: "Themes",        desc: "64 I-Ching gates — the genetic codes of your design",             status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-6-gates.png",     x: 50, y: 55 },
    { num: 7, label: "Cycles",         sub: "Timing",        desc: "Planetary transits and your personal design cycles",              status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-7-cycles.png",    x: 63, y: 63 },
    { num: 8, label: "Living Design",  sub: "Wholeness",     desc: "Synthesis of all elements — living in alignment with your nature", status: "locked",  emblem: "/assets/node-emblems/humandesign/emblem-8-living.png",    x: 50, y: 84 },
  ];

  const LINES: [number, number][] = [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [3, 6],
    [4, 6], [4, 7],
  ];

  const discipline = false ? "Dizayn cheloveka" : "Human Design";
  return (
    <NodePathPage
      discipline={discipline}
      disciplineKey="humandesign"
      nodes={NODES}
      lines={LINES}
      mapVariant="body"
      bodyMapBackground={gender === "male" ? humanDesignMan : humanDesignWoman}
    />
  );
}
