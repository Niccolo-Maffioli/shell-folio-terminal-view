import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export type OnboardingLocale = "en" | "it";

export interface OnboardingHighlight {
  x: number;
  y: number;
  radius: number;
  width: number;
  height: number;
  shape: "circle" | "rounded";
}

interface StepTip {
  id: string;
  content: React.ReactNode;
}

interface StepCopy {
  title: string;
  body: () => React.ReactNode;
  tips: StepTip[];
}

interface OnboardingCopy {
  stepIndicator: (current: number, total: number) => string;
  languageLabel: string;
  skipLabel: string;
  nextLabel: string;
  backLabel: string;
  doneLabel: string;
  continueHint: string;
  closeHint: string;
  step1: StepCopy;
  step2: StepCopy;
}

const TOTAL_ONBOARDING_STEPS = 2;

const ONBOARDING_COPY: Record<OnboardingLocale, OnboardingCopy> = {
  en: {
    stepIndicator: (current, total) => `Step ${current} of ${total}`,
    languageLabel: "Language",
    skipLabel: "Skip tour",
    nextLabel: "Next",
    backLabel: "Back",
    doneLabel: "Got it",
    continueHint: "Press Enter to continue • Esc to skip",
    closeHint: "Press Enter to close • Esc to skip",
    step1: {
      title: "Open the quick menu",
      body: () =>
        "Use the button on the right side of the top bar to jump straight to each section without typing commands.",
      tips: [],
    },
    step2: {
      title: "Run your first command",
      body: () => (
        <>
          In the prompt below type{" "}
          <kbd className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wide text-terminal-cyan">help</kbd>{" "}
          to see the available commands, or{" "}
          <kbd className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wide text-terminal-cyan">about</kbd>{" "}
          to learn more about my background.
        </>
      ),
      tips: [
        {
          id: "history",
          content: "↑ / ↓ to browse history",
        },
        {
          id: "tab",
          content: (
            <>
              <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] uppercase text-terminal-cyan">tab</kbd>{" "}
              to auto-complete
            </>
          ),
        },
      ],
    },
  },
  it: {
    stepIndicator: (current, total) => `Step ${current} di ${total}`,
    languageLabel: "Lingua",
    skipLabel: "Salta tour",
    nextLabel: "Avanti",
    backLabel: "Indietro",
    doneLabel: "Ho capito",
    continueHint: "Premi Invio per continuare • Esc per saltare",
    closeHint: "Premi Invio per chiudere • Esc per saltare",
    step1: {
      title: "Apri il menu rapido",
      body: () =>
        "Usa il pulsante sulla destra della barra superiore per saltare direttamente alle sezioni del portfolio senza digitare comandi.",
      tips: [],
    },
    step2: {
      title: "Digita un comando",
      body: () => (
        <>
          Nel prompt in basso scrivi{" "}
          <kbd className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wide text-terminal-cyan">help</kbd>{" "}
          per vedere i comandi, oppure{" "}
          <kbd className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wide text-terminal-cyan">about</kbd>{" "}
          per conoscere la mia storia.
        </>
      ),
      tips: [
        {
          id: "cronologia",
          content: "↑ / ↓ per scorrere la cronologia",
        },
        {
          id: "tab",
          content: (
            <>
              <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] uppercase text-terminal-cyan">tab</kbd>{" "}
              per completare
            </>
          ),
        },
      ],
    },
  },
};

interface UseOnboardingOptions {
  localStorageKey?: string;
  toggleSelector?: string;
  focusSelector?: string;
  totalSteps?: number;
}

export const useOnboarding = (
  {
    localStorageKey = "terminal-onboarding",
    toggleSelector = ".navbar__toggle",
    focusSelector = "#terminal-input-area",
    totalSteps = TOTAL_ONBOARDING_STEPS,
  }: UseOnboardingOptions = {}
) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingLocale, setOnboardingLocale] = useState<OnboardingLocale>("en");
  const [highlight, setHighlight] = useState<OnboardingHighlight | null>(null);

  const strings = useMemo(
    () => ONBOARDING_COPY[onboardingLocale],
    [onboardingLocale]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeen = window.localStorage.getItem(localStorageKey);
    if (!hasSeen) {
      setOnboardingStep(1);
      setShowOnboarding(true);
    }
  }, [localStorageKey]);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    setOnboardingStep(1);
    setOnboardingLocale("en");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(localStorageKey, "seen");
    }
  }, [localStorageKey]);

  const handleNextOnboardingStep = useCallback(() => {
    setOnboardingStep((step) => Math.min(totalSteps, step + 1));
  }, [totalSteps]);

  const handlePrevOnboardingStep = useCallback(() => {
    setOnboardingStep((step) => Math.max(1, step - 1));
  }, []);

  const updateOnboardingHighlight = useCallback(() => {
    if (!showOnboarding) {
      setHighlight(null);
      return;
    }

    if (onboardingStep === 1) {
      const toggle = document.querySelector(toggleSelector) as HTMLElement | null;
      if (toggle) {
        const rect = toggle.getBoundingClientRect();
        const padding = 36;
        const radius = Math.max(rect.width, rect.height) / 2 + padding;
        setHighlight({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          radius,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          shape: "circle",
        });
        return;
      }
    } else {
      const focusElement = document.querySelector(focusSelector) as HTMLElement | null;
      if (focusElement) {
        const rect = focusElement.getBoundingClientRect();
        const horizontalPadding = 60;
        const verticalPadding = 32;
        const width = rect.width + horizontalPadding * 2;
        const height = rect.height + verticalPadding * 2;
        const radius = Math.max(width, height) / 2;
        setHighlight({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          radius,
          width,
          height,
          shape: "rounded",
        });
        return;
      }
    }

    const fallbackRadius = onboardingStep === 1 ? 140 : 220;
    setHighlight({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: fallbackRadius,
      width: fallbackRadius * 2,
      height: fallbackRadius * 2,
      shape: onboardingStep === 1 ? "circle" : "rounded",
    });
  }, [focusSelector, onboardingStep, showOnboarding, toggleSelector]);

  const overlayStyle = useMemo(() => {
    if (!highlight) return undefined;
    const mask =
      highlight.shape === "circle"
        ? `radial-gradient(circle at ${highlight.x}px ${highlight.y}px, transparent 0, transparent ${highlight.radius}px, rgba(0,0,0,1) ${highlight.radius + 1}px)`
        : `radial-gradient(ellipse ${highlight.width / 2}px ${highlight.height / 2}px at ${highlight.x}px ${highlight.y}px, transparent 0, transparent 98%, rgba(0,0,0,1) 99%)`;
    return {
      WebkitMaskImage: mask,
      maskImage: mask,
    } as React.CSSProperties;
  }, [highlight]);

  const step1CardPosition = useMemo(() => {
    if (!highlight || onboardingStep !== 1) return null;
    if (typeof window === "undefined") {
      return {
        left: highlight.x,
        top: highlight.y + highlight.radius + 80,
      };
    }
    const minLeft = 220;
    const maxLeft = window.innerWidth - 220;
    const left = Math.min(Math.max(highlight.x, minLeft), maxLeft);
    const maxTop = window.innerHeight - 260;
    const top = Math.min(highlight.y + highlight.radius + 80, maxTop);
    return { left, top };
  }, [highlight, onboardingStep]);

  const step2CardPosition = useMemo(() => {
    if (!highlight || onboardingStep !== 2) return null;
    if (typeof window === "undefined") {
      return {
        left: highlight.x,
        top: highlight.y - highlight.height / 2 - 240,
      };
    }
    const minLeft = 240;
    const maxLeft = window.innerWidth - 240;
    const left = Math.min(Math.max(highlight.x, minLeft), maxLeft);
    const top = Math.max(highlight.y - highlight.height / 2 - 240, 80);
    return { left, top };
  }, [highlight, onboardingStep]);

  useEffect(() => {
    if (!showOnboarding) {
      setHighlight(null);
      return;
    }

    updateOnboardingHighlight();

    const handleReposition = () => updateOnboardingHighlight();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [showOnboarding, onboardingStep, updateOnboardingHighlight]);

  useEffect(() => {
    if (!showOnboarding) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissOnboarding();
        return;
      }

      if (event.key === "Enter") {
        if (onboardingStep >= totalSteps) {
          dismissOnboarding();
        } else {
          handleNextOnboardingStep();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    dismissOnboarding,
    handleNextOnboardingStep,
    onboardingStep,
    showOnboarding,
    totalSteps,
  ]);

  const handleOnboardingLocaleChange = useCallback((locale: OnboardingLocale) => {
    setOnboardingLocale(locale);
  }, []);

  return {
    showOnboarding,
    onboardingStep,
    onboardingLocale,
    highlight,
    overlayStyle,
    step1CardPosition,
    step2CardPosition,
    strings,
    totalSteps,
    dismissOnboarding,
    handleNextOnboardingStep,
    handlePrevOnboardingStep,
    handleOnboardingLocaleChange,
  };
};
