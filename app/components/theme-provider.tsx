"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "a" | "b" | "c";
export type ModeId  = "light" | "dark";

export const themes: Record<ThemeId, { name: string; accent: string }> = {
  a: { name: "Sharp & Urban",       accent: "#f59e0b" },
  b: { name: "Clean & Confident",   accent: "#0d9488" },
  c: { name: "Warm & Approachable", accent: "#16a34a" },
};

const ThemeContext = createContext<{
  theme: ThemeId;
  mode:  ModeId;
  setTheme: (t: ThemeId) => void;
  setMode:  (m: ModeId)  => void;
}>({ theme: "b", mode: "light", setTheme: () => {}, setMode: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function applyToDOM(theme: ThemeId, mode: ModeId) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-mode",  mode);
}

function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "b";

  const stored = localStorage.getItem("theme");
  return stored === "a" || stored === "b" || stored === "c" ? stored : "b";
}

function getStoredMode(): ModeId {
  if (typeof window === "undefined") return "light";

  return localStorage.getItem("mode") === "dark" ? "dark" : "light";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getStoredTheme);
  const [mode,  setModeState]  = useState<ModeId>(getStoredMode);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyToDOM(theme, mode);
  }, [theme, mode]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  function setTheme(t: ThemeId) {
    setThemeState(t);
  }

  function setMode(m: ModeId) {
    setModeState(m);
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
