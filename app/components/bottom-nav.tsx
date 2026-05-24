"use client";

import { Home, MapPin, UserRound, Package, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReservations } from "@/app/lib/reservations";

const tabs: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/stores", label: "Explore", Icon: MapPin },
  { href: "/profile", label: "Profile", Icon: UserRound },
];

const TAB_W = 52;
const GAP = 4;

export default function BottomNav() {
  const pathname = usePathname();
  const { active } = useReservations();
  const activeIndex = tabs.findIndex(t => t.href === pathname);
  const hasOrder = active.length > 0;
  const onOrderPage = pathname === "/order";

  return (
    <div
      className="flex justify-center items-center gap-3 pt-2"
      style={{ paddingBottom: `calc(1.5rem + env(safe-area-inset-bottom, 0px))` }}
    >
      <nav
        className="relative flex items-center rounded-full p-2 shadow-lg"
        style={{ gap: GAP, backgroundColor: "var(--nav-bg)" }}
      >
        {/* Sliding indicator */}
        {activeIndex >= 0 && (
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
        )}
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="relative z-10 flex items-center justify-center rounded-full transition-colors"
              style={{
                width: TAB_W,
                height: TAB_W - 10,
                color: isActive ? "var(--nav-active-color)" : "var(--nav-inactive-color)",
              }}
            >
              <Icon size={22} fill="none" strokeWidth={2} />
            </Link>
          );
        })}
      </nav>

      {/* Order indicator */}
      {hasOrder && (
        <Link
          href="/order"
          aria-label="Active order"
          className="relative flex items-center justify-center rounded-full shadow-lg"
          style={{
            width: TAB_W,
            height: TAB_W - 10,
            backgroundColor: "var(--nav-bg)",
          }}
        >
          <Package
            size={22}
            fill="none"
            strokeWidth={2}
            style={{ color: onOrderPage ? "var(--nav-active-color)" : "var(--nav-inactive-color)" }}
          />
          {onOrderPage && (
            <div
              className="absolute inset-2 rounded-full -z-10"
              style={{ backgroundColor: "var(--nav-active-bg)" }}
            />
          )}
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </Link>
      )}
    </div>
  );
}
