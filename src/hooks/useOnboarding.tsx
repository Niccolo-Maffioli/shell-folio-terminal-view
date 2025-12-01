import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  APP_STRINGS,
  LocaleCode,
  OnboardingCopy,
} from "../locales/appContent";
import {
  createSpotlightCalculator,
  SpotlightHighlight,
} from "../utils/onboardingHighlight";

export type OnboardingLocale = LocaleCode;
export type OnboardingHighlight = SpotlightHighlight;

interface UseOnboardingOptions {
  localStorageKey?: string;
  toggleSelector?: string;
  focusSelector?: string;
  totalStepsOverride?: number;
}

export const useOnboarding = (
  {
    localStorageKey = "terminal-onboarding",
    toggleSelector = ".navbar__toggle",
    focusSelector = "#terminal-input-area",
    totalStepsOverride,
  }: UseOnboardingOptions = {}
) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingLocale, setOnboardingLocale] = useState<OnboardingLocale>("en");
  const [highlight, setHighlight] = useState<OnboardingHighlight | null>(null);
  const spotlightCalculator = useMemo(
    () => createSpotlightCalculator(),
    [focusSelector, toggleSelector]
  );

  const strings: OnboardingCopy = useMemo(
    () => APP_STRINGS[onboardingLocale].onboarding,
    [onboardingLocale]
  );
  const totalSteps = totalStepsOverride ?? strings.totalSteps;

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

    const nextHighlight = spotlightCalculator.compute({
      step: onboardingStep,
      toggleSelector,
      focusSelector,
      circlePadding: 36,
      roundedPadding: { horizontal: 60, vertical: 32 },
      fallbackRadius: { circle: 140, rounded: 220 },
    });

    if (!nextHighlight) {
      setHighlight(null);
      return;
    }

    setHighlight(nextHighlight);
  }, [
    focusSelector,
    onboardingStep,
    showOnboarding,
    spotlightCalculator,
    toggleSelector,
  ]);

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
