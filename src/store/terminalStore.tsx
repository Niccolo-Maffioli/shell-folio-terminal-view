import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { LocaleCode } from "../locales/appContent";

export type TerminalView = "normal" | "hidden" | "minimized" | "compact";

interface TerminalStoreState {
  terminalView: TerminalView;
  commandHistory: string[];
  historyIndex: number;
  inputValue: string;
  locale: LocaleCode;
}

interface TerminalStoreActions {
  setTerminalView: (view: TerminalView) => void;
  pushCommandHistory: (command: string) => void;
  setCommandHistory: (history: string[]) => void;
  clearCommandHistory: () => void;
  setHistoryIndex: (index: number) => void;
  resetHistoryIndex: () => void;
  setInputValue: (value: string) => void;
  resetInputValue: () => void;
  setLocale: (locale: LocaleCode) => void;
}

export type TerminalStore = TerminalStoreState & TerminalStoreActions;

const TerminalStoreContext = createContext<TerminalStore | null>(null);

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [terminalView, setTerminalViewState] = useState<TerminalView>("normal");
  const [commandHistory, setCommandHistoryState] = useState<string[]>([]);
  const [historyIndex, setHistoryIndexState] = useState(-1);
  const [inputValue, setInputValueState] = useState("");
  const [locale, setLocaleState] = useState<LocaleCode>("en");

  const setTerminalView = useCallback((view: TerminalView) => {
    setTerminalViewState(view);
  }, []);

  const pushCommandHistory = useCallback((command: string) => {
    setCommandHistoryState((prev) => [...prev, command]);
  }, []);

  const setCommandHistory = useCallback((history: string[]) => {
    setCommandHistoryState(history);
  }, []);

  const clearCommandHistory = useCallback(() => {
    setCommandHistoryState([]);
  }, []);

  const setHistoryIndex = useCallback((index: number) => {
    setHistoryIndexState(index);
  }, []);

  const resetHistoryIndex = useCallback(() => {
    setHistoryIndexState(-1);
  }, []);

  const setInputValue = useCallback((value: string) => {
    setInputValueState(value);
  }, []);

  const resetInputValue = useCallback(() => {
    setInputValueState("");
  }, []);

  const setLocale = useCallback((nextLocale: LocaleCode) => {
    setLocaleState(nextLocale);
  }, []);

  const value = useMemo<TerminalStore>(() => ({
    terminalView,
    commandHistory,
    historyIndex,
    inputValue,
    locale,
    setTerminalView,
    pushCommandHistory,
    setCommandHistory,
    clearCommandHistory,
    setHistoryIndex,
    resetHistoryIndex,
    setInputValue,
    resetInputValue,
    setLocale,
  }), [
    terminalView,
    commandHistory,
    historyIndex,
    inputValue,
    locale,
    setTerminalView,
    pushCommandHistory,
    setCommandHistory,
    clearCommandHistory,
    setHistoryIndex,
    resetHistoryIndex,
    setInputValue,
    resetInputValue,
    setLocale,
  ]);

  return (
    <TerminalStoreContext.Provider value={value}>
      {children}
    </TerminalStoreContext.Provider>
  );
};

export const useTerminalStore = (): TerminalStore => {
  const context = useContext(TerminalStoreContext);

  if (!context) {
    throw new Error("useTerminalStore must be used within a TerminalProvider");
  }

  return context;
};
