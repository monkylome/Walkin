import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  PackagePlus,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Store,
  TriangleAlert,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "Inventory", href: "#", icon: Boxes },
  { label: "Orders", href: "#", icon: ShoppingBag },
  { label: "Analytics", href: "#", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings/pricing", icon: Settings },
];

const metrics = [
  { label: "Items listed", value: "128", hint: "+12 this week", icon: Boxes },
  { label: "Low stock", value: "9", hint: "Needs attention", icon: TriangleAlert },
  { label: "Walk-ins", value: "342", hint: "+18% vs last week", icon: Store },
  { label: "Revenue", value: "€4.8k", hint: "Last 7 days", icon: CircleDollarSign },
];

const inventory = [
  { name: "Anker USB-C Charger 20W", category: "Electronics", stock: 8, price: "€14.99", status: "Live" },
  { name: "Xiaomi Power Bank 10000mAh", category: "Electronics", stock: 3, price: "€24.99", status: "Low stock" },
  { name: "JBL Tune 110 Earbuds", category: "Electronics", stock: 7, price: "€11.50", status: "Live" },
  { name: "UGREEN HDMI Cable 2m", category: "Electronics", stock: 9, price: "€12.99", status: "Live" },
  { name: "Energizer AA Batteries 4pcs", category: "Electronics", stock: 15, price: "€6.20", status: "Live" },
];

const activity = [
  "Inventory synced 8 minutes ago",
  "USB-C Hub was marked featured",
  "Safety Goggles went out of stock",
  "3 customers requested directions",
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-border bg-surface">
          <div className="flex h-16 items-center gap-3 border-b border-border px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
              <Store size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">WalkIn Store</p>
              <p className="text-xs text-muted">TechStop</p>
            </div>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {navItems.map(({ label, href, icon: Icon, active }) => (
              <a
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <Icon size={17} />
                {label}
              </a>
            ))}
          </nav>

          <div className="mx-3 mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <Star size={15} fill="currentColor" />
              Featured store
            </div>
            <p className="mt-1 text-xs leading-5 text-amber-700">
              Your featured products are highlighted on nearby customer maps.
            </p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Store dashboard</h1>
              <p className="text-xs text-muted">Manage inventory, visibility, and walk-in demand.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-72 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted">
                <Search size={16} />
                Search inventory
              </div>
              <button className="flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background">
                <PackagePlus size={16} />
                Add item
              </button>
            </div>
          </header>

          <div className="space-y-6 p-8">
            <section className="grid grid-cols-4 gap-4">
              {metrics.map(({ label, value, hint, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted">{label}</p>
                    <Icon size={18} className="text-muted" />
                  </div>
                  <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
                  <p className="mt-1 text-xs text-muted">{hint}</p>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-[1fr_320px] gap-6">
              <div className="rounded-lg border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <h2 className="text-sm font-semibold">Inventory snapshot</h2>
                    <p className="text-xs text-muted">Live listings visible to nearby customers</p>
                  </div>
                  <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground">
                    View all
                  </button>
                </div>

                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-5 py-3 font-medium">Item</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 font-medium">Stock</th>
                      <th className="px-5 py-3 font-medium">Price</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {inventory.map((item) => (
                      <tr key={item.name}>
                        <td className="px-5 py-4 font-medium">{item.name}</td>
                        <td className="px-5 py-4 text-muted">{item.category}</td>
                        <td className="px-5 py-4 tabular-nums">{item.stock}</td>
                        <td className="px-5 py-4 tabular-nums">{item.price}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.status === "Live"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "Out"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-surface p-5">
                  <div className="flex items-center gap-2">
                    <Clock3 size={17} className="text-muted" />
                    <h2 className="text-sm font-semibold">Recent activity</h2>
                  </div>
                  <div className="mt-4 space-y-3">
                    {activity.map((entry) => (
                      <div key={entry} className="border-l-2 border-border pl-3 text-sm text-muted">
                        {entry}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface p-5">
                  <h2 className="text-sm font-semibold">Map visibility</h2>
                  <p className="mt-2 text-3xl font-semibold">94%</p>
                  <p className="mt-1 text-sm text-muted">of nearby searches show at least one of your items.</p>
                  <div className="mt-4 h-2 rounded-full bg-background">
                    <div className="h-2 w-[94%] rounded-full bg-foreground" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
