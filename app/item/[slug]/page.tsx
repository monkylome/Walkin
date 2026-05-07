"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Hammer, Zap, Wrench, Shirt, Package, type LucideIcon } from "lucide-react";
import { itemBySlug } from "@/app/lib/items";

const categoryIcon: Record<string, LucideIcon> = {
  Tools:       Hammer,
  Electronics: Zap,
  Hardware:    Wrench,
  Apparel:     Shirt,
  Other:       Package,
};

const categoryAccent: Record<string, string> = {
  Tools:       "bg-blue-100 text-blue-700",
  Electronics: "bg-sky-100 text-sky-700",
  Hardware:    "bg-slate-100 text-slate-600",
  Apparel:     "bg-violet-100 text-violet-600",
  Other:       "bg-gray-100 text-gray-600",
};

export default function ItemPage() {
  const { slug } = useParams<{ slug: string }>();
  const router   = useRouter();
  const item     = itemBySlug(slug);
  const Icon     = item ? (categoryIcon[item.category] ?? Package) : Package;

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh bg-background gap-3">
        <p className="text-[17px] font-semibold text-foreground">Item not found</p>
        <button onClick={() => router.back()} className="text-[14px] text-primary font-medium">Go back</button>
      </div>
    );
  }

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

      {/* Hero placeholder */}
      <div className="mx-5 mb-6 h-52 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted">
        <Icon size={56} strokeWidth={1.2} />
      </div>

      {/* Item identity */}
      <div className="px-5 pb-7">
        <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${categoryAccent[item.category] ?? categoryAccent.Other}`}>
          {item.category}
        </span>
        <h1 className="text-[26px] font-bold tracking-tight text-foreground leading-tight mb-1">
          {item.name}
        </h1>
        <p className="text-[14px] text-muted">
          Available at {item.stores.length} {item.stores.length === 1 ? "store" : "stores"} nearby
        </p>
      </div>

      {/* Store list */}
      <div className="px-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
          Where to get it
        </p>
        <div className="flex flex-col gap-3">
          {item.stores.map((store, i) => (
            <div key={store.name} className="p-4 rounded-2xl border border-border bg-surface">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Rank badge */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                    i === 0 ? "bg-primary text-white" : "bg-background border border-border text-muted"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{store.name}</p>
                    <p className="text-[12px] text-muted mt-0.5">{store.walkTime} walk · {store.distance}</p>
                  </div>
                </div>
                <Link
                  href="/map"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-[13px] font-semibold active:opacity-80 transition-opacity"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Map
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
