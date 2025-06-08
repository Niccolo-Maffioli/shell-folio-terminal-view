import React, { useEffect, useState } from "react";

interface TerminalLoadingProps {
  onFinish: () => void;
  lang?: "en" | "it";
}

const TerminalLoading: React.FC<TerminalLoadingProps> = ({ onFinish, lang = "en" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const messages = {
    en: 'Type "help" to start...',
    it: 'Digita "help" per iniziare...'
  };

  const text = messages[lang];

  useEffect(() => {
    const typingSpeed = 50;

    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const finishTimeout = setTimeout(() => {
        onFinish();
      }, 1000); // tempo in più per lasciare visibile il messaggio
      return () => clearTimeout(finishTimeout);
    }
  }, [index]);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-terminal-bg text-green-400 flex items-center justify-center text-lg font-mono z-50">
      <span>{displayedText}</span>
    </div>
  );
};

export default TerminalLoading;
