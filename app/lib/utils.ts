import type { StockStatus, StoreSummary } from "./types";
import { allItems, storeMeta, storeLocations } from "./data";

export function directionsUrl(storeName: string) {
  const loc = storeLocations[storeName];
  const q = loc ? `${loc.lat},${loc.lng}` : encodeURIComponent(`${storeName}, Athens`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

export function stockStatus(stock: number): StockStatus {
  if (stock === 0) return "out_of_stock";
  if (stock <= 3)  return "low_stock";
  return "in_stock";
}

export const stockLabel: Record<StockStatus, string> = {
  in_stock:     "In stock",
  low_stock:    "Low stock",
  out_of_stock: "Out of stock",
};

export const stockDot: Record<StockStatus, string> = {
  in_stock:     "bg-emerald-500",
  low_stock:    "bg-amber-400",
  out_of_stock: "bg-amber-400",
};

export function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function itemBySlug(slug: string) {
  return allItems.find((item) => toSlug(item.name) === slug) ?? null;
}

export function toStoreSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function storeBySlug(slug: string): StoreSummary | null {
  const name = Object.keys(storeMeta).find((n) => toStoreSlug(n) === slug);
  if (!name) return null;

  const meta = storeMeta[name];
  const inventory: StoreSummary["inventory"] = [];
  let distance = "";
  let distanceKm = 0;
  let walkTime = "";

  for (const item of allItems) {
    const entry = item.stores.find((s) => s.name === name);
    if (entry) {
      inventory.push({ item, stock: entry.stock, price: entry.price });
      distance = entry.distance;
      distanceKm = entry.distanceKm;
      walkTime = entry.walkTime;
    }
  }

  return { name, category: meta.category, distance, distanceKm, walkTime, inventory };
}
