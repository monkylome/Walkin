"use client";

import { createContext, useContext, useCallback, useState, useEffect, useSyncExternalStore } from "react";

export type PaymentMethod = "at_store" | "pay_now";

export type Reservation = {
  id: string;
  itemName: string;
  storeName: string;
  price: number;
  method: PaymentMethod;
  code: string;
  expiresAt: number;
  createdAt: number;
};

const STORAGE_KEY = "walkin_reservations";

const listeners = new Set<() => void>();
function notify() { listeners.forEach(cb => cb()); }

function read(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(reservations: Reservation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  notify();
}

function generateCode(): string {
  return String(Math.floor(Math.random() * 900) + 100);
}

let cached: Reservation[] = [];
let cachedRaw: string | null = null;

function getSnapshot(): Reservation[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = raw ? JSON.parse(raw) : [];
  }
  return cached;
}

const EMPTY: Reservation[] = [];

const store = {
  subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; },
  getSnapshot,
  getServerSnapshot(): Reservation[] { return EMPTY; },
};

const ReservationContext = createContext<{
  reservations: Reservation[];
  reserve: (item: string, store: string, price: number, method: PaymentMethod) => Reservation;
  cancel: (id: string) => void;
  active: Reservation[];
}>({ reservations: [], reserve: () => null!, cancel: () => {}, active: [] });

export function useReservations() {
  return useContext(ReservationContext);
}

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const reservations = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const reserve = useCallback((itemName: string, storeName: string, price: number, method: PaymentMethod): Reservation => {
    const r: Reservation = {
      id: crypto.randomUUID(),
      itemName,
      storeName,
      price,
      method,
      code: generateCode(),
      expiresAt: Date.now() + 3 * 60 * 1000, // 3 min for demo
      createdAt: Date.now(),
    };
    write([r, ...read()]);
    return r;
  }, []);

  const cancel = useCallback((id: string) => {
    write(read().filter(r => r.id !== id));
  }, []);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const active = reservations.filter(r => r.expiresAt > now);

  return (
    <ReservationContext.Provider value={{ reservations, reserve, cancel, active }}>
      {children}
    </ReservationContext.Provider>
  );
}
