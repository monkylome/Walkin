import type { Item, StoreMeta } from "./types";

export const storeMeta: Record<string, StoreMeta> = {
  "Papageorgiou Group":    { initials: "PG", color: "bg-slate-600",  category: "Hardware",         verified: true,  featured: false, image: "/images/papageorgiou.webp", logo: "/logos/papagroup-logo.webp" },
  "TechStop":              { initials: "TS", color: "bg-sky-600",    category: "Electronics",      verified: true,  featured: true, logo: "/logos/techstop-logo.webp" },
  "ProBuild Supplies":     { initials: "PS", color: "bg-blue-700",   category: "Tools",            verified: false, featured: false },
  "ElectroCity":           { initials: "EC", color: "bg-cyan-600",   category: "Electronics",      verified: true,  featured: false, logo: "/logos/electrocity-logo.webp" },
  "Toolman":               { initials: "TM", color: "bg-indigo-600", category: "Hardware",       verified: false, featured: false, logo: "/logos/toolman-logo.webp" },
  "MediCare Plus":          { initials: "MC", color: "bg-emerald-600", category: "Medicine",        verified: true,  featured: true, logo: "/logos/medicare-plus-logo.webp" },
  "ToFarmakeioMou":        { initials: "TF", color: "bg-teal-600",   category: "Medicine",         verified: true,  featured: false, logo: "/logos/tofarmakeiomou-logo.webp" },
};

export const storeLocations: Record<string, { lat: number; lng: number }> = {
  "Papageorgiou Group":    { lat: 38.0352, lng: 23.7538 },
  "TechStop":              { lat: 38.0338, lng: 23.7562 },
  "ProBuild Supplies":     { lat: 38.0361, lng: 23.7505 },
  "ElectroCity":           { lat: 38.0330, lng: 23.7515 },
  "Toolman":               { lat: 38.0370, lng: 23.7548 },
  "MediCare Plus":             { lat: 38.0342, lng: 23.7525 },
  "ToFarmakeioMou":        { lat: 38.0355, lng: 23.7570 },
};

const PH = (stock: number, price: number) => ({ name: "Papageorgiou Group",   distance: "0.3 km", distanceKm: 0.3, walkTime: "4 min",  stock, price });
const TS = (stock: number, price: number) => ({ name: "TechStop",              distance: "0.7 km", distanceKm: 0.7, walkTime: "9 min",  stock, price });
const EC = (stock: number, price: number) => ({ name: "ElectroCity",           distance: "0.5 km", distanceKm: 0.5, walkTime: "6 min",  stock, price });
const CB = (stock: number, price: number) => ({ name: "Toolman",              distance: "0.9 km", distanceKm: 0.9, walkTime: "11 min", stock, price });
const PS = (stock: number, price: number) => ({ name: "ProBuild Supplies",     distance: "1.2 km", distanceKm: 1.2, walkTime: "15 min", stock, price });
const FK = (stock: number, price: number) => ({ name: "MediCare Plus",             distance: "0.4 km", distanceKm: 0.4, walkTime: "5 min",  stock, price });
const YC = (stock: number, price: number) => ({ name: "ToFarmakeioMou",       distance: "0.6 km", distanceKm: 0.6, walkTime: "7 min",  stock, price });

export const allItems: Item[] = [
  { name: "Depon 500mg",          category: "Medicine", image: "/images/depon.webp", stores: [FK(20, 2.80), YC(15, 3.10)] },
  { name: "Ponstan 500mg",        category: "Medicine", image: "/images/ponstan.webp", stores: [FK(12, 5.40), YC(8, 5.80)] },
  { name: "Nurofen 400mg",        category: "Medicine", image: "/images/nurofen.webp", stores: [YC(10, 6.20), FK(7, 6.50)] },
  { name: "Voltaren Emulgel",     category: "Medicine", image: "/images/voltaren.webp", stores: [FK(6, 9.80), YC(4, 10.20)] },
  { name: "Solgar Vitamin C 1000mg", category: "Medicine", image: "/images/solgar-vitc.webp", stores: [YC(25, 7.90), FK(10, 8.20)] },
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
