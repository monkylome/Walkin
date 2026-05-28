"use client";

import { Sparkles } from "lucide-react";

export default function AskButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Ask Walkin AI"
      className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
      style={{ boxShadow: "0 4px 20px rgb(0 0 0 / 0.2)" }}
    >
      <Sparkles size={22} strokeWidth={2} />
    </button>
  );
}
