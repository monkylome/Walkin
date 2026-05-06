import Link from "next/link";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const categories = ["Tools", "Electronics", "Hardware", "Apparel", "Other"];

const featuredItems = [
  { name: "DeWalt 20V Drill Kit", store: "ProBuild Supplies", distance: "1.2 km", category: "Tools", accent: "bg-orange-100 text-orange-600" },
  { name: "HDMI Cable 2m", store: "TechStop Kolonaki", distance: "0.7 km", category: "Electronics", accent: "bg-blue-100 text-blue-600" },
  { name: "Allen Key Set", store: "Papageorgiou Hardware", distance: "0.3 km", category: "Hardware", accent: "bg-surface text-muted" },
  { name: "Work Gloves L", store: "ProBuild Supplies", distance: "1.2 km", category: "Apparel", accent: "bg-green-100 text-green-600" },
];

const stores = [
  { name: "Papageorgiou Hardware", category: "Hardware", distance: "0.3 km", walkTime: "4 min",  itemCount: 8  },
  { name: "TechStop Kolonaki",     category: "Electronics", distance: "0.7 km", walkTime: "9 min",  itemCount: 24 },
  { name: "ProBuild Supplies",     category: "Tools",    distance: "1.2 km", walkTime: "15 min", itemCount: 15 },
];

export default function HomePage() {
  const greeting = getGreeting();

  return (
    <div className="flex flex-col min-h-full bg-background pb-28">

      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="text-muted">
                <path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 3.85 5.5 7.5 5.5 7.5S11 9.35 11 5.5C11 2.46 8.54 0 5.5 0zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor" />
              </svg>
              <span className="text-[13px] text-muted font-medium">Kolonaki, Athens</span>
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-tight">
              {greeting}
            </h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-[13px] font-semibold text-muted select-none">
            A
          </div>
        </div>

        {/* Search CTA */}
        <Link href="/map">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface border border-border active:opacity-80 transition-opacity">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-[14px] text-muted flex-1">Allen key, HDMI cable 2m…</span>
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Categories */}
      <div className="pb-6">
        <div className="px-5 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Browse</span>
        </div>
        <div className="flex gap-2 px-5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {categories.map((label, i) => (
            <button
              key={label}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors border ${
                i === 0
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Items */}
      <div className="pb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Featured nearby</span>
          <button className="text-[13px] font-medium text-primary">See all</button>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {featuredItems.map((item) => (
            <div key={item.name} className="shrink-0 w-44 p-3.5 rounded-2xl border border-border bg-surface active:opacity-80 transition-opacity">
              <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2.5 ${item.accent}`}>
                {item.category}
              </span>
              <p className="text-[14px] font-semibold text-foreground leading-snug mb-1">{item.name}</p>
              <p className="text-[12px] text-muted truncate">{item.store}</p>
              <p className="text-[12px] font-medium text-primary mt-1">{item.distance}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Stores */}
      <div className="px-5 pb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Near you</span>
          <button className="text-[13px] font-medium text-primary">See all</button>
        </div>
        <div className="flex flex-col gap-3">
          {stores.map((store) => (
            <div key={store.name} className="flex items-center gap-3.5 p-4 rounded-2xl border border-border bg-surface active:opacity-80 transition-opacity">
              <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{store.name}</p>
                <p className="text-[12px] text-muted mt-0.5">{store.category} · {store.itemCount} items listed</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-semibold text-foreground">{store.distance}</p>
                <p className="text-[11px] text-muted mt-0.5">{store.walkTime} walk</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
