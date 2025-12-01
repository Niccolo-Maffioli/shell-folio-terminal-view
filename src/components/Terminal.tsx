import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Navbar from "./Navbar";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";
import { CommandProcessor } from "../utils/commandProcessor";
import { Helmet } from "react-helmet-async";

export interface TerminalLine {
  id: string;
  type: "command" | "output" | "error" | "system";
  content: string;
  timestamp: Date;
}

type TerminalView = "normal" | "hidden" | "minimized" | "compact";

interface OnboardingHighlight {
  x: number;
  y: number;
  radius: number;
  width: number;
  height: number;
  shape: "circle" | "rounded";
}

type OnboardingLocale = "en" | "it";

const TOTAL_ONBOARDING_STEPS = 2;

const ONBOARDING_COPY: Record<OnboardingLocale, {
  stepIndicator: (current: number, total: number) => string;
  languageLabel: string;
  skipLabel: string;
  nextLabel: string;
  backLabel: string;
  doneLabel: string;
  continueHint: string;
  closeHint: string;
  step1: {
    title: string;
    body: () => React.ReactNode;
  };
  step2: {
    title: string;
    body: () => React.ReactNode;
    tips: Array<{ id: string; content: React.ReactNode }>;
  };
}> = {
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

// Create a single instance of CommandProcessor that persists across renders
const commandProcessor = new CommandProcessor();

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [welcomeLines, setWelcomeLines] = useState<TerminalLine[]>([]);
  const [currentPath, setCurrentPath] = useState("~");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [, forceUpdate] = useState({}); // Force re-render when language changes
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [terminalView, setTerminalView] = useState<TerminalView>("normal");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingLocale, setOnboardingLocale] = useState<OnboardingLocale>("en");
  const [highlight, setHighlight] = useState<OnboardingHighlight | null>(null);
  const isHidden = terminalView === "hidden";
  const isMinimized = terminalView === "minimized";
  const isCompact = terminalView === "compact";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSeen = window.localStorage.getItem("terminal-onboarding");
    if (!hasSeen) {
      setOnboardingStep(1);
      setShowOnboarding(true);
    }
  }, []);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    setOnboardingStep(1);
    setOnboardingLocale("en");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("terminal-onboarding", "seen");
    }
  }, [setOnboardingLocale]);

  const handleNextOnboardingStep = useCallback(() => {
    setOnboardingStep((step) => (step >= 2 ? 2 : step + 1));
  }, []);

  const handlePrevOnboardingStep = useCallback(() => {
    setOnboardingStep((step) => (step <= 1 ? 1 : step - 1));
  }, []);

  const updateOnboardingHighlight = useCallback(() => {
    if (!showOnboarding) {
      setHighlight(null);
      return;
    }

    if (onboardingStep === 1) {
      const toggle = document.querySelector(".navbar__toggle") as HTMLElement | null;
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
      const inputArea = document.getElementById("terminal-input-area");
      if (inputArea) {
        const rect = inputArea.getBoundingClientRect();
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
  }, [onboardingStep, showOnboarding]);

  const overlayStyle = useMemo(() => {
    if (!highlight) return undefined;
    const mask = highlight.shape === "circle"
      ? `radial-gradient(circle at ${highlight.x}px ${highlight.y}px, transparent 0, transparent ${highlight.radius}px, rgba(0,0,0,1) ${highlight.radius + 1}px)`
      : `radial-gradient(ellipse ${highlight.width / 2}px ${highlight.height / 2}px at ${highlight.x}px ${highlight.y}px, transparent 0, transparent 98%, rgba(0,0,0,1) 99%)`;
    return {
      WebkitMaskImage: mask,
      maskImage: mask,
    } as React.CSSProperties;
  }, [highlight]);

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

  const strings = ONBOARDING_COPY[onboardingLocale];

  const handleOnboardingLocaleChange = useCallback((locale: OnboardingLocale) => {
    setOnboardingLocale(locale);
  }, [setOnboardingLocale]);

  useEffect(() => {
    if (!showOnboarding) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissOnboarding();
        return;
      }

      if (event.key === "Enter") {
        if (onboardingStep === 1) {
          handleNextOnboardingStep();
        } else {
          dismissOnboarding();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showOnboarding, onboardingStep, dismissOnboarding, handleNextOnboardingStep]);

  useEffect(() => {
    const welcomeContent = commandProcessor.getWelcomeMessage(isMobile);
    const welcomeTerminalLines = welcomeContent.map((content, index) => ({
      id: `welcome-${index}`,
      type: "system" as const,
      content,
      timestamp: new Date(),
    }));
    setWelcomeLines(welcomeTerminalLines);
    setLines(welcomeTerminalLines);
  }, [isMobile]); // <-- ora si aggiorna quando cambia la larghezza

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (command: string) => {
    if (!command.trim()) return;

    if (showOnboarding) {
      dismissOnboarding();
    }

    setTerminalView((state) =>
      state === "hidden" || state === "minimized" ? "normal" : state
    );

    // Add command to history
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Handle clear command specially
    if (command.trim().toLowerCase() === "clear") {
      setLines([...welcomeLines]);
      return;
    }

    // Add command line
    const commandLine: TerminalLine = {
      id: `cmd-${Date.now()}`,
      type: "command",
      content: `${currentPath} $ ${command}`,
      timestamp: new Date(),
    };

    // Process command
    const result = commandProcessor.processCommand(command, currentPath);

    // Update path if changed
    if (result.newPath && result.newPath !== currentPath) {
      setCurrentPath(result.newPath);
    }

    // If language was changed, force a re-render to update welcome message
    if (command.toLowerCase().startsWith("lang ")) {
      setTimeout(() => {
        forceUpdate({});
        // Update welcome lines with new language
        const newWelcomeContent = commandProcessor.getWelcomeMessage(isMobile);
        const newWelcomeLines = newWelcomeContent.map((content, index) => ({
          id: `welcome-${index}`,
          type: "system" as const,
          content,
          timestamp: new Date(),
        }));
        setWelcomeLines(newWelcomeLines);
      }, 100);
    }

    // Add output lines
    const outputLines: TerminalLine[] = result.output.map((line, index) => ({
      id: `out-${Date.now()}-${index}`,
      type: result.type,
      content: line,
      timestamp: new Date(),
    }));

    setLines((prev) => [...prev, commandLine, ...outputLines]);
  };

  const getCommandFromHistory = (direction: "up" | "down"): string => {
    if (commandHistory.length === 0) return "";

    let newIndex = historyIndex;

    if (direction === "up") {
      newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
    } else {
      newIndex =
        historyIndex === -1
          ? -1
          : Math.min(commandHistory.length - 1, historyIndex + 1);
    }

    setHistoryIndex(newIndex);
    return newIndex === -1 ? "" : commandHistory[newIndex];
  };

  const handleCloseTerminal = () => setTerminalView("hidden");

  const handleToggleMinimize = () => {
    setTerminalView((state) =>
      state === "minimized" ? "normal" : "minimized"
    );
  };

  const handleToggleMaximize = () => {
    setTerminalView((state) =>
      state === "compact" ? "normal" : "compact"
    );
  };

  const handleRestoreTerminal = () => setTerminalView("normal");

  return (
    <>
      <Helmet>
        <title>Niccolò Maffioli | Web Developer</title>
        <meta
          name="description"
          content="Portfolio personale di Niccolò Maffioli, sviluppatore front-end specializzato in React, TypeScript e Tailwind."
        />
        <meta property="og:title" content="Niccolò Maffioli | Full-Stack Developer" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://niccolo.dev/works" />
        <meta property="og:image" content="https://niccolo.dev/preview.jpg" />
      </Helmet>
      <div className="h-screen bg-terminal-bg text-terminal-fg font-mono flex flex-col min-h-0">
        <Navbar onSelectCommand={handleCommand} />
        {showOnboarding && (
          <div className="fixed inset-0 z-40">
            <div
              className="absolute inset-0 z-10 bg-terminal-bg/92 backdrop-blur-sm"
              style={overlayStyle}
            />

            {onboardingStep === 1 ? (
              <>
                <div
                  className="pointer-events-none absolute z-20"
                  style={highlight ? {
                    left: `${highlight.x}px`,
                    top: `${highlight.y}px`,
                    width: `${highlight.radius * 2}px`,
                    height: `${highlight.radius * 2}px`,
                    transform: "translate(-50%, -50%)",
                  } : {
                    left: "50%",
                    top: "70px",
                    width: "9rem",
                    height: "9rem",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="h-full w-full rounded-full border border-terminal-cyan/60 bg-terminal-bg/10 shadow-[0_12px_40px_rgba(6,182,212,0.32)]" />
                </div>
                <div
                  className="pointer-events-none absolute text-4xl text-terminal-cyan/90 z-20 animate-bounce"
                  style={highlight ? {
                    left: `${highlight.x}px`,
                    top: `${highlight.y + highlight.radius + 24}px`,
                    transform: "translate(-50%, 0)",
                  } : {
                    left: "50%",
                    top: "170px",
                    transform: "translate(-50%, 0)",
                  }}
                >
                  ↓
                </div>
                <div
                  className="absolute w-full max-w-md px-6 z-30"
                  style={step1CardPosition ? {
                    left: `${step1CardPosition.left}px`,
                    top: `${step1CardPosition.top}px`,
                    transform: "translate(-50%, 0)",
                  } : {
                    left: "50%",
                    top: "220px",
                    transform: "translate(-50%, 0)",
                  }}
                >
                  <div className="rounded-2xl border border-terminal-cyan/40 bg-gray-900/95 p-6 shadow-[0_24px_60px_rgba(6,182,212,0.28)]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="uppercase tracking-[0.35em] text-terminal-cyan/70">
                        {strings.stepIndicator(onboardingStep, TOTAL_ONBOARDING_STEPS)}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                          {strings.languageLabel}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOnboardingLocaleChange("en")}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                              onboardingLocale === "en"
                                ? "border-terminal-cyan/60 bg-terminal-cyan/90 text-terminal-bg shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                                : "border-transparent bg-gray-800/80 text-gray-400 hover:border-terminal-cyan/40 hover:text-terminal-cyan"
                            }`}
                            aria-pressed={onboardingLocale === "en"}
                            aria-label="Tour language: English"
                          >
                            EN
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOnboardingLocaleChange("it")}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                              onboardingLocale === "it"
                                ? "border-terminal-cyan/60 bg-terminal-cyan/90 text-terminal-bg shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                                : "border-transparent bg-gray-800/80 text-gray-400 hover:border-terminal-cyan/40 hover:text-terminal-cyan"
                            }`}
                            aria-pressed={onboardingLocale === "it"}
                            aria-label="Tour language: Italiano"
                          >
                            IT
                          </button>
                        </div>
                      </div>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-terminal-cyan">{strings.step1.title}</h2>
                    <p className="mt-3 text-sm text-gray-300">{strings.step1.body()}</p>
                    <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                      <button
                        type="button"
                        onClick={dismissOnboarding}
                        className="rounded-full border border-terminal-cyan/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-terminal-cyan transition-colors hover:bg-terminal-cyan hover:text-terminal-bg"
                      >
                        {strings.skipLabel}
                      </button>
                      <button
                        type="button"
                        onClick={handleNextOnboardingStep}
                        className="rounded-full bg-terminal-cyan/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terminal-bg transition hover:bg-terminal-cyan"
                      >
                        {strings.nextLabel}
                      </button>
                    </div>
                    <p className="mt-4 text-center text-[11px] text-gray-500">{strings.continueHint}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="pointer-events-none absolute z-20"
                  style={highlight ? {
                    left: `${highlight.x}px`,
                    top: `${highlight.y}px`,
                    width: `${highlight.width}px`,
                    height: `${highlight.height}px`,
                    transform: "translate(-50%, -50%)",
                  } : {
                    left: "50%",
                    bottom: "118px",
                    width: "78%",
                    height: "9rem",
                    transform: "translate(-50%, 0)",
                  }}
                >
                  <div className="h-full w-full rounded-2xl border border-terminal-cyan/60 bg-terminal-bg/10 shadow-[0_20px_50px_rgba(6,182,212,0.28)]" />
                </div>
                <div
                  className="pointer-events-none absolute text-4xl text-terminal-cyan/90 z-20 animate-bounce"
                  style={highlight ? {
                    left: `${highlight.x}px`,
                    top: `${highlight.y + (highlight.height / 2) + 24}px`,
                    transform: "translate(-50%, 0) rotate(180deg)",
                  } : {
                    left: "50%",
                    bottom: "108px",
                    transform: "translate(-50%, 0) rotate(180deg)",
                  }}
                >
                  ↓
                </div>
                <div
                  className="absolute w-full max-w-lg px-6 z-30"
                  style={step2CardPosition ? {
                    left: `${step2CardPosition.left}px`,
                    top: `${step2CardPosition.top}px`,
                    transform: "translate(-50%, 0)",
                  } : {
                    left: "50%",
                    bottom: "220px",
                    transform: "translate(-50%, 0)",
                  }}
                >
                  <div className="rounded-2xl border border-terminal-cyan/40 bg-gray-900/95 p-6 shadow-[0_24px_60px_rgba(6,182,212,0.28)]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="uppercase tracking-[0.35em] text-terminal-cyan/70">
                        {strings.stepIndicator(onboardingStep, TOTAL_ONBOARDING_STEPS)}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                          {strings.languageLabel}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOnboardingLocaleChange("en")}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                              onboardingLocale === "en"
                                ? "border-terminal-cyan/60 bg-terminal-cyan/90 text-terminal-bg shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                                : "border-transparent bg-gray-800/80 text-gray-400 hover:border-terminal-cyan/40 hover:text-terminal-cyan"
                            }`}
                            aria-pressed={onboardingLocale === "en"}
                            aria-label="Tour language: English"
                          >
                            EN
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOnboardingLocaleChange("it")}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                              onboardingLocale === "it"
                                ? "border-terminal-cyan/60 bg-terminal-cyan/90 text-terminal-bg shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                                : "border-transparent bg-gray-800/80 text-gray-400 hover:border-terminal-cyan/40 hover:text-terminal-cyan"
                            }`}
                            aria-pressed={onboardingLocale === "it"}
                            aria-label="Tour language: Italiano"
                          >
                            IT
                          </button>
                        </div>
                      </div>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-terminal-cyan">{strings.step2.title}</h2>
                    <p className="mt-3 text-sm text-gray-300">{strings.step2.body()}</p>
                    {strings.step2.tips.length > 0 && (
                      <ul className="mt-4 space-y-1 text-xs text-gray-400">
                        {strings.step2.tips.map(({ id, content }) => (
                          <li key={id}>• {content}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                      <button
                        type="button"
                        onClick={handlePrevOnboardingStep}
                        className="rounded-full border border-terminal-cyan/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-terminal-cyan transition-colors hover:bg-terminal-cyan hover:text-terminal-bg"
                      >
                        {strings.backLabel}
                      </button>
                      <button
                        type="button"
                        onClick={dismissOnboarding}
                        className="rounded-full bg-terminal-cyan/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terminal-bg transition hover:bg-terminal-cyan"
                      >
                        {strings.doneLabel}
                      </button>
                    </div>
                    <p className="mt-4 text-center text-[11px] text-gray-500">{strings.closeHint}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {isHidden ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-sm text-gray-400">
              Terminal nascosto. Premi per riaprirlo.
            </p>
            <button
              type="button"
              className="rounded-full border border-terminal-cyan px-6 py-2 text-sm font-medium text-terminal-cyan transition-colors hover:bg-terminal-cyan hover:text-terminal-bg"
              onClick={handleRestoreTerminal}
            >
              Riapri terminale
            </button>
          </div>
        ) : (
          <div
            className={` flex w-full min-h-0 flex-col rounded-md border border-gray-700/70 bg-gray-900/60 backdrop-blur-sm transition-all duration-300 ease-out ${
              isMinimized
                ? "flex-none max-h-28 overflow-hidden shadow-[0_8px_18px_rgba(15,23,42,0.35)]"
                : isCompact
                ? "flex-none w-full max-w-4xl self-center h-[68vh] min-h-[360px] shadow-[0_18px_45px_rgba(6,182,212,0.28)]"
                : "flex-1 shadow-[0_12px_35px_rgba(15,23,42,0.45)]"
            } ${
              isCompact && !isMinimized
                ? "ring-1 ring-terminal-cyan/40"
                : ""
            }`}
          >
            <TerminalHeader
              onClose={handleCloseTerminal}
              onMinimize={handleToggleMinimize}
              onMaximize={handleToggleMaximize}
              isMinimized={isMinimized}
              isCompact={isCompact}
            />
            {isMinimized ? (
              <div className="flex items-center justify-between rounded-b-md border-t border-gray-700 bg-gray-900/80 px-4 py-3 text-xs text-gray-400 sm:text-sm">
                <span>Terminal minimizzato. Premi ripristina per continuare.</span>
                <button
                  type="button"
                  onClick={handleRestoreTerminal}
                  className="rounded-full border border-terminal-cyan/60 px-3 py-1 text-xs font-medium text-terminal-cyan transition-colors hover:bg-terminal-cyan hover:text-terminal-bg"
                >
                  Ripristina
                </button>
              </div>
            ) : (
              <>
                <div
                  ref={terminalRef}
                  className="flex-1 min-h-0 overflow-y-auto px-4 pb-2 pt-4"
                >
                  <TerminalOutput lines={lines} />
                </div>
                <TerminalInput
                  currentPath={currentPath}
                  onCommand={handleCommand}
                  onHistoryNavigation={getCommandFromHistory}
                />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
