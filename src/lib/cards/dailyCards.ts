export type DailyCard = {
  id: string;
  title: string;
  theme: string;
  meaning: string;
  action: string;
  reflection: string;
  premium?: boolean;
};

export const dailyCards: DailyCard[] = [
  {
    id: "moon-mirror",
    title: "The Moon Mirror",
    theme: "Emotional truth",
    meaning: "What you feel today may reveal what your mind has been trying to avoid.",
    action: "Name one feeling without judging it.",
    reflection: "What emotion asked for my attention today?",
  },
  {
    id: "golden-gate",
    title: "The Golden Gate",
    theme: "Opportunity",
    meaning: "A small opening may matter more than a dramatic breakthrough.",
    action: "Say yes to one aligned opportunity.",
    reflection: "What door felt quietly open today?",
  },
  {
    id: "inner-flame",
    title: "The Inner Flame",
    theme: "Energy",
    meaning: "Your energy returns when you stop giving it to what drains you.",
    action: "Protect one part of your attention today.",
    reflection: "Where did my energy feel most alive?",
  },
  {
    id: "quiet-star",
    title: "The Quiet Star",
    theme: "Intuition",
    meaning: "The clearest signal may arrive quietly, not loudly.",
    action: "Pause before reacting.",
    reflection: "What did I know before I explained it?",
  },
  {
    id: "silver-thread",
    title: "The Silver Thread",
    theme: "Connection",
    meaning: "A bond, memory, or pattern may be asking to be seen with more honesty.",
    action: "Notice who or what you keep returning to.",
    reflection: "What connection repeated in my thoughts?",
  },
  {
    id: "stone-circle",
    title: "The Stone Circle",
    theme: "Grounding",
    meaning: "Stability grows when you return to the simple next step.",
    action: "Do one grounding action slowly.",
    reflection: "What helped me feel steady today?",
  },
  {
    id: "rose-key",
    title: "The Rose Key",
    theme: "Heart opening",
    meaning: "Softness does not make you weaker; it helps you hear what matters.",
    action: "Let one honest feeling exist without hiding it.",
    reflection: "Where did I allow softness today?",
  },
  {
    id: "black-lantern",
    title: "The Black Lantern",
    theme: "Shadow awareness",
    meaning: "What feels uncomfortable may be showing you where your power is hidden.",
    action: "Look at one avoided thought with curiosity.",
    reflection: "What did I avoid, and what did it teach me?",
  },
  {
    id: "dawn-path",
    title: "The Dawn Path",
    theme: "New direction",
    meaning: "Today favors one small movement toward a new rhythm.",
    action: "Choose one action that belongs to your future self.",
    reflection: "What new direction called me today?",
  },
  {
    id: "twin-waters",
    title: "The Twin Waters",
    theme: "Choice",
    meaning: "Two emotional currents may be moving through you. You do not need to force clarity.",
    action: "Write down both truths before choosing.",
    reflection: "What two truths existed at the same time?",
  },
  {
    id: "violet-shield",
    title: "The Violet Shield",
    theme: "Protection",
    meaning: "Your peace deserves structure, not just hope.",
    action: "Set one boundary in your time, space, or attention.",
    reflection: "What boundary protected my path today?",
  },
  {
    id: "cosmic-seed",
    title: "The Cosmic Seed",
    theme: "Growth",
    meaning: "What begins quietly today may become important later.",
    action: "Give one small practice your full attention.",
    reflection: "What seed did I plant today?",
  },
];

export function getDailyCardById(id: string | null | undefined) {
  return dailyCards.find((card) => card.id === id) ?? null;
}
