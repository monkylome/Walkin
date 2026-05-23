"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type ModeId = "system" | "light" | "dark";

const DEFAULT_MODE: ModeId = "system";

function getEffectiveMode(mode: ModeId): "light" | "dark" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyToDOM(mode: ModeId) {
  document.documentElement.setAttribute("data-mode", getEffectiveMode(mode));
}

const listeners = new Set<() => void>();
const modeStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  },
  getSnapshot(): ModeId {
    const v = localStorage.getItem("mode");
    return v === "light" || v === "dark" || v === "system" ? v : DEFAULT_MODE;
  },
  setValue(v: ModeId) {
    localStorage.setItem("mode", v);
    listeners.forEach(cb => cb());
  },
};

const ModeContext = createContext<{
  mode: ModeId;
  effectiveMode: "light" | "dark";
  setMode: (m: ModeId) => void;
}>({ mode: DEFAULT_MODE, effectiveMode: "light", setMode: () => {} });

export function useMode() {
  return useContext(ModeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(modeStore.subscribe, modeStore.getSnapshot, () => DEFAULT_MODE);
  const effectiveMode = getEffectiveMode(mode);

  useEffect(() => { applyToDOM(mode); }, [mode]);

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyToDOM("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  function setMode(m: ModeId) { modeStore.setValue(m); }

  return (
    <ModeContext.Provider value={{ mode, effectiveMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}
