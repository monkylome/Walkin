const featuredItems = [
  { id: 1, name: "DeWalt 20V Drill Kit", category: "Power Tools", stock: 3, color: "from-orange-500/20 to-amber-500/10", dot: "bg-orange-400" },
  { id: 2, name: "Bosch Circular Saw", category: "Power Tools", stock: 1, color: "from-red-500/20 to-rose-500/10", dot: "bg-red-400" },
  { id: 3, name: "Stanley Tape 5m", category: "Hand Tools", stock: 14, color: "from-yellow-500/20 to-lime-500/10", dot: "bg-yellow-400" },
  { id: 4, name: "3M Safety Goggles", category: "Safety Gear", stock: 8, color: "from-blue-500/20 to-cyan-500/10", dot: "bg-blue-400" },
  { id: 5, name: "Milwaukee Level 48\"", category: "Measuring", stock: 2, color: "from-violet-500/20 to-purple-500/10", dot: "bg-violet-400" },
  { id: 6, name: "Makita Random Sander", category: "Power Tools", stock: 5, color: "from-emerald-500/20 to-teal-500/10", dot: "bg-emerald-400" },
];

const navItems = ["Dashboard", "Inventory", "Orders", "Analytics", "Settings"];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Top Nav */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              WalkIn <span className="text-zinc-400 dark:text-zinc-500 font-normal">/ Store</span>
            </span>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    item === "Dashboard"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-300">
            A
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Featured Items</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Items highlighted to customers browsing nearby
            </p>
          </div>
          <button className="text-sm px-3.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium">
            + Add item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className={`h-32 bg-linear-to-br ${item.color} flex items-center justify-center relative`}>
                <div className={`w-10 h-10 rounded-full ${item.dot} opacity-30`} />
                <span className="absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Featured
                </span>
                {item.stock <= 2 && (
                  <span className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                    Low stock
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">{item.name}</h3>
                    <span className="inline-block mt-1 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{item.stock}</div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500">in stock</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 text-xs py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 text-xs py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    Unfeature
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
