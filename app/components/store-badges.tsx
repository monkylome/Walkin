import { Check, Star } from "lucide-react";

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-0 py-0 text-[11px] font-semibold text-emerald-600">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 m-auto" />
      </span>
      Live inventory
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <Star size={11} strokeWidth={2.5} fill="currentColor" />
      Featured
    </span>
  );
}

export function VerifiedTick() {
  return (
    <span
      aria-label="Verified store"
      title="Verified store"
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white"
    >
      <Check size={11} strokeWidth={3} />
    </span>
  );
}
