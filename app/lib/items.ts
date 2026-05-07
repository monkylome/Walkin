export type StoreAvailability = { name: string; distance: string; walkTime: string };
export type Item = { name: string; category: string; stores: StoreAvailability[] };

export const allItems: Item[] = [
  { name: "Allen Key Set",      category: "Hardware",    stores: [{ name: "Papageorgiou Hardware", distance: "0.3 km", walkTime: "4 min"  }] },
  { name: "Masking Tape 50mm",  category: "Hardware",    stores: [{ name: "Papageorgiou Hardware", distance: "0.3 km", walkTime: "4 min"  }] },
  { name: "HDMI Cable 2m",      category: "Electronics", stores: [{ name: "TechStop Kolonaki",     distance: "0.7 km", walkTime: "9 min"  }] },
  { name: "USB-C Hub",          category: "Electronics", stores: [{ name: "TechStop Kolonaki",     distance: "0.7 km", walkTime: "9 min"  }] },
  { name: "Phone Stand",        category: "Electronics", stores: [{ name: "TechStop Kolonaki",     distance: "0.7 km", walkTime: "9 min"  }] },
  { name: "DeWalt 20V Drill",   category: "Tools",       stores: [{ name: "ProBuild Supplies",     distance: "1.2 km", walkTime: "15 min" }] },
  { name: "Bosch Circular Saw", category: "Tools",       stores: [{ name: "ProBuild Supplies",     distance: "1.2 km", walkTime: "15 min" }] },
  {
    name: "Work Gloves L", category: "Apparel",
    stores: [
      { name: "Papageorgiou Hardware", distance: "0.3 km", walkTime: "4 min"  },
      { name: "ProBuild Supplies",     distance: "1.2 km", walkTime: "15 min" },
    ],
  },
  {
    name: "Safety Goggles", category: "Tools",
    stores: [
      { name: "Papageorgiou Hardware", distance: "0.3 km", walkTime: "4 min"  },
      { name: "ProBuild Supplies",     distance: "1.2 km", walkTime: "15 min" },
    ],
  },
  {
    name: "Screwdriver Set", category: "Tools",
    stores: [
      { name: "Papageorgiou Hardware", distance: "0.3 km", walkTime: "4 min"  },
      { name: "ProBuild Supplies",     distance: "1.2 km", walkTime: "15 min" },
    ],
  },
];

export function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function itemBySlug(slug: string) {
  return allItems.find((item) => toSlug(item.name) === slug) ?? null;
}
