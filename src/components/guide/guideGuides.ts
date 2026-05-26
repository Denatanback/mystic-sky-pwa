import type { GuideTone } from "./guideAssets";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SectionKey =
  | "home"
  | "today"
  | "sky"
  | "path"
  | "journal"
  | "profile"
  | "settings";

export type TutorialStep = {
  id: string;
  title: string;
  text: string;
  tone?: GuideTone;
};

export type QuickHelpItem = {
  question: string;
  answer: string;
  tone?: GuideTone;
};

export type SectionGuide = {
  section: SectionKey;
  title: string;
  intro: string;
  defaultTone: GuideTone;
  autoLaunchOnFirstVisit: boolean;
  steps: TutorialStep[];
  quickHelp: QuickHelpItem[];
};

export type GuideGuideStorage = {
  sections: Partial<Record<SectionKey, {
    seen: boolean;
    completed: boolean;
    skipped: boolean;
    lastOpenedAt?: string;
  }>>;
};

export const STORAGE_KEY = "eluna:tours:v1:completed";

// ── Section guides ────────────────────────────────────────────────────────────

export const SECTION_GUIDES: Record<SectionKey, SectionGuide> = {
  home: {
    section: "home",
    title: "Home",
    intro: "A quick guide to your daily dashboard.",
    defaultTone: "calm",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "home-today-card",
        title: "Today's insight",
        text: "Your daily sky reading and emotional focus appear here.",
      },
      {
        id: "home-day-energy",
        title: "Day energy",
        text: "This shows the overall rhythm of your day.",
      },
      {
        id: "home-card-today",
        title: "Your card today",
        text: "Open your daily card for a short reflective message.",
      },
      {
        id: "home-recommendations",
        title: "Recommended for today",
        text: "These actions help you turn the reading into practice.",
      },
    ],
    quickHelp: [
      {
        question: "What changes daily?",
        answer: "The date, daily reading, energy block, card prompt and recommendations are designed as your daily starting point.",
      },
      {
        question: "Where do I continue my path?",
        answer: "Use the Sky Map or Today page to move from a reading into a concrete practice.",
      },
    ],
  },

  today: {
    section: "today",
    title: "Today",
    intro: "This is your daily starting point.",
    defaultTone: "curious",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "today-moon-card",
        title: "Moon today",
        text: "This card shows the main emotional tone of the day.",
      },
      {
        id: "today-recommended-actions",
        title: "Recommended actions",
        text: "Use these small practices as your next step.",
      },
    ],
    quickHelp: [
      {
        question: "What is the moon card for?",
        answer: "It shows the current moon phase and its effect on your energy today.",
        tone: "curious",
      },
      {
        question: "Does the forecast change every day?",
        answer: "Yes. It is calculated fresh each day from the moon phase and your personal data.",
      },
      {
        question: "What are the practices on this page?",
        answer: "Meditation, ritual, and card of the day — quick activities matched to your current rhythm.",
      },
      {
        question: "What is the personal day number?",
        answer: "A numerology cycle number that describes the general theme of your day.",
        tone: "curious",
      },
      {
        question: "Can I skip today and check yesterday?",
        answer: "This page always reflects today. Journal entries let you look back at past observations.",
      },
    ],
  },

  sky: {
    section: "sky",
    title: "Sky Map",
    intro: "This is where your main directions live.",
    defaultTone: "curious",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "sky-map-main",
        title: "Your Sky Map",
        text: "This is where your personal directions live.",
      },
      {
        id: "sky-map-filters",
        title: "Filter directions",
        text: "Switch between all, active, and locked areas of your path.",
      },
    ],
    quickHelp: [
      {
        question: "What does 'active' mean?",
        answer: "Active directions have unlocked nodes you can open right now.",
        tone: "curious",
      },
      {
        question: "What is a node?",
        answer: "A node is one focused step inside a direction — it might be a reading, a question, or a short practice.",
      },
      {
        question: "Why are some directions locked?",
        answer: "Premium directions unlock as you progress or when your plan includes them.",
      },
      {
        question: "What is Astrology in the Sky Map?",
        answer: "It maps your sun sign, moon sign, and birth chart progressively through 8 nodes.",
      },
      {
        question: "Do I need to follow a specific order?",
        answer: "Start with whatever direction draws you most. Nodes within a direction unlock in sequence.",
      },
    ],
  },

  path: {
    section: "path",
    title: "Path",
    intro: "This is your current journey.",
    defaultTone: "curious",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "path-1",
        title: "Continue from where you stopped",
        text: "Your path shows what is active now.",
        tone: "curious",
      },
      {
        id: "path-2",
        title: "Follow the next node",
        text: "Open the next step when you want guidance.",
        tone: "calm",
      },
      {
        id: "path-3",
        title: "Reflect, do not rush",
        text: "The value is in noticing patterns, not speed.",
        tone: "happy",
      },
      {
        id: "path-4",
        title: "Use journal notes",
        text: "Important thoughts can be saved into your journal.",
        tone: "calm",
      },
    ],
    quickHelp: [
      {
        question: "What is a path?",
        answer: "A path is a sequence of nodes inside one direction — like a guided journey through a topic.",
        tone: "curious",
      },
      {
        question: "How do I unlock the next node?",
        answer: "Complete the current node by finishing all exercises and tapping 'Complete node'.",
      },
      {
        question: "Can I have multiple active paths?",
        answer: "Right now one path is active at a time. You can switch directions from the Sky Map.",
      },
      {
        question: "What happens after I finish all nodes?",
        answer: "Your progress is saved and you can revisit any node. More content will be added over time.",
      },
    ],
  },

  journal: {
    section: "journal",
    title: "Journal",
    intro: "This is where your observations become visible.",
    defaultTone: "calm",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "journal-1",
        title: "Write what you noticed",
        text: "Capture thoughts, feelings, symbols, and repeated patterns.",
        tone: "curious",
      },
      {
        id: "journal-2",
        title: "Keep it short",
        text: "Even one sentence is enough.",
        tone: "calm",
      },
      {
        id: "journal-3",
        title: "Return later",
        text: "Your notes help you see how your path changes over time.",
        tone: "happy",
      },
    ],
    quickHelp: [
      {
        question: "Can I tag my entries?",
        answer: "Yes — use Insight, Node, or Card tags to filter entries later.",
        tone: "curious",
      },
      {
        question: "Are entries saved automatically?",
        answer: "Tap 'Save entry' after writing. Quick notes are saved to your journal history.",
      },
      {
        question: "What is the streak counter?",
        answer: "It counts how many days in a row you have written at least one entry.",
      },
      {
        question: "Can I delete or edit a past entry?",
        answer: "Editing and deletion will be available in an upcoming update.",
        tone: "sad",
      },
    ],
  },

  profile: {
    section: "profile",
    title: "Profile",
    intro: "This is your personal setup.",
    defaultTone: "calm",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "profile-button",
        title: "Your profile",
        text: "This is where your account, settings, and progress live.",
      },
    ],
    quickHelp: [
      {
        question: "Where is my birth chart?",
        answer: "Tap 'Personal Chart' to see your stored birth date, time, and place.",
        tone: "curious",
      },
      {
        question: "Can I change my name or email?",
        answer: "Name can be updated in Personal Chart. Email changes are available in Settings.",
      },
      {
        question: "What does the progress ring show?",
        answer: "It reflects how many nodes you have completed across all directions.",
      },
      {
        question: "How do I sign out?",
        answer: "Scroll to the bottom of the profile page and tap 'Sign out'.",
      },
    ],
  },

  settings: {
    section: "settings",
    title: "Settings",
    intro: "This is where you control the app experience.",
    defaultTone: "calm",
    autoLaunchOnFirstVisit: false,
    steps: [
      {
        id: "settings-1",
        title: "App preferences",
        text: "Manage language, account, and interface options here.",
        tone: "calm",
      },
      {
        id: "settings-2",
        title: "Notifications later",
        text: "Some reminder settings may appear here as the app grows.",
        tone: "curious",
      },
      {
        id: "settings-3",
        title: "Keep control",
        text: "You can always return here to adjust the experience.",
        tone: "happy",
      },
    ],
    quickHelp: [
      {
        question: "How do I change the language?",
        answer: "The Language section at the top of this page lets you switch the interface language.",
        tone: "curious",
      },
      {
        question: "Will notifications be added?",
        answer: "Yes — daily reminders and path nudges are planned for a future update.",
      },
      {
        question: "Where is my account data?",
        answer: "Account details and privacy options are under the Privacy section.",
      },
    ],
  },

};

/** Returns the guide for a given section, or null if unsupported. */
export function getGuide(section: SectionKey | null): SectionGuide | null {
  if (!section) return null;
  return SECTION_GUIDES[section] ?? null;
}

/** Maps a pathname to a SectionKey. Returns null for unsupported routes. */
export function pathToSection(pathname: string): SectionKey | null {
  if (pathname === "/home") return "home";
  if (pathname === "/today" || pathname.startsWith("/today/")) return "today";
  if (pathname === "/sky"   || pathname.startsWith("/sky/"))   return "sky";
  if (pathname === "/path"  || pathname.startsWith("/path/"))  return "path";
  if (pathname === "/journal" || pathname.startsWith("/journal/")) return "journal";
  if (pathname === "/profile" || pathname.startsWith("/profile/")) return "profile";
  if (pathname === "/settings") return "settings";
  return null;
}
