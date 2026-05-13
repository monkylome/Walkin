import {
  BarChart3,
  Boxes,
  Check,
  CreditCard,
  LayoutDashboard,
  Receipt,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "#", icon: Boxes },
  { label: "Orders", href: "#", icon: ShoppingBag },
  { label: "Analytics", href: "#", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings/pricing", icon: Settings, active: true },
];

const plans = [
  {
    name: "Free",
    price: "€0",
    description: "For testing WalkIn with a small live catalog.",
    features: [
      "5 item uploads",
      "Basic map visibility",
      "ERP, WooCommerce, or CSV sync",
      "Store profile page",
    ],
  },
  {
    name: "Local",
    price: "€39",
    description: "For stores that want reliable nearby discovery.",
    featured: true,
    features: [
      "250 item uploads",
      "Verified store tick",
      "Live inventory badge",
      "Hourly ERP and WooCommerce sync",
      "Customer direction analytics",
      "Low-stock alerts",
      "Click-to-call tracking",
      "WhatsApp contact tracking",
      "Basic category performance reports",
      "Manual featured item rotation",
      "Opening hours and holiday schedule",
      "Customer save/bookmark insights",
      "CSV bulk import and export",
    ],
  },
  {
    name: "Featured",
    price: "€79",
    description: "For stores that want premium placement and promotions.",
    features: [
      "Unlimited item uploads",
      "Featured store placement",
      "Featured product boosts",
      "Real-time inventory sync",
      "Promotion scheduling",
      "Advanced search analytics",
      "Multi-location support",
      "Sponsored placement by category",
      "Competitor price snapshots",
      "Demand heatmap by neighborhood",
      "Abandoned search alerts",
      "Custom discount campaigns",
      "Staff accounts and permissions",
      "Priority support",
      "API access",
      "Custom sync rules",
      "Automated out-of-stock suppression",
      "Restock prediction reports",
      "Seasonal campaign templates",
      "Product photo cleanup",
      "Dedicated onboarding call",
    ],
  },
];

const invoices = [
  { date: "May 1, 2026", amount: "€49.00", status: "Paid" },
  { date: "Apr 1, 2026", amount: "€49.00", status: "Paid" },
  { date: "Mar 1, 2026", amount: "€49.00", status: "Paid" },
];

export default function PricingSettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white">
          <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Store size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">WalkIn Store</p>
              <p className="text-xs text-zinc-500">TechStop Kolonaki</p>
            </div>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {navItems.map(({ label, href, icon: Icon, active }) => (
              <a
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                <Icon size={17} />
                {label}
              </a>
            ))}
          </nav>

          <div className="mx-3 mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Settings</p>
            <div className="mt-3 space-y-1">
              <a href="#" className="block rounded-md px-2 py-1.5 text-sm text-zinc-600">Store profile</a>
              <a href="/dashboard/settings/pricing" className="block rounded-md bg-white px-2 py-1.5 text-sm font-medium text-zinc-950 shadow-sm">
                Pricing & billing
              </a>
              <a href="#" className="block rounded-md px-2 py-1.5 text-sm text-zinc-600">Team access</a>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Pricing & billing</h1>
              <p className="text-xs text-zinc-500">Manage your subscription and store visibility plan.</p>
            </div>
            <button className="flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700">
              <Receipt size={16} />
              Download invoices
            </button>
          </header>

          <div className="space-y-6 p-8">
            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">Current plan</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">Growth</h2>
                  <p className="mt-1 text-sm text-zinc-500">Renews on June 1, 2026. Card ending in 4242.</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Active
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                    <CreditCard size={16} />
                    Monthly spend
                  </div>
                  <p className="mt-2 text-2xl font-semibold">€49</p>
                </div>
                <div className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                    <Zap size={16} />
                    Visibility boost
                  </div>
                  <p className="mt-2 text-2xl font-semibold">2.4x</p>
                </div>
                <div className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                    <Star size={16} />
                    Featured items
                  </div>
                  <p className="mt-2 text-2xl font-semibold">12</p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Plans</h2>
                  <p className="text-xs text-zinc-500">Mock pricing tiers for store operators.</p>
                </div>
                <div className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
                  Monthly billing
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-lg border bg-white p-5 ${
                      plan.featured ? "border-zinc-950 shadow-sm" : "border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{plan.name}</h3>
                      {plan.featured && (
                        <span className="rounded-full bg-zinc-950 px-2 py-1 text-xs font-medium text-white">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">
                      {plan.price}<span className="text-sm font-normal text-zinc-500">/mo</span>
                    </p>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-500">{plan.description}</p>
                    <button
                      className={`mt-5 h-9 w-full rounded-md text-sm font-medium ${
                        plan.featured
                          ? "bg-zinc-950 text-white"
                          : "border border-zinc-200 text-zinc-700"
                      }`}
                    >
                      {plan.featured ? "Manage plan" : "Switch plan"}
                    </button>
                    <div className="mt-5 space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-zinc-600">
                          <Check size={15} className="text-emerald-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-5 py-4">
                <h2 className="text-sm font-semibold">Recent invoices</h2>
              </div>
              <div className="divide-y divide-zinc-100">
                {invoices.map((invoice) => (
                  <div key={invoice.date} className="flex items-center justify-between px-5 py-4 text-sm">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                  <p className="text-xs text-zinc-500">Local plan subscription</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="tabular-nums">{invoice.amount}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
