"use client";

import Link from "next/link";
import { allItems, toSlug, toStoreSlug } from "@/app/lib/items";
import { iconFor, accentFor } from "@/app/lib/categories";
import { useSavedItems } from "@/app/lib/saved-items";
import { useAuth } from "@/app/lib/auth";
import { useMode } from "@/app/components/theme-provider";
import {
  SearchIcon,
  StoreBuildingIcon,
  BookmarkIcon,
  ChevronRightIcon,
} from "@/app/components/icons";

const activity = [
  { icon: "search",   label: 'Searched for "cordless drill"', time: "2h ago"    },
  { icon: "store",    label: "Visited TechStop",             time: "Yesterday"  },
  { icon: "bookmark", label: 'Saved "HDMI Cable 2m"',         time: "2 days ago" },
];

const stats = [
  { value: "12",    label: "Stores visited" },
  { value: "47",    label: "Items found"    },
  { value: "8.3 km", label: "Walked"        },
];

const activityIcon = {
  search:   () => <SearchIcon size={16} />,
  store:    () => <StoreBuildingIcon size={16} strokeWidth={2} />,
  bookmark: () => <BookmarkIcon size={16} />,
} as const;

const settingsRows = [
  { label: "Notifications", danger: false },
  { label: "Privacy",       danger: false },
  { label: "Help & feedback", danger: false },
  { label: "Sign out",      danger: true  },
];

export default function ProfilePage() {
  const { saved, toggle } = useSavedItems();
  const { user, signOut } = useAuth();
  const { mode, setMode } = useMode();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const savedItems = allItems.filter((item) => saved.has(toSlug(item.name)));

  return (
    <div className="flex flex-col min-h-full bg-background pb-28">

      {/* Header */}
      <div className="px-5 pt-safe pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Profile</h1>
          <button className="text-[13px] font-medium text-primary">Edit</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-[22px] font-bold text-white shrink-0 select-none">
            {initials}
          </div>
          <div>
            <p className="text-[18px] font-semibold text-foreground leading-tight">{user?.name ?? ""}</p>
            <p className="text-[12px] text-muted mt-0.5">{user?.email ?? user?.phone ?? ""}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 pb-7">
        <div className="grid grid-cols-3 gap-2.5">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5 p-3.5 rounded-2xl border border-border bg-surface">
              <span className="text-[20px] font-bold text-foreground leading-none">{value}</span>
              <span className="text-[11px] text-muted text-center leading-snug mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Items */}
      <div className="pb-7">
        <div className="flex items-center justify-between px-5 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">
            Saved items{savedItems.length > 0 ? ` · ${savedItems.length}` : ""}
          </span>
        </div>

        {savedItems.length === 0 ? (
          <div className="mx-5 py-8 rounded-2xl border border-border bg-surface flex flex-col items-center gap-2">
            <BookmarkIcon size={28} strokeWidth={1.5} className="text-border" />
            <p className="text-[13px] text-muted">No saved items yet</p>
            <p className="text-[12px] text-muted opacity-70">Tap the bookmark on any item to save it</p>
          </div>
        ) : (
          <div className="flex gap-3 px-5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            {savedItems.map((item) => {
              const Icon    = iconFor(item.category);
              const nearest = item.stores[0];
              const slug    = toSlug(item.name);
              return (
                <div key={item.name} className="shrink-0 w-44 relative">
                  <Link href={`/item/${slug}`} className="p-3.5 rounded-2xl border border-border bg-surface active:opacity-80 transition-opacity block">
                    <div className="w-full h-24 rounded-xl bg-background border border-border flex items-center justify-center mb-3 text-muted">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2.5 ${accentFor(item.category)}`}>
                      {item.category}
                    </span>
                    <p className="text-[14px] font-semibold text-foreground leading-snug mb-1 pr-6">{item.name}</p>
                    <Link href={`/store/${toStoreSlug(nearest.name)}`} className="text-[12px] text-muted truncate block active:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                      {nearest.name}
                    </Link>
                    <p className="text-[12px] font-medium text-primary mt-1">{nearest.distance}</p>
                  </Link>
                  <button
                    onClick={() => toggle(slug)}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-background border border-border text-primary active:opacity-60 transition-opacity"
                    aria-label="Unsave item"
                  >
                    <BookmarkIcon size={13} filled className="text-primary" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="px-5 pb-7">
        <div className="mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Recent activity</span>
        </div>
        <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden divide-y divide-border">
          {activity.map(({ icon, label, time }) => {
            const Icon = activityIcon[icon as keyof typeof activityIcon];
            return (
              <div key={label} className="flex items-center gap-3.5 px-4 py-3.5">
                <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0 text-muted">
                  <Icon />
                </div>
                <p className="text-[13px] text-foreground flex-1 leading-snug">{label}</p>
                <span className="text-[12px] text-muted shrink-0">{time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="px-5 pb-6">
        <div className="mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Settings</span>
        </div>
        <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden divide-y divide-border">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-[15px] font-medium text-foreground">Appearance</span>
            <div className="flex rounded-full bg-background border border-border p-0.5">
              {(["system", "light", "dark"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMode(opt)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium capitalize transition-colors ${
                    mode === opt ? "bg-primary text-white" : "text-muted"
                  }`}
                >
                  {opt === "system" ? "Auto" : opt}
                </button>
              ))}
            </div>
          </div>
          {settingsRows.map(({ label, danger }) => (
            <button
              key={label}
              onClick={danger ? signOut : undefined}
              className="flex items-center justify-between px-4 py-4 w-full active:opacity-70 transition-opacity text-left"
            >
              <span className={`text-[15px] font-medium ${danger ? "text-red-500" : "text-foreground"}`}>
                {label}
              </span>
              {!danger && <ChevronRightIcon className="text-muted" />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
