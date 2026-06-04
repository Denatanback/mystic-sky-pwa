export type SkyNodeStatus = "active" | "available" | "locked" | "premium" | "completed";
export type SkyUnlockType = "free" | "progress" | "premium" | "time";

export type SkyNode = {
  id: string;
  num: number;
  title: string;
  category: string;
  discipline: string;
  description: string;
  meaning: string;
  status: SkyNodeStatus;
  route: string;
  requirement: string;
  unlockType: SkyUnlockType;
  requiredDailyCompletions?: number;
  availableOnDay?: number;
  premium?: boolean;
  emblem: string;
  deg: number;
  previewBullets: string[];
};

export const disciplineDescriptions = {
  astrology: "Identity, timing, emotional rhythm, and the patterns reflected by the sky.",
  numerology: "Life path, inner drive, repeating numbers, and personal cycles.",
  humanDesign: "Energy rhythm, decision-making style, and how your system interacts with the world.",
  pastLife: "Repeating emotional themes, soul memory, and patterns that feel older than the present.",
  spiritual: "Grounding rituals, affirmations, reflection, and daily integration.",
  soulmate: "Connection patterns, attraction themes, mirrors, and relationship signals.",
};

export const baseSkyNodes: SkyNode[] = [
  {
    id: "sun-sign",
    num: 1,
    title: "Sun Sign",
    category: "Astrology",
    discipline: disciplineDescriptions.astrology,
    description: "Your Sun sign shows the core energy you return to when you make choices, seek meaning, and express identity.",
    meaning: "Your core solar identity",
    status: "active",
    route: "/sky/astrology/1",
    requirement: "Available now",
    unlockType: "free",
    emblem: "/assets/sky-emblems/sky-astrology-emblem.png",
    deg: 0,
    previewBullets: ["Your sign meaning", "Your core strengths", "One reflection question", "How this connects to today's path"],
  },
  {
    id: "life-path",
    num: 2,
    title: "Life Path",
    category: "Numerology",
    discipline: disciplineDescriptions.numerology,
    description: "Your Life Path number shows the rhythm behind your choices, challenges, and recurring direction.",
    meaning: "Your inner drive and direction",
    status: "available",
    route: "/sky/numerology/1",
    requirement: "Available after setup",
    unlockType: "free",
    emblem: "/assets/sky-emblems/sky-numerology-emblem.png",
    deg: 300,
    previewBullets: ["Your Life Path number", "Core traits", "A practical interpretation", "How to use the number today"],
  },
  {
    id: "energy-rhythm",
    num: 3,
    title: "Energy Rhythm",
    category: "Human Design",
    discipline: disciplineDescriptions.humanDesign,
    description: "This node introduces how your energy system moves through choices, rest, and response.",
    meaning: "Decision-making style and energy rhythm",
    status: "locked",
    route: "/sky/humandesign/1",
    requirement: "Available with Intro access or Premium",
    unlockType: "premium",
    premium: true,
    emblem: "/assets/sky-emblems/sky-humandesign-emblem-2.png",
    deg: 60,
    previewBullets: ["Your energy rhythm", "Where you force effort", "One daily integration prompt", "A simple decision-making check"],
  },
  {
    id: "past-life-signal",
    num: 4,
    title: "Past Life Signal",
    category: "Soul Memory",
    discipline: disciplineDescriptions.pastLife,
    description: "This node explores repeating emotional patterns that may feel older than the present moment.",
    meaning: "Repeating emotional patterns across your path",
    status: "premium",
    route: "/sky/pastlife/1",
    requirement: "Start 3-day access for $1 or complete 3 daily practices",
    unlockType: "premium",
    requiredDailyCompletions: 3,
    premium: true,
    emblem: "/assets/sky-emblems/sky-pastlife-emblem.png",
    deg: 240,
    previewBullets: ["A past-life signal preview", "The pattern it mirrors", "A grounded release prompt", "How it connects to today's practice"],
  },
  {
    id: "grounding-practice",
    num: 5,
    title: "Grounding Practice",
    category: "Spiritual Practices",
    discipline: disciplineDescriptions.spiritual,
    description: "This node turns your daily insight into a short practice that helps you integrate the path.",
    meaning: "Reflection, affirmations, and daily integration",
    status: "available",
    route: "/sky/spiritual/1",
    requirement: "Available with Intro access or Premium",
    unlockType: "premium",
    premium: true,
    emblem: "/assets/sky-emblems/sky-soulpractice-emblem.png",
    deg: 180,
    previewBullets: ["A grounding ritual", "One reflection question", "A practice instruction", "A path integration cue"],
  },
  {
    id: "soulmate-pattern",
    num: 6,
    title: "Soulmate Pattern",
    category: "Soulmate",
    discipline: disciplineDescriptions.soulmate,
    description: "This node previews attraction themes, relationship mirrors, and the signals that repeat in connection.",
    meaning: "Connection patterns, attraction themes, and mirrors",
    status: "premium",
    route: "/sky/soulmate/1",
    requirement: "Available with Intro access or Premium",
    unlockType: "premium",
    premium: true,
    emblem: "/assets/sky-emblems/sky-soulmate-emblem.png",
    deg: 120,
    previewBullets: ["Your connection pattern", "A relationship mirror", "One grounded reflection", "A deeper premium insight"],
  },
  {
    id: "weekly-report",
    num: 7,
    title: "Weekly Soul Report",
    category: "Reports",
    discipline: "Weekly synthesis of your readings, practices, and recurring signals.",
    description: "A weekly report collects your repeated signals and shows how your path is changing.",
    meaning: "Your weekly signal pattern",
    status: "locked",
    route: "/profile",
    requirement: "Return on Day 7",
    unlockType: "time",
    availableOnDay: 7,
    premium: true,
    emblem: "/assets/sky-emblems/sky-soulpractice-emblem.png",
    deg: 210,
    previewBullets: ["Weekly signal summary", "Recurring symbols", "Practice streak insights", "Next-week guidance"],
  },
];

export function resolveSkyNodes(input: {
  completedCount: number;
  hasPremiumAccess: boolean;
  birthDate?: string | null;
}) {
  return baseSkyNodes.map((node) => {
    if (node.unlockType === "free") {
      return {
        ...node,
        status: node.id === "life-path" && input.birthDate ? "active" as const : node.status,
      };
    }

    if (node.unlockType === "progress") {
      const required = node.requiredDailyCompletions ?? 1;
      return {
        ...node,
        status: input.completedCount >= required ? "available" as const : "locked" as const,
      };
    }

    if (node.unlockType === "premium") {
      return {
        ...node,
        status: input.hasPremiumAccess ? "available" as const : "premium" as const,
      };
    }

    return node;
  });
}
