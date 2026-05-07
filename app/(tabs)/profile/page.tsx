const savedItems = [
  { name: "DeWalt 20V Drill Kit", store: "ProBuild Supplies", distance: "1.2 km", category: "Tools", accent: "bg-blue-100 text-blue-600" },
  { name: "HDMI Cable 2m", store: "TechStop Kolonaki", distance: "0.7 km", category: "Electronics", accent: "bg-sky-100 text-sky-600" },
  { name: "Allen Key Set", store: "Papageorgiou Hardware", distance: "0.3 km", category: "Hardware", accent: "bg-surface text-muted" },
];

const activity = [
  { icon: "search", label: 'Searched for "cordless drill"', time: "2h ago" },
  { icon: "store", label: "Visited TechStop Kolonaki", time: "Yesterday" },
  { icon: "bookmark", label: 'Saved "HDMI Cable 2m"', time: "2 days ago" },
];

const stats = [
  { value: "12", label: "Stores visited" },
  { value: "47", label: "Items found" },
  { value: "8.3 km", label: "Walked" },
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const activityIcon = { search: SearchIcon, store: StoreIcon, bookmark: BookmarkIcon } as const;

const settingsRows = [
  { label: "Notifications", danger: false },
  { label: "Privacy", danger: false },
  { label: "Help & feedback", danger: false },
  { label: "Sign out", danger: true },
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-full bg-background pb-28">

      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Profile</h1>
          <button className="text-[13px] font-medium text-primary">Edit</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-[22px] font-bold text-white shrink-0 select-none">
            A
          </div>
          <div>
            <p className="text-[18px] font-semibold text-foreground leading-tight">Arsen T.</p>
            <div className="flex items-center gap-1.5 mt-1">
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="text-muted">
                <path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 3.85 5.5 7.5 5.5 7.5S11 9.35 11 5.5C11 2.46 8.54 0 5.5 0zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor" />
              </svg>
              <span className="text-[13px] text-muted font-medium">Kolonaki, Athens</span>
            </div>
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
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Saved items</span>
          <button className="text-[13px] font-medium text-primary">See all</button>
        </div>
        <div className="flex gap-3 px-5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {savedItems.map((item) => (
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
          {settingsRows.map(({ label, danger }) => (
            <button
              key={label}
              className="flex items-center justify-between px-4 py-4 w-full active:opacity-70 transition-opacity text-left"
            >
              <span className={`text-[15px] font-medium ${danger ? "text-red-500" : "text-foreground"}`}>
                {label}
              </span>
              {!danger && <ChevronRight />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
