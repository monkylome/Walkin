"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { allItems, toSlug, stockStatus } from "@/app/lib/items";
import { iconFor, accentFor } from "@/app/lib/categories";
import EmptyState from "@/app/components/empty-state";
import {
  SearchIcon,
  XCircleIcon,
  ChevronLeftIcon,
} from "@/app/components/icons";

const categories = ["All", "Tools", "Electronics", "Hardware", "Apparel"];

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  const q = query.trim().toLowerCase();
  const filteredItems = allItems.filter((item) => {
    const matchesCat   = activeCategory === "All" || item.category === activeCategory;
    const matchesQuery = q === "" || item.name.toLowerCase().includes(q) ||
      item.stores.some(s => s.name.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-col h-dvh bg-background search-slide-up">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-safe pb-3 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-foreground shrink-0 active:opacity-60 transition-opacity"
          aria-label="Go back"
        >
          <ChevronLeftIcon />
        </button>

        <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-surface border border-border">
          <SearchIcon className="text-muted shrink-0" />
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
              <XCircleIcon />
            </button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 px-5 pb-3 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
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

      <div className="h-px bg-border mx-5 shrink-0" />

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={<SearchIcon size={40} strokeWidth={1.4} />}
            title="No results"
            subtitle="Try a different search or category"
          />
        ) : (
          <div className="px-5 pt-4 pb-10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden divide-y divide-border">
              {filteredItems.map((item) => {
                const nearest = item.stores[0];
                const extra   = item.stores.length - 1;
                const Icon = iconFor(item.category);
                return (
                  <Link key={item.name} href={`/item/${toSlug(item.name)}`} className="flex items-center gap-3 px-4 py-3.5 active:opacity-70 transition-opacity">
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
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${accentFor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
