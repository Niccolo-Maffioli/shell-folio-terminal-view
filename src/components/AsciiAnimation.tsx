import React, { useEffect, useState } from "react";

const message = [
  "Accesso segreto riconosciuto...",
  "Ciao",
  "Hai sbloccato il terminale nascosto.",
  "Ecco un biscotto virtuale",
];

const ledFrames = [
  "● ○ ● ○ ●",
  "○ ● ○ ● ○",
  "● ○ ● ○ ●",
  "○ ● ○ ● ○",
];

export const AsciiAnimation: React.FC = () => {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayedText((prev) => [...prev, message[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500); // ogni riga ogni 1.5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ledInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % ledFrames.length);
    }, 400);
    return () => clearInterval(ledInterval);
  }, []);

  return (
    <div className="font-mono mt-2">
      <pre className="text-yellow-300 text-sm mb-2">{ledFrames[frameIndex]}</pre>

      {displayedText.map((line, i) => (
        <p key={i} className="text-green-400 animate-fade-in">
          {line}
        </p>
      ))}

      {displayedText.length === message.length && (
        <div className="mt-2 text-pink-400 animate-pulse">
          (Terminale segreto chiuso automaticamente tra poco...)
        </div>
      )}
    </div>
  );
};
