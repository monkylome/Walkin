import { Hammer, Zap, Wrench, Shirt, Package, type LucideIcon } from "lucide-react";

export const categoryIcon: Record<string, LucideIcon> = {
  Tools:       Hammer,
  Electronics: Zap,
  Hardware:    Wrench,
  Apparel:     Shirt,
  Other:       Package,
};

export const categoryAccent: Record<string, string> = {
  Tools:       "bg-blue-100 text-blue-700",
  Electronics: "bg-sky-100 text-sky-700",
  Hardware:    "bg-slate-100 text-slate-600",
  Apparel:     "bg-violet-100 text-violet-600",
  Other:       "bg-gray-100 text-gray-600",
};

export function iconFor(category: string): LucideIcon {
  return categoryIcon[category] ?? Package;
}

export function accentFor(category: string): string {
  return categoryAccent[category] ?? categoryAccent.Other;
}
