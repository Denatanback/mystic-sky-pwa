"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { MascotSheet }            from "./MascotSheet";
import { MascotTutorialOverlay }  from "./MascotTutorialOverlay";

import type { MascotMood }        from "./mascotAssets";
import {
  SECTION_GUIDES,
  STORAGE_KEY,
  getGuide,
  pathToSection,
  type MascotGuideStorage,
  type SectionKey,
} from "./mascotGuides";

// ── Context ───────────────────────────────────────────────────────────────────

interface MascotContextValue {
  openHelp:         () => void;
  startTutorial:    (section?: SectionKey) => void;
  closeTutorial:    () => void;
  currentSection:   SectionKey | null;
  currentMood:      MascotMood;
}

const MascotCtx = createContext<MascotContextValue>({
  openHelp:       () => {},
  startTutorial:  () => {},
  closeTutorial:  () => {},
  currentSection: null,
  currentMood:    "calm",
});

export function useMascot() {
  return useContext(MascotCtx);
}

// ── Storage helpers ───────────────────────────────────────────────────────────

function loadStorage(): MascotGuideStorage {
  if (typeof window === "undefined") return { sections: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MascotGuideStorage;
  } catch {
    // ignore corrupt data
  }
  return { sections: {} };
}

function saveStorage(data: MascotGuideStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage quota issues
  }
}

function markSection(
  data: MascotGuideStorage,
  section: SectionKey,
  patch: Partial<{ seen: boolean; completed: boolean; skipped: boolean }>,
): MascotGuideStorage {
  return {
    ...data,
    sections: {
      ...data.sections,
      [section]: {
        seen:      false,
        completed: false,
        skipped:   false,
        ...data.sections[section],
        ...patch,
        lastOpenedAt: new Date().toISOString(),
      },
    },
  };
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [sheetOpen,    setSheetOpen]    = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentMood,  setCurrentMood]  = useState<MascotMood>("calm");

  const storageRef    = useRef<MascotGuideStorage>({ sections: {} });
  const autoTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive section from current pathname
  const currentSection: SectionKey | null = pathToSection(pathname ?? "");
  const guide = getGuide(currentSection);

  // ── Sync mood to current section ─────────────────────────────────────────
  useEffect(() => {
    if (guide && !tutorialOpen && !sheetOpen) {
      setCurrentMood(guide.defaultMood);
    }
  }, [currentSection]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load storage once on mount ────────────────────────────────────────────
  useEffect(() => {
    storageRef.current = loadStorage();
  }, []);

  // ── Auto-launch first-visit tutorial ─────────────────────────────────────
  useEffect(() => {
    // Clear any pending auto-launch from the previous page
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);

    if (!guide || !guide.autoLaunchOnFirstVisit) return;
    if (!currentSection) return;

    const sectionState = storageRef.current.sections[currentSection];
    if (sectionState?.seen || sectionState?.completed || sectionState?.skipped) return;

    // Wait 700ms before auto-launching (let the page settle)
    autoTimerRef.current = setTimeout(() => {
      // Mark as seen so we never auto-launch again for this section
      storageRef.current = markSection(storageRef.current, currentSection, { seen: true });
      saveStorage(storageRef.current);

      // Auto-open the sheet (softer than jumping straight to tutorial)
      setCurrentMood("curious");
      setSheetOpen(true);
    }, 700);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [currentSection]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────────────

  const openHelp = useCallback(() => {
    if (!guide) return;
    setCurrentMood(guide.defaultMood);
    setSheetOpen(true);
  }, [guide]);

  const startTutorial = useCallback((section?: SectionKey) => {
    const targetSection = section ?? currentSection;
    const targetGuide   = targetSection ? SECTION_GUIDES[targetSection] : guide;
    if (!targetGuide) return;

    setSheetOpen(false);
    setTutorialStep(0);
    setCurrentMood("curious");
    setTutorialOpen(true);
  }, [currentSection, guide]);

  const closeTutorial = useCallback(() => {
    setTutorialOpen(false);
    if (currentSection && guide) {
      setCurrentMood(guide.defaultMood);
    }
  }, [currentSection, guide]);

  function handleSkip() {
    if (!currentSection) return;
    storageRef.current = markSection(storageRef.current, currentSection, { skipped: true });
    saveStorage(storageRef.current);
    closeTutorial();
  }

  function handleDone() {
    if (!currentSection) return;
    storageRef.current = markSection(storageRef.current, currentSection, { completed: true });
    saveStorage(storageRef.current);
    setCurrentMood("happy");
    setTutorialOpen(false);
  }

  function handleNext() {
    if (!guide) return;
    const nextStep = tutorialStep + 1;
    if (nextStep < guide.steps.length) {
      setTutorialStep(nextStep);
      const stepMood = guide.steps[nextStep].mood;
      if (stepMood) setCurrentMood(stepMood);
    }
  }

  function handleBack() {
    const prevStep = tutorialStep - 1;
    if (prevStep >= 0 && guide) {
      setTutorialStep(prevStep);
      const stepMood = guide.steps[prevStep].mood;
      if (stepMood) setCurrentMood(stepMood);
    }
  }

  // ── Context value ─────────────────────────────────────────────────────────

  const ctxValue: MascotContextValue = {
    openHelp,
    startTutorial,
    closeTutorial,
    currentSection,
    currentMood,
  };


  return (
    <MascotCtx.Provider value={ctxValue}>
      {children}

      {/* Help sheet */}
      {sheetOpen && guide && (
        <MascotSheet
          guide={guide}
          mood={currentMood}
          onClose={() => setSheetOpen(false)}
          onStartTutorial={() => startTutorial()}
        />
      )}

      {/* Tutorial overlay */}
      {tutorialOpen && guide && guide.steps.length > 0 && (
        <MascotTutorialOverlay
          steps={guide.steps}
          currentStep={tutorialStep}
          sectionTitle={guide.title}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          onDone={handleDone}
        />
      )}
    </MascotCtx.Provider>
  );
}
