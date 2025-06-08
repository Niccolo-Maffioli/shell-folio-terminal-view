import React, { useState, useRef, useEffect } from 'react';

interface TerminalInputProps {
  currentPath: string;
  onCommand: (command: string) => void;
  onHistoryNavigation: (direction: 'up' | 'down') => string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  currentPath,
  onCommand,
  onHistoryNavigation
}) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    'help', 'about', 'skills', 'projects', 'experience', 'education', 
    'contact', 'ls', 'cd', 'cat', 'clear', 'pwd', 'whoami', 'date', 'tree', 'lang', 'Nico'
  ];

  useEffect(() => {
    // Auto-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Update suggestions based on input
    if (input.trim()) {
      const filtered = commands.filter(cmd => 
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommand(input);
    setInput('');
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const historyCommand = onHistoryNavigation('up');
      setInput(historyCommand);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const historyCommand = onHistoryNavigation('down');
      setInput(historyCommand);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="border-t border-gray-700 bg-gray-900/50">
      {suggestions.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Suggestions:</div>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-terminal-fg outline-none caret-terminal-green"
            placeholder="Type a command..."
            autoComplete="off"
            spellCheck={false}
          />
          <span className="ml-1 animate-cursor-blink text-terminal-green">█</span>
        </div>
      </form>
    </div>
  );
};
