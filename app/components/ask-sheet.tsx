"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send, X, MapPin, ExternalLink, Mic, MicOff } from "lucide-react";
import StoreLogo from "@/app/components/store-logo";
import { buildMapsUrl } from "@/app/lib/maps-link";
import type { SearchResult } from "@/app/lib/search";

type SortBy = "detour" | "price" | "stock";

type AiResponse = {
  reply: string;
  results: SearchResult[];
  sortBy: SortBy;
};

const SORT_LABELS: Record<SortBy, string> = {
  detour: "Least Detour",
  price: "Cheapest",
  stock: "Most Stock",
};

function ResultCard({
  result,
  userLat,
  userLng,
  onView,
}: {
  result: SearchResult;
  userLat: number;
  userLng: number;
  onView: () => void;
}) {
  const mapsUrl = buildMapsUrl({
    originLat: userLat,
    originLng: userLng,
    waypointLat: result.storeLat,
    waypointLng: result.storeLng,
  });

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <StoreLogo name={result.store} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-foreground leading-tight truncate">
            {result.store}
          </p>
          <p className="text-[12px] text-muted mt-0.5 truncate">{result.item}</p>
        </div>
        <span className="text-[16px] font-bold text-foreground shrink-0">
          €{result.price.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3 text-[12px] text-muted">
        <span>{result.detourMinutes} min detour</span>
        <span>·</span>
        <span>{result.stock} in stock</span>
        {result.inNeighborhood && (
          <>
            <span>·</span>
            <span className="flex items-center gap-0.5 shrink-0">
              <MapPin size={10} />
              {result.inNeighborhood}
            </span>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 py-2.5 rounded-xl border border-border bg-background text-foreground text-[13px] font-semibold active:opacity-70 transition-opacity"
        >
          View store
        </button>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold text-center flex items-center justify-center gap-1.5 active:opacity-80 transition-opacity"
        >
          <ExternalLink size={13} />
          Open in Maps
        </a>
      </div>
    </div>
  );
}

export default function AskSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("detour");
  const [error, setError] = useState<string | null>(null);
  const [userLat, setUserLat] = useState(37.9755);
  const [userLng, setUserLng] = useState(23.7348);
  const [recording, setRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const voiceSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      recognitionRef.current?.abort();
    };
  }, []);

  function toggleVoice() {
    if (recording) {
      recognitionRef.current?.abort();
      setRecording(false);
      return;
    }

    // Web Speech API — not in TS DOM lib yet, use runtime cast
    const w = window as unknown as Record<string, unknown>;
    const SR = (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"]) as new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      start(): void;
      abort(): void;
      onstart: (() => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
      onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
    };

    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setRecording(true);
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      handleSubmit(transcript);
    };

    recognitionRef.current = rec;
    rec.start();
  }

  const sortedResults = response
    ? [...response.results].sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "stock") return b.stock - a.stock;
        return a.detourMinutes - b.detourMinutes;
      })
    : [];

  async function handleSubmit(text?: string) {
    const q = (text ?? input).trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    let lat = 37.9755;
    let lng = 23.7348;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
      );
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      setUserLat(lat);
      setUserLng(lng);
    } catch {
      // fall through to Athens default
    }

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q, lat, lng }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data: AiResponse = await res.json();
      setResponse(data);
      setSortBy(data.sortBy ?? "detour");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-[0_-8px_24px_rgb(0_0_0/0.15)] flex flex-col"
        style={{
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
          maxHeight: "85dvh",
        }}
      >
        {/* Drag handle */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={17} className="text-primary" />
            <span className="text-[15px] font-semibold text-foreground">Ask Walkin AI</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-3 min-h-0">
          {/* Idle placeholder */}
          {!loading && !response && !error && (
            <p className="text-[14px] text-muted py-1 leading-relaxed">
              Try: <span className="text-foreground">"Going to Nea Ionia by metro, I want Depon on the way"</span>
            </p>
          )}

          {/* Loading shimmer */}
          {loading && (
            <div className="space-y-3 pt-1">
              <div className="h-12 rounded-2xl bg-surface animate-pulse" />
              <div className="h-28 rounded-2xl bg-surface animate-pulse" />
              <div className="h-28 rounded-2xl bg-surface animate-pulse" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="text-[14px] text-red-500 py-2">{error}</p>
          )}

          {/* Results */}
          {!loading && response && (
            <div className="space-y-4 pt-1">
              {/* Gemini reply bubble */}
              {response.reply ? (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3">
                  <p className="text-[14px] text-foreground leading-relaxed">{response.reply}</p>
                </div>
              ) : null}

              {/* Sort chips */}
              {sortedResults.length > 0 && (
                <div className="flex gap-2">
                  {(["detour", "price", "stock"] as SortBy[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                        sortBy === s
                          ? "bg-primary text-white border-primary"
                          : "bg-surface text-muted border-border"
                      }`}
                    >
                      {SORT_LABELS[s]}
                    </button>
                  ))}
                </div>
              )}

              {/* Result cards */}
              <div className="space-y-3 pb-2">
                {sortedResults.map((r, i) => (
                  <ResultCard
                    key={i}
                    result={r}
                    userLat={userLat}
                    userLng={userLng}
                    onView={() => {
                      onClose();
                      router.push(`/store/${r.storeSlug}`);
                    }}
                  />
                ))}

                {sortedResults.length === 0 && response.reply && (
                  <p className="text-[13px] text-muted text-center py-4">No matching stores found.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          className="px-4 pt-3 border-t border-border shrink-0"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-2 bg-surface border border-border rounded-2xl px-4 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ask anything…"
              className="flex-1 text-[15px] bg-transparent text-foreground placeholder:text-muted outline-none"
            />
            {voiceSupported && (
              <button
                onClick={toggleVoice}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  recording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-surface border border-border text-muted"
                }`}
              >
                {recording ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
            )}
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
