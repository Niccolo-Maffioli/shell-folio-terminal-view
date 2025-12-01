import { describe, expect, beforeEach, afterEach, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelmetProvider } from "react-helmet-async";

import { Terminal } from "../Terminal";
import { TerminalProvider } from "../../store/terminalStore";
import { APP_STRINGS } from "../../locales/appContent";

const renderTerminal = () =>
  render(
    <HelmetProvider>
      <TerminalProvider>
        <Terminal />
      </TerminalProvider>
    </HelmetProvider>
  );

describe("Terminal window controls", () => {
  const { terminal } = APP_STRINGS.en;

  beforeEach(() => {
    window.localStorage.setItem("terminal-onboarding", "seen");
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("hides the terminal when close is pressed", async () => {
    renderTerminal();
    const user = userEvent.setup();

    const closeButton = screen.getByRole("button", {
      name: APP_STRINGS.en.header.closeAria,
    });

    await user.click(closeButton);

    expect(
      screen.getByText(APP_STRINGS.en.terminal.hiddenMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: APP_STRINGS.en.terminal.reopenLabel })
    ).toBeInTheDocument();
  });

  it("toggles minimized state and can be restored", async () => {
    renderTerminal();
    const user = userEvent.setup();

    const minimizeButton = screen.getByRole("button", {
      name: APP_STRINGS.en.header.minimizeAria.default,
    });

    await user.click(minimizeButton);

    expect(
      screen.getByText(APP_STRINGS.en.terminal.minimizedMessage)
    ).toBeInTheDocument();

    const restoreButton = screen.getByRole("button", {
      name: APP_STRINGS.en.terminal.restoreLabel,
    });

    await user.click(restoreButton);

    expect(
      screen.queryByText(APP_STRINGS.en.terminal.minimizedMessage)
    ).not.toBeInTheDocument();
  });

  it("toggles compact mode and updates aria state", async () => {
    renderTerminal();
    const user = userEvent.setup();

    const compactButton = screen.getByRole("button", {
      name: APP_STRINGS.en.header.compactAria.default,
    });

    await user.click(compactButton);

    expect(compactButton).toHaveAttribute("aria-pressed", "true");
    expect(compactButton).toHaveAccessibleName(
      APP_STRINGS.en.header.compactAria.active
    );
  });
});
