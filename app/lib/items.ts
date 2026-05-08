export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type StoreAvailability = { name: string; distance: string; distanceKm: number; walkTime: string; stock: number; verified: boolean; price: number };
export type Item = { name: string; category: string; stores: StoreAvailability[] };

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

const PH = (stock: number, price: number, verified = true)  => ({ name: "Papageorgiou Hardware", distance: "0.3 km", distanceKm: 0.3, walkTime: "4 min",  stock, verified, price });
const TS = (stock: number, price: number, verified = true)  => ({ name: "TechStop Kolonaki",     distance: "0.7 km", distanceKm: 0.7, walkTime: "9 min",  stock, verified, price });
const EC = (stock: number, price: number, verified = true)  => ({ name: "ElectroCity Syntagma",  distance: "0.5 km", distanceKm: 0.5, walkTime: "6 min",  stock, verified, price });
const CB = (stock: number, price: number, verified = false) => ({ name: "CityBuild Center",      distance: "0.9 km", distanceKm: 0.9, walkTime: "11 min", stock, verified, price });
const PS = (stock: number, price: number, verified = false) => ({ name: "ProBuild Supplies",     distance: "1.2 km", distanceKm: 1.2, walkTime: "15 min", stock, verified, price });

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
