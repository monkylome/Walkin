import { NextRequest, NextResponse } from "next/server";
import { allItems, storeLocations } from "@/app/lib/data";

export type SearchResult = {
  store: string;
  item: string;
  price: number;
  stock: number;
  distanceM: number;
  detourMinutes: number;
};

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const lat = parseFloat(searchParams.get("lat") ?? "37.9755");
  const lng = parseFloat(searchParams.get("lng") ?? "23.7348");

  if (!q) return NextResponse.json([]);

  const results: SearchResult[] = allItems
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
          const distanceM = loc
            ? Math.round(haversineMeters(lat, lng, loc.lat, loc.lng))
            : 99999;
          const detourMinutes = Math.max(1, Math.round(distanceM / 250));
          return {
            store: s.name,
            item: item.name,
            price: s.price,
            stock: s.stock,
            distanceM,
            detourMinutes,
          };
        })
    )
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, 3);

  return NextResponse.json(results);
}
