"use client";

import { useState } from "react";
import Link from "next/link";
import { allItems, storeLocations, storeMeta, toStoreSlug } from "@/app/lib/items";
import MapView, { type MapPoint } from "@/app/components/map-view";
import BottomSheet, { type SheetStore } from "@/app/components/bottom-sheet";
import EmptyState from "@/app/components/empty-state";
import StoreLogo from "@/app/components/store-logo";
import { SearchIcon, XCircleIcon } from "@/app/components/icons";

type StoreEntry = {
  name: string;
  category: string;
  initials: string;
  accentClass: string;
  distance: string;
  walkTime: string;
  items: { name: string; stock: number }[];
};

function buildStores(): StoreEntry[] {
  return Object.keys(storeMeta).map((name) => {
    const meta = storeMeta[name];
    let distance = "";
    let walkTime = "";
    const items: { name: string; stock: number }[] = [];
    for (const item of allItems) {
      const entry = item.stores.find((s) => s.name === name);
      if (entry) {
        items.push({ name: item.name, stock: entry.stock });
        distance = entry.distance;
        walkTime = entry.walkTime;
      }
    }
    return {
      name,
      category: meta.category,
      initials: meta.initials,
      accentClass: meta.color,
      distance,
      walkTime,
      items,
    };
  });
}

export default function StoresPage() {
  const [view, setView] = useState<"map" | "list">("map");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const stores = buildStores();

  const categorySet = new Set<string>();
  for (const s of stores) categorySet.add(s.category);
  const categories = ["All", ...Array.from(categorySet)];

  const q = query.trim().toLowerCase();
  const filteredStores = stores.filter((s) => {
    const matchesCat = activeCategory === "All" || s.category === activeCategory;
    const matchesQuery =
      q === "" ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.items.some((i) => i.name.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const effectiveSelectedId =
    selectedStoreId && filteredStores.some((s) => s.name === selectedStoreId)
      ? selectedStoreId
      : null;

  const points: MapPoint[] = filteredStores.map((s) => ({
    kind: "store" as const,
    id: s.name,
    position: storeLocations[s.name] ?? { lat: 37.9775, lng: 23.7400 },
    initials: s.initials,
    accentClass: s.accentClass,
    featured: storeMeta[s.name]?.featured ?? false,
  }));

  let selectedSheet: SheetStore | null = null;
  if (effectiveSelectedId) {
    const s = stores.find((x) => x.name === effectiveSelectedId);
    if (s) {
      selectedSheet = {
        id: 0,
        name: s.name,
        category: s.category,
        distance: s.distance,
        walkTime: s.walkTime,
        caption: `${s.items.length} item${s.items.length !== 1 ? "s" : ""} listed`,
        verified: storeMeta[s.name]?.verified ?? false,
      };
    }
  }

  // Shared control fragments — `pointer-events-auto` lets taps pass through the
  // empty padding of the floating overlay to the map below.

  const searchRow = (
    <div className="flex items-center gap-2">
      <div className="pointer-events-auto flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-surface border border-border shadow-sm">
        <SearchIcon className="text-muted shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stores or items…"
          className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted outline-none min-w-0"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-muted active:text-foreground transition-colors shrink-0"
            aria-label="Clear search"
          >
            <XCircleIcon />
          </button>
        )}
      </div>

      <div className="flex gap-1.5 shrink-0 pointer-events-auto">
        <button
          onClick={() => setView("map")}
          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shadow-sm ${
            view === "map"
              ? "bg-primary text-white border-primary"
              : "bg-background text-muted border-border"
          }`}
          aria-label="Map view"
          aria-pressed={view === "map"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
        </button>
        <button
          onClick={() => setView("list")}
          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shadow-sm ${
            view === "list"
              ? "bg-primary text-white border-primary"
              : "bg-background text-muted border-border"
          }`}
          aria-label="List view"
          aria-pressed={view === "list"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );

  const chips = categories.map((cat) => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={`pointer-events-auto shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors shadow-sm ${
        activeCategory === cat
          ? "bg-primary text-white border-primary"
          : "bg-background text-foreground border-border"
      }`}
    >
      {cat}
    </button>
  ));

  if (view === "map") {
    return (
      <div className="relative h-dvh overflow-hidden bg-background">
        <div className="absolute inset-0">
          <MapView
            points={points}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedStoreId}
            onMapClick={() => setSelectedStoreId(null)}
          />
        </div>

        {/* Floating header — no background, controls float as pills */}
        <div className="absolute inset-x-0 top-0 z-30 pt-safe pointer-events-none">
          <div className="px-5 pb-3">{searchRow}</div>
          <div
            className="flex gap-2 px-5 pb-3 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {chips}
          </div>
        </div>

        {filteredStores.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-background border border-border text-[12px] font-medium text-muted shadow-md z-20">
            No stores match
          </div>
        )}

        <BottomSheet store={selectedSheet} onClose={() => setSelectedStoreId(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-background">
      <div className="px-5 pt-safe pb-3 shrink-0">{searchRow}</div>
      <div
        className="flex gap-2 px-5 pb-3 overflow-x-auto shrink-0"
        style={{ scrollbarWidth: "none" }}
      >
        {chips}
      </div>

      <div className="flex-1 relative overflow-hidden">
        {filteredStores.length === 0 ? (
          <EmptyState
            icon={<SearchIcon size={40} strokeWidth={1.4} />}
            title="No stores found"
            subtitle="Try a different search or filter"
          />
        ) : (
          <div className="absolute inset-0 overflow-y-auto px-5 pt-1 pb-28">
            <div className="flex flex-col gap-3">
              {filteredStores.map((store) => (
                <Link
                  key={store.name}
                  href={`/store/${toStoreSlug(store.name)}`}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-surface active:opacity-80 transition-opacity"
                >
                  <StoreLogo name={store.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{store.name}</p>
                    <p className="text-[12px] text-muted mt-0.5 truncate">
                      {store.category} · {store.items.length} item{store.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-semibold text-foreground">{store.distance}</p>
                    <p className="text-[11px] text-muted mt-0.5">{store.walkTime} walk</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
