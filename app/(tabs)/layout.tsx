"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import BottomNav from "@/app/components/bottom-nav";
import { useAuth } from "@/app/lib/auth";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="h-dvh bg-background" />;
  }

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
