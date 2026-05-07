"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/app/components/bottom-nav";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative h-dvh overflow-hidden">
      <main className="h-full overflow-y-auto">
        <div key={pathname} className="tab-slide-left" style={{ height: "100%" }}>
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
