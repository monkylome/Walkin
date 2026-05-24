"use client";

import { useState } from "react";
import { type PaymentMethod } from "@/app/lib/reservations";
import { Store, CreditCard, X } from "lucide-react";

type Props = {
  open: boolean;
  itemName: string;
  storeName: string;
  price: number;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
};

export default function ReserveSheet({ open, itemName, storeName, price, onClose, onConfirm }: Props) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl border-t border-border bottom-sheet-enter" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-foreground">Reserve item</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-muted">
              <X size={16} />
            </button>
          </div>

          <p className="text-[13px] text-muted mb-5">
            <span className="font-semibold text-foreground">{itemName}</span> at {storeName} · €{price.toFixed(2)}
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => setSelected("at_store")}
              className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-colors text-left ${
                selected === "at_store" ? "border-primary bg-primary/5" : "border-border bg-surface"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected === "at_store" ? "bg-primary text-white" : "bg-background border border-border text-muted"}`}>
                <Store size={18} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">Pay at store</p>
                <p className="text-[12px] text-muted mt-0.5">Reserve for 30 min, pay when you arrive</p>
              </div>
            </button>

            <button
              onClick={() => setSelected("pay_now")}
              className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-colors text-left ${
                selected === "pay_now" ? "border-primary bg-primary/5" : "border-border bg-surface"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected === "pay_now" ? "bg-primary text-white" : "bg-background border border-border text-muted"}`}>
                <CreditCard size={18} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">Pay now & pick up</p>
                <p className="text-[12px] text-muted mt-0.5">Pay online, item is ready when you arrive</p>
              </div>
            </button>
          </div>

          <button
            disabled={!selected}
            onClick={() => selected && onConfirm(selected)}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-[16px] active:opacity-80 transition-opacity disabled:opacity-40"
          >
            {selected === "pay_now" ? `Pay €${price.toFixed(2)} & reserve` : "Reserve now"}
          </button>
        </div>
      </div>
    </>
  );
}
