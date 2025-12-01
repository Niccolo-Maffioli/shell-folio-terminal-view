import React from "react";
import { Minus, Square, X } from "lucide-react";

type TerminalHeaderProps = {
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMinimized?: boolean;
  isCompact?: boolean;
};

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  onClose,
  onMinimize,
  onMaximize,
  isMinimized = false,
  isCompact = false,
}) => {
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date());

  return (
    <header className="flex items-center justify-between rounded-t-md border-b border-gray-700 bg-gray-800/80 px-4 py-2">
      <div className="flex items-center space-x-3">
        <div className="hidden items-center space-x-2 md:flex">
          <button
            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/70"
            aria-label="Chiudi terminale"
            onClick={onClose}
            type="button"
          >
            <X className="w-3 h-3 text-red-900" aria-hidden="true" />
          </button>
          <button
            className={`flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 transition-colors hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200/70 ${
              isMinimized ? "ring-2 ring-yellow-200/70" : ""
            }`}
            aria-label={isMinimized ? "Ripristina terminale" : "Minimizza terminale"}
            aria-pressed={isMinimized}
            onClick={() => onMinimize?.()}
            type="button"
          >
            <Minus className="w-3 h-3 text-yellow-900" aria-hidden="true" />
          </button>
          <button
            className={`flex h-5 w-5 items-center justify-center rounded-full bg-green-500 transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200/70 ${
              isCompact ? "ring-2 ring-green-200/70" : ""
            }`}
            aria-label={isCompact ? "Ripristina dimensione terminale" : "Riduci terminale"}
            aria-pressed={isCompact}
            onClick={() => onMaximize?.()}
            type="button"
          >
            <Square className="w-3 h-3 text-green-900" aria-hidden="true" />
          </button>
        </div>
        <span className="ml-2 text-sm text-gray-300">Terminal - Portfolio</span>
      </div>
      <div className="text-xs text-gray-400">{dateLabel}</div>
    </header>
  );
};
