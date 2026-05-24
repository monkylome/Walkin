"use client";

import { useState, useEffect, useRef } from "react";
import { type Reservation, useReservations } from "@/app/lib/reservations";
import { CheckCircle, X, Clock, Loader, Package, AlertTriangle } from "lucide-react";

type Props = {
  reservation: Reservation | null;
  onClose: () => void;
};

type Stage = "confirming" | "preparing" | "ready" | "expired";

const CONFIRM_DURATION = 2000;
const PREPARE_DURATION = 4000;
const PICKUP_DURATION = 3 * 60 * 1000; // 3 min
const NUDGE_THRESHOLD = 60 * 1000; // 1 min
const EXTEND_AMOUNT = 60 * 1000; // 1 min

function formatTime(ms: number): string {
  if (ms <= 0) return "0:00";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ReservationConfirm({ reservation, onClose }: Props) {
  const { cancel } = useReservations();
  const [stage, setStage] = useState<Stage>("confirming");
  const [remaining, setRemaining] = useState(PICKUP_DURATION);
  const [extended, setExtended] = useState(false);
  const deadlineRef = useRef<number>(0);
  const prevReservationId = useRef<string | null>(null);

  // Reset stages when a new reservation comes in
  useEffect(() => {
    if (!reservation) return;
    if (reservation.id === prevReservationId.current) return;
    prevReservationId.current = reservation.id;
    setStage("confirming");
    setExtended(false);
    setRemaining(PICKUP_DURATION);

    const t1 = setTimeout(() => setStage("preparing"), CONFIRM_DURATION);
    const t2 = setTimeout(() => {
      setStage("ready");
      deadlineRef.current = Date.now() + PICKUP_DURATION;
    }, CONFIRM_DURATION + PREPARE_DURATION);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reservation]);

  // Countdown for ready stage
  useEffect(() => {
    if (stage !== "ready") return;
    const id = setInterval(() => {
      const left = Math.max(0, deadlineRef.current - Date.now());
      setRemaining(left);
      if (left <= 0) { setStage("expired"); clearInterval(id); }
    }, 1000);
    return () => clearInterval(id);
  }, [stage]);

  function handleExtend() {
    if (extended) return;
    deadlineRef.current += EXTEND_AMOUNT;
    setRemaining(Math.max(0, deadlineRef.current - Date.now()));
    setExtended(true);
  }

  if (!reservation) return null;

  const showNudge = stage === "ready" && remaining <= NUDGE_THRESHOLD && remaining > 0 && !extended;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full bg-background rounded-t-3xl border-t border-border bottom-sheet-enter" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {stage === "expired" ? (
                <AlertTriangle size={20} className="text-red-500" />
              ) : stage === "ready" ? (
                <CheckCircle size={20} className="text-emerald-500" />
              ) : (
                <Loader size={20} className="text-primary animate-spin" />
              )}
              <h2 className="text-[18px] font-bold text-foreground">
                {stage === "confirming" && "Confirming..."}
                {stage === "preparing" && "Preparing your item"}
                {stage === "ready" && "Ready for pickup!"}
                {stage === "expired" && "Time ran out"}
              </h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-muted">
              <X size={16} />
            </button>
          </div>

          {/* Stage indicator */}
          <div className="flex items-center gap-1 mb-6">
            {(["confirming", "preparing", "ready"] as const).map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  stage === "expired"
                    ? "bg-red-500/30"
                    : i <= ["confirming", "preparing", "ready"].indexOf(stage)
                      ? "bg-primary"
                      : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Ticket */}
          <div className="rounded-2xl border border-border bg-surface p-5 mb-5">
            <p className="text-[13px] text-muted mb-1">Item</p>
            <p className="text-[16px] font-semibold text-foreground mb-4">{reservation.itemName}</p>

            <p className="text-[13px] text-muted mb-1">Store</p>
            <p className="text-[16px] font-semibold text-foreground mb-4">{reservation.storeName}</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-muted mb-1">Pickup code</p>
                <p className={`text-[28px] font-bold tracking-widest ${stage === "expired" ? "text-muted line-through" : "text-primary"}`}>
                  {reservation.code}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[13px] text-muted mb-1">
                  {reservation.method === "pay_now" ? "Paid" : "Pay at store"}
                </p>
                <p className="text-[18px] font-bold text-foreground">€{reservation.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Timer / status */}
          {stage === "ready" && (
            <div className={`flex items-center justify-center gap-2 py-3 rounded-xl border mb-5 ${
              remaining <= NUDGE_THRESHOLD ? "bg-red-500/5 border-red-500/20" : "bg-surface border-border"
            }`}>
              <Clock size={16} className={remaining <= NUDGE_THRESHOLD ? "text-red-500" : "text-muted"} />
              <span className={`text-[14px] font-semibold ${remaining <= NUDGE_THRESHOLD ? "text-red-500" : "text-foreground"}`}>
                {formatTime(remaining)}
              </span>
              <span className="text-[13px] text-muted">remaining</span>
            </div>
          )}

          {(stage === "confirming" || stage === "preparing") && (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-surface border border-border mb-5">
              <Package size={16} className="text-muted" />
              <span className="text-[13px] text-muted">
                {stage === "confirming" ? "Sending to store..." : "Store is getting your item ready"}
              </span>
            </div>
          )}

          {stage === "expired" && (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/5 border border-red-500/20 mb-5">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="text-[13px] font-medium text-red-500">Reservation expired</span>
            </div>
          )}

          {/* Nudge / extend */}
          {showNudge && (
            <button
              onClick={handleExtend}
              className="w-full py-3 mb-4 rounded-2xl bg-primary text-white font-semibold text-[14px] active:opacity-80 transition-opacity"
            >
              Running out of time — extend 1 min
            </button>
          )}

          {/* Cancel */}
          {stage !== "expired" ? (
            <button
              onClick={() => { cancel(reservation.id); onClose(); }}
              className="w-full py-3 rounded-2xl border border-border text-[14px] font-medium text-muted active:opacity-70 transition-opacity"
            >
              Cancel reservation
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-foreground text-background font-semibold text-[14px] active:opacity-80 transition-opacity"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
