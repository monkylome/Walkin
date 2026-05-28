import { NextRequest, NextResponse } from "next/server";
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
const NEIGHBORHOOD_RADIUS_M = 1500; // a store within 1.5km of a neighborhood centroid counts as "in" it

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type NearPoint = { name: string | null; lat: number; lng: number };

function parseNear(raw: string | null): NearPoint[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((token): NearPoint[] => {
      // numeric "lat:lng" pair
      const coord = token.match(/^(-?\d+\.?\d*):(-?\d+\.?\d*)$/);
      if (coord) return [{ name: null, lat: parseFloat(coord[1]), lng: parseFloat(coord[2]) }];
      // neighborhood name lookup (case-insensitive)
      const match = Object.entries(neighborhoods).find(
        ([n]) => n.toLowerCase() === token.toLowerCase()
      );
      if (match) return [{ name: match[0], lat: match[1].lat, lng: match[1].lng }];
      return [];
    });
}

function closestNeighborhood(lat: number, lng: number): string | null {
  let bestName: string | null = null;
  let bestDist = Infinity;
  for (const [name, c] of Object.entries(neighborhoods)) {
    const d = haversineMeters(lat, lng, c.lat, c.lng);
    if (d < bestDist) { bestDist = d; bestName = name; }
  }
  return bestDist < NEIGHBORHOOD_RADIUS_M ? bestName : null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const lat = parseFloat(searchParams.get("lat") ?? "37.9755");
  const lng = parseFloat(searchParams.get("lng") ?? "23.7348");
  const destLatRaw = searchParams.get("destLat");
  const destLngRaw = searchParams.get("destLng");
  const destLat = destLatRaw != null ? parseFloat(destLatRaw) : NaN;
  const destLng = destLngRaw != null ? parseFloat(destLngRaw) : NaN;
  const hasDest = Number.isFinite(destLat) && Number.isFinite(destLng);
  const directM = hasDest ? haversineMeters(lat, lng, destLat, destLng) : 0;

  const nearPoints = parseNear(searchParams.get("near"));
  const hasNear = nearPoints.length > 0;

  if (!q) return NextResponse.json([]);

  const candidates = allItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
    .flatMap((item) =>
      item.stores
        .filter((s) => s.stock > 0)
        .map((s) => {
          const loc = storeLocations[s.name];
          if (!loc) return null;

          const distanceM = Math.round(haversineMeters(lat, lng, loc.lat, loc.lng));

          // Distance to nearest "near" anchor — used both for filtering and for detour calc
          let nearestNearM = Infinity;
          for (const p of nearPoints) {
            const d = haversineMeters(p.lat, p.lng, loc.lat, loc.lng);
            if (d < nearestNearM) nearestNearM = d;
          }

          // When a `near` filter is set, drop stores that aren't within radius of any anchor
          if (hasNear && nearestNearM > NEIGHBORHOOD_RADIUS_M) return null;

          // Detour cost in meters: orig→store→dest minus the direct orig→dest leg.
          // Without a destination, use raw distance from origin.
          const detourM = hasDest
            ? Math.max(0, distanceM + haversineMeters(loc.lat, loc.lng, destLat, destLng) - directM)
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
            // Internal sort key — not in SearchResult
            _sort: hasNear ? nearestNearM : detourM,
          };
        })
    )
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => a._sort - b._sort)
    .slice(0, 5);

  const results: SearchResult[] = candidates.map((c) => {
    const { _sort, ...rest } = c;
    void _sort;
    return rest;
  });
  return NextResponse.json(results);
}
