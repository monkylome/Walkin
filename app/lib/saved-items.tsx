"use client";

import { createContext, useContext, useState, useCallback } from "react";

type SavedCtx = {
  saved: Set<string>;
  toggle: (slug: string) => void;
  isSaved: (slug: string) => boolean;
};

const Ctx = createContext<SavedCtx>({ saved: new Set(), toggle: () => {}, isSaved: () => false });

function readSaved(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("walkin_saved");
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function SavedItemsProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<Set<string>>(readSaved);

  const toggle = useCallback((slug: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      localStorage.setItem("walkin_saved", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isSaved = useCallback((slug: string) => saved.has(slug), [saved]);

  return <Ctx.Provider value={{ saved, toggle, isSaved }}>{children}</Ctx.Provider>;
}

export function useSavedItems() {
  return useContext(Ctx);
}
