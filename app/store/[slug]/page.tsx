"use client";

import { useParams, useRouter } from "next/navigation";
import {
  storeBySlug,
  storeMeta,
  directionsUrl,
} from "@/app/lib/items";
import ItemCard from "@/app/components/item-card";
import DistanceChips from "@/app/components/distance-chips";
import { LiveBadge, FeaturedBadge, VerifiedTick } from "@/app/components/store-badges";
import {
  ChevronLeftIcon,
  MapPinFilledIcon,
} from "@/app/components/icons";

export default function StorePage() {
  const { slug } = useParams<{ slug: string }>();
  const router   = useRouter();
  const store    = storeBySlug(slug);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background gap-3">
        <p className="text-[17px] font-semibold text-foreground">Store not found</p>
        <button onClick={() => router.back()} className="text-[14px] text-primary font-medium">Go back</button>
      </div>
    );
  }

  const meta        = storeMeta[store.name] ?? { initials: store.name.slice(0, 2).toUpperCase(), color: "bg-muted", category: "", verified: false, featured: false };
  const inStockCount = store.inventory.filter((e) => e.stock > 0).length;

  return (
    <div className="flex flex-col min-h-dvh bg-background pb-12">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pb-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border text-foreground shrink-0 active:opacity-60 transition-opacity"
          aria-label="Go back"
        >
          <ChevronLeftIcon />
        </button>
      </div>

      {/* Hero */}
      <div className="mx-5 mb-6 h-40 rounded-2xl bg-surface border border-border flex items-center justify-center">
        <div className={`w-20 h-20 rounded-2xl ${meta.color} flex items-center justify-center`}>
          <span className="text-[22px] font-bold text-white tracking-wide">{meta.initials}</span>
        </div>
      </div>

      {/* Store identity */}
      <div className="px-5 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface border border-border text-muted">
            {store.category}
          </span>
          {meta.featured && <FeaturedBadge />}
          {meta.verified && <LiveBadge />}
        </div>
        <div className="mb-4 flex min-w-0 items-center gap-2">
          <h1 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
            {store.name}
          </h1>
          {meta.verified && <VerifiedTick />}
        </div>

        <DistanceChips distance={store.distance} walkTime={store.walkTime} />
      </div>

      {/* Inventory */}
      <div className="px-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
          Inventory · {inStockCount} of {store.inventory.length} in stock
        </p>
        <div className="flex flex-col gap-3">
          {store.inventory.map(({ item, stock, price }) => (
            <ItemCard
              key={item.name}
              item={item}
              subtitle={`${stock > 0 ? `${stock} left` : "Out of stock"}`}
              price={price}
              stock={stock}
            />
          ))}
        </div>
      </div>

      {/* Get directions */}
      <div className="px-5 pt-6">
        <a
          href={directionsUrl(store.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-[15px] active:opacity-80 transition-opacity"
        >
          <MapPinFilledIcon size={16} />
          Get directions
        </a>
      </div>

    </div>
  );
}
