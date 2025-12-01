import { describe, expect, beforeEach, it } from "vitest";
import { CommandProcessor } from "../commandProcessor";
import { APP_STRINGS } from "../../locales/appContent";

const setWindowWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
};

describe("CommandProcessor", () => {
  let processor: CommandProcessor;

  beforeEach(() => {
    processor = new CommandProcessor();
    setWindowWidth(1024);
  });

  it("returns desktop help output by default", () => {
    const result = processor.processCommand("help", "~");

    expect(result.type).toBe("system");
    expect(result.output).toEqual(APP_STRINGS.en.commands.help.desktop);
  });

  it("returns mobile help output when viewport is narrow", () => {
    setWindowWidth(480);

    const result = processor.processCommand("help", "~");

    expect(result.type).toBe("system");
    expect(result.output).toEqual(APP_STRINGS.en.commands.help.mobile);
  });

  it("switches language with lang command", () => {
    const result = processor.processCommand("lang it", "~");

    expect(result.type).toBe("system");
    expect(result.output).toEqual([APP_STRINGS.it.commands.language.changed]);
    expect(processor.getCurrentLanguage()).toBe("it");
  });

  it("responds with localized content after language change", () => {
    processor.processCommand("lang it", "~");

    const projects = processor.processCommand("projects", "~");

    expect(projects.type).toBe("output");
    expect(projects.output).toEqual(APP_STRINGS.it.commands.projects);
  });

  it("returns localized errors for unknown commands", () => {
    const unknown = processor.processCommand("does-not-exist", "~");

    expect(unknown.type).toBe("error");
    expect(unknown.output).toEqual([
      APP_STRINGS.en.commands.errors.commandNotFound("does-not-exist"),
    ]);
  });
});
