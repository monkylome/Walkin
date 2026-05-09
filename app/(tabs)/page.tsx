"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Hammer, Zap, Wrench, Shirt, Package, type LucideIcon } from "lucide-react";
import { allItems, toSlug, toStoreSlug, stockStatus, type Item } from "@/app/lib/items";

const categoryIcon: Record<string, LucideIcon> = {
  Tools:       Hammer,
  Electronics: Zap,
  Hardware:    Wrench,
  Apparel:     Shirt,
  Other:       Package,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const categoryAccent: Record<string, string> = {
  Tools:       "bg-blue-100 text-blue-700",
  Electronics: "bg-sky-100 text-sky-700",
  Hardware:    "bg-slate-100 text-slate-600",
  Apparel:     "bg-violet-100 text-violet-600",
  Other:       "bg-gray-100 text-gray-600",
};


const featuredItems = allItems.slice(0, 4);

const categories = ["All", "Tools", "Electronics", "Hardware", "Apparel"];

const nearbyStores = [
  { name: "Papageorgiou Hardware", category: "Hardware",    distance: "0.3 km", walkTime: "4 min",  itemCount: 8  },
  { name: "TechStop Kolonaki",     category: "Electronics", distance: "0.7 km", walkTime: "9 min",  itemCount: 24 },
  { name: "ProBuild Supplies",     category: "Tools",       distance: "1.2 km", walkTime: "15 min", itemCount: 15 },
];

function ItemRow({ item }: { item: Item }) {
  const nearest = item.stores[0];
  const extra   = item.stores.length - 1;
  const Icon    = categoryIcon[item.category] ?? Package;
  return (
    <Link href={`/item/${toSlug(item.name)}`} className="flex items-center gap-3 px-4 py-3.5 active:opacity-70 transition-opacity">
      <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 text-muted">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{item.name}</p>
        <p className="text-[12px] text-muted mt-0.5 truncate">
          {nearest.name} · {nearest.distance}
          {extra > 0 && <span className="text-primary"> +{extra} store{extra > 1 ? "s" : ""}</span>}
        </p>
        {stockStatus(nearest.stock) === "low_stock" && (
          <p className="text-[11px] font-medium text-amber-600 mt-0.5">Low stock</p>
        )}
        {stockStatus(nearest.stock) === "out_of_stock" && (
          <p className="text-[11px] font-medium text-amber-600 mt-0.5">Not available at nearest</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <p className="text-[15px] font-bold text-foreground">€{Math.min(...item.stores.map(s => s.price)).toFixed(2)}</p>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${categoryAccent[item.category] ?? categoryAccent.Other}`}>
          {item.category}
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [searchActive, setSearchActive]     = useState(false);
  const [query, setQuery]                   = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  function openSearch() {
    setSearchActive(true);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  function closeSearch() {
    setSearchActive(false);
    setQuery("");
    setActiveCategory("All");
  }

  const q = query.trim().toLowerCase();
  const filteredItems = allItems.filter((item) => {
    const matchesCat   = activeCategory === "All" || item.category === activeCategory;
    const matchesQuery = q === "" || item.name.toLowerCase().includes(q) ||
      item.stores.some(s => s.name.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  /* ── Search mode ──────────────────────────────────────── */
  if (searchActive) {
    return (
      <div className="flex flex-col h-full bg-background">

        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 pt-safe pb-3 shrink-0">
          <button
            onClick={closeSearch}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border text-foreground shrink-0 active:opacity-60 transition-opacity"
            aria-label="Close search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-surface border border-border">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items…"
              className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted outline-none min-w-0"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted active:text-foreground transition-colors shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6m0-6 6 6" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="h-px bg-border mx-4 shrink-0" />

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 pb-16">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-border">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
              </svg>
              <p className="text-[15px] font-medium text-foreground">No results</p>
              <p className="text-[13px] text-muted">Try a different search or category</p>
            </div>
          ) : (
            <div className="px-4 pt-4 pb-28">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden divide-y divide-border">
                {filteredItems.map((item) => (
                  <ItemRow key={item.name} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    );
  }

  /* ── Home mode ────────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-full bg-background pb-28">

      {/* Header */}
      <div className="px-5 pt-safe pb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="text-muted">
                <path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 3.85 5.5 7.5 5.5 7.5S11 9.35 11 5.5C11 2.46 8.54 0 5.5 0zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor" />
              </svg>
              <span className="text-[13px] text-muted font-medium">Kolonaki, Athens</span>
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-tight">
              {getGreeting()}
            </h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-[13px] font-semibold text-muted select-none">
            A
          </div>
        </div>

        {/* Search bar */}
        <button onClick={openSearch} className="w-full text-left">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface border border-border">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-[14px] text-muted flex-1">Drill, HDMI cable, screwdriver…</span>
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Categories */}
      <div className="pb-6">
        <div className="px-5 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Browse</span>
        </div>
        <div className="flex gap-2 px-5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {["Tools", "Electronics", "Hardware", "Apparel", "Other"].map((label, i) => (
            <button
              key={label}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors border ${
                i === 0
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Items */}
      <div className="pb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Available nearby</span>
          <button className="text-[13px] font-medium text-primary">See all</button>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {featuredItems.map((item) => {
            const nearest = item.stores[0];
            const extra   = item.stores.length - 1;
            const Icon = categoryIcon[item.category] ?? Package;
            return (
              <Link key={item.name} href={`/item/${toSlug(item.name)}`} className="shrink-0 w-44 p-3.5 rounded-2xl border border-border bg-surface active:opacity-80 transition-opacity block">
                <div className="w-full h-24 rounded-xl bg-background border border-border flex items-center justify-center mb-3 text-muted">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2.5 ${categoryAccent[item.category] ?? categoryAccent.Other}`}>
                  {item.category}
                </span>
                <p className="text-[14px] font-semibold text-foreground leading-snug mb-1">{item.name}</p>
                <p className="text-[12px] text-muted truncate">{nearest.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[12px] font-medium text-primary">{nearest.distance}</p>
                  {extra > 0 && <p className="text-[11px] text-muted">+{extra} more</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Nearby Stores */}
      <div className="px-5 pb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Stores near you</span>
          <button className="text-[13px] font-medium text-primary">See all</button>
        </div>
        <div className="flex flex-col gap-3">
          {nearbyStores.map((store) => (
            <Link key={store.name} href={`/store/${toStoreSlug(store.name)}`} className="flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-surface active:opacity-80 transition-opacity block">
              <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{store.name}</p>
                <p className="text-[12px] text-muted mt-0.5">{store.category} · {store.itemCount} items listed</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-semibold text-foreground">{store.distance}</p>
                <p className="text-[11px] text-muted mt-0.5">{store.walkTime} walk</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
