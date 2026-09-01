import { allItems, storeLocations, neighborhoods } from "@/app/lib/data";

export type SearchResult = {
  store: string;
  item: string;
  category: string;
  price: number;
  stock: number;
  storeLat: number;
  storeLng: number;
  distanceM: number;
  detourMinutes: number;
  inNeighborhood: string | null;
  storeSlug: string;
  itemSlug: string;
};

const DRIVING_METERS_PER_MIN = 700;
const NEIGHBORHOOD_RADIUS_M = 1500;

export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function resolveNeighborhoodNames(
  names: string[]
): Array<{ lat: number; lng: number }> {
  return names.flatMap((name) => {
    const entry = Object.entries(neighborhoods).find(
      ([k]) => k.toLowerCase() === name.toLowerCase()
    );
    return entry ? [{ lat: entry[1].lat, lng: entry[1].lng }] : [];
  });
}

function closestNeighborhood(lat: number, lng: number): string | null {
  let bestName: string | null = null;
  let bestDist = Infinity;
  for (const [name, c] of Object.entries(neighborhoods)) {
    const d = haversineMeters(lat, lng, c.lat, c.lng);
    if (d < bestDist) {
      bestDist = d;
      bestName = name;
    }
  }
  return bestDist < NEIGHBORHOOD_RADIUS_M ? bestName : null;
}

export function searchInventory(params: {
  q: string;
  lat: number;
  lng: number;
  destLat?: number;
  destLng?: number;
  nearPoints?: Array<{ lat: number; lng: number }>;
  sortBy?: "detour" | "price" | "stock";
}): SearchResult[] {
  const { q, lat, lng, sortBy = "detour" } = params;
  const destLat = params.destLat ?? NaN;
  const destLng = params.destLng ?? NaN;
  const hasDest = Number.isFinite(destLat) && Number.isFinite(destLng);
  const directM = hasDest ? haversineMeters(lat, lng, destLat, destLng) : 0;
  const nearPoints = params.nearPoints ?? [];
  const hasNear = nearPoints.length > 0;
  const qLower = q.toLowerCase().trim();

  if (!qLower) return [];

  const candidates = allItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(qLower) ||
        item.category.toLowerCase().includes(qLower)
    )
    .flatMap((item) =>
      item.stores
        .filter((s) => s.stock > 0)
        .map((s) => {
          const loc = storeLocations[s.name];
          if (!loc) return null;

          const distanceM = Math.round(haversineMeters(lat, lng, loc.lat, loc.lng));

          let nearestNearM = Infinity;
          for (const p of nearPoints) {
            const d = haversineMeters(p.lat, p.lng, loc.lat, loc.lng);
            if (d < nearestNearM) nearestNearM = d;
          }

          if (hasNear && nearestNearM > NEIGHBORHOOD_RADIUS_M) return null;

          const detourM = hasDest
            ? Math.max(
                0,
                distanceM +
                  haversineMeters(loc.lat, loc.lng, destLat, destLng) -
                  directM
              )
            : distanceM;
          const detourMinutes = Math.max(1, Math.round(detourM / DRIVING_METERS_PER_MIN));

          return {
            store: s.name,
            item: item.name,
            category: item.category,
            price: s.price,
            stock: s.stock,
            storeLat: loc.lat,
            storeLng: loc.lng,
            distanceM,
            detourMinutes,
            inNeighborhood: closestNeighborhood(loc.lat, loc.lng),
            storeSlug: slugify(s.name),
            itemSlug: slugify(item.name),
            _sortKey: hasNear ? nearestNearM : detourM,
          };
        })
    )
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "stock") return b.stock - a.stock;
      return a._sortKey - b._sortKey;
    })
    .slice(0, 5);

  return candidates.map(({ _sortKey, ...rest }) => {
    void _sortKey;
    return rest;
  });
}
