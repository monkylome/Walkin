"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { allItems, storeMeta, toStoreSlug } from "@/app/lib/items";
import { iconFor } from "@/app/lib/categories";
import { useNeighborhood } from "@/app/lib/use-neighborhood";
import { useAuth } from "@/app/lib/auth";
import { useReservations } from "@/app/lib/reservations";
import StoreLogo from "@/app/components/store-logo";
import { SearchIcon } from "@/app/components/icons";
import { Pill, Wrench, Zap, Hammer, MoreHorizontal, MapPin, MapPinOff } from "lucide-react";

const categoryRow = [
  { label: "Medicine", icon: Pill, href: "/search?category=Medicine" },
  { label: "Tools", icon: Wrench, href: "/search?category=Tools" },
  { label: "Electronics", icon: Zap, href: "/search?category=Electronics" },
  { label: "Hardware", icon: Hammer, href: "/search?category=Hardware" },
  { label: "More", icon: MoreHorizontal, href: "/search" },
];

const placeholders = [
  "Paracetamol, charger, drill bit…",
  "HDMI cable, batteries, tape…",
  "Screwdriver, power bank, glue…",
  "Light bulb, padlock, earbuds…",
];

const nearbyStores = Object.entries(storeMeta).map(([name, meta]) => {
  const storeItems = allItems.filter(i => i.stores.some(s => s.name === name));
  const first = storeItems.flatMap(i => i.stores).find(s => s.name === name);
  const categories = [...new Set(storeItems.map(i => i.category))];
  return {
    name,
    category: meta.category,
    distance: first?.distance ?? "",
    walkTime: first?.walkTime ?? "",
    itemCount: storeItems.length,
    categories,
  };
}).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

export default function HomePage() {
  const { name: neighborhood, denied, retry } = useNeighborhood();
  const { user } = useAuth();
  const { active } = useReservations();
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % placeholders.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-background pb-28">

      {/* Hero section */}
      <div className="px-5 pt-safe pb-8">
        {/* Location */}
        <div className="flex items-center justify-between mb-8">
          {denied ? (
            <button onClick={retry} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 active:opacity-70 transition-opacity">
              <MapPinOff size={14} className="text-red-400" />
              <span className="text-[13px] text-red-400 font-medium">Enable location</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border">
              <MapPin size={14} className="text-primary" />
              <span className="text-[13px] text-foreground font-medium">{neighborhood}</span>
            </div>
          )}
          <Link href="/(tabs)/profile" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-[12px] font-bold text-white select-none">
            {initials}
          </Link>
        </div>

        {/* Headline */}
        <h1 className="text-[28px] font-bold tracking-tight text-foreground leading-tight mb-6">
          Find it nearby,<br />get it now.
        </h1>

        {/* Search bar — hero */}
        <Link href="/search" className="block">
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-surface border border-border shadow-sm">
            <SearchIcon className="text-muted shrink-0" />
            <span key={placeholderIdx} className="text-[16px] text-muted flex-1 placeholder-fade">{placeholders[placeholderIdx]}</span>
          </div>
        </Link>

        {/* Category icons */}
        <div className="flex justify-between mt-6 px-2">
          {categoryRow.map(({ label, icon: Icon, href }) => (
            <Link key={label} href={href} className="flex flex-col items-center gap-2 active:opacity-60 transition-opacity">
              <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-foreground">
                <Icon size={22} strokeWidth={1.6} />
              </div>
              <span className="text-[11px] font-medium text-muted">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-5" />

      {/* Active reservations */}
      {active.length > 0 && (
        <div className="px-5 pt-6 pb-4">
          <span className="text-[13px] font-semibold text-foreground mb-3 block">Active reservations</span>
          <div className="flex flex-col gap-2.5">
            {active.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-emerald-600">{r.code.slice(0, 3)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground truncate">{r.itemName}</p>
                  <p className="text-[12px] text-muted mt-0.5">{r.storeName} · {r.method === "pay_now" ? "Paid" : "Pay at store"}</p>
                </div>
                <span className="text-[13px] font-semibold text-emerald-600 shrink-0">€{r.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Near you */}
      <div className="px-5 pt-6 pb-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-semibold text-foreground">Near you</span>
          <Link href="/stores" className="text-[13px] font-medium text-primary">Map</Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {nearbyStores.map((store) => (
            <Link key={store.name} href={`/store/${toStoreSlug(store.name)}`} className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface border border-border active:opacity-70 transition-opacity">
              <StoreLogo name={store.name} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-foreground truncate leading-tight">{store.name}</p>
                <div className="flex items-center gap-1 mt-1 text-muted">
                  {store.categories.map((cat) => {
                    const Icon = iconFor(cat);
                    return <Icon key={cat} size={12} strokeWidth={2} className="text-foreground" />;
                  })}
                  <span className="text-[11px]">·</span>
                  <span className="text-[11px] truncate">{store.categories.join(", ")}</span>
                  <span className="text-[11px]">·</span>
                  <span className="text-[11px] shrink-0">{store.itemCount} items</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-semibold text-foreground">{store.distance}</p>
                <p className="text-[11px] text-muted">{store.walkTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
