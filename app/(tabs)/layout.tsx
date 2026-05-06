"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import BottomNav from "@/app/components/bottom-nav";

const TABS = ["/", "/map", "/profile"];

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevRef = useRef(pathname);

  const prevIdx = TABS.indexOf(prevRef.current);
  const nextIdx = TABS.indexOf(pathname);
  const animClass = nextIdx > prevIdx ? "tab-slide-left" : "tab-slide-right";
  prevRef.current = pathname;

  return (
    <div className="relative h-dvh overflow-hidden">
      <main className="h-full overflow-y-auto">
        <div key={pathname} className={animClass} style={{ height: "100%" }}>
          {children}
        </div>
      </main>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="pointer-events-auto">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
