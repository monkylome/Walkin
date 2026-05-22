export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type StoreAvailability = { name: string; distance: string; distanceKm: number; walkTime: string; stock: number; price: number };
export type Item = { name: string; category: string; image?: string; stores: StoreAvailability[] };
export type StoreSummary = { name: string; category: string; distance: string; distanceKm: number; walkTime: string; inventory: { item: Item; stock: number; price: number }[] };
export type StoreMeta = { initials: string; color: string; category: string; verified: boolean; featured: boolean };
