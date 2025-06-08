import React from 'react';
import { Minus, Square, X } from 'lucide-react';

export const TerminalHeader: React.FC = () => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="space-x-2 hidden md:flex">
          {/* Bottone Chiudi */}
          <button
            className="w-10 h-10 flex items-center justify-center"
            aria-label="Chiudi scheda"
          >
            <div className="w-4 h-4 bg-red-500 rounded-full hover:bg-red-400 transition-colors flex items-center justify-center">
              <X className="w-3 h-3 text-red-900" aria-hidden="true" />
            </div>
          </button>

          {/* Bottone Nascondi */}
          <button
            className="w-10 h-10 flex items-center justify-center"
            aria-label="Nascondi scheda"
          >
            <div className="w-4 h-4 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors flex items-center justify-center">
              <Minus className="w-3 h-3 text-yellow-900" aria-hidden="true" />
            </div>
          </button>

          {/* Bottone Ingrandisci */}
          <button
            className="w-10 h-10 flex items-center justify-center"
            aria-label="Ingrandisci scheda"
          >
            <div className="w-4 h-4 bg-green-500 rounded-full hover:bg-green-400 transition-colors flex items-center justify-center">
              <Square className="w-3 h-3 text-green-900" aria-hidden="true" />
            </div>
          </button>
        </div>

        <span className="text-md text-gray-300 ml-4">Terminal - Portfolio</span>
      </div>
      <div className="text-sm text-gray-400">{new Date().toLocaleDateString()}</div>
    </div>
  );
};
