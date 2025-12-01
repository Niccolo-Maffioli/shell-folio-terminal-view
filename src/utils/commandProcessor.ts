import { APP_STRINGS, type LocaleCode } from "../locales/appContent";

export class CommandProcessor {
  private currentLanguage: LocaleCode = "en";

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

  private get commandCopy() {
    return APP_STRINGS[this.currentLanguage].commands;
  }

  private getCommandCopyFor(language: LocaleCode) {
    return APP_STRINGS[language].commands;
  }

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  getWelcomeMessage(isMobile: boolean): string[] {
    const welcome = this.commandCopy.welcome;
    return isMobile ? welcome.mobile : welcome.desktop;
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

      case "blog":
        return this.handleBlog(args[0]);

      case "ls":
        return this.handleLs(currentPath, args[0]);

      case "cd":
        return this.handleCd(currentPath, args[0]);

      case "pwd":
        return { output: [currentPath], type: "output" };

      case "whoami":
        return {
          output: [this.commandCopy.whoami],
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
        return {
          output: [this.commandCopy.errors.commandNotFound(cmd)],
          type: "error",
        };
    }
  }

  getCurrentLanguage(): LocaleCode {
    return this.currentLanguage;
  }

  private handleLanguage(lang?: string): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    const languageCopy = this.commandCopy.language;

    if (!lang) {
      return {
        output: [languageCopy.current(this.currentLanguage)],
        type: "output",
      };
    }

    if (lang === "en" || lang === "it") {
      this.currentLanguage = lang;
      const message = this.getCommandCopyFor(lang).language.changed;
      return { output: [message], type: "system" };
    }

    return { output: [languageCopy.unsupported], type: "error" };
  }

  private handleHelp(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    const helpCopy = this.commandCopy.help;
    const output = this.isMobile() ? helpCopy.mobile : helpCopy.desktop;
    return { output, type: "system" };
  }

  private handleAbout(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    return { output: this.commandCopy.about, type: "output" };
  }

  private handleSkills(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    return { output: this.commandCopy.skills, type: "output" };
  }

  private handleProjects(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    return { output: this.commandCopy.projects, type: "output" };
  }

  private handleExperience(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    return { output: this.commandCopy.experience, type: "output" };
  }

  private handleEducation(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    return { output: this.commandCopy.education, type: "output" };
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
    return { output: this.commandCopy.contact, type: "output" };
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

    const target = arg || currentPath;

    return {
      output: [this.commandCopy.errors.lsNotFound(target)],
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

    return {
      output: [this.commandCopy.errors.cdNotFound(arg)],
      type: "error",
    };
  }

  private handleCat(filename?: string): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    const { catMissingOperand, catNotFound } = this.commandCopy.errors;
    const files = this.commandCopy.files;

    if (!filename) {
      return { output: [catMissingOperand], type: "error" };
    }

    if (files[filename]) {
      return { output: ["", ...files[filename], ""], type: "output" };
    }

    return { output: [catNotFound(filename)], type: "error" };
  }

  private handleTree(): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    return { output: this.commandCopy.tree, type: "output" };
  }

  private handleBlog(date?: string): {
    output: string[];
    type: "output" | "error" | "system";
  } {
    const blogCopy = this.commandCopy.blog;

    if (!date) {
      return {
        output: blogCopy.list,
        type: "output",
      };
    }

    if (blogCopy.entries[date]) {
      return {
        output: blogCopy.entries[date],
        type: "output",
      };
    }

    return {
      output: [blogCopy.notFound(date)],
      type: "error",
    };
  }
}
