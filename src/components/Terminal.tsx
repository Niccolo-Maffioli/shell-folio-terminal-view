import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";
import { CommandProcessor } from "../utils/commandProcessor";
import { Helmet } from "react-helmet-async";
import { useOnboarding } from "../hooks/useOnboarding";
import { APP_STRINGS, LocaleCode } from "../locales/appContent";
import { useTerminalStore } from "../store/terminalStore";

export interface TerminalLine {
  id: string;
  type: "command" | "output" | "error" | "system";
  content: string;
  timestamp: Date;
}

// Create a single instance of CommandProcessor that persists across renders
const commandProcessor = new CommandProcessor();

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [welcomeLines, setWelcomeLines] = useState<TerminalLine[]>([]);
  const [currentPath, setCurrentPath] = useState("~");
  const [, forceUpdate] = useState({}); // Force re-render when language changes
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [uiLocale, setUiLocale] = useState<LocaleCode>(() => commandProcessor.getCurrentLanguage());
  const {
    terminalView,
    setTerminalView,
    commandHistory,
    pushCommandHistory,
    historyIndex,
    setHistoryIndex,
    resetHistoryIndex,
    setInputValue,
  } = useTerminalStore();
  const {
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
  } = useOnboarding();
  const appStrings = APP_STRINGS[uiLocale];
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

    if (terminalView === "hidden" || terminalView === "minimized") {
      setTerminalView("normal");
    }

    // Add command to history
    pushCommandHistory(command);
    resetHistoryIndex();

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

  const navigateHistory = (direction: "up" | "down") => {
    if (commandHistory.length === 0) {
      setInputValue("");
      return;
    }

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
    setInputValue(newIndex === -1 ? "" : commandHistory[newIndex]);
  };

  const handleCloseTerminal = () => setTerminalView("hidden");

  const handleToggleMinimize = () => {
    setTerminalView(terminalView === "minimized" ? "normal" : "minimized");
  };

  const handleToggleMaximize = () => {
    setTerminalView(terminalView === "compact" ? "normal" : "compact");
  };

  const handleRestoreTerminal = () => setTerminalView("normal");

  return (
    <>
      <Helmet>
        <title>{appStrings.meta.title}</title>
        <meta name="description" content={appStrings.meta.description} />
        <meta property="og:title" content={appStrings.meta.ogTitle} />
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
                        {strings.stepIndicator(onboardingStep, totalSteps)}
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
                            aria-label={strings.languageOptionAria("en", onboardingLocale === "en")}
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
                            aria-label={strings.languageOptionAria("it", onboardingLocale === "it")}
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
                        aria-label={strings.controlsAria.skip(onboardingStep, totalSteps)}
                      >
                        {strings.skipLabel}
                      </button>
                      <button
                        type="button"
                        onClick={handleNextOnboardingStep}
                        className="rounded-full bg-terminal-cyan/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terminal-bg transition hover:bg-terminal-cyan"
                        aria-label={strings.controlsAria.next(onboardingStep, totalSteps)}
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
                        {strings.stepIndicator(onboardingStep, totalSteps)}
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
                            aria-label={strings.languageOptionAria("en", onboardingLocale === "en")}
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
                            aria-label={strings.languageOptionAria("it", onboardingLocale === "it")}
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
                        aria-label={strings.controlsAria.back(onboardingStep, totalSteps)}
                      >
                        {strings.backLabel}
                      </button>
                      <button
                        type="button"
                        onClick={dismissOnboarding}
                        className="rounded-full bg-terminal-cyan/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-terminal-bg transition hover:bg-terminal-cyan"
                        aria-label={strings.controlsAria.done(onboardingStep, totalSteps)}
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
              {appStrings.terminal.hiddenMessage}
            </p>
            <button
              type="button"
              className="rounded-full border border-terminal-cyan px-6 py-2 text-sm font-medium text-terminal-cyan transition-colors hover:bg-terminal-cyan hover:text-terminal-bg"
              onClick={handleRestoreTerminal}
            >
              {appStrings.terminal.reopenLabel}
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
              labels={appStrings.header}
            />
            {isMinimized ? (
              <div className="flex items-center justify-between rounded-b-md border-t border-gray-700 bg-gray-900/80 px-4 py-3 text-xs text-gray-400 sm:text-sm">
                <span>{appStrings.terminal.minimizedMessage}</span>
                <button
                  type="button"
                  onClick={handleRestoreTerminal}
                  className="rounded-full border border-terminal-cyan/60 px-3 py-1 text-xs font-medium text-terminal-cyan transition-colors hover:bg-terminal-cyan hover:text-terminal-bg"
                >
                  {appStrings.terminal.restoreLabel}
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
                  onHistoryNavigation={navigateHistory}
                  placeholder={appStrings.terminal.input.placeholder}
                  suggestionsLabel={appStrings.terminal.input.suggestionsLabel}
                />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
