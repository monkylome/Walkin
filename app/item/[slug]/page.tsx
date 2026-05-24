"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Map as MapIcon, List, Package } from "lucide-react";
import {
  itemBySlug,
  storeMeta,
  toStoreSlug,
  toSlug,
  stockStatus,
  stockLabel,
  stockDot,
  directionsUrl,
  storeLocations,
} from "@/app/lib/items";
import { categoryIcon, accentFor } from "@/app/lib/categories";
import { useSavedItems } from "@/app/lib/saved-items";
import { useReservations } from "@/app/lib/reservations";
import MapView, { type MapPoint } from "@/app/components/map-view";
import BottomSheet, { type SheetStore } from "@/app/components/bottom-sheet";
import ReserveSheet from "@/app/components/reserve-sheet";
import StoreLogo from "@/app/components/store-logo";
import { VerifiedTick } from "@/app/components/store-badges";
import {
  ChevronLeftIcon,
  BookmarkIcon,
  MapPinFilledIcon,
} from "@/app/components/icons";

type ViewMode = "list" | "map";

export default function ItemPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"distance" | "price">("distance");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [reserveStore, setReserveStore] = useState<{ name: string; price: number } | null>(null);
  const { toggle, isSaved } = useSavedItems();
  const { reserve, active } = useReservations();
  const item = itemBySlug(slug);
  const Icon = item ? (categoryIcon[item.category] ?? Package) : Package;
  const saved = item ? isSaved(toSlug(item.name)) : false;

  const sortedStores = item
    ? [...item.stores].sort((a, b) =>
      sortBy === "price" ? a.price - b.price : a.distanceKm - b.distanceKm
    )
    : [];

  const mapPoints: MapPoint[] = item
    ? item.stores.map((s) => ({
      kind: "price" as const,
      id: s.name,
      position: storeLocations[s.name] ?? { lat: 38.0345, lng: 23.7530 },
      price: s.price,
      outOfStock: s.stock === 0,
      featured: storeMeta[s.name]?.featured ?? false,
    }))
    : [];

  let selectedSheet: SheetStore | null = null;
  if (item && selectedStoreId) {
    const s = item.stores.find((x) => x.name === selectedStoreId);
    if (s) {
      const meta = storeMeta[s.name];
      selectedSheet = {
        id: 0,
        name: s.name,
        category: meta?.category ?? "",
        distance: s.distance,
        walkTime: s.walkTime,
        caption: `€${s.price.toFixed(2)} · ${s.stock > 0 ? `${s.stock} left` : "Out of stock"}`,
        verified: meta?.verified ?? false,
      };
    }
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background gap-3">
        <p className="text-[17px] font-semibold text-foreground">Item not found</p>
        <button onClick={() => router.back()} className="text-[14px] text-primary font-medium">Go back</button>
      </div>
    );
  }

  const minPrice = Math.min(...item.stores.map(s => s.price));
  const maxPrice = Math.max(...item.stores.map(s => s.price));

  return (
    <div className="flex flex-col h-dvh bg-background">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pb-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border text-foreground shrink-0 active:opacity-60 transition-opacity"
          aria-label="Go back"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={() => toggle(toSlug(item.name))}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border shrink-0 active:opacity-60 transition-opacity"
          aria-label={saved ? "Unsave item" : "Save item"}
        >
          <BookmarkIcon
            size={16}
            strokeWidth={2.2}
            filled={saved}
            className={saved ? "text-primary" : "text-foreground"}
          />
        </button>
      </div>

      {/* Body */}
      {viewMode === "list" ? (
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Hero */}
          <div className="mx-5 mb-6 h-52 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted overflow-hidden">
            {item.image ? (
              <Image src={item.image} alt={item.name} width={320} height={208} className="w-full h-full object-contain" />
            ) : (
              <Icon size={56} strokeWidth={1.2} />
            )}
          </div>

          {/* Item identity */}
          <div className="px-5 pb-7">
            <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${accentFor(item.category)}`}>
              {item.category}
            </span>
            <h1 className="text-[26px] font-bold tracking-tight text-foreground leading-tight mb-1">
              {item.name}
            </h1>
            <p className="text-[14px] text-muted">
              Available at {item.stores.length} {item.stores.length === 1 ? "store" : "stores"}
            </p>
          </div>

          {/* Store list */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Where to get it</p>
              <button
                onClick={() => setSortBy(s => s === "distance" ? "price" : "distance")}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium bg-foreground text-background transition-opacity active:opacity-70"
              >
                {sortBy === "price" ? "Sort by distance" : "Sort by price"}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {sortedStores.map((store) => {
                const status = stockStatus(store.stock);
                return (
                  <div key={store.name} className="p-4 rounded-2xl border border-border bg-surface">
                    <div className="flex items-center gap-3">
                      <StoreLogo name={store.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <Link href={`/store/${toStoreSlug(store.name)}`} className="text-[15px] font-semibold text-foreground truncate leading-tight hover:text-primary transition-colors active:opacity-70">
                            {store.name}
                          </Link>
                          {storeMeta[store.name]?.verified && <VerifiedTick />}
                        </div>
                        <p className="text-[12px] text-muted mt-0.5">{store.walkTime} walk · {store.distance}</p>
                      </div>
                      <p className="text-[20px] font-bold text-foreground shrink-0">
                        €{store.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${stockDot[status]}`} />
                        <span className="text-[12px] text-muted">{stockLabel[status]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={directionsUrl(store.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-muted text-[13px] font-semibold active:opacity-80 transition-opacity shrink-0"
                        >
                          <MapPinFilledIcon />
                          Directions
                        </a>
                        {active.some(r => r.itemName === item.name && r.storeName === store.name) ? (
                          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[13px] font-semibold">Reserved</span>
                        ) : status !== "out_of_stock" && (
                          <button
                            onClick={() => setReserveStore({ name: store.name, price: store.price })}
                            className="px-3 py-1.5 rounded-full bg-primary text-white text-[13px] font-semibold active:opacity-80 transition-opacity"
                          >
                            Reserve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Slim item context strip */}
          <div className="px-5 pb-3 shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border">
              <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 text-muted">
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-foreground truncate leading-tight">{item.name}</p>
                <p className="text-[12px] text-muted mt-0.5">
                  {item.stores.length} stores · {minPrice === maxPrice ? `€${minPrice.toFixed(2)}` : `€${minPrice.toFixed(2)}–€${maxPrice.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative overflow-hidden">
            <MapView
              points={mapPoints}
              selectedId={selectedStoreId}
              onSelect={setSelectedStoreId}
              onMapClick={() => setSelectedStoreId(null)}
            />
            <BottomSheet store={selectedSheet} onClose={() => setSelectedStoreId(null)} />
          </div>
        </>
      )}

      {/* Floating list↔map toggle */}
      {!selectedStoreId && (
        <button
          onClick={() => {
            setViewMode(v => v === "list" ? "map" : "list");
            setSelectedStoreId(null);
          }}
          className="fixed left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-full bg-foreground text-background font-semibold text-[13px] shadow-xl flex items-center gap-2 active:opacity-80 transition-opacity"
          style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
        >
          {viewMode === "list" ? (
            <>
              <MapIcon size={15} strokeWidth={2.4} />
              Map
            </>
          ) : (
            <>
              <List size={15} strokeWidth={2.4} />
              List
            </>
          )}
        </button>
      )}

      {/* Reserve sheet */}
      {item && reserveStore && (
        <ReserveSheet
          open={!!reserveStore}
          itemName={item.name}
          storeName={reserveStore.name}
          price={reserveStore.price}
          onClose={() => setReserveStore(null)}
          onConfirm={(method) => {
            reserve(item.name, reserveStore.name, reserveStore.price, method);
            setReserveStore(null);
            router.push("/order");
          }}
        />
      )}

    </div>
  );
}
