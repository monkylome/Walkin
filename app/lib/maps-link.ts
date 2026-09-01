export function buildMapsUrl({
  originLat,
  originLng,
  waypointLat,
  waypointLng,
  destLat,
  destLng,
  mode = "driving",
}: {
  originLat: number;
  originLng: number;
  waypointLat: number;
  waypointLng: number;
  destLat?: number;
  destLng?: number;
  mode?: "driving" | "transit" | "walking";
}): string {
  const origin = `${originLat},${originLng}`;
  const waypoint = `${waypointLat},${waypointLng}`;
  const hasDest = destLat != null && destLng != null;
  const destination = hasDest ? `${destLat},${destLng}` : waypoint;

  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: mode,
  });

  if (hasDest) params.set("waypoints", waypoint);

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
