import React, { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <div className="h-screen bg-terminal-bg text-terminal-fg font-mono flex flex-col">
        <TerminalHeader />
        <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 pb-2">
          <TerminalOutput lines={lines} />
        </div>
        <TerminalInput
          currentPath={currentPath}
          onCommand={handleCommand}
          onHistoryNavigation={getCommandFromHistory}
        />
      </div>
    </>
  );
};
