import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_ORIGIN, neighborhoods } from "@/app/lib/data";
import { haversineMeters, searchInventory, type SearchResult } from "@/app/lib/search";

export type { SearchResult };

const NEIGHBORHOOD_RADIUS_M = 1500;

type NearPoint = { lat: number; lng: number };

function parseNear(raw: string | null): NearPoint[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((token): NearPoint[] => {
      const coord = token.match(/^(-?\d+\.?\d*):(-?\d+\.?\d*)$/);
      if (coord) return [{ lat: parseFloat(coord[1]), lng: parseFloat(coord[2]) }];
      const match = Object.entries(neighborhoods).find(
        ([n]) => n.toLowerCase() === token.toLowerCase()
      );
      if (match) return [{ lat: match[1].lat, lng: match[1].lng }];
      return [];
    });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const lat = parseFloat(searchParams.get("lat") ?? String(DEFAULT_ORIGIN.lat));
  const lng = parseFloat(searchParams.get("lng") ?? String(DEFAULT_ORIGIN.lng));
  const destLatRaw = searchParams.get("destLat");
  const destLngRaw = searchParams.get("destLng");
  const destLat = destLatRaw != null ? parseFloat(destLatRaw) : undefined;
  const destLng = destLngRaw != null ? parseFloat(destLngRaw) : undefined;
  const sortBy = (searchParams.get("sortBy") ?? "detour") as "detour" | "price" | "stock";

  const nearPoints = parseNear(searchParams.get("near"));

  // Drop near points that are too far from any known neighborhood (stale coord pairs)
  const filteredNear = nearPoints.filter((p) =>
    Object.values(neighborhoods).some(
      (n) => haversineMeters(p.lat, p.lng, n.lat, n.lng) < NEIGHBORHOOD_RADIUS_M * 2
    )
  );

  if (!q) return NextResponse.json([]);

  const results = searchInventory({ q, lat, lng, destLat, destLng, nearPoints: filteredNear, sortBy });
  return NextResponse.json(results);
}
