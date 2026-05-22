"use client";

import { useRef, type KeyboardEvent, type ClipboardEvent } from "react";

export default function OtpInput({
  value, onChange, disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(idx: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      const next = (value.slice(0, idx) + value.slice(idx + 1)).slice(0, 6);
      onChange(next);
      return;
    }
    const ch  = digits[digits.length - 1];
    const arr = value.padEnd(6, " ").split("");
    arr[idx]  = ch;
    const next = arr.join("").replace(/ +$/, "").slice(0, 6);
    onChange(next);
    if (idx < 5) refs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      e.preventDefault();
      const next = value.slice(0, idx - 1) + value.slice(idx);
      onChange(next);
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      e.preventDefault();
      refs.current[idx + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { refs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] ?? ""}
          onChange={(e) => setDigit(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={idx === 0}
          className="w-12 h-14 text-center text-[22px] font-bold rounded-xl bg-surface border border-border text-foreground outline-none focus:border-primary transition-colors tabular-nums disabled:opacity-50"
        />
      ))}
    </div>
  );
}
