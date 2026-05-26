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

import { GuideSheet }            from "./GuideSheet";
import { GuideTutorialOverlay }  from "./GuideTutorialOverlay";

import type { GuideTone }        from "./guideAssets";
import {
  SECTION_GUIDES,
  STORAGE_KEY,
  getGuide,
  pathToSection,
  type GuideGuideStorage,
  type SectionKey,
} from "./guideGuides";

// ── Context ───────────────────────────────────────────────────────────────────

interface GuideContextValue {
  openHelp:         () => void;
  startTutorial:    (section?: SectionKey) => void;
  closeTutorial:    () => void;
  currentSection:   SectionKey | null;
  currentTone:      GuideTone;
}

const GuideCtx = createContext<GuideContextValue>({
  openHelp:       () => {},
  startTutorial:  () => {},
  closeTutorial:  () => {},
  currentSection: null,
  currentTone:    "calm",
});

export function useGuide() {
  return useContext(GuideCtx);
}

// ── Storage helpers ───────────────────────────────────────────────────────────

function loadStorage(): GuideGuideStorage {
  if (typeof window === "undefined") return { sections: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GuideGuideStorage;
  } catch {
    // ignore corrupt data
  }
  return { sections: {} };
}

function saveStorage(data: GuideGuideStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage quota issues
  }
}

function markSection(
  data: GuideGuideStorage,
  section: SectionKey,
  patch: Partial<{ seen: boolean; completed: boolean; skipped: boolean }>,
): GuideGuideStorage {
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

export function GuideProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [sheetOpen,    setSheetOpen]    = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentTone,  setCurrentTone]  = useState<GuideTone>("calm");

  const storageRef    = useRef<GuideGuideStorage>({ sections: {} });
  const autoTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive section from current pathname
  const currentSection: SectionKey | null = pathToSection(pathname ?? "");
  const guide = getGuide(currentSection);

  // ── Sync tone to current section ─────────────────────────────────────────
  useEffect(() => {
    if (guide && !tutorialOpen && !sheetOpen) {
      setCurrentTone(guide.defaultTone);
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
      setCurrentTone("curious");
      setSheetOpen(true);
    }, 700);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [currentSection]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────────────

  const openHelp = useCallback(() => {
    if (!guide) return;
    setCurrentTone(guide.defaultTone);
    setSheetOpen(true);
  }, [guide]);

  const startTutorial = useCallback((section?: SectionKey) => {
    const targetSection = section ?? currentSection;
    const targetGuide   = targetSection ? SECTION_GUIDES[targetSection] : guide;
    if (!targetGuide) return;

    setSheetOpen(false);
    setTutorialStep(0);
    setCurrentTone("curious");
    setTutorialOpen(true);
  }, [currentSection, guide]);

  const closeTutorial = useCallback(() => {
    setTutorialOpen(false);
    if (currentSection && guide) {
      setCurrentTone(guide.defaultTone);
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
    setCurrentTone("happy");
    setTutorialOpen(false);
  }

  function handleNext() {
    if (!guide) return;
    const nextStep = tutorialStep + 1;
    if (nextStep < guide.steps.length) {
      setTutorialStep(nextStep);
      const stepTone = guide.steps[nextStep].tone;
      if (stepTone) setCurrentTone(stepTone);
    }
  }

  function handleBack() {
    const prevStep = tutorialStep - 1;
    if (prevStep >= 0 && guide) {
      setTutorialStep(prevStep);
      const stepTone = guide.steps[prevStep].tone;
      if (stepTone) setCurrentTone(stepTone);
    }
  }

  // ── Context value ─────────────────────────────────────────────────────────

  const ctxValue: GuideContextValue = {
    openHelp,
    startTutorial,
    closeTutorial,
    currentSection,
    currentTone,
  };


  return (
    <GuideCtx.Provider value={ctxValue}>
      {children}

      {/* Help sheet */}
      {sheetOpen && guide && (
        <GuideSheet
          guide={guide}
          onClose={() => setSheetOpen(false)}
          onStartTutorial={() => startTutorial()}
        />
      )}

      {/* Tutorial overlay */}
      {tutorialOpen && guide && guide.steps.length > 0 && (
        <GuideTutorialOverlay
          steps={guide.steps}
          currentStep={tutorialStep}
          sectionTitle={guide.title}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          onDone={handleDone}
        />
      )}
    </GuideCtx.Provider>
  );
}
