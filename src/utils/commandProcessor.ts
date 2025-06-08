import { clear } from "console";
import { TerminalLine } from "../components/Terminal";
import { Link } from "lucide-react";

interface Translations {
  [key: string]: {
    [key: string]: string | string[];
  };
}

export class CommandProcessor {
  private currentLanguage = "en";

  private fileSystem = {
    "~": {
      type: "directory",
      children: [
        "about.txt",
        "skills.json",
        "projects/",
        "experience/",
        "contact.txt",
      ],
    },
    "~/projects": {
      type: "directory",
      children: [
        "<link=https://www.behance.net/gallery/196749843/Ripcord-Flat-After-Effect?share=1|Burton Project>",
        "<link=https://www.behance.net/gallery/187278913/Retro-Treasures|Retro Treasures>",
        "<link=https://www.behance.net/gallery/129309527/Foodie|Foodie app>",
        "<link=https://www.behance.net/gallery/138063725/Moholes|Mohole's app>",
      ],
    },
    "~/experience": {
      type: "directory",
      children: ["junior-dev.txt", "fullstack-dev.txt", "frontend-dev.txt"],
    },
  };

  private translations: Translations = {
    en: {
      welcomeMessage: [
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
        "🚀 System initialized. Ready for commands...",
        "",
      ],
      languageChanged: "Language changed to English",
    },
    it: {
      welcomeMessage: [
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
        "🚀 Sistema inizializzato. Pronto per i comandi...",
        "",
      ],
      languageChanged: "Lingua cambiata in Italiano",
    },
  };

  private translationsMobile: Translations = {
    en: {
      welcomeMessage: [
        "Full Stack Developer Portfolio Terminal",
        "Welcome to my interactive portfolio!",
        "  ",
        'Type "help" to see available commands',
        "Navigate like a real terminal",
        "  ",
        "🚀 System initialized. Ready for commands...",
      ],
      languageChanged: "Language changed to English",
    },
    it: {
      welcomeMessage: [
        "Portfolio Terminale Sviluppatore Full Stack",
        "Benvenuto nel mio portfolio interattivo!",
        "  ",
        'Digita "help" per vedere i comandi disponibili',
        "Naviga come un vero terminale",
        "  ",
        "🚀 Sistema inizializzato. Pronto per i comandi...",
      ],
      languageChanged: "Lingua cambiata in Italiano",
    },
  };

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  getWelcomeMessage(isMobile: boolean): string[] {
    return isMobile
      ? (this.translationsMobile[this.currentLanguage]
          .welcomeMessage as string[])
      : (this.translations[this.currentLanguage].welcomeMessage as string[]);
  }

  processCommand(
    command: string,
    currentPath: string
  ): {
    output: string[];
    type: "output" | "error" | "system";
    newPath?: string;
    shouldClear?: boolean;
  } {
    const [cmd, ...args] = command.trim().split(" ");

    switch (cmd.toLowerCase()) {
      case "lang":
      case "language":
        return this.handleLanguage(args[0]);

      case "help":
        return this.handleHelp();

      case "about":
        return this.handleAbout();

      case "skills":
        return this.handleSkills();

      case "projects":
        return this.handleProjects();

      case "experience":
        return this.handleExperience();

      case "education":
        return this.handleEducation();

      case "contact":
        return this.handleContact();

      case "nico":
        return this.handleNico();

      case "ls":
        return this.handleLs(currentPath, args[0]);

      case "cd":
        return this.handleCd(currentPath, args[0]);

      case "pwd":
        return { output: [currentPath], type: "output" };

      case "whoami":
        return {
          output: [
            this.currentLanguage === "it"
              ? "Sviluppatore Full Stack"
              : "Full Stack Developer",
          ],
          type: "output",
        };

      case "date":
        return { output: [new Date().toString()], type: "output" };

      case "clear":
        return { output: [], type: "system", shouldClear: true };

      case "cat":
        return this.handleCat(args[0]);

      case "tree":
        return this.handleTree();

      default:
        const errorMsg =
          this.currentLanguage === "it"
            ? `Comando non trovato: ${cmd}. Digita 'help' per i comandi disponibili.`
            : `Command not found: ${cmd}. Type 'help' for available commands.`;
        return {
          output: [errorMsg],
          type: "error",
        };
    }
  }

  private handleLanguage(lang?: string): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (!lang) {
      const currentMsg =
        this.currentLanguage === "it"
          ? `Lingua attuale: ${this.currentLanguage}. Usa: lang en | lang it`
          : `Current language: ${this.currentLanguage}. Usage: lang en | lang it`;
      return { output: [currentMsg], type: "output" };
    }

    if (lang === "en" || lang === "it") {
      this.currentLanguage = lang;
      const message = this.translations[lang].languageChanged as string;
      return { output: [message], type: "system" };
    }

    const errorMsg =
      this.currentLanguage === "it"
        ? "Lingua non supportata. Usa: lang en | lang it"
        : "Language not supported. Use: lang en | lang it";

    return { output: [errorMsg], type: "error" };
  }

  private handleHelp(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (this.isMobile) {
      if (this.currentLanguage === "it") {
        return {
          output: [
            "",
            "📚 Comandi Disponibili:",
            "",
            "Comandi Portfolio:",
            "  • about      - Scopri di più su di me",
            "  • skills     - Visualizza le mie competenze",
            "  • projects   - Vedi i miei progetti recenti",
            "  • experience - Controlla la mia esperienza",
            "  • education  - Visualizza la mia formazione",
            "  • contact    - Ottieni le mie informazioni",
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
            "💡 Suggerimento: Usa Tab per il completamento automatico e ↑/↓ per la cronologia",
            "",
          ],
          type: "system",
        };
      }

      return {
        output: [
          "",
          "📚 Available Commands:",
          "",
          "Portfolio Commands:",
          "  • about      - Learn about me",
          "  • skills     - View my technical skills",
          "  • projects   - See my latest projects",
          "  • experience - Check my work experience",
          "  • education  - View my educational background",
          "  • contact    - Get my contact information",
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
          "💡 Tip: Use Tab for auto-completion and ↑/↓ for command history",
          "",
        ],
        type: "system",
      };
    }

    if (this.currentLanguage === "it") {
      return {
        output: [
          "",
          "📚 Comandi Disponibili:",
          "",
          "┌─ Comandi Portfolio ───────────────────────────┐",
          "│  about      - Scopri di più su di me        │",
          "│  skills     - Visualizza le mie competenze  │",
          "│  projects   - Vedi i miei progetti recenti  │",
          "│  experience - Controlla la mia esperienza   │",
          "│  education  - Visualizza la mia formazione  │",
          "│  contact    - Ottieni le mie informazioni   │",
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
          "💡 Suggerimento: Usa Tab per il completamento automatico e ↑/↓ per la cronologia",
          "",
        ],
        type: "system",
      };
    }

    return {
      output: [
        "",
        "📚 Available Commands:",
        "",
        "┌─ Portfolio Commands ───────────────────────────┐",
        "│  about      - Learn about me                 │",
        "│  skills     - View my technical skills       │",
        "│  projects   - See my latest projects         │",
        "│  experience - Check my work experience       │",
        "│  education  - View my educational background │",
        "│  contact    - Get my contact information     │",
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
        "💡 Tip: Use Tab for auto-completion and ↑/↓ for command history",
        "",
      ],
      type: "system",
    };
  }

  private handleAbout(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (this.currentLanguage === "it") {
      return {
        output: [
          "",
          "👋 Su di Me",
          "═══════════",
          "",
          "Sviluppatore Full Stack con oltre 4 anni di apprendimento continuo e sviluppo di progetti.",
          "nella creazione di applicazioni web scalabili e nella risoluzione di problemi complessi.",
          "",
          "🎯 Specializzazioni:",
          "  • Frontend: React, TypeScript, CSS, HTML5",
          "  • Backend: Node.js, Python, mySQL",
          "  • DevOps: CI/CD, Infrastructure as Code",
          "",
          "🌟 Cosa mi motiva:",
          "  • Creare esperienze utente eccezionali",
          "  • Scrivere codice pulito e manutenibile",
          "  • Apprendimento continuo e innovazione",
          "",
          "📍 Attualmente a Milano, MI",
          "🌐 Aperto a opportunità remote in tutto il mondo",
          "",
        ],
        type: "output",
      };
    }

    return {
      output: [
        "",
        "👋 About Me",
        "═══════════",
        "",
        "Full Stack Developer with over 4 years of continuous learning and project development.",
        "building scalable web applications and solving complex problems.",
        "",
        "🎯 Specializations:",
        "  • Frontend: React, TypeScript, JavaScript, Html, CSS",
        "  • Backend: Node.js, Python, mySQL",
        "  • DevOps: CI/CD, Infrastructure as Code",
        "",
        "🌟 What drives me:",
        "  • Creating exceptional user experiences",
        "  • Writing clean, maintainable code",
        "  • Continuous learning and innovation",
        "",
        "📍 Currently based in Milan, MI",
        "🌐 Open to remote opportunities worldwide",
        "",
      ],
      type: "output",
    };
  }

  private handleSkills(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (this.currentLanguage === "it") {
      return {
        output: [
          "",
          "💻 Technical Skills",
          "═══════════════════",
          "",
          "🔥 Frontend Development:",
          "  ▓▓▓░░ React.js             (Intermedio)",
          "  ▓▓▓▓░ TypeScript/JavaScript (Avanzato)",
          "  ▓▓▓▓▓ HTML5/CSS3/SCSS      (Esperto)",
          "  ▓▓▓▓░ Tailwind CSS         (Avanzato)",
          "  ▓▓▓░░ Webpack/Vite         (Intermedio)",

          "",
          "⚙️ Backend Development:",
          "  ▓▓▓░░ Node.js              (Intermedio)",
          "  ▓▓░░░ Python               (Basi)",
          "  ▓▓░░░ PHP                  (Basi)",
          "  ▓▓▓▓░ RESTful APIs         (Avanzato)",
          "",
          "🗄️ Databases:",
          "  ▓▓▓▓░ MySQL                (Avanzato)",
          "  ▓░░░░ MongoDB              (familiarità)",
          "",
          "☁️ Cloud & DevOps:",
          "  ▓▓░░░ CI/CD Pipelines      (Basi)",
          "  ▓▓▓░░ GitHub Actions       (Intermedio)",
          "",
          "🛠️ Tools & Others:",
          "  ▓▓▓▓░ Git/GitHub           (Avanzato)",
          "  ▓▓▓▓▓ VS Code              (Esperto)",
          "",
        ],
        type: "output",
      };
    }

    return {
      output: [
        "",
        "💻 Technical Skills",
        "═══════════════════",
        "",
        "🔥 Frontend Development:",
        "  ▓▓▓░░ React.js             (Intermediate)",
        "  ▓▓▓▓░ TypeScript/JavaScript (Advanced)",
        "  ▓▓▓▓▓ HTML5/CSS3/SCSS      (Expert)",
        "  ▓▓▓▓░ Tailwind CSS         (Advanced)",
        "  ▓▓▓░░ Webpack/Vite         (Intermediate)",

        "",
        "⚙️ Backend Development:",
        "  ▓▓▓░░ Node.js              (Intermediate)",
        "  ▓▓░░░ Python               (Basic)",
        "  ▓▓░░░ PHP                  (Basic)",
        "  ▓▓▓▓░ RESTful APIs         (Advanced)",
        "",
        "🗄️ Databases:",
        "  ▓▓▓▓░ MySQL                (Advanced)",
        "  ▓░░░░ MongoDB              (Familiar)",
        "",
        "☁️ Cloud & DevOps:",
        "  ▓▓░░░ CI/CD Pipelines      (Basic)",
        "  ▓▓▓░░ GitHub Actions       (Intermediate)",
        "",
        "🛠️ Tools & Others:",
        "  ▓▓▓▓░ Git/GitHub           (Advanced)",
        "  ▓▓▓▓▓ VS Code              (Expert)",
        "",
      ],
      type: "output",
    };
  }

  private handleProjects(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (this.currentLanguage === "it") {
      return {
        output: [
          "",
          "🚀 Progetti in Evidenza",
          "════════════════════════",
          "",
          "1.  🎞️ Movie app",
          "   ├─ Stack Tecnologico: TypeScript, TMDB (API), Vercel (per il deploy)",
          "   ├─ Funzionalità: mini-simulazione di Netflix, visualizzazione lista serie popolari e lista film popolari",
          "   ├─ <link=https://github.com/Niccolo-Maffioli/movie-niccolo-app|Github>",
          "   └─ <link=https://movie-niccolo-app-1yzy.vercel.app/|Movie app>",
          "",
          "2. 💼 Portfolio Exlibris",
          "   ├─ Stack Tecnologico: HTML, CSS, JavaScript, Netlify (per il deploy)",
          "   ├─ Funzionalità: template portfolio per i collaboratori di Exlibris",
          "   ├─ <link=https://github.com/Niccolo-Maffioli/Exlibrisportfolio|GitHub>",
          "   └─ <link=https://exlibris.link|ExLibris portfolio template>",
          "",
          "3. 🎞️ Blink",
          "   ├─ Stack Tecnologico: HTML, CSS, JavaScript, Netlify (per il deploy)",
          "   ├─ Funzionalità: sito di film per MetaProject Mohole",
          "   ├─ <link=https://blinkprimevideo.netlify.app/|Blink movie app>",
          "   └─ <link=https://github.com/Niccolo-Maffioli/PrimeGift-More|GitHub>",
          "",
          /*"4. 🏗️ Strumento di Project Management",
    "   ├─ Stack Tecnologico: React, Django, PostgreSQL, Docker",
    "   ├─ Funzionalità: tracciamento attività, collaborazione di team, tracciamento del tempo",
    "   ├─ Adozione: utilizzato da 3 aziende, oltre 100 progetti",
    "   └─ GitHub: github.com/yourname/project-management",
    "",
    '💡 Vedi altri progetti: "cd ~/projects" poi "ls"', */
          "",
        ],
        type: "output",
      };
    }

    return {
      output: [
        "",
        "🚀 Featured Projects",
        "═══════════════════",
        "",
        "1.  🎞️ Movie app",
        "   ├─ Tech Stack: typescript, TMDB (API), Vercel (for deploy)",
        "   ├─ Features: minisimulation of Netflix, view list of popular series and view list of popular films",
        "   ├─ <link=https://github.com/Niccolo-Maffioli/movie-niccolo-app|Github>",
        "   └─ <link=https://movie-niccolo-app-1yzy.vercel.app/|Movie app>",
        "",
        "2. 💼 Portfolio Exlibris",
        "   ├─ Tech Stack: HTML, CSS, JAvascript, Netlify (for deploy)",
        "   ├─ Features: Portfolio template for Exlibris's employees",
        "   ├─ <link=https://github.com/Niccolo-Maffioli/Exlibrisportfolio|GitHub>",
        "   └─ <link=https://exlibris.link|ExLibris portfolio template>",
        "",
        "3. 🎞️ Blink",
        "   ├─ Tech Stack: HTML, CSS, Javascript, Netlify (for deploy)",
        "   ├─ Features: Movie site for MetaProject Mohole, ",
        "   ├─ <link=https://blinkprimevideo.netlify.app/|Blink Movie App>",
        "   └─ <link=https://github.com/Niccolo-Maffioli/PrimeGift-More|GitHub>",
        "",
        /*"4. 🏗️ Project Management Tool",
        "   ├─ Tech Stack: React, Django, PostgreSQL, Docker",
        "   ├─ Features: Task tracking, team collaboration, time tracking",
        "   ├─ Adoption: Used by 3 companies, 100+ projects",
        "   └─ GitHub: github.com/yourname/project-management",
        "",
        '💡 View more projects: "cd ~/projects" then "ls"', */
        "",
      ],
      type: "output",
    };
  }

  private handleExperience(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (this.currentLanguage === "it") {
      return {
        output: [
          "",
          "💼 Esperienza Professionale",
          "════════════════════════════",
          "",
          "🗓️ 2022 – 2023",
          "🔹 Collaborazione Freelance",
          "   📍 Exlibris.link Srl",
          "   ┌─ Progettazione di copertine per libri digitali (formato EPUB3)",
          "   ├─ Sviluppo e gestione di un sistema intranet web per l'archiviazione di contenuti digitali",
          "   └─ Realizzazione di un'applicazione web per la gestione dei portfolio digitali dei collaboratori",
          "",
          "🗓️ 2021 – 2022",
          "🔹 Collaborazione con il reparto R&S",
          "   📍 Ste Industries Srl",
          "   ┌─ Creazione di loghi prototipo per nuove linee di prodotto",
          "   └─ Progettazione di mockup e materiali visivi per brochure marketing",
          "",
        ],
        type: "output",
      };
    }
    return {
      output: [
        "",
        "💼 Professional Experience",
        "═══════════════════════════",
        "",
        "🗓️ 2022 – 2023",
        "🔹 Freelance Collaboration",
        "   📍 Exlibris.link Srl",
        "   ┌─ Designed book covers for digital publications (EPUB3 format)",
        "   ├─ Developed and managed a web-based intranet system for digital content archiving",
        "   └─ Built a web application for managing collaborators’ digital portfolios",
        "",
        "🗓️ 2021 – 2022",
        "🔹 Collaboration with R&D Department",
        "   📍 Ste Industries Srl",
        "   ┌─ Created prototype logos for new product lines",
        "   └─ Designed marketing brochure mock-ups and visuals",
        "",
      ],
      type: "output",
    };
  }

  private handleEducation(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (this.currentLanguage === "it") {
      return {
        output: [
          "",
          "🎓 Formazione & Certificazioni",
          "══════════════════════════════",
          "",
          "🏫 Sviluppatore Full Stack con Tecnologie Cloud",
          "   📍 ITS - Tech Talent Factory, Milano",
          "   📅 2024 - 2026 | Voto finale: --",
          "",
          "🏫 Graphic Design",
          "   📍 Mohole, Milano",
          "   📅 2022 - 2024 | Voto finale: 27/30",
          "",
          "🏫 Web e Media Digitali",
          "   📍 Mohole, Milano",
          "   📅 2020 - 2022 | Voto finale: 25/30",
          "",
          "🏫 Liceo Artistico Brera (Hajeck) – Indirizzo Architettura",
          "   📍 Milano, Italia",
          "   📅 2014 - 2019",
          "",
          "📚 Formazione Continua:",
          "   • Best practices in JavaScript e TypeScript",
          "   • Design Responsive e Accessibilità",
          "   • Fondamenti di DevOps e principi CI/CD",
          "   • Git e flussi di lavoro per il controllo versione",
          "",
          "🏆 Risultati:",
          "   • Sviluppato e distribuito diversi progetti personali",
          "   • Collaborato su progetti accademici in ambito design e sviluppo",
          "",
        ],
        type: "output",
      };
    }

    return {
      output: [
        "",
        "🎓 Education & Certifications",
        "═══════════════════════════",
        "",
        "🏫 Full Stack Developer with Cloud Technologies",
        "   📍 ITS - Tech Talent Factory, Milano",
        "   📅 2024 - 2026 | Final Grade: --",
        "",
        "🏫 Graphic Design",
        "   📍 Mohole, Milano",
        "   📅 2022 - 2024 | Final Grade: 27/30",
        "",
        "🏫 Web and Digital Media",
        "   📍 Mohole, Milano",
        "   📅 2020 - 2022 | Final Grade: 25/30",
        "",
        "🏫 Brera Art High School (Hajeck) – Architecture Program",
        "   📍 Milan, Italy",
        "   📅 2014 - 2019",
        "",
        "📚 Continuous Learning:",
        "   • JavaScript & TypeScript Best Practices",
        "   • Responsive Design & Accessibility",
        "   • DevOps Foundations & CI/CD Principles",
        "   • Git & Version Control Workflows",
        "",
        "🏆 Achievements:",
        "   • Developed and deployed multiple personal projects",
        "   • Collaborated on design and development with peers during academic projects",
        "",
      ],
      type: "output",
    };
  }

  private handleNico(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    return {
      output: ["::easteregg_nico::"], // token speciale
      type: "output",
    };
  }

  private handleContact(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (this.currentLanguage === "it") {
      return {
        output: [
          "",
          "📞 Informazioni di Contatto",
          "════════════════════",
          "",
          "📧 Email:  nico.maffioli@gmail.com",
          "📱 Cell:   +39 3348691322",
          "🌐 <link=https://niccolo.dev/|Portfolio Personale>",
          "📍 Sede:   Milano, MI",
          "",
          "🔗 Link Professionali:",
          "   💼 <link=https://www.linkedin.com/in/niccolomaffioli/|Profilo Linkedin>",
          "   💻 <link=https://github.com/Niccolo-Maffioli/|GitHub>",
          "",
          "💬 Restiamo in contatto!",
          "   Sono sempre aperto a discutere nuove opportunità,",
          "   collaborare su progetti interessanti o semplicemente",
          "   fare due chiacchiere su tecnologia e sviluppo.",
          "",
          "🕐 Disponibilità: Aperto a nuove opportunità",
          "💰 Tariffa: €80-120/ora (freelance)",
          "⏰ Fuso orario: CET/CEST (UTC+1/UTC+2)",
          "",
        ],
        type: "output",
      };
    }

    return {
      output: [
        "",
        "📞 Contact Information",
        "════════════════════",
        "",
        "📧 Email:     nico.maffioli@gmail.com",
        "📱 Phone:     +39 3348691322",
        "🌐 <link=https://niccolo.dev/|Personal Porfolio>",
        "📍 Location:  Milano, MI",
        "",
        "🔗 Professional Links:",
        "   💼 <link=https://www.linkedin.com/in/niccolomaffioli/|LinkedIn Profile>",
        "   💻 <link=https://github.com/Niccolo-Maffioli/|GitHub Profile>",
        "",
        "💬 Let's Connect!",
        "   I'm always open to discussing new opportunities,",
        "   collaborating on interesting projects, or just",
        "   having a chat about technology and development.",
        "",
        "🕐 Availability: Open for new opportunities",
        "💰 Rate: €80-120/hour (freelance)",
        "⏰ Timezone: CET/CEST (UTC+1/UTC+2)",
        "",
      ],
      type: "output",
    };
  }

  private handleLs(
    currentPath: string,
    arg?: string
  ): { output: string[]; type: "output" | "error" | "system" } {
    const path = arg ? `${currentPath}/${arg}`.replace("//", "/") : currentPath;
    const normalizedPath = path === "/" ? "~" : path;

    if (this.fileSystem[normalizedPath]) {
      const items = this.fileSystem[normalizedPath].children;
      const output = [""];

      items.forEach((item) => {
        if (item.endsWith("/")) {
          output.push(
            `drwxr-xr-x  2 user user  4096 ${new Date()
              .toDateString()
              .slice(4)} ${item}`
          );
        } else {
          output.push(
            `-rw-r--r--  1 user user  1024 ${new Date()
              .toDateString()
              .slice(4)} ${item}`
          );
        }
      });

      output.push("");
      return { output, type: "output" };
    }

    const errorMsg =
      this.currentLanguage === "it"
        ? `ls: impossibile accedere a '${
            arg || currentPath
          }': File o directory non esistente`
        : `ls: cannot access '${
            arg || currentPath
          }': No such file or directory`;

    return {
      output: [errorMsg],
      type: "error",
    };
  }

  private handleCd(
    currentPath: string,
    arg?: string
  ): {
    output: string[];
    type: "output" | "error" | "system";
    newPath?: string;
  } {
    if (!arg) {
      return { output: [""], type: "output", newPath: "~" };
    }

    if (arg === "..") {
      const parts = currentPath.split("/");
      parts.pop();
      const newPath = parts.length === 1 ? "~" : parts.join("/");
      return { output: [""], type: "output", newPath };
    }

    const newPath = currentPath === "~" ? `~/${arg}` : `${currentPath}/${arg}`;

    if (this.fileSystem[newPath]) {
      return { output: [""], type: "output", newPath };
    }

    const errorMsg =
      this.currentLanguage === "it"
        ? `cd: file o directory non esistente: ${arg}`
        : `cd: no such file or directory: ${arg}`;

    return {
      output: [errorMsg],
      type: "error",
    };
  }

  private handleCat(filename?: string): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    if (!filename) {
      const errorMsg =
        this.currentLanguage === "it"
          ? "cat: operando file mancante"
          : "cat: missing file operand";
      return { output: [errorMsg], type: "error" };
    }

    const files: { [key: string]: string[] } = {
      "about.txt": [
        "Full Stack Developer with 4+ years of education",
        "Passionate about creating scalable web applications",
        "Expert in React, Node.js, and cloud technologies",
      ],
      "contact.txt": [
        "Email: nico.maffioli@gmail.com",
        "LinkedIn: https://www.linkedin.com/in/niccolomaffioli/",
        "GitHub: https://github.com/Niccolo-Maffioli",
      ],
    };

    if (files[filename]) {
      return { output: ["", ...files[filename], ""], type: "output" };
    }

    const errorMsg =
      this.currentLanguage === "it"
        ? `cat: ${filename}: File o directory non esistente`
        : `cat: ${filename}: No such file or directory`;

    return {
      output: [errorMsg],
      type: "error",
    };
  }

  private handleTree(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    return {
      output: [
        "",
        "📁 Portfolio Directory Structure",
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
      type: "output",
    };
  }
}
