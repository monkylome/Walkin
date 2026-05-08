"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Hammer, Zap, Wrench, Shirt, Package, type LucideIcon } from "lucide-react";
import {
  storeBySlug,
  storeMeta,
  toSlug,
  stockStatus,
  stockLabel,
  stockDot,
} from "@/app/lib/items";

const categoryIcon: Record<string, LucideIcon> = {
  Tools:       Hammer,
  Electronics: Zap,
  Hardware:    Wrench,
  Apparel:     Shirt,
  Other:       Package,
};

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

  const meta        = storeMeta[store.name] ?? { initials: store.name.slice(0, 2).toUpperCase(), color: "bg-muted", category: "" };
  const inStockCount = store.inventory.filter((e) => e.stock > 0).length;

  return (
    <div className="flex flex-col min-h-dvh bg-background pb-12">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-border text-foreground shrink-0 active:opacity-60 transition-opacity"
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
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
        <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 bg-surface border border-border text-muted">
          {store.category}
        </span>
        <h1 className="text-[26px] font-bold tracking-tight text-foreground leading-tight mb-4">
          {store.name}
        </h1>

        {/* Distance chips */}
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-foreground">{store.distance}</p>
              <p className="text-[11px] text-muted">away</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-foreground">{store.walkTime}</p>
              <p className="text-[11px] text-muted">walk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="px-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
          Inventory · {inStockCount} of {store.inventory.length} in stock
        </p>
        <div className="flex flex-col gap-3">
          {store.inventory.map(({ item, stock, price }) => {
            const status = stockStatus(stock);
            const Icon   = categoryIcon[item.category] ?? Package;
            return (
              <Link
                key={item.name}
                href={`/item/${toSlug(item.name)}`}
                className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-surface active:opacity-70 transition-opacity"
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 text-muted">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${stockDot[status]}`} />
                    <span className="text-[12px] text-muted">{stockLabel[status]}{stock > 0 ? ` · ${stock} left` : ""}</span>
                  </div>
                </div>
                <p className="text-[17px] font-bold text-foreground shrink-0">€{price.toFixed(2)}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Get directions */}
      <div className="px-5 pt-6">
        <Link
          href="/map"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-[15px] active:opacity-80 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Get directions
        </Link>
      </div>

    </div>
  );
}
