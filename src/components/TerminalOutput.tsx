import React from "react";
import { TerminalLine } from "./Terminal";
import { AsciiAnimation } from "./AsciiAnimation";
import profileImage from "../images/01_Nico serio.jpg";

interface TerminalOutputProps {
  lines: TerminalLine[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines }) => {
  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-terminal-fg";
      case "output":
        return "text-terminal-cyan";
      case "error":
        return "text-terminal-red";
      case "system":
        return "text-terminal-green";
      default:
        return "text-terminal-fg";
    }
  };

  /* const formatContent = (content: string, type: TerminalLine['type']) => {
    // Handle special formatting for different content types
    if (content.includes('ERROR:')) {
      return <span className="text-terminal-red">{content}</span>;
    }
    
    if (content.includes('SUCCESS:')) {
      return <span className="text-terminal-green">{content}</span>;
    }

    // Format file listings
    if (content.includes('drwx') || content.includes('-rw-')) {
      const parts = content.split(/\s+/);
      return (
        <span>
          <span className="text-terminal-yellow">{parts[0]}</span>
          {' '}
          <span className="text-terminal-fg">{parts.slice(1, -1).join(' ')}</span>
          {' '}
          <span className="text-terminal-cyan">{parts[parts.length - 1]}</span>
        </span>
      );
    }

    // Format JSON-like content
    if (content.includes('{') || content.includes('}')) {
      return (
        <span 
          className="text-terminal-cyan"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\{/g, '<span class="text-terminal-yellow">{</span>')
              .replace(/\}/g, '<span class="text-terminal-yellow">}</span>')
              .replace(/"([^"]+)":/g, '<span class="text-terminal-purple">"$1"</span>:')
              .replace(/: "([^"]+)"/g, ': <span class="text-terminal-green">"$1"</span>')
          }}
        />
      );
    }

    return content;
  }; */

  const renderWithNamedLinks = (text: string) => {
    const linkRegex = /<link=([^>|]+)(\|([^>]+))?>/g;
    const parts: (string | { url: string; label: string })[] = [];

    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const url = match[1];
      const label = match[3] || match[1]; // Usa il testo personalizzato se presente
      parts.push({ url, label });

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.map((part, i) => {
      if (typeof part === "string") {
        return <span key={i}>{part}</span>;
      }
      return (
        <a
          key={i}
          href={part.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-terminal-blue"
        >
          {part.label}
        </a>
      );
    });
  };

  const renderImageToken = (token: string) => {
    if (token !== "<image=profile>") {
      return null;
    }

    return (
      <div className="my-4 flex justify-start">
        <figure className="relative overflow-hidden rounded-2xl border border-terminal-cyan/30 bg-gradient-to-br from-gray-900/80 via-gray-900/40 to-gray-900/80 p-[3px] shadow-[0_12px_40px_rgba(6,182,212,0.18)]">
          <div className="rounded-[1rem] bg-terminal-bg/80 p-2 backdrop-blur">
            <img
              src={profileImage}
              alt="Portrait of Niccolò Maffioli"
              className="h-40 w-40 rounded-xl object-cover grayscale transition duration-500 ease-out hover:grayscale-0 sm:h-48 sm:w-48"
            />
          </div>
        </figure>
      </div>
    );
  };

  const formatContent = (content: string, type: TerminalLine["type"]) => {
    const trimmed = content.trim();

    if (trimmed.startsWith("<image=")) {
      return renderImageToken(trimmed);
    }

    // Gestione link con sintassi <link=URL|Testo>
    if (trimmed.includes("<link=")) {
      return renderWithNamedLinks(content);
    }

    // resto della formattazione esistente...
    if (trimmed.includes("ERROR:")) {
      return <span className="text-terminal-red">{content}</span>;
    }

    if (trimmed.includes("SUCCESS:")) {
      return <span className="text-terminal-green">{content}</span>;
    }

    if (trimmed.includes("drwx") || trimmed.includes("-rw-")) {
      const parts = content.split(/\s+/);
      return (
        <span>
          <span className="text-terminal-yellow">{parts[0]}</span>{" "}
          <span className="text-terminal-fg">
            {parts.slice(1, -1).join(" ")}
          </span>{" "}
          <span className="text-terminal-cyan">{parts[parts.length - 1]}</span>
        </span>
      );
    }

    if (trimmed.includes("{") || trimmed.includes("}")) {
      return (
        <span
          className="text-terminal-cyan"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\{/g, '<span class="text-terminal-yellow">{</span>')
              .replace(/\}/g, '<span class="text-terminal-yellow">}</span>')
              .replace(
                /"([^"]+)":/g,
                '<span class="text-terminal-purple">"$1"</span>:'
              )
              .replace(
                /: "([^"]+)"/g,
                ': <span class="text-terminal-green">"$1"</span>'
              ),
          }}
        />
      );
    }

    return content;
  };

  return (
    <div className="space-y-1">
      {lines.map((line) => {
        if (line.content === "::easteregg_nico::") {
          return (
            <div key={line.id} className="text-green-400 animate-pulse">
              <p>Ciao! Hai trovato l'easter egg!</p>
              <AsciiAnimation />
            </div>
          );
        }

        const formatted = formatContent(line.content, line.type);

        return (
          <div
            key={line.id}
            className={`${getLineColor(line.type)} leading-relaxed`}
          >
            {typeof formatted === "string" ? (
              <span className="whitespace-pre-wrap break-words">{formatted}</span>
            ) : (
              formatted
            )}
          </div>
        );
      })}
    </div>
  );
};
