"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";

export type ThemeId = "a" | "b" | "c" | "d" | "e";
export type ModeId  = "light" | "dark";

export const themes: Record<ThemeId, { name: string; accent: string }> = {
  a: { name: "Midnight",  accent: "#1d4ed8" },
  b: { name: "Ocean",     accent: "#0369a1" },
  c: { name: "Sky",       accent: "#0ea5e9" },
  d: { name: "Cyan",      accent: "#06b6d4" },
  e: { name: "Mint",      accent: "#0d9488" },
};

const DEFAULT_THEME: ThemeId = "b";
const DEFAULT_MODE: ModeId   = "light";

function applyToDOM(theme: ThemeId, mode: ModeId) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-mode",  mode);
}

function createStorageStore<T extends string>(key: string, fallback: T, valid: (v: string | null) => v is T) {
  const listeners = new Set<() => void>();

  return {
    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getSnapshot(): T {
      const v = localStorage.getItem(key);
      return valid(v) ? v : fallback;
    },
    setValue(v: T) {
      localStorage.setItem(key, v);
      listeners.forEach(cb => cb());
    },
  };
}

function isThemeId(v: string | null): v is ThemeId { return v === "a" || v === "b" || v === "c" || v === "d" || v === "e"; }
function isModeId(v: string | null): v is ModeId   { return v === "light" || v === "dark"; }

const themeStore = createStorageStore("theme", DEFAULT_THEME, isThemeId);
const modeStore  = createStorageStore("mode",  DEFAULT_MODE,  isModeId);

const ThemeContext = createContext<{
  theme: ThemeId;
  mode:  ModeId;
  setTheme: (t: ThemeId) => void;
  setMode:  (m: ModeId)  => void;
  pickerOpen: boolean;
  togglePicker: () => void;
  closePicker: () => void;
}>({ theme: DEFAULT_THEME, mode: DEFAULT_MODE, setTheme: () => {}, setMode: () => {}, pickerOpen: false, togglePicker: () => {}, closePicker: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, () => DEFAULT_THEME);
  const mode  = useSyncExternalStore(modeStore.subscribe,  modeStore.getSnapshot,  () => DEFAULT_MODE);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    applyToDOM(theme, mode);
  }, [theme, mode]);

  function setTheme(t: ThemeId) {
    themeStore.setValue(t);
  }

  function setMode(m: ModeId) {
    modeStore.setValue(m);
  }

  function togglePicker() {
    setPickerOpen((v) => !v);
  }

  function closePicker() {
    setPickerOpen(false);
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, pickerOpen, togglePicker, closePicker }}>
      {children}
    </ThemeContext.Provider>
  );
}
