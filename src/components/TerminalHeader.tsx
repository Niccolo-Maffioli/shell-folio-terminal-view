
import React from 'react';
import { Minus, Square, X } from 'lucide-react';

export const TerminalHeader: React.FC = () => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-2">
          <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors" aria-label="Chiudi scheda">
            <X className="w-2 h-2 text-red-900 mx-auto" />
          </button>
          <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors" aria-label="Nascondi scheda">
            <Minus className="w-2 h-2 text-yellow-900 mx-auto" />
          </button>
          <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors" aria-label="Espandi scheda">
            <Square className="w-2 h-2 text-green-900 mx-auto" />
          </button>
        </div>
        <span className="text-sm text-gray-300 ml-4">Terminal - Portfolio</span>
      </div>
      <div className="text-xs text-gray-400">
        {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};
