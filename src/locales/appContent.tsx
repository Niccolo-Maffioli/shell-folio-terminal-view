import React from "react";

export type LocaleCode = "en" | "it";

interface StepTip {
  id: string;
  content: React.ReactNode;
}

interface OnboardingStepCopy {
  title: string;
  body: () => React.ReactNode;
  tips: StepTip[];
}

export interface OnboardingCopy {
  totalSteps: number;
  stepIndicator: (current: number, total: number) => string;
  languageLabel: string;
  skipLabel: string;
  nextLabel: string;
  backLabel: string;
  doneLabel: string;
  continueHint: string;
  closeHint: string;
  languageOptionAria: (option: LocaleCode, isActive: boolean) => string;
  controlsAria: {
    skip: (current: number, total: number) => string;
    next: (current: number, total: number) => string;
    back: (current: number, total: number) => string;
    done: (current: number, total: number) => string;
  };
  step1: OnboardingStepCopy;
  step2: OnboardingStepCopy;
}

export interface MetaCopy {
  title: string;
  description: string;
  ogTitle: string;
}

export interface TerminalUICopy {
  hiddenMessage: string;
  reopenLabel: string;
  minimizedMessage: string;
  restoreLabel: string;
  input: {
    placeholder: string;
    suggestionsLabel: string;
  };
}

export interface TerminalHeaderCopy {
  title: string;
  closeAria: string;
  minimizeAria: {
    default: string;
    active: string;
  };
  compactAria: {
    default: string;
    active: string;
  };
}

export interface NavbarCopy {
  about: string;
  skills: string;
  projects: string;
  experience: string;
  contact: string;
  cv: string;
  help: string;
  clear: string;
  language: (targetLang: string) => string;
}

export interface CommandLanguageCopy {
  changed: string;
  current: (current: LocaleCode) => string;
  unsupported: string;
}

export interface CommandHelpCopy {
  desktop: string[];
  mobile: string[];
}

export interface CommandBlogCopy {
  list: string[];
  entries: Record<string, string[]>;
  notFound: (date: string) => string;
}

export interface CommandErrorCopy {
  commandNotFound: (cmd: string) => string;
  lsNotFound: (target: string) => string;
  cdNotFound: (dir: string) => string;
  catMissingOperand: string;
  catNotFound: (filename: string) => string;
}

export interface CommandCopy {
  welcome: {
    desktop: string[];
    mobile: string[];
  };
  language: CommandLanguageCopy;
  help: CommandHelpCopy;
  about: string[];
  skills: string[];
  projects: string[];
  experience: string[];
  education: string[];
  contact: string[];
  whoami: string;
  tree: string[];
  blog: CommandBlogCopy;
  files: Record<string, string[]>;
  errors: CommandErrorCopy;
}

export interface AppCopy {
  meta: MetaCopy;
  terminal: TerminalUICopy;
  header: TerminalHeaderCopy;
  navbar: NavbarCopy;
  onboarding: OnboardingCopy;
  commands: CommandCopy;
}

export const APP_STRINGS: Record<LocaleCode, AppCopy> = {
  en: {
    meta: {
      title: "Niccolò Maffioli | Web Developer",
      description:
        "Portfolio website of Niccolò Maffioli, front-end developer specializing in React, TypeScript, and Tailwind.",
      ogTitle: "Niccolò Maffioli | Full-Stack Developer",
    },
    terminal: {
      hiddenMessage: "Terminal hidden. press the button to reopen it.",
      reopenLabel: "Reopen terminal",
      minimizedMessage: "Terminal minimized. Press restore to continue.",
      restoreLabel: "Restore",
      input: {
        placeholder: "Type a command...",
        suggestionsLabel: "Suggestions:",
      },
    },
    header: {
      title: "Terminal - Portfolio",
      closeAria: "Close terminal",
      minimizeAria: {
        default: "Minimize terminal window",
        active: "Restore terminal window",
      },
      compactAria: {
        default: "Switch to compact terminal size",
        active: "Restore full terminal size",
      },
    },
    navbar: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      contact: "Contact",
      cv: "CV",
      help: "Help",
      clear: "Clear",
      language: (targetLang) => `Lang (${targetLang.toUpperCase()})`,
    },
    onboarding: {
      totalSteps: 2,
      stepIndicator: (current, total) => `Step ${current} of ${total}`,
      languageLabel: "Language",
      skipLabel: "Skip tour",
      nextLabel: "Next",
      backLabel: "Back",
      doneLabel: "Got it",
      continueHint: "Press Enter to continue • Esc to skip",
      closeHint: "Press Enter to close • Esc to skip",
      languageOptionAria: (option, isActive) => {
        const languageName = option === "en" ? "English" : "Italian";
        return isActive
          ? `Tour language ${languageName} selected`
          : `Switch tour language to ${languageName}`;
      },
      controlsAria: {
        skip: (current, total) => `Skip tour after step ${current} of ${total}`,
        next: (current, total) => `Go to step ${Math.min(total, current + 1)} of ${total}`,
        back: (current, total) => `Go back to step ${Math.max(1, current - 1)} of ${total}`,
        done: (current, total) => `Close tour at step ${current} of ${total}`,
      },
      step1: {
        title: "Open the quick menu",
        body: () =>
          "Use the button on the right side of the top bar to jump straight to each section without typing commands.",
        tips: [],
      },
      step2: {
        title: "Run your first command",
        body: () => (
          <>
            In the prompt below type{" "}
            <kbd className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wide text-terminal-cyan">help</kbd>{" "}
            to see the available commands, or{" "}
            <kbd className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wide text-terminal-cyan">about</kbd>{" "}
            to learn more about my background.
          </>
        ),
        tips: [
          {
            id: "history",
            content: "↑ / ↓ to browse history",
          },
          {
            id: "tab",
            content: (
              <>
                <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] uppercase text-terminal-cyan">tab</kbd>{" "}
                to auto-complete
              </>
            ),
          },
        ],
      },
    },
    commands: {
      welcome: {
        desktop: [
          "",
          "┌─ Full Stack Developer Portfolio Terminal ─┐",
          "│                                           │",
          "│  Welcome to my interactive portfolio!     │",
          "│                                           │",
          '│  Type "help" to see available commands    │',
          "│  Navigate like a real terminal            │",
          "│                                           │",
          "└───────────────────────────────────────────────┘",
          "",
          "System initialized. Ready for commands...",
          "",
        ],
        mobile: [
          "Full Stack Developer Portfolio Terminal",
          "Welcome to my interactive portfolio!",
          "  ",
          'Type "help" to see available commands',
          "Navigate like a real terminal",
          "  ",
          "System initialized. Ready for commands...",
        ],
      },
      language: {
        changed: "Language changed to English",
        current: (current) =>
          `Current language: ${current}. Usage: lang en | lang it`,
        unsupported: "Language not supported. Use: lang en | lang it",
      },
      help: {
        mobile: [
          "",
          "Available Commands:",
          "",
          "Portfolio Commands:",
          "  • about      - Learn about me",
          "  • skills     - View my technical skills",
          "  • projects   - See my latest projects",
          "  • experience - Check my work experience",
          "  • education  - View my educational background",
          "  • contact    - Get my contact information",
          "  • cv         - Download my CV",
          "  • blog       - My last articles",
          "",
          "Terminal Commands:",
          "  • ls         - List files and directories",
          "  • cd         - Change directory",
          "  • cat        - Display file contents",
          "  • pwd        - Show current directory",
          "  • whoami     - Display user information",
          "  • date       - Show current date/time",
          "  • tree       - Display directory tree",
          "  • clear      - Clear terminal screen",
          "  • lang       - Change language (en|it)",
          "  • help       - Show this help message",
          "",
          "Tip: Use Tab for auto-completion and ↑/↓ for command history",
          "",
        ],
        desktop: [
          "",
          "Available Commands:",
          "",
          "┌─ Portfolio Commands ───────────────────────────┐",
          "│  about      - Learn about me                 │",
          "│  skills     - View my technical skills       │",
          "│  projects   - See my latest projects         │",
          "│  experience - Check my work experience       │",
          "│  education  - View my educational background │",
          "│  contact    - Get my contact information     │",
          "│  cv         - Download my CV                 │",
          "└──────────────────────────────────────────────────┘",
          "",
          "┌─ Terminal Commands ──────────────────────────┐",
          "│  ls         - List files and directories   │",
          "│  cd         - Change directory             │",
          "│  cat        - Display file contents        │",
          "│  pwd        - Show current directory       │",
          "│  whoami     - Display user information     │",
          "│  date       - Show current date/time       │",
          "│  tree       - Display directory tree       │",
          "│  clear      - Clear terminal screen        │",
          "│  lang       - Change language (en|it)      │",
          "│  help       - Show this help message       │",
          "└────────────────────────────────────────────────┘",
          "",
          "Tip: Use Tab for auto-completion and ↑/↓ for command history",
          "",
        ],
      },
      about: [
        "",
        "About Me",
        "═══════════",
        "",
        "<image=profile>",
        "Junior Full Stack Developer with a strong focus on Front-End development, specializing in React (TSX), Tailwind, and Vite.",
        "Through my years of study, I have developed technical precision and a strong visual sensibility, crafting polished UI/UX interfaces using tools such as Figma.",
        "I am a collaborative team player who also excels when working independently.",
        "I am looking for a dynamic environment where I can grow as a developer and contribute to creating modern, intuitive digital experiences.",
        "",
        "I have a background in competitive artistic gymnastics and tennis, and more recently, I've taken up acrobatics and boxing.",
        "I am passionate about collecting (especially manga), TV series, films, and gaming.",
        "",
      ],
      skills: [
        "",
        "Technical Skills",
        "═══════════════════",
        "",
        "Frontend Development:",
        "  ▓▓▓░░ React.js             (Intermediate)",
        "  ▓▓▓▓░ TypeScript/JavaScript (Advanced)",
        "  ▓▓▓▓▓ HTML5/CSS3/SCSS      (Expert)",
        "  ▓▓▓▓░ Tailwind CSS         (Advanced)",
        "  ▓▓▓░░ Webpack/Vite         (Intermediate)",
        "",
        "Backend Development:",
        "  ▓▓▓░░ Node.js              (Intermediate)",
        "  ▓▓░░░ Python               (Basic)",
        "  ▓▓░░░ Java                 (Basic)",
        "  ▓░░░░ Spring Boot          (Familiar)",
        "  ▓▓░░░ PHP                  (Basic)",
        "  ▓▓▓▓░ RESTful APIs         (Advanced)",
        "",
        "Databases:",
        "  ▓▓▓░░ MySQL                (Intermediate)",
        "  ▓░░░░ MongoDB              (Familiar)",
        "",
        "Cloud & DevOps:",
        "  ▓▓░░░ CI/CD Pipelines      (Basic)",
        "  ▓▓▓░░ GitHub Actions       (Intermediate)",
        "",
        "Tools & Others:",
        "  ▓▓▓▓░ Git/GitHub           (Advanced)",
        "  ▓▓▓▓▓ VS Code              (Expert)",
        "",
        "UI / UX:",
        "  ▓▓▓▓░ Figma                (Advanced)",
        "",
      ],
      projects: [
        "",
        "Featured Projects",
        "═══════════════════",
        "",
        "1.  Movie app",
        "   ├─ Tech Stack: typescript, TMDB (API), Vercel (for deploy)",
        "   ├─ Features: minisimulation of Netflix, view list of popular series and view list of popular films",
        "   ├─ <link=https://github.com/Niccolo-Maffioli/movie-niccolo-app|Github>",
        "   └─ <link=https://movie-niccolo-app-1yzy.vercel.app/|Movie app>",
        "",
        "2. Portfolio Exlibris",
        "   ├─ Tech Stack: HTML, CSS, JAvascript, Netlify (for deploy)",
        "   ├─ Features: Portfolio template for Exlibris's employees",
        "   ├─ <link=https://github.com/Niccolo-Maffioli/Exlibrisportfolio|GitHub>",
        "   └─ <link=https://exlibrisportfolio.netlify.app/|ExLibris portfolio template>",
        "",
        "3. Blink",
        "   ├─ Tech Stack: HTML, CSS, Javascript, Netlify (for deploy)",
        "   ├─ Features: Movie site for MetaProject Mohole, ",
        "   ├─ <link=https://blinkprimevideo.netlify.app/|Blink Movie App>",
        "   └─ <link=https://github.com/Niccolo-Maffioli/PrimeGift-More|GitHub>",
        "",
        "4. Marialetizia Cristina Portfolio",
        "   ├─ Tech Stack: React (TypeScript), WordPress (backend), Vercel (deploy)",
        "   ├─ Features: Portfolio for a graphic designer. Backend left in WP, frontend built with stateless tech using React (TS). Frontend connected to WP obscured using best practices (blank pure theme and automatic redirection to React frontend deployed on Vercel on free domain). Those accessing the old frontend now blank page are automatically redirected to the new React frontend. Used SEO best practices to de-index the old site (WP frontend) and increase indexing of the new site (React frontend).",
        "   ├─ GitHub: -- (not available yet, private, will be public when client authorizes)",
        "   └─ <link=https://marialetiziacristina.vercel.app/|Marialetizia Cristina Portfolio>",
        "",
        "5. I Am Chef",
        "   ├─ Tech Stack: React (TypeScript), Spoonacular API, Vercel (deploy)",
        "   ├─ Features: App where you search for ingredients, add them one by one, and using Spoonacular APIs finds recipes with those ingredients.",
        "   ├─ GitHub: -- (not available yet, will add later)",
        "   └─ <link=https://iamchef-maffioli.vercel.app/|I Am Chef>",
        "",
        "6. Moholes Platform",
        "   ├─ Tech Stack: UI/UX Research, Figma",
        "   ├─ Features: Internal publishing platform for Mohole School that lets students and staff share content with category and author-specific styling, comments, and personal author hubs. The concept remains open to future ideas and improvements.",
        "   └─ <link=https://www.behance.net/gallery/138063725/Moholes?platform=direct|Behance Case Study>",
        "",
        "7. RetroTreasures",
        "   ├─ Tech Stack: UI/UX, Figma",
        "   ├─ Features: Curated marketplace app for vintage lovers to buy and sell authentic apparel, accessories, furniture, and collectibles, connecting sellers with buyers who appreciate the charm of past eras.",
        "   └─ <link=https://www.behance.net/gallery/187278913/Retro-Treasures|Behance Case Study>",
        "",
        "8. GatherFeel",
        "   ├─ Tech Stack: UI/UX, Figma",
        "   ├─ Features: Collector-focused marketplace spanning vinyls, comics, coins, action figures, and antiques, with in-depth provenance details, advanced search, and exclusive auctions to surface culturally significant pieces.",
        "   └─ <link=https://www.behance.net/gallery/242477357/GatherFeel|Behance Case Study>",
        "",
      ],
      experience: [
        "",
        "Professional Experience",
        "═══════════════════════════",
        "",
        "2022 – 2023",
        "Freelance Collaboration",
        "   Exlibris.link Srl",
        "   ┌─ Designed book covers for digital publications (EPUB3 format)",
        "   ├─ Developed and managed a web-based intranet system for digital content archiving",
        "   └─ Built a web application for managing collaborators’ digital portfolios",
        "",
        "2021 – 2022",
        "Collaboration with R&D Department",
        "   Ste Industries Srl",
        "   ┌─ Created prototype logos for new product lines",
        "   └─ Designed marketing brochure mock-ups and visuals",
        "",
      ],
      education: [
        "",
        "Education & Certifications",
        "═══════════════════════════",
        "",
        "Full Stack Developer with Cloud Technologies",
        "   ITS - Tech Talent Factory, Milano",
        "   2024 - 2026 | Final Grade: --",
        "",
        "Graphic Design",
        "   Mohole, Milano",
        "   2022 - 2024 | Final Grade: 27/30",
        "",
        "Web and Digital Media",
        "   Mohole, Milano",
        "   2020 - 2022 | Final Grade: 25/30",
        "",
        "Brera Art High School (Hajeck) – Architecture Program",
        "   Milan, Italy",
        "   2014 - 2019",
        "",
        "Continuous Learning:",
        "   • JavaScript & TypeScript Best Practices",
        "   • Responsive Design & Accessibility",
        "   • DevOps Foundations & CI/CD Principles",
        "   • Git & Version Control Workflows",
        "",
        "Achievements:",
        "   • Developed and deployed multiple personal projects",
        "   • Collaborated on design and development with peers during academic projects",
        "",
      ],
      contact: [
        "",
        "Contact Information",
        "════════════════════",
        "",
        "Email:     nico.maffioli@gmail.com",
        "Phone:     +39 3348691322",
        "<link=https://niccolo.dev/|Personal Porfolio>",
        "Location:  Milano, MI",
        "",
        "Professional Links:",
        "   <link=https://www.linkedin.com/in/niccolomaffioli/|LinkedIn Profile>",
        "   <link=https://github.com/Niccolo-Maffioli/|GitHub Profile>",
        "   <link=https://www.behance.net/niccolmaffioli|Behance Portfolio>",
        "",
        "Let's Connect!",
        "   I'm always open to discussing new opportunities,",
        "   collaborating on interesting projects, or just",
        "   having a chat about technology and development.",
        "",
        "Availability: Open for new opportunities",
        "Rate: €80-120/hour (freelance)",
        "Timezone: CET/CEST (UTC+1/UTC+2)",
        "",
      ],
      whoami: "Full Stack Developer",
      tree: [
        "",
        "Portfolio Directory Structure",
        "",
        "~/",
        "├── about.txt",
        "├── skills.json",
        "├── contact.txt",
        "├── projects/",
        "│   ├── --/",
        "└── experience/",
        "    ├── fullstack-dev.txt",
        "    └── frontend-dev.txt",
        "",
      ],
      blog: {
        list: [
          "Personal Blog - Life beyond code",
          "",
          "Warning: this blog contains personal and medical reflections.",
          "These are part of my story and go beyond my work.",
          "Please read with respect and an open mind.",
          "",
          "Entries:",
          "  • [2025-06-09] - The upcoming brain surgery",
          "  • [2025-04-15] - My internship and goals",
          "",
          "Use the command `blog <date>` to read a post.",
          "   Example: `blog 2025-06-09`",
        ],
        entries: {
          "2025-06-09": [
            "[2025-06-09] - The upcoming brain surgery",
            "",
            "After over 12 years of living with epilepsy, I'm facing a crucial moment:",
            "a high-risk surgery on the right insula. It's not my first operation,",
            "but it might be the one with the most consequences — for better or worse.",
            "",
            "The doctors aren't sure. It could be the right decision, or a mistake.",
            "But I’ve come this far with strength and patience.",
            "",
            "Whatever happens, I'm proud of the person I've become.",
          ],
          "2025-04-15": [
            "[2025-04-15] - My internship and goals",
            "",
            "Right now I’m doing an internship through school.",
            "It’s my final year and this stage marks a key step for my future.",
            "",
            "I’m learning a lot, building real projects, and trying to balance",
            "life, health, and education — and honestly, I'm doing okay.",
          ],
        },
        notFound: (date) => `No blog post found for date: ${date}`,
      },
      files: {
        "about.txt": [
          "Full Stack Developer with 4+ years of education",
          "Passionate about creating scalable web applications",
          "Expert in React, Node.js, and cloud technologies",
        ],
        "contact.txt": [
          "Email: nico.maffioli@gmail.com",
          "LinkedIn: https://www.linkedin.com/in/niccolomaffioli/",
          "GitHub: https://github.com/Niccolo-Maffioli",
          "Behance: https://www.behance.net/niccolmaffioli",
        ],
      },
      errors: {
        commandNotFound: (cmd) =>
          `Command not found: ${cmd}. Type 'help' for available commands.`,
        lsNotFound: (target) =>
          `ls: cannot access '${target}': No such file or directory`,
        cdNotFound: (dir) => `cd: no such file or directory: ${dir}`,
        catMissingOperand: "cat: missing file operand",
        catNotFound: (filename) =>
          `cat: ${filename}: No such file or directory`,
      },
    },
  },
  it: {
    meta: {
      title: "Niccolò Maffioli | Web Developer",
      description:
        "Portfolio personale di Niccolò Maffioli, sviluppatore front-end specializzato in React, TypeScript e Tailwind.",
      ogTitle: "Niccolò Maffioli | Full-Stack Developer",
    },
    terminal: {
      hiddenMessage: "Terminal nascosto. Premi per riaprirlo.",
      reopenLabel: "Riapri terminale",
      minimizedMessage: "Terminal minimizzato. Premi ripristina per continuare.",
      restoreLabel: "Ripristina",
      input: {
        placeholder: "Digita un comando...",
        suggestionsLabel: "Suggerimenti:",
      },
    },
    header: {
      title: "Terminal - Portfolio",
      closeAria: "Chiudi terminale",
      minimizeAria: {
        default: "Minimizza finestra terminale",
        active: "Ripristina finestra terminale",
      },
      compactAria: {
        default: "Passa al terminale compatto",
        active: "Ripristina dimensione terminale",
      },
    },
    onboarding: {
      totalSteps: 2,
      stepIndicator: (current, total) => `Step ${current} di ${total}`,
      languageLabel: "Lingua",
      skipLabel: "Salta tour",
      nextLabel: "Avanti",
      backLabel: "Indietro",
      doneLabel: "Ho capito",
      continueHint: "Premi Invio per continuare • Esc per saltare",
      closeHint: "Premi Invio per chiudere • Esc per saltare",
      languageOptionAria: (option, isActive) => {
        const languageName = option === "en" ? "Inglese" : "Italiano";
        return isActive
          ? `Lingua del tour ${languageName} selezionata`
          : `Imposta lingua del tour su ${languageName}`;
      },
      controlsAria: {
        skip: (current, total) => `Salta il tour dopo lo step ${current} di ${total}`,
        next: (current, total) => `Vai allo step ${Math.min(total, current + 1)} di ${total}`,
        back: (current, total) => `Torna allo step ${Math.max(1, current - 1)} di ${total}`,
        done: (current, total) => `Chiudi il tour allo step ${current} di ${total}`,
      },
      step1: {
        title: "Apri il menu rapido",
        body: () =>
          "Usa il pulsante sulla destra della barra superiore per saltare direttamente alle sezioni del portfolio senza digitare comandi.",
        tips: [],
      },
      step2: {
        title: "Digita un comando",
        body: () => (
          <>
            Nel prompt in basso scrivi{" "}
            <kbd className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wide text-terminal-cyan">help</kbd>{" "}
            per vedere i comandi, oppure{" "}
            <kbd className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wide text-terminal-cyan">about</kbd>{" "}
            per conoscere la mia storia.
          </>
        ),
        tips: [
          {
            id: "cronologia",
            content: "↑ / ↓ per scorrere la cronologia",
          },
          {
            id: "tab",
            content: (
              <>
                <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] uppercase text-terminal-cyan">tab</kbd>{" "}
                per completare
              </>
            ),
          },
        ],
      },
    },
    commands: {
      welcome: {
        desktop: [
          "",
          "┌─ Portfolio Terminale Sviluppatore Full Stack ─┐",
          "│                                                │",
          "│  Benvenuto nel mio portfolio interattivo!      │",
          "│                                                │",
          '│  Digita "help" per vedere i comandi disponibili│',
          "│  Naviga come un vero terminale                 │",
          "│                                                │",
          "└────────────────────────────────────────────────────┘",
          "",
          "Sistema inizializzato. Pronto per i comandi...",
          "",
        ],
        mobile: [
          "Portfolio Terminale Sviluppatore Full Stack",
          "Benvenuto nel mio portfolio interattivo!",
          "  ",
          'Digita "help" per vedere i comandi disponibili',
          "Naviga come un vero terminale",
          "  ",
          "Sistema inizializzato. Pronto per i comandi...",
        ],
      },
      language: {
        changed: "Lingua cambiata in Italiano",
        current: (current) =>
          `Lingua attuale: ${current}. Usa: lang en | lang it`,
        unsupported: "Lingua non supportata. Usa: lang en | lang it",
      },
      help: {
        mobile: [
          "",
          "Comandi Disponibili:",
          "",
          "Comandi Portfolio:",
          "  • about      - Scopri di più su di me",
          "  • skills     - Visualizza le mie competenze",
          "  • projects   - Vedi i miei progetti recenti",
          "  • experience - Controlla la mia esperienza",
          "  • education  - Visualizza la mia formazione",
          "  • contact    - Ottieni le mie informazioni",
          "  • cv         - Scarica il mio CV",
          "  • blog       - i miei ultimi articoli",
          "",
          "Comandi Terminale:",
          "  • ls         - Elenca file e directory",
          "  • cd         - Cambia directory",
          "  • cat        - Mostra contenuto file",
          "  • pwd        - Mostra directory corrente",
          "  • whoami     - Mostra informazioni utente",
          "  • date       - Mostra data/ora corrente",
          "  • tree       - Mostra albero directory",
          "  • clear      - Pulisci schermo terminale",
          "  • lang       - Cambia lingua (en|it)",
          "  • help       - Mostra questo messaggio",
          "",
          "Suggerimento: Usa Tab per il completamento automatico e ↑/↓ per la cronologia",
          "",
        ],
        desktop: [
          "",
          "Comandi Disponibili:",
          "",
          "┌─ Comandi Portfolio ───────────────────────────┐",
          "│  about      - Scopri di più su di me        │",
          "│  skills     - Visualizza le mie competenze  │",
          "│  projects   - Vedi i miei progetti recenti  │",
          "│  experience - Controlla la mia esperienza   │",
          "│  education  - Visualizza la mia formazione  │",
          "│  contact    - Ottieni le mie informazioni   │",
          "│  cv         - Scarica il mio CV             │",
          "└─────────────────────────────────────────────────┘",
          "",
          "┌─ Comandi Terminale ───────────────────────────┐",
          "│  ls         - Elenca file e directory       │",
          "│  cd         - Cambia directory              │",
          "│  cat        - Mostra contenuto file         │",
          "│  pwd        - Mostra directory corrente     │",
          "│  whoami     - Mostra informazioni utente    │",
          "│  date       - Mostra data/ora corrente      │",
          "│  tree       - Mostra albero directory       │",
          "│  clear      - Pulisci schermo terminale     │",
          "│  lang       - Cambia lingua (en|it)         │",
          "│  help       - Mostra questo messaggio       │",
          "└─────────────────────────────────────────────────┘",
          "",
          "Suggerimento: Usa Tab per il completamento automatico e ↑/↓ per la cronologia",
          "",
        ],
      },
      about: [
        "",
        "Su di Me",
        "═══════════",
        "",
        "<image=profile>",
        "Junior Full Stack Developer con una forte propensione per il Front-End, specializzato in React (TSX), Tailwind e Vite.",
        "Dopo i miei anni di studio ho acquisito precisione tecnica e sensibilità visiva, sviluppando interfacce curate in UI/UX utilizzando software come Figma.",
        "Lavoro bene in gruppo ma sono anche autonomo.",
        "Cerco un ambiente dinamico in cui crescere come sviluppatore e contribuire alla creazione di esperienze digitali moderne e intuitive.",
        "",
        "Ho praticato ginnastica artistica e tennis a livello agonistico, più di recente acrobatica e pugilato.",
        "Sono appassionato di collezionismo (specialmente di manga), di serie TV, di film e del mondo videoludico.",
        "",
      ],
      skills: [
        "",
        "Technical Skills",
        "═══════════════════",
        "",
        "Frontend Development:",
        "  ▓▓▓░░ React.js             (Intermedio)",
        "  ▓▓▓▓░ TypeScript/JavaScript (Avanzato)",
        "  ▓▓▓▓▓ HTML5/CSS3/SCSS      (Esperto)",
        "  ▓▓▓▓░ Tailwind CSS         (Avanzato)",
        "  ▓▓▓░░ Webpack/Vite         (Intermedio)",
        "",
        "Backend Development:",
        "  ▓▓▓░░ Node.js              (Intermedio)",
        "  ▓▓░░░ Python               (Basi)",
        "  ▓▓░░░ Java                 (Basi)",
        "  ▓░░░░ Spring Boot          (Familiarità)",
        "  ▓▓░░░ PHP                  (Basi)",
        "  ▓▓▓▓░ RESTful APIs         (Avanzato)",
        "",
        "Databases:",
        "  ▓▓▓░░ MySQL                (Intermedio)",
        "  ▓░░░░ MongoDB              (familiarità)",
        "",
        "Cloud & DevOps:",
        "  ▓▓░░░ CI/CD Pipelines      (Basi)",
        "  ▓▓▓░░ GitHub Actions       (Intermedio)",
        "",
        "Tools & Others:",
        "  ▓▓▓▓░ Git/GitHub           (Avanzato)",
        "  ▓▓▓▓▓ VS Code              (Esperto)",
        "",
        "UI / UX:",
        "  ▓▓▓▓░ Figma                (Avanzato)",
        "",
      ],
      projects: [
        "",
        "Progetti in Evidenza",
        "════════════════════════",
        "",
        "1.  Movie app",
        "   ├─ Stack Tecnologico: TypeScript, TMDB (API), Vercel (per il deploy)",
        "   ├─ Funzionalità: mini-simulazione di Netflix, visualizzazione lista serie popolari e lista film popolari",
        "   ├─ <link=https://github.com/Niccolo-Maffioli/movie-niccolo-app|Github>",
        "   └─ <link=https://movie-niccolo-app-1yzy.vercel.app/|Movie app>",
        "",
        "2. Portfolio Exlibris",
        "   ├─ Stack Tecnologico: HTML, CSS, JavaScript, Netlify (per il deploy)",
        "   ├─ Funzionalità: template portfolio per i collaboratori di Exlibris",
        "   ├─ <link=https://github.com/Niccolo-Maffioli/Exlibrisportfolio|GitHub>",
        "   └─ <link=https://exlibrisportfolio.netlify.app/|ExLibris portfolio template>",
        "",
        "3. Blink",
        "   ├─ Stack Tecnologico: HTML, CSS, JavaScript, Netlify (per il deploy)",
        "   ├─ Funzionalità: sito di film per MetaProject Mohole",
        "   ├─ <link=https://blinkprimevideo.netlify.app/|Blink movie app>",
        "   └─ <link=https://github.com/Niccolo-Maffioli/PrimeGift-More|GitHub>",
        "",
        "4. Portfolio Marialetizia Cristina",
        "   ├─ Stack Tecnologico: React (TypeScript), WordPress (backend), Vercel (deploy)",
        "   ├─ Funzionalità: Portfolio per una graphic designer. Backend lasciato in WP, frontend realizzato con tech stateless utilizzando React (TS). Frontend collegato a WP oscurato utilizzando best practices (tema blank puro e reindirizzamento automatico al frontend React deployato su Vercel su dominio gratuito). Chi accede al vecchio frontend ora blank page viene automaticamente reindirizzato al nuovo frontend React. Utilizzate best practices SEO per de-indicizzare il sito vecchio (frontend WP) e aumentare l'indicizzazione del sito nuovo (frontend React).",
        "   ├─ GitHub: -- (non disponibile per ora, privato, sarà pubblico quando avrò l'autorizzazione dal cliente)",
        "   └─ <link=https://marialetiziacristina.vercel.app/|Portfolio Marialetizia Cristina>",
        "",
        "5. I Am Chef",
        "   ├─ Stack Tecnologico: React (TypeScript), API Spoonacular, Vercel (deploy)",
        "   ├─ Funzionalità: App in cui cerchi ingredienti, li aggiungi uno ad uno, e utilizzando le API di Spoonacular trova ricette con quegli ingredienti.",
        "   ├─ GitHub: -- (non disponibile per ora, lo aggiungerò dopo)",
        "   └─ <link=https://iamchef-maffioli.vercel.app/|I Am Chef>",
        "",
        "6. Moholes Platform",
        "   ├─ Stack Tecnologico: UI/UX, prototipi Figma",
        "   ├─ Funzionalità: Piattaforma interna per Scuola Mohole in cui studenti e personale pubblicano contenuti con differenziazione visiva per categorie e autori, commenti e spazi personali per raccogliere le pubblicazioni. Il concept rimane aperto a idee e suggerimenti.",
        "   └─ <link=https://www.behance.net/gallery/138063725/Moholes?platform=direct|Case study su Behance>",
        "",
        "7. RetroTreasures",
        "   ├─ Stack Tecnologico: UI/UX, Figma",
        "   ├─ Funzionalità: App marketplace curata per appassionati di vintage che permette di comprare e vendere capi, accessori, arredi e pezzi da collezione autentici, mettendo in contatto venditori e acquirenti che amano il fascino delle epoche passate.",
        "   └─ <link=https://www.behance.net/gallery/187278913/Retro-Treasures|Case study su Behance>",
        "",
        "8. GatherFeel",
        "   ├─ Stack Tecnologico: UI/UX, Figma",
        "   ├─ Funzionalità: Marketplace per collezionisti che copre vinili, fumetti, monete, action figure e oggetti d'epoca, con informazioni approfondite su storia e autenticità, ricerca avanzata e aste esclusive per scoprire pezzi unici di valore culturale.",
        "   └─ <link=https://www.behance.net/gallery/242477357/GatherFeel|Case study su Behance>",
        "",
      ],
      experience: [
        "",
        "Esperienza Professionale",
        "════════════════════════════",
        "",
        "2022 – 2023",
        "Collaborazione Freelance",
        "   Exlibris.link Srl",
        "   ┌─ Progettazione di copertine per libri digitali (formato EPUB3)",
        "   ├─ Sviluppo e gestione di un sistema intranet web per l'archiviazione di contenuti digitali",
        "   └─ Realizzazione di un'applicazione web per la gestione dei portfolio digitali dei collaboratori",
        "",
        "2021 – 2022",
        "Collaborazione con il reparto R&S",
        "   Ste Industries Srl",
        "   ┌─ Creazione di loghi prototipo per nuove linee di prodotto",
        "   └─ Progettazione di mockup e materiali visivi per brochure marketing",
        "",
      ],
      education: [
        "",
        "Formazione & Certificazioni",
        "══════════════════════════════",
        "",
        "Sviluppatore Full Stack con Tecnologie Cloud",
        "   ITS - Tech Talent Factory, Milano",
        "   2024 - 2026 | Voto finale: --",
        "",
        "Graphic Design",
        "   Mohole, Milano",
        "   2022 - 2024 | Voto finale: 27/30",
        "",
        "Web e Media Digitali",
        "   Mohole, Milano",
        "   2020 - 2022 | Voto finale: 25/30",
        "",
        "Liceo Artistico Brera (Hajeck) – Indirizzo Architettura",
        "   Milano, Italia",
        "   2014 - 2019",
        "",
        "Formazione Continua:",
        "   • Best practices in JavaScript e TypeScript",
        "   • Design Responsive e Accessibilità",
        "   • Fondamenti di DevOps e principi CI/CD",
        "   • Git e flussi di lavoro per il controllo versione",
        "",
        "Risultati:",
        "   • Sviluppato e distribuito diversi progetti personali",
        "   • Collaborato su progetti accademici in ambito design e sviluppo",
        "",
      ],
      contact: [
        "",
        "Informazioni di Contatto",
        "════════════════════",
        "",
        "Email:  nico.maffioli@gmail.com",
        "Cell:   +39 3348691322",
        "<link=https://niccolo.dev/|Portfolio Personale>",
        "Sede:   Milano, MI",
        "",
        "Link Professionali:",
        "   <link=https://www.linkedin.com/in/niccolomaffioli/|Profilo Linkedin>",
        "   <link=https://github.com/Niccolo-Maffioli/|GitHub>",
        "   <link=https://www.behance.net/niccolmaffioli|Profilo Behance>",
        "",
        "Restiamo in contatto!",
        "   Sono sempre aperto a discutere nuove opportunità,",
        "   collaborare su progetti interessanti o semplicemente",
        "   fare due chiacchiere su tecnologia e sviluppo.",
        "",
        "Disponibilità: Aperto a nuove opportunità",
        "Tariffa: €80-120/ora (freelance)",
        "Fuso orario: CET/CEST (UTC+1/UTC+2)",
        "",
      ],
      whoami: "Sviluppatore Full Stack",
      tree: [
        "",
        "Struttura Directory Portfolio",
        "",
        "~/",
        "├── about.txt",
        "├── skills.json",
        "├── contact.txt",
        "├── projects/",
        "│   ├── --/",
        "└── experience/",
        "    ├── fullstack-dev.txt",
        "    └── frontend-dev.txt",
        "",
      ],
      blog: {
        list: [
          "Personal Blog - Life beyond code",
          "",
          "Attenzione: questo blog contiene riflessioni personali e mediche.",
          "Sono parte della mia storia, vanno oltre il lavoro.",
          "Leggere con rispetto e mente aperta.",
          "",
          "Articoli:",
          "  • [2025-06-09] - L'intervento imminente",
          "  • [2025-04-15] - Lo stage e i miei obiettivi",
          "",
          "Usa il comando `blog <data>` per leggere un post.",
          "   Esempio: `blog 2025-06-09`",
        ],
        entries: {
          "2025-06-09": [
            "[2025-06-09] - Il prossimo intervento al cervello",
            "",
            "Dopo oltre 12 anni vissuti con l’epilessia, sto affrontando un momento cruciale:",
            "un intervento ad alto rischio sull’insula destra. Non è la mia prima operazione,",
            "ma potrebbe essere quella con le conseguenze più importanti — nel bene o nel male.",
            "",
            "I medici non sono sicuri. Potrebbe essere la scelta giusta, oppure un errore.",
            "Ma sono arrivato fin qui con forza e pazienza.",
            "",
            "Qualunque cosa accada, sono orgoglioso della persona che sono diventato.",
          ],
          "2025-04-15": [
            "[2025-04-15] - Lo stage e i miei obiettivi",
            "",
            "Attualmente sto facendo uno stage organizzato dalla scuola.",
            "È il mio ultimo anno, e questo tirocinio rappresenta un passo fondamentale per il mio futuro.",
            "",
            "Sto imparando molto, lavorando su progetti reali, e cercando di bilanciare",
            "vita, salute e istruzione — e onestamente, me la sto cavando bene.",
          ],
        },
        notFound: (date) => `Nessun articolo trovato per la data: ${date}`,
      },
      files: {
        "about.txt": [
          "Full Stack Developer with 4+ years of education",
          "Passionate about creating scalable web applications",
          "Expert in React, Node.js, and cloud technologies",
        ],
        "contact.txt": [
          "Email: nico.maffioli@gmail.com",
          "LinkedIn: https://www.linkedin.com/in/niccolomaffioli/",
          "GitHub: https://github.com/Niccolo-Maffioli",
          "Behance: https://www.behance.net/niccolmaffioli",
        ],
      },
      errors: {
        commandNotFound: (cmd) =>
          `Comando non trovato: ${cmd}. Digita 'help' per i comandi disponibili.`,
        lsNotFound: (target) =>
          `ls: impossibile accedere a '${target}': File o directory non esistente`,
        cdNotFound: (dir) => `cd: file o directory non esistente: ${dir}`,
        catMissingOperand: "cat: operando file mancante",
        catNotFound: (filename) =>
          `cat: ${filename}: File o directory non esistente`,
      },
    },
    navbar: {
      about: "Su di me",
      skills: "Competenze",
      projects: "Progetti",
      experience: "Esperienza",
      contact: "Contatti",
      cv: "CV",
      help: "Aiuto",
      clear: "Pulisci",
      language: (targetLang) => `Lingua (${targetLang.toUpperCase()})`,
    },
  },
};
