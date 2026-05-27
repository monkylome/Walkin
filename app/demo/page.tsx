"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import MapView, { type MapPoint } from "@/app/components/map-view";
import ReservationConfirm from "@/app/components/reservation-confirm";
import StoreLogo from "@/app/components/store-logo";
import { ReservationProvider, useReservations, type Reservation } from "@/app/lib/reservations";
import { storeLocations, storeMeta } from "@/app/lib/data";

const DEMO_RESULTS = [
  { store: "Toolman",           item: "Bosch Screwdriver Set 42pc", price: 18.90, stock: 5, detourMinutes: 2 },
  { store: "ProBuild Supplies", item: "Bosch Screwdriver Set 42pc", price: 19.50, stock: 3, detourMinutes: 5 },
];

const DEMO_STORES = ["Toolman", "ProBuild Supplies", "Papageorgiou Group"];

// idle → listening → results → reserving → confirmed → done
type DemoStep = "idle" | "listening" | "results" | "reserving" | "confirmed" | "done";

function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined") return;
  console.log("[TTS]", text);
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.92;
  if (onEnd) u.onend = onEnd;
  // resume() fixes the iOS "paused" state; small delay after cancel() avoids
  // a Safari timing bug where cancel+speak in the same tick drops the utterance
  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();
  setTimeout(() => window.speechSynthesis.speak(u), 50);
}

function googleMapsUrl(storeName: string) {
  const loc = storeLocations[storeName];
  const dest = encodeURIComponent("Nea Ionia, Athens, Greece");
  const waypoint = loc ? `${loc.lat},${loc.lng}` : encodeURIComponent(storeName);
  return `https://maps.google.com/maps?daddr=${dest}&waypoints=${waypoint}`;
}

function matchStore(t: string): string | null {
  const s = t.toLowerCase();
  if (s.includes("toolman") || s.includes("tool man") || s.includes("first") || s.includes("one") || s.includes("cheaper")) return "Toolman";
  if (s.includes("probuild") || s.includes("pro build") || s.includes("second") || s.includes("two")) return "ProBuild Supplies";
  return null;
}

function DemoContent() {
  const searchParams = useSearchParams();
  const isDemoMode = searchParams.get("demo") === "1";

  const [step, setStep]               = useState<DemoStep>("idle");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [transcript, setTranscript]   = useState("");
  const [speaking, setSpeaking]       = useState("");

  // Stable refs so async callbacks always see current values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef           = useRef<any>(null);
  const stepRef          = useRef<DemoStep>("idle");
  const storeRef         = useRef<string | null>(null);
  const { reserve }      = useReservations();
  const reserveRef       = useRef(reserve);
  reserveRef.current     = reserve;
  stepRef.current        = step;
  storeRef.current       = selectedStore;

  const points: MapPoint[] = DEMO_STORES
    .filter((name) => storeLocations[name])
    .map((name) => ({
      kind:        "store" as const,
      id:          name,
      position:    storeLocations[name],
      initials:    storeMeta[name]?.initials ?? "??",
      accentClass: storeMeta[name]?.color    ?? "bg-gray-500",
      category:    storeMeta[name]?.category ?? "Tools",
      featured:    false,
    }));

  function stopRec() {
    if (recRef.current) {
      try { recRef.current.abort(); } catch { /* ignore */ }
      recRef.current = null;
    }
  }

  function startRec(onResult: (text: string) => void) {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    stopRec();
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    recRef.current = rec;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const text: string = e.results[0]?.[0]?.transcript ?? "";
      setTranscript(text);
      onResult(text);
    };
    rec.onerror = () => { if (recRef.current === rec) recRef.current = null; };
    rec.onend   = () => { if (recRef.current === rec) recRef.current = null; };
    try { rec.start(); } catch { /* already running */ }
  }

  function doReserve(storeName: string) {
    const result = DEMO_RESULTS.find((r) => r.store === storeName);
    if (!result) return;
    const r = reserveRef.current(result.item, storeName, result.price, "at_store");
    setReservation(r);
    setStep("confirmed");
  }

  function speakAloud(text: string, onEnd?: () => void) {
    setSpeaking(text);
    speak(text, () => { setSpeaking(""); onEnd?.(); });
  }

  // Starts the "listening" step — must be called directly from a user gesture
  // so iOS Safari permits speechSynthesis
  function beginListening() {
    setStep("listening");
    setTranscript("");
    speakAloud("What do you need along your route?", () => {
      if (stepRef.current !== "listening") return;
      const t = setTimeout(() => {
        if (stepRef.current === "listening") setStep("results");
      }, 6000);
      startRec((_text) => {
        clearTimeout(t);
        if (stepRef.current === "listening") setStep("results");
      });
    });
  }

  // Drive TTS + STT for steps that follow voice recognition (audio already unlocked)
  useEffect(() => {
    if (step === "listening") return; // handled by beginListening()
    setTranscript("");
    stopRec();
    window.speechSynthesis.cancel();

    if (step === "results") {
      speakAloud(
        "I found 2 stores near your route. " +
        "Toolman has a Bosch Screwdriver Set for €18.90, just 2 minutes off your route. " +
        "ProBuild Supplies has one for €19.50, 5 minutes off your route. " +
        "Which would you prefer?",
        () => {
          if (stepRef.current !== "results") return;
          startRec((text) => {
            const store = matchStore(text);
            if (store) { setSelectedStore(store); setStep("reserving"); }
          });
        }
      );
    } else if (step === "reserving") {
      const store = storeRef.current;
      speakAloud(`Great choice! Would you like to reserve at ${store}, or just get directions?`, () => {
        if (stepRef.current !== "reserving") return;
        startRec((text) => {
          const t = text.toLowerCase();
          if (t.includes("reserve") || t.includes("book") || t.includes("yes")) {
              const s = storeRef.current;
              if (s) doReserve(s);
          } else if (t.includes("direct") || t.includes("navigate") || t.includes("no")) {
            setStep("done");
          }
        });
      });
    } else if (step === "confirmed") {
      speakAloud(
        "Your item has been reserved. " +
        "Show your pickup code at the store. " +
        "I've updated your route — tap Navigate when you're ready."
      );
    }

    return () => { stopRec(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function handleSelectStore(storeName: string) {
    stopRec();
    setSelectedStore(storeName);
    setStep("reserving");
  }

  function handleConfirmClose() {
    setStep("done");
  }

  function reset() {
    stopRec();
    window.speechSynthesis.cancel();
    setStep("idle");
    setSelectedStore(null);
    setReservation(null);
    setTranscript("");
  }

  const showWaypoint = (step === "confirmed" || step === "done") && selectedStore && storeLocations[selectedStore];
  const waypointCoords = showWaypoint
    ? `${storeLocations[selectedStore!].lat},${storeLocations[selectedStore!].lng}`
    : undefined;

  return (
    <div className="relative h-dvh overflow-hidden bg-black">

      {/* Map */}
      <div className="absolute inset-0">
        <MapView
          points={points}
          defaultCenter={{ lat: 38.0100, lng: 23.7400 }}
          defaultZoom={13}
          routeConfig={{
            origin:      "Syntagma Square, Athens, Greece",
            destination: "Nea Ionia, Athens, Greece",
            waypoint:    waypointCoords,
          }}
        />
      </div>

      {/* Top navigation chrome */}
      <div className="absolute top-0 inset-x-0 z-20 pt-safe pointer-events-none">
        <div className="mx-3 mt-3 px-4 py-3 rounded-2xl bg-background/95 backdrop-blur border border-border shadow-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground">Heading to Nea Ionia</p>
            <p className="text-[11px] text-muted">
              {step === "done" ? "Stop added: " + selectedStore : "12 min · 4.2 km"}
            </p>
          </div>
          <span className="text-[12px] font-medium text-primary shrink-0">Via Patision</span>
        </div>
      </div>

      {/* Bottom navigation chrome */}
      <div className="absolute bottom-0 inset-x-0 z-20" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="mx-3 mb-3 px-4 py-3 rounded-2xl bg-background/95 backdrop-blur border border-border shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[18px] font-bold text-foreground">
              {step === "done" ? "14 min" : "12 min"}
            </p>
            <p className="text-[12px] text-muted">
              {step === "done" ? "Stop at " + selectedStore + " added" : "4.2 km · Arrive ~3:45 PM"}
            </p>
          </div>
          {step === "done" && selectedStore && (
            <button
              onClick={() => window.open(googleMapsUrl(selectedStore), "_blank")}
              className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-semibold active:opacity-80"
            >
              Navigate
            </button>
          )}
          {step === "idle" && (
            <button onClick={reset} className="px-4 py-2 rounded-xl border border-border text-[13px] font-medium text-muted">
              End
            </button>
          )}
        </div>
      </div>

      {/* Floating W button */}
      {step === "idle" && (
        <button
          onClick={beginListening}
          className="absolute right-4 z-30 w-14 h-14 rounded-full bg-primary shadow-xl flex items-center justify-center active:scale-95 transition-transform"
          style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <span className="text-white text-[22px] font-bold">W</span>
        </button>
      )}

      {/* Demo mode button */}
      {isDemoMode && step === "idle" && (
        <button
          onClick={beginListening}
          className="absolute left-4 z-30 px-4 h-10 rounded-full bg-black/70 border border-white/20 text-white text-[12px] font-semibold flex items-center gap-1.5"
          style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
          ▶ Demo
        </button>
      )}

      {/* Voice overlay */}
      {(step === "listening" || step === "results" || step === "reserving") && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30" onClick={reset} />
          <div className="absolute inset-x-0 bottom-0 z-40 bg-background rounded-t-3xl border-t border-border shadow-2xl bottom-sheet-enter" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <div className="px-5 pb-6">

              {step === "listening" && (
                <div className="flex flex-col items-center py-8 gap-4">
                  <div className="flex items-end gap-1 h-12">
                    {[24, 36, 48, 40, 28, 44, 32, 48, 36, 24].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-primary animate-pulse"
                        style={{ height: h, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-[17px] font-semibold text-foreground">Listening…</p>
                  {transcript ? (
                    <p className="text-[14px] text-primary font-medium">"{transcript}"</p>
                  ) : (
                    <p className="text-[13px] text-muted">Say what you need along your route</p>
                  )}
                </div>
              )}

              {step === "results" && (
                <>
                  <div className="mb-4">
                    <p className="text-[13px] text-muted mb-0.5">Found along your route</p>
                    <p className="text-[20px] font-bold text-foreground">Bosch Screwdriver Set</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {DEMO_RESULTS.map((result) => (
                      <button
                        key={result.store}
                        onClick={() => handleSelectStore(result.store)}
                        className="flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-surface text-left active:opacity-80 transition-opacity"
                      >
                        <StoreLogo name={result.store} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold text-foreground">{result.store}</p>
                          <p className="text-[12px] text-muted mt-0.5">
                            +{result.detourMinutes} min detour · {result.stock} in stock
                          </p>
                        </div>
                        <p className="text-[16px] font-bold text-foreground shrink-0">
                          €{result.price.toFixed(2)}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-[12px] text-muted">
                      {transcript ? `Heard: "${transcript}" — say a store name` : "Say a store name…"}
                    </p>
                  </div>
                </>
              )}

              {step === "reserving" && selectedStore && (
                <div className="flex flex-col items-center py-6 gap-4">
                  <StoreLogo name={selectedStore} size="md" />
                  <div className="text-center">
                    <p className="text-[17px] font-semibold text-foreground">{selectedStore}</p>
                    <p className="text-[13px] text-muted mt-1">Bosch Screwdriver Set 42pc · €{DEMO_RESULTS.find((r) => r.store === selectedStore)?.price.toFixed(2)}</p>
                  </div>
                  {transcript ? (
                    <p className="text-[14px] text-primary font-medium">"{transcript}"</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <p className="text-[13px] text-muted">Say "reserve" or "directions"</p>
                    </div>
                  )}
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => doReserve(selectedStore)}
                      className="flex-1 py-3 rounded-2xl bg-primary text-white text-[14px] font-semibold active:opacity-80"
                    >
                      Reserve
                    </button>
                    <button
                      onClick={() => setStep("done")}
                      className="flex-1 py-3 rounded-2xl border border-border text-[14px] font-medium text-foreground active:opacity-80"
                    >
                      Directions
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}

      {/* TTS subtitle — visible when speaking, great for screen mirroring */}
      {speaking && (
        <div className="absolute bottom-32 inset-x-0 z-50 mx-6 pointer-events-none" style={{ bottom: "calc(8rem + env(safe-area-inset-bottom, 0px))" }}>
          <p className="text-center text-white text-[13px] font-medium bg-black/70 rounded-2xl px-4 py-2.5 leading-snug">
            {speaking}
          </p>
        </div>
      )}

      {/* Reservation confirmation */}
      <ReservationConfirm
        reservation={step === "confirmed" ? reservation : null}
        onClose={handleConfirmClose}
      />
    </div>
  );
}

export default function DemoPage() {
  return (
    <ReservationProvider>
      <Suspense>
        <DemoContent />
      </Suspense>
    </ReservationProvider>
  );
}
