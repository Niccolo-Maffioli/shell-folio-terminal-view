import React from "react";
import { TerminalLine } from "./Terminal";

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

  const formatContent = (content: string, type: TerminalLine["type"]) => {
    // Gestione link personalizzati <link=URL>
    const linkRegex = /<link=([^>]+)>/g;
    if (linkRegex.test(content)) {
      const parts = content.split(linkRegex);
      // parts sarà un array che alterna testo normale e URL

      return parts.map((part, i) => {
        if (i % 2 === 1) {
          // parte dispari = URL da linkare
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-terminal-blue"
            >
              {part}
            </a>
          );
        }
        // parte pari = testo normale
        return <span key={i}>{part}</span>;
      });
    }

    // resto della formattazione esistente...
    if (content.includes("ERROR:")) {
      return <span className="text-terminal-red">{content}</span>;
    }

    if (content.includes("SUCCESS:")) {
      return <span className="text-terminal-green">{content}</span>;
    }

    if (content.includes("drwx") || content.includes("-rw-")) {
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

    if (content.includes("{") || content.includes("}")) {
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
      {lines.map((line) => (
        <div
          key={line.id}
          className={`${getLineColor(line.type)} leading-relaxed`}
        >
          <span className="whitespace-pre-wrap break-words">
            {formatContent(line.content, line.type)}
          </span>
        </div>
      ))}
    </div>
  );
};
