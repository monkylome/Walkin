"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { allItems } from "@/app/lib/items";
import EmptyState from "@/app/components/empty-state";
import ItemCard from "@/app/components/item-card";
import {
  SearchIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ClockIcon,
} from "@/app/components/icons";

const HISTORY_KEY = "search_history";
const MAX_HISTORY = 8;

function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
  catch { return []; }
}

function addToHistory(term: string) {
  const h = getHistory().filter(t => t !== term);
  h.unshift(term);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)));
}

function removeFromHistory(term: string) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(t => t !== term)));
}

const categories = ["All", "Medicine", "Tools", "Electronics", "Hardware"];

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const paramCat = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(
    paramCat && categories.includes(paramCat) ? paramCat : "All"
  );
  const [history, setHistory] = useState<string[]>(getHistory);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;
  const hasCategoryFilter = activeCategory !== "All";

  const filteredItems = (hasQuery || hasCategoryFilter)
    ? allItems.filter((item) => {
        const matchesCat = activeCategory === "All" || item.category === activeCategory;
        const matchesQuery = !hasQuery || item.name.toLowerCase().includes(q) ||
          item.stores.some(s => s.name.toLowerCase().includes(q));
        return matchesCat && matchesQuery;
      })
    : [];

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

      {/* Results / History */}
      <div className="flex-1 overflow-y-auto">
        {!hasQuery && !hasCategoryFilter ? (
          history.length === 0 ? (
            <EmptyState
              icon={<SearchIcon size={40} strokeWidth={1.4} />}
              title="Search for items"
              subtitle="Find products across nearby stores"
            />
          ) : (
            <div className="px-5 pt-4 pb-10">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">Recent searches</p>
              <div className="flex flex-col gap-1">
                {history.map((term) => (
                  <div key={term} className="flex items-center gap-3">
                    <button
                      onClick={() => setQuery(term)}
                      className="flex-1 flex items-center gap-3 py-2.5 active:opacity-60 transition-opacity text-left min-w-0"
                    >
                      <ClockIcon size={16} className="text-muted shrink-0" />
                      <span className="text-[15px] text-foreground truncate">{term}</span>
                    </button>
                    <button
                      onClick={() => { removeFromHistory(term); setHistory(getHistory()); }}
                      className="text-muted active:text-foreground p-1 shrink-0"
                      aria-label={`Remove ${term}`}
                    >
                      <XCircleIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : filteredItems.length === 0 ? (
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
            <div className="flex flex-col gap-3">
              {filteredItems.map((item) => {
                const nearest = item.stores[0];
                const extra = item.stores.length - 1;
                const sub = `${nearest.name} · ${nearest.distance}${extra > 0 ? ` +${extra} more` : ""}`;
                return (
                  <ItemCard
                    key={item.name}
                    item={item}
                    subtitle={sub}
                    price={Math.min(...item.stores.map(s => s.price))}
                    stock={nearest.stock}
                    showCategory
                    onClick={() => addToHistory(query.trim())}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
