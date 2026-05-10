"use client";

import Link from "next/link";
import { allItems, toSlug, toStoreSlug } from "@/app/lib/items";
import { iconFor, accentFor } from "@/app/lib/categories";
import { useTheme } from "@/app/components/theme-provider";
import StoreLogo from "@/app/components/store-logo";
import { MapPinSmallIcon, SearchIcon } from "@/app/components/icons";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const featuredItems = allItems.slice(0, 4);

const nearbyStores = [
  { name: "Papageorgiou Hardware", category: "Hardware",    distance: "0.3 km", walkTime: "4 min",  itemCount: 8  },
  { name: "TechStop Kolonaki",     category: "Electronics", distance: "0.7 km", walkTime: "9 min",  itemCount: 24 },
  { name: "ProBuild Supplies",     category: "Tools",       distance: "1.2 km", walkTime: "15 min", itemCount: 15 },
];

export default function HomePage() {
  const { togglePicker } = useTheme();
  return (
    <div className="flex flex-col min-h-full bg-background pb-28">

      {/* Header */}
      <div className="px-5 pt-safe pb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPinSmallIcon className="text-muted" />
              <span className="text-[13px] text-muted font-medium">Kolonaki, Athens</span>
            </div>
            <h1 onClick={togglePicker} className="text-[22px] font-semibold tracking-tight text-foreground leading-tight select-none">
              {getGreeting()}
            </h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-[13px] font-semibold text-muted select-none">
            A
          </div>
        </div>

        {/* Search bar */}
        <Link href="/search" className="block">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-surface border border-border">
            <SearchIcon className="text-muted shrink-0" />
            <span className="text-[15px] text-muted flex-1">Drill, HDMI cable, screwdriver…</span>
          </div>
        </Link>
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
            const Icon = iconFor(item.category);
            return (
              <Link key={item.name} href={`/item/${toSlug(item.name)}`} className="shrink-0 w-44 p-3.5 rounded-2xl border border-border bg-surface active:opacity-80 transition-opacity block">
                <div className="w-full h-24 rounded-xl bg-background border border-border flex items-center justify-center mb-3 text-muted">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2.5 ${accentFor(item.category)}`}>
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
          <Link href="/stores" className="text-[13px] font-medium text-primary">View map</Link>
        </div>
        <div className="flex flex-col gap-3">
          {nearbyStores.map((store) => (
            <Link key={store.name} href={`/store/${toStoreSlug(store.name)}`} className="flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-surface active:opacity-80 transition-opacity block">
              <StoreLogo name={store.name} size="md" />
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
