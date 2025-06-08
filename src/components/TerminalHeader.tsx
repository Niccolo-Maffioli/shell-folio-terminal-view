import React, { useState } from 'react';
import { Minus, Square, X } from 'lucide-react';

export const TerminalHeader: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
      {/* HEADER */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className="space-x-2 hidden md:flex">
            <button
              className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
              aria-label="Chiudi scheda"
              onClick={() => alert("Simulazione chiusura")}
            >
              <X className="w-3 h-3 text-red-900" aria-hidden="true" />
            </button>
            <button
              className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
              aria-label="Nascondi scheda"
              onClick={() => alert("Simulazione nascondimento se esiste come parola")}
            >
              <Minus className="w-3 h-3 text-yellow-900" aria-hidden="true" />
            </button>
            <button
              className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors"
              aria-label="Ingrandisci scheda"
              onClick={() => alert("Simulazione ingrandimento")}
            >
              <Square className="w-3 h-3 text-green-900" aria-hidden="true" />
            </button>
          </div>
          <span className="text-sm text-gray-300 ml-4">Terminal - Portfolio</span>
        </div>
        <div className="text-xs text-gray-400">{new Date().toLocaleDateString()}</div>
      </div>
    </div>
  );
};
