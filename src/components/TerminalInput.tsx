import React, { useState, useRef, useEffect } from "react";
import { useTerminalStore } from "../store/terminalStore";

interface TerminalInputProps {
  currentPath: string;
  onCommand: (command: string) => void;
  onHistoryNavigation: (direction: "up" | "down") => void;
  placeholder?: string;
  suggestionsLabel?: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  currentPath,
  onCommand,
  onHistoryNavigation,
  placeholder = "Type a command...",
  suggestionsLabel = "Suggestions:",
}) => {
  const { inputValue, setInputValue, resetInputValue } = useTerminalStore();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    "help",
    "about",
    "skills",
    "projects",
    "experience",
    "education",
    "contact",
    "ls",
    "cd",
    "cat",
    "clear",
    "pwd",
    "whoami",
    "date",
    "tree",
    "lang",
    "nico",
    "blog",
  ];

  useEffect(() => {
    // Auto-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Update suggestions based on input
    if (inputValue.trim()) {
      const filtered = commands.filter((cmd) =>
        cmd.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommand(inputValue);
    resetInputValue();
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onHistoryNavigation("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onHistoryNavigation("down");
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInputValue(suggestions[0]);
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      id="terminal-input-area"
      className="border-t border-gray-700 bg-gray-900/50 rounded-b-md"
    >
      {suggestions.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-700">
          <div className="text-xs text-gray-400 mb-1">{suggestionsLabel}</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-2 py-1 text-xs bg-gray-800 text-terminal-cyan hover:bg-gray-700 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center">
          <span className="text-terminal-green mr-2">
            {currentPath} $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-terminal-fg outline-none caret-terminal-green"
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="ml-1 animate-cursor-blink text-terminal-green">█</span>
        </div>
      </form>
    </div>
  );
};
