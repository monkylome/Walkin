import type { Item, StoreMeta } from "./types";

export const storeMeta: Record<string, StoreMeta> = {
  "Papageorgiou Group":    { initials: "PG", color: "bg-slate-600",  category: "Hardware",         verified: true,  featured: false, image: "/images/papageorgiou.webp", logo: "/logos/papagroup-logo.webp" },
  "TechStop":              { initials: "TS", color: "bg-sky-600",    category: "Electronics",      verified: true,  featured: true, logo: "/logos/techstop-logo.webp" },
  "ProBuild Supplies":     { initials: "PS", color: "bg-blue-700",   category: "Tools",            verified: false, featured: false },
  "ElectroCity":           { initials: "EC", color: "bg-cyan-600",   category: "Electronics",      verified: true,  featured: false, logo: "/logos/electrocity-logo.webp" },
  "Toolman":               { initials: "TM", color: "bg-indigo-600", category: "Hardware",       verified: false, featured: false, logo: "/logos/toolman-logo.webp" },
  "MediCare Plus":          { initials: "MC", color: "bg-emerald-600", category: "Medicine",        verified: true,  featured: true, logo: "/logos/medicare-plus-logo.webp" },
  "ToFarmakeioMou":        { initials: "TF", color: "bg-teal-600",   category: "Medicine",         verified: true,  featured: false, logo: "/logos/tofarmakeiomou-logo.webp" },
  "Farmakeio Athinon":     { initials: "FA", color: "bg-rose-600",   category: "Medicine",         verified: true,  featured: false },
  "Pharma Plaka":          { initials: "PP", color: "bg-amber-600",  category: "Medicine",         verified: false, featured: false },
  "Farmakeio Peiraios":    { initials: "FP", color: "bg-violet-600", category: "Medicine",         verified: true,  featured: false },
  "Glyfada Pharma":        { initials: "GP", color: "bg-pink-600",   category: "Medicine",         verified: false, featured: false },
};

export const storeLocations: Record<string, { lat: number; lng: number }> = {
  "Papageorgiou Group":    { lat: 38.0384, lng: 23.7598 },
  "TechStop":              { lat: 38.0370, lng: 23.7622 },
  "ProBuild Supplies":     { lat: 38.0393, lng: 23.7565 },
  "ElectroCity":           { lat: 38.0362, lng: 23.7575 },
  "Toolman":               { lat: 38.0402, lng: 23.7608 },
  "MediCare Plus":         { lat: 38.0374, lng: 23.7585 },
  "ToFarmakeioMou":        { lat: 38.0387, lng: 23.7630 },
  "Farmakeio Athinon":     { lat: 37.9762, lng: 23.7253 }, // Monastiraki
  "Pharma Plaka":          { lat: 37.9728, lng: 23.7305 }, // Plaka, near Monastiraki
  "Farmakeio Peiraios":    { lat: 37.9430, lng: 23.6480 }, // Piraeus
  "Glyfada Pharma":        { lat: 37.8640, lng: 23.7540 }, // Glyfada
};

// Neighborhood centroids used by /api/search to filter stores by route waypoints
// and by Gemini to translate the user's prose ("passing from Monastiraki") into
// structured route hints.
export const neighborhoods: Record<string, { lat: number; lng: number }> = {
  "Monastiraki":   { lat: 37.9762, lng: 23.7253 },
  "Plaka":         { lat: 37.9710, lng: 23.7283 },
  "Syntagma":      { lat: 37.9755, lng: 23.7348 },
  "Kolonaki":      { lat: 37.9787, lng: 23.7437 },
  "Exarchia":      { lat: 37.9870, lng: 23.7340 },
  "Omonia":        { lat: 37.9839, lng: 23.7283 },
  "Patision":      { lat: 37.9930, lng: 23.7345 },
  "Kypseli":       { lat: 38.0008, lng: 23.7400 },
  "Galatsi":       { lat: 38.0205, lng: 23.7530 },
  "Nea Ionia":     { lat: 38.0420, lng: 23.7560 },
  "Kifisia":       { lat: 38.0741, lng: 23.8158 },
  "Glyfada":       { lat: 37.8636, lng: 23.7553 },
  "Piraeus":       { lat: 37.9420, lng: 23.6464 },
};

// The mock `distance` / `walkTime` strings on each store entry below are measured
// from here. Anything that computes distance instead of reading those strings must
// default to the same origin, or the two contradict each other — Papageorgiou reads
// "0.3 km" statically but ~7.3 km if you measure from Syntagma.
export const DEFAULT_ORIGIN = neighborhoods["Nea Ionia"];

const PH = (stock: number, price: number) => ({ name: "Papageorgiou Group",   distance: "0.3 km", distanceKm: 0.3, walkTime: "4 min",  stock, price });
const TS = (stock: number, price: number) => ({ name: "TechStop",              distance: "0.7 km", distanceKm: 0.7, walkTime: "9 min",  stock, price });
const EC = (stock: number, price: number) => ({ name: "ElectroCity",           distance: "0.5 km", distanceKm: 0.5, walkTime: "6 min",  stock, price });
const CB = (stock: number, price: number) => ({ name: "Toolman",              distance: "0.9 km", distanceKm: 0.9, walkTime: "11 min", stock, price });
const PS = (stock: number, price: number) => ({ name: "ProBuild Supplies",     distance: "1.2 km", distanceKm: 1.2, walkTime: "15 min", stock, price });
const FK = (stock: number, price: number) => ({ name: "MediCare Plus",             distance: "0.4 km", distanceKm: 0.4, walkTime: "5 min",  stock, price });
const YC = (stock: number, price: number) => ({ name: "ToFarmakeioMou",       distance: "0.6 km", distanceKm: 0.6, walkTime: "7 min",  stock, price });
const FA = (stock: number, price: number) => ({ name: "Farmakeio Athinon",    distance: "7.5 km", distanceKm: 7.5, walkTime: "—",       stock, price });
const PP = (stock: number, price: number) => ({ name: "Pharma Plaka",          distance: "7.8 km", distanceKm: 7.8, walkTime: "—",       stock, price });
const FP = (stock: number, price: number) => ({ name: "Farmakeio Peiraios",    distance: "12 km",  distanceKm: 12,  walkTime: "—",       stock, price });
const GP = (stock: number, price: number) => ({ name: "Glyfada Pharma",        distance: "14 km",  distanceKm: 14,  walkTime: "—",       stock, price });

export const allItems: Item[] = [
  { name: "Depon 500mg",          category: "Medicine", image: "/images/depon.webp", stores: [FK(20, 2.80), YC(15, 3.10), FA(18, 2.90), PP(10, 3.20), FP(14, 2.95), GP(8, 3.05)] },
  { name: "Ponstan 500mg",        category: "Medicine", image: "/images/ponstan.webp", stores: [FK(12, 5.40), YC(8, 5.80), FA(6, 5.60), FP(9, 5.50)] },
  { name: "Nurofen 400mg",        category: "Medicine", image: "/images/nurofen.webp", stores: [YC(10, 6.20), FK(7, 6.50), PP(9, 6.30), GP(6, 6.40)] },
  { name: "Voltaren Emulgel",     category: "Medicine", image: "/images/voltaren.webp", stores: [FK(6, 9.80), YC(4, 10.20), FA(5, 9.90), FP(7, 9.70)] },
  { name: "Solgar Vitamin C 1000mg", category: "Medicine", image: "/images/solgar-vitc.webp", stores: [YC(25, 7.90), FK(10, 8.20), GP(12, 8.00)] },
  // Electronics
  { name: "Anker USB-C Charger 20W",   category: "Electronics", image: "/images/anker-charger.webp", stores: [TS(8, 14.99), EC(5, 15.90)] },
  { name: "Energizer AA Batteries 4pcs", category: "Electronics", image: "/images/energizer-batteries.webp", stores: [EC(20, 5.90), TS(15, 6.20)] },
  { name: "Xiaomi Power Bank 10000mAh", category: "Electronics", image: "/images/xiaomi-powerbank.webp", stores: [TS(3, 24.99), EC(2, 26.50)] },
  { name: "JBL Tune 110 Earbuds",       category: "Electronics", image: "/images/jbl-earbuds.webp", stores: [EC(4, 9.90), TS(7, 11.50)] },
  { name: "UGREEN HDMI Cable 2m",        category: "Electronics", image: "/images/ugreen-hdmi.webp", stores: [EC(6, 11.50), TS(9, 12.99)] },
  // Tools
  { name: "Stanley Utility Knife",      category: "Tools", image: "/images/stanley-knife.webp", stores: [PS(10, 8.90), CB(6, 9.50), PH(4, 9.90)] },
  { name: "WD-40 Spray 200ml",          category: "Tools", image: "/images/wd40.webp", stores: [PH(15, 5.80), PS(8, 6.20), CB(12, 6.50)] },
  { name: "Stanley Measuring Tape 5m",  category: "Tools", image: "/images/stanley-tape.webp", stores: [PS(7, 7.50), CB(5, 8.20)] },
  { name: "Bosch Screwdriver Set 42pc", category: "Tools", image: "/images/bosch-screwdriver.webp", stores: [CB(5, 18.90), PS(3, 19.50), PH(6, 20.99)] },
  { name: "Duck Tape Original 50m",     category: "Tools", image: "/images/duck-tape.webp", stores: [PH(20, 6.90), CB(14, 7.20), PS(9, 7.50)] },
  // Hardware
  { name: "Abus Padlock 40mm",          category: "Hardware", image: "/images/abus-padlock.webp", stores: [PH(8, 12.50), CB(4, 13.90)] },
  { name: "Brennenstuhl Extension 3m",  category: "Hardware", image: "/images/brennenstuhl-extension.webp", stores: [CB(6, 14.90), PH(3, 15.50)] },
  { name: "Philips LED Bulb E27 9W",    category: "Hardware", image: "/images/philips-bulb.webp", stores: [PH(25, 4.50), CB(18, 4.90)] },
  { name: "Fischer Wall Plugs 50pcs",    category: "Hardware", image: "/images/fischer-plugs.webp", stores: [PH(30, 3.80), CB(20, 4.20), PS(15, 4.50)] },
  { name: "Loctite Super Glue 3g",      category: "Hardware", image: "/images/loctite-glue.webp", stores: [PH(12, 3.90), CB(8, 4.20)] },
];
