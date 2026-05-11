export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type StoreAvailability = { name: string; distance: string; distanceKm: number; walkTime: string; stock: number; price: number };
export type Item = { name: string; category: string; stores: StoreAvailability[] };
export type StoreSummary = { name: string; category: string; distance: string; distanceKm: number; walkTime: string; inventory: { item: Item; stock: number; price: number }[] };

export type StoreMeta = { initials: string; color: string; category: string; verified: boolean; featured: boolean };

export const storeMeta: Record<string, StoreMeta> = {
  "Papageorgiou Hardware": { initials: "PH", color: "bg-slate-600",  category: "Hardware",         verified: true,  featured: false },
  "TechStop Kolonaki":     { initials: "TS", color: "bg-sky-600",    category: "Electronics",      verified: true,  featured: true  },
  "ProBuild Supplies":     { initials: "PS", color: "bg-blue-700",   category: "Tools",            verified: false, featured: false },
  "ElectroCity Syntagma":  { initials: "EC", color: "bg-cyan-600",   category: "Electronics",      verified: true,  featured: false },
  "CityBuild Center":      { initials: "CB", color: "bg-indigo-600", category: "Hardware & Tools", verified: false, featured: false },
};

export const storeLocations: Record<string, { lat: number; lng: number }> = {
  "Papageorgiou Hardware": { lat: 37.9792, lng: 23.7404 },
  "TechStop Kolonaki":     { lat: 37.9768, lng: 23.7432 },
  "ProBuild Supplies":     { lat: 37.9751, lng: 23.7368 },
  "ElectroCity Syntagma":  { lat: 37.9755, lng: 23.7348 },
  "CityBuild Center":      { lat: 37.9780, lng: 23.7385 },
};

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

const PH = (stock: number, price: number) => ({ name: "Papageorgiou Hardware", distance: "0.3 km", distanceKm: 0.3, walkTime: "4 min",  stock, price });
const TS = (stock: number, price: number) => ({ name: "TechStop Kolonaki",     distance: "0.7 km", distanceKm: 0.7, walkTime: "9 min",  stock, price });
const EC = (stock: number, price: number) => ({ name: "ElectroCity Syntagma",  distance: "0.5 km", distanceKm: 0.5, walkTime: "6 min",  stock, price });
const CB = (stock: number, price: number) => ({ name: "CityBuild Center",      distance: "0.9 km", distanceKm: 0.9, walkTime: "11 min", stock, price });
const PS = (stock: number, price: number) => ({ name: "ProBuild Supplies",     distance: "1.2 km", distanceKm: 1.2, walkTime: "15 min", stock, price });

export const allItems: Item[] = [
  { name: "Allen Key Set",      category: "Hardware",    stores: [PH(5, 8.50), CB(3, 9.20)] },
  { name: "Masking Tape 50mm",  category: "Hardware",    stores: [PH(11, 3.20), CB(6, 3.80)] },
  { name: "HDMI Cable 2m",      category: "Electronics", stores: [EC(4, 11.50), TS(7, 12.99)] },
  { name: "USB-C Hub",          category: "Electronics", stores: [EC(2, 22.50), TS(3, 24.99)] },
  { name: "Phone Stand",        category: "Electronics", stores: [TS(1, 9.99), EC(5, 11.20)] },
  { name: "DeWalt 20V Drill",   category: "Tools",       stores: [CB(2, 179.00), PS(3, 189.00)] },
  { name: "Bosch Circular Saw", category: "Tools",       stores: [PS(1, 134.50), CB(0, 129.90)] },
  {
    name: "Work Gloves L", category: "Apparel",
    stores: [CB(4, 6.50), PH(2, 6.99), PS(8, 7.49)],
  },
  {
    name: "Safety Goggles", category: "Tools",
    stores: [PH(0, 9.99), CB(3, 10.50), PS(8, 11.50)],
  },
  {
    name: "Screwdriver Set", category: "Tools",
    stores: [PS(2, 13.50), CB(5, 14.99), PH(6, 15.90)],
  },
];

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
