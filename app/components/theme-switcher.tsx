"use client";

import { useTheme, themes, ThemeId } from "./theme-provider";

export default function ThemeSwitcher() {
  const { theme, mode, setTheme, setMode, pickerOpen, closePicker } = useTheme();

  if (!pickerOpen) return null;

  return (
    <>
      {/* Tap-outside backdrop */}
      <button
        type="button"
        aria-label="Close theme picker"
        onClick={closePicker}
        className="fixed inset-0 z-40 cursor-default bg-transparent"
      />

      <div
        className="fixed z-50 flex items-center gap-2 theme-picker-pop"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 0.75rem)", right: "1rem" }}
      >
        {/* Theme picker */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-full px-2.5 py-1.5 shadow-md">
          {(Object.keys(themes) as ThemeId[]).map((id) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              title={themes[id].name}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                theme === id
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: themes[id].accent }}
              />
              {id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Light / Dark toggle */}
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border shadow-md text-foreground transition-colors hover:bg-border"
          title={mode === "light" ? "Switch to dark" : "Switch to light"}
        >
          {mode === "light" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
