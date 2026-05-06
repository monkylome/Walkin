"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5Z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: "/map",
    label: "Map",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

const TAB_W = 52; // px — width of each tab
const GAP = 4;    // px — gap between tabs

export default function BottomNav() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex(t => t.href === pathname);

  return (
    <div
      className="flex justify-center pt-2"
      style={{ paddingBottom: `calc(1.5rem + env(safe-area-inset-bottom, 0px))` }}
    >
      <nav className="relative flex items-center bg-zinc-900 rounded-full p-2 shadow-lg" style={{ gap: GAP }}>
        {/* Sliding white indicator */}
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: TAB_W,
            height: TAB_W - 10,
            top: "50%",
            transform: `translateY(-50%) translateX(${activeIndex * (TAB_W + GAP)}px)`,
            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {tabs.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`relative z-10 flex items-center justify-center rounded-full transition-colors ${
                active ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-200"
              }`}
              style={{ width: TAB_W, height: TAB_W - 10 }}
            >
              {icon(active)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
