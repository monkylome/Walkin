"use client";

import { Home, Store, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs: { href: string; label: string; Icon: LucideIcon }[] = [
  {
    href: "/",
    label: "Home",
    Icon: Home,
  },
  {
    href: "/stores",
    label: "Stores",
    Icon: Store,
  },
  {
    href: "/profile",
    label: "Profile",
    Icon: UserRound,
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
      <nav
        className="relative flex items-center rounded-full p-2 shadow-lg"
        style={{ gap: GAP, backgroundColor: "var(--nav-bg)" }}
      >
        {/* Sliding indicator */}
        <div
          className="absolute rounded-full"
          style={{
            width: TAB_W,
            height: TAB_W - 10,
            top: "50%",
            backgroundColor: "var(--nav-active-bg)",
            transform: `translateY(-50%) translateX(${activeIndex * (TAB_W + GAP)}px)`,
            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="relative z-10 flex items-center justify-center rounded-full transition-colors"
              style={{
                width: TAB_W,
                height: TAB_W - 10,
                color: active ? "var(--nav-active-color)" : "var(--nav-inactive-color)",
              }}
            >
              <Icon
                size={22}
                fill="none"
                strokeWidth={2}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
