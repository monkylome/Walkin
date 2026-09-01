import { Hammer, Zap, Wrench, Package, Pill, type LucideIcon } from "lucide-react";

export const categoryIcon: Record<string, LucideIcon> = {
  Medicine:    Pill,
  Tools:       Hammer,
  Electronics: Zap,
  Hardware:    Wrench,
  Other:       Package,
};

export const categoryAccent: Record<string, string> = {
  Medicine:    "bg-emerald-100 text-emerald-700",
  Tools:       "bg-blue-100 text-blue-700",
  Electronics: "bg-sky-100 text-sky-700",
  Hardware:    "bg-slate-100 text-slate-600",
  Other:       "bg-gray-100 text-gray-600",
};

export function iconFor(category: string): LucideIcon {
  return categoryIcon[category] ?? Package;
}

export function accentFor(category: string): string {
  return categoryAccent[category] ?? categoryAccent.Other;
}

export const categoryPinColor: Record<string, string> = {
  Medicine:    "bg-emerald-600",
  Tools:       "bg-blue-600",
  Electronics: "bg-sky-600",
  Hardware:    "bg-slate-600",
  Other:       "bg-gray-600",
};

export function pinColorFor(category: string): string {
  return categoryPinColor[category] ?? categoryPinColor.Other;
}
