"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ru";

/**
 * Set to true to re-enable the Russian locale in the UI.
 * RU translations are preserved in the T object below and will work
 * immediately once this flag is flipped back to true.
 */
export const ENABLE_RU_LOCALE = false;

const T = {
  en: {
    nav: { home: "Home", sky: "Sky", path: "Path", journal: "Journal", profile: "Profile" },
    welcome: {
      tagline: "Your personal\nstar path",
      subtitle: "Daily insights, sky map, practices, associative cards and observation journal in one space.",
      createAccount: "Create account",
      haveAccount: "I already have an account",
      guestNote: "You can continue as a guest, but your path progress\nand personal notes won't be saved.",
      directions: "directions", minDay: "min a day", personalPath: "personal path",
    },
    home: {
      today: "TODAY",
      readForecast: "Read forecast",
      energy: "Day's energy",
      high: "High",
      more: "More",
      yourCard: "Your card today",
      openCard: "Open card",
      recommended: "Recommended for today",
      seeAll: "See all →",
      yourPath: "Your path",
      keepRhythm: "Keep the rhythm. Keep going!",
      viewPath: "View path",
      cardOfDay: "Card of the day",
      dailyRitual: "Daily ritual",
      mindfulness: "Mindfulness\npractice",
      universeMsg: "Receive a message\nfrom the Universe",
      ritualLabel: "Gratitude ritual\n10 minutes",
      breathLabel: "Breathing & centering\n7 minutes",
      open: "Open", start: "Start", practice: "Practice",
      greetingLine2: "Good to see you again",
      greetingMorning: "Good morning", greetingDay: "Good afternoon", greetingEvening: "Good evening",
      energyDesc: "Energy for action and achieving goals",
      energyNote: "A good day for important decisions",
      streakDays: "day streak",
      hello: "Hello,",
      moonInScorpio: "Moon in Scorpio",
      moonDesc: "Moon in Scorpio heightens intuition. Trust your inner voice — today you will see what is hidden from others.",
    },
    sky: {
      title: "Sky Map",
      subtitle: "Choose a direction and continue your journey.",
      all: "All", active: "Active", available: "Available",
      currentPath: "Current path",
      availableLabel: "Available",
      premium: "Premium",
      astrology: "Astrology",
      numerology: "Numerology",
      humanDesign: "Human Design",
      pastLife: "Past Life",
      spiritual: "Spiritual Practices",
      soulmate: "Soul Mate",
      currentPoint: "Current point",
      nextUnlock: "Next unlock",
      unlocksAt: "Unlocks at level 3",
      pathProgress: "Path progress",
      level: "Level 2 of 10",
      diveIn: "Dive in",
      moonInScorpio: "Moon in Scorpio",
      currentPathBtn: "Current path",
    },
    today: {
      yourPath: "✦ Your path",
      astrology: "Astrology",
      progress: "Progress",
      pathNodes: "Path · Astrology nodes",
      sun: "Sun", moon: "Moon", planets: "Planets", aspects: "Aspects",
      cardOfDay: "Card of the day",
      practice: "Practice",
      ritual: "Ritual",
      universeMsg: "Message from\nthe Universe",
      meditation: "Meditation\n7 minutes",
      gratitude: "Gratitude\nritual",
      open: "Open", start: "Start",
      understandYourself: "Understand yourself through the star code",
      embraceCycles: "Embrace your cycles and make conscious decisions.",
      intuition: "Intuition", cycles: "Cycles", selfKnowledge: "Self-knowledge",
      currentNode: "Current node",
      nextNode: "Next node",
      moonNode: "Moon",
      moonDesc: "Depth, intuition and self-understanding",
      planetsNode: "Planets",
      planetsDesc: "Understanding energies and their influence",
      comingSoon: "Coming soon",
      forToday: "✦ For today",
      seeAll: "All →",
      pathProgress: "Path progress · Level 2 of 10",
      continuePath: "Continue path →",
      continueLink: "Continue →",
    },
    cards: {
      title: "Cards",
      subtitle: "Associative images for questions and decisions.",
      cardOfDay: "Card of the day",
      cardQuestion: "What have you already outgrown but keep around out of habit?",
      writeAnswer: "Write your answer →",
      recent: "Recent cards",
      sevenDays: "Recent",
      spreads: "Spreads",
      all: "All",
      threshold: "Threshold", lotus: "Lotus", candle: "Candle",
      today: "Today", yesterday: "Yesterday", mon: "Mon",
      oneSymbol: "One symbol", oneSymbolSub: "Quick question for today.",
      relationships: "Relationships", relationshipsSub: "What's happening between you.",
      threeCards: "Three cards", threeCardsSub: "Past, present, future.",
      celticCross: "Celtic Cross", celticCrossSub: "Deep spread for a situation.",
      min2: "2 min", min5: "5 min", min7: "7 min", min15: "15 min",
    },
    journal: {
      title: "Journal",
      subtitle: "Notes, answers and observations.",
      daysStreak: "days in a row",
      entries: "entries",
      nodes: "nodes",
      quickNote: "Quick note",
      placeholder: "What stood out today?",
      save: "Save entry",
      saved: "Saved",
      recent: "Recent entries",
      archive: "Archive",
      empty: "No entries in this category yet.",
      all: "All", insight: "Insight", node: "Node", card: "Card",
    },
    profile: {
      title: "Profile",
      subtitle: "Personal card and settings.",
      zodiac: "Gemini · 'Intuition' Path",
      streak: "day streak",
      days: "days", cards: "cards", entries: "entries",
      deepPath: "Deep Path",
      nodesCompleted: "nodes completed",
      next: "Next:",
      mercury: "Mercury",
      personalChart: "Personal Chart",
      personalChartSub: "Date, time and place of birth.",
      journalMenu: "Journal",
      journalMenuSub: "All entries and node answers.",
      settings: "Settings",
      settingsSub: "Notifications, language, privacy.",
      signOut: "Sign out",
      signOutSub: "Return to the start screen.",
      confirmSignOut: "Are you sure you want to sign out?",
      stay: "Stay",
      signOutConfirm: "Are you sure you want to sign out?",
      cancel: "Cancel",
    },
    settings: {
      title: "Settings",
      subtitle: "App preferences.",
      language: "Language",
      languageSub: "Choose the interface language.",
      english: "English",
      russian: "Russian",
      notifications: "Notifications",
      notificationsSub: "Daily reminders and updates.",
      privacy: "Privacy",
      privacySub: "Data and account management.",
      back: "Back",
    },
    nodePath: {
      title: "Deep Path",
      subtitle: "approximate constellation",
      currentNode: "CURRENT NODE",
      openNode: "Open node",
      nextNode: "NEXT NODE",
      progressTitle: "PATH PROGRESS",
      of: "of",
      nodes: "nodes",
    },
    register: {
      stepLabels: ["Account", "Birth", "Interests", "Start"],
      step1Title: "Create account",
      step1Sub: "We'll save your progress, chart and personal notes.",
      nameLabel: "Name",
      namePlaceholder: "What should we call you?",
      nameRequired: "Enter your name",
      genderLabel: "Gender",
      female: "Woman",
      male: "Man",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 8 characters",
      passwordMin: "Minimum 8 characters",
      generatePassword: "Generate password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      emailRequired: "Enter a valid email",
      continue: "Continue →",
      haveAccount: "Already have an account?",
      signIn: "Sign in",
      step2Title: "Birth data",
      step2Sub: "This is the basis for your personal chart and daily insights.",
      birthDateLabel: "Date of birth",
      birthDatePlaceholder: "DD.MM.YYYY",
      birthDateRequired: "Enter date of birth",
      birthDateFull: "Enter full date as DD.MM.YYYY",
      birthDateFormat: "Format: DD.MM.YYYY",
      birthMonthRange: "Month must be between 01 and 12",
      birthDayRange: "Day must be between 01 and 31",
      birthYearRange: "Year must be between 1900 and",
      birthDateInvalid: "This date does not exist",
      birthTimeLabel: "Time of birth",
      birthTimePlaceholder: "HH:MM",
      birthTimeFormat: "Enter time as HH:MM",
      birthTimeFormatHint: "Format: HH:MM",
      birthHourRange: "Hours from 00 to 23",
      birthMinuteRange: "Minutes from 00 to 59",
      birthTimeUnknown: "Don't know",
      birthTimeUnknownActive: "✓ Don't know",
      birthTimeNote: "Optional. Refines ascendant and houses.",
      birthPlaceLabel: "Place of birth",
      birthPlacePlaceholder: "New York, United States",
      birthPlaceRequired: "Enter place of birth",
      birthPlaceNote: "Start with a city. Country can be added if needed.",
      step3Title: "What resonates with you?",
      step3Sub: "Choose 1–2 directions. This will set up your first path.",
      directions: [
        { id: "astro",    emoji: "🌙", label: "Astrology",        sub: "chart, transits, daily forecast" },
        { id: "soul",     emoji: "💫", label: "Soul Mate",        sub: "love, compatibility, attraction" },
        { id: "practice", emoji: "🕯", label: "Practices",        sub: "rituals, breathing, mindfulness" },
        { id: "cards",    emoji: "✦",  label: "MAK Cards",        sub: "images, questions, insights" },
      ],
      step4Title: "Your path is ready",
      step4Sub: "We've assembled a starter chart. Your first day will begin with a short forecast and a gentle practice.",
      startMap: "Starter chart",
      startMapSub: "Created from your data",
      firstPath: "First path",
      firstPathSub: "Intuition and personal rhythm",
      observationJournal: "Observation journal",
      observationJournalSub: "Ready for your first entries",
      enterEluna: "Enter Eluna →",
    },
    login: {
      title: "Welcome back",
      subtitle: "Your path continues from where you left off.",
      passwordLabel: "Password",
      forgotPassword: "Forgot?",
      submit: "Sign in",
      submitting: "Signing in...",
      orSignInWith: "or sign in with",
      noAccount: "No account?",
      create: "Create one",
    },
  },
} as const;

export type Translations = typeof T.en;

const LangCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({ lang: "en", setLang: () => {}, t: T.en });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("eluna-lang");
    if (!ENABLE_RU_LOCALE) {
      // RU is temporarily disabled — migrate any stored RU preference to EN
      if (stored === "ru") localStorage.setItem("eluna-lang", "en");
      setLangState("en");
      return;
    }
    if (stored === "en" || stored === "ru") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    // Guard: ignore RU requests while the locale is disabled
    const safe: Lang = (!ENABLE_RU_LOCALE && l === "ru") ? "en" : l;
    setLangState(safe);
    localStorage.setItem("eluna-lang", safe);
  }

  return (
    <LangCtx.Provider value={{ lang: "en", setLang, t: T.en }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  return useContext(LangCtx);
}
