import type { MascotMood } from "./mascotAssets";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SectionKey =
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
  mood?: MascotMood;
};

export type QuickHelpItem = {
  question: string;
  answer: string;
  mood?: MascotMood;
};

export type SectionGuide = {
  section: SectionKey;
  title: string;
  intro: string;
  defaultMood: MascotMood;
  autoLaunchOnFirstVisit: boolean;
  steps: TutorialStep[];
  quickHelp: QuickHelpItem[];
};

export type MascotGuideStorage = {
  sections: Partial<Record<SectionKey, {
    seen: boolean;
    completed: boolean;
    skipped: boolean;
    lastOpenedAt?: string;
  }>>;
};

export const STORAGE_KEY = "eluna_mascot_guide_v1";

// ── Section guides ────────────────────────────────────────────────────────────

export const SECTION_GUIDES: Record<SectionKey, SectionGuide> = {

  today: {
    section: "today",
    title: "Today",
    intro: "This is your daily starting point.",
    defaultMood: "curious",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "today-1",
        title: "Your daily forecast",
        text: "Read the main insight for the day and start with the energy around you.",
        mood: "curious",
      },
      {
        id: "today-2",
        title: "Energy and card",
        text: "Use the energy and card blocks as quick signals, not strict rules.",
        mood: "calm",
      },
      {
        id: "today-3",
        title: "Recommended actions",
        text: "Follow the suggested practices when you want a simple next step.",
        mood: "happy",
      },
      {
        id: "today-4",
        title: "Come back daily",
        text: "This page changes with your rhythm, so it works best as a daily check-in.",
        mood: "calm",
      },
    ],
    quickHelp: [
      {
        question: "What is the moon card for?",
        answer: "It shows the current moon phase and its effect on your energy today.",
        mood: "curious",
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
        mood: "curious",
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
    defaultMood: "curious",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "sky-1",
        title: "Choose a direction",
        text: "Each direction opens a different part of your personal path.",
        mood: "curious",
      },
      {
        id: "sky-2",
        title: "Open nodes",
        text: "Nodes contain questions, insights, and practices.",
        mood: "calm",
      },
      {
        id: "sky-3",
        title: "Track progress",
        text: "Completed nodes build your deeper map over time.",
        mood: "happy",
      },
      {
        id: "sky-4",
        title: "Return anytime",
        text: "You can explore slowly. There is no need to finish everything at once.",
        mood: "calm",
      },
    ],
    quickHelp: [
      {
        question: "What does 'active' mean?",
        answer: "Active directions have unlocked nodes you can open right now.",
        mood: "curious",
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
    defaultMood: "curious",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "path-1",
        title: "Continue from where you stopped",
        text: "Your path shows what is active now.",
        mood: "curious",
      },
      {
        id: "path-2",
        title: "Follow the next node",
        text: "Open the next step when you want guidance.",
        mood: "calm",
      },
      {
        id: "path-3",
        title: "Reflect, do not rush",
        text: "The value is in noticing patterns, not speed.",
        mood: "happy",
      },
      {
        id: "path-4",
        title: "Use journal notes",
        text: "Important thoughts can be saved into your journal.",
        mood: "calm",
      },
    ],
    quickHelp: [
      {
        question: "What is a path?",
        answer: "A path is a sequence of nodes inside one direction — like a guided journey through a topic.",
        mood: "curious",
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
    defaultMood: "calm",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "journal-1",
        title: "Write what you noticed",
        text: "Capture thoughts, feelings, symbols, and repeated patterns.",
        mood: "curious",
      },
      {
        id: "journal-2",
        title: "Keep it short",
        text: "Even one sentence is enough.",
        mood: "calm",
      },
      {
        id: "journal-3",
        title: "Return later",
        text: "Your notes help you see how your path changes over time.",
        mood: "happy",
      },
    ],
    quickHelp: [
      {
        question: "Can I tag my entries?",
        answer: "Yes — use Insight, Node, or Card tags to filter entries later.",
        mood: "curious",
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
        mood: "sad",
      },
    ],
  },

  profile: {
    section: "profile",
    title: "Profile",
    intro: "This is your personal setup.",
    defaultMood: "calm",
    autoLaunchOnFirstVisit: true,
    steps: [
      {
        id: "profile-1",
        title: "Your details",
        text: "Your profile stores the basic information used for personalization.",
        mood: "curious",
      },
      {
        id: "profile-2",
        title: "Preferences",
        text: "Adjust what should feel more personal to you.",
        mood: "calm",
      },
      {
        id: "profile-3",
        title: "Progress",
        text: "This is also where your journey can be connected to your account.",
        mood: "happy",
      },
    ],
    quickHelp: [
      {
        question: "Where is my birth chart?",
        answer: "Tap 'Personal Chart' to see your stored birth date, time, and place.",
        mood: "curious",
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
    defaultMood: "calm",
    autoLaunchOnFirstVisit: false,
    steps: [
      {
        id: "settings-1",
        title: "App preferences",
        text: "Manage language, account, and interface options here.",
        mood: "calm",
      },
      {
        id: "settings-2",
        title: "Notifications later",
        text: "Some reminder settings may appear here as the app grows.",
        mood: "curious",
      },
      {
        id: "settings-3",
        title: "Keep control",
        text: "You can always return here to adjust the experience.",
        mood: "happy",
      },
    ],
    quickHelp: [
      {
        question: "How do I change the language?",
        answer: "The Language section at the top of this page lets you switch the interface language.",
        mood: "curious",
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
  if (pathname === "/today" || pathname.startsWith("/today/")) return "today";
  if (pathname === "/sky"   || pathname.startsWith("/sky/"))   return "sky";
  if (pathname === "/path"  || pathname.startsWith("/path/"))  return "path";
  if (pathname === "/journal" || pathname.startsWith("/journal/")) return "journal";
  if (pathname === "/profile" || pathname.startsWith("/profile/")) return "profile";
  if (pathname === "/settings") return "settings";
  return null;
}
