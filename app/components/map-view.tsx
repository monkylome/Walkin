"use client";

import { useEffect, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { LocateFixed, LoaderCircle } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;

export type MapPoint = {
  id: string;
  position: { lat: number; lng: number };
  featured?: boolean;
} & (
  | { kind: "price"; price: number; outOfStock?: boolean }
  | { kind: "store"; initials: string; accentClass: string }
);

const FEATURED_HALO = "0 0 0 2px #f59e0b";

type UserLocation = { lat: number; lng: number };

type Props = {
  points: MapPoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onMapClick?: () => void;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
};

function PricePin({
  price,
  selected,
  dimmed,
  featured,
}: {
  price: number;
  selected: boolean;
  dimmed: boolean;
  featured: boolean;
}) {
  let cls = "bg-background text-foreground border-border";
  if (dimmed)        cls = "bg-background/80 text-muted border-border";
  else if (selected) cls = "bg-primary text-white border-primary";

  const baseShadow = "0 4px 10px rgb(0 0 0 / 0.18)";

  return (
    <div
      className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border whitespace-nowrap ${cls}`}
      style={{
        boxShadow: featured ? `${FEATURED_HALO}, ${baseShadow}` : baseShadow,
        transform: selected ? "scale(1.12)" : "scale(1)",
        transition: "transform 0.15s ease",
      }}
    >
      €{price.toFixed(2)}
    </div>
  );
}

function StorePin({
  initials,
  accentClass,
  selected,
  featured,
}: {
  initials: string;
  accentClass: string;
  selected: boolean;
  featured: boolean;
}) {
  const baseShadow = "0 4px 10px rgb(0 0 0 / 0.25)";

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 border-white text-white font-bold ${accentClass}`}
      style={{
        width: selected ? 44 : 36,
        height: selected ? 44 : 36,
        fontSize: selected ? 13 : 11,
        boxShadow: featured ? `${FEATURED_HALO}, ${baseShadow}` : baseShadow,
        transition: "all 0.15s ease",
      }}
    >
      {initials}
    </div>
  );
}

function CurrentLocationDot() {
  return <div className="h-4 w-4 rounded-full border-2 border-white bg-primary shadow-md" />;
}

function PanToSelected({ selectedId, points }: { selectedId: string | null; points: MapPoint[] }) {
  const map = useMap();
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedId) {
      lastId.current = null;
      return;
    }
    if (!map || selectedId === lastId.current) return;
    const point = points.find((p) => p.id === selectedId);
    if (!point) return;
    lastId.current = selectedId;
    map.panTo(point.position);
  }, [map, selectedId, points]);

  return null;
}

function LocateButton({ onLocated }: { onLocated: (loc: UserLocation) => void }) {
  const map = useMap();
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const centerOnUser = () => {
    if (!map || locating) return;
    if (!navigator.geolocation) {
      setError("Location is not available in this browser.");
      return;
    }
    setError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const center = { lat: coords.latitude, lng: coords.longitude };
        onLocated(center);
        map.panTo(center);
        map.setZoom(16);
        setLocating(false);
      },
      () => {
        setError("Location permission was denied.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <button
      type="button"
      aria-label="Center map on your location"
      title={error ?? "Center map on your location"}
      disabled={!map || locating}
      onClick={centerOnUser}
      className="absolute right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-lg transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
      style={{ bottom: "calc(7.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {locating ? (
        <LoaderCircle size={21} className="animate-spin" />
      ) : (
        <LocateFixed size={21} strokeWidth={2.1} />
      )}
    </button>
  );
}

export default function MapView({
  points,
  selectedId,
  onSelect,
  onMapClick,
  defaultCenter = { lat: 37.9775, lng: 23.7400 },
  defaultZoom = 15,
}: Props) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  return (
    <div className="h-full w-full relative">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapId="walkin-map"
          disableDefaultUI
          style={{ width: "100%", height: "100%" }}
          onClick={onMapClick}
        >
          {userLocation && (
            <AdvancedMarker position={userLocation}>
              <CurrentLocationDot />
            </AdvancedMarker>
          )}
          <PanToSelected selectedId={selectedId ?? null} points={points} />
          {points.map((p) => {
            const selected = selectedId === p.id;
            const outOfStock = p.kind === "price" && Boolean(p.outOfStock);
            const dimmed = outOfStock;
            return (
              <AdvancedMarker
                key={p.id}
                position={p.position}
                onClick={() => onSelect?.(p.id)}
                zIndex={selected ? 100 : outOfStock ? 1 : 10}
              >
                {p.kind === "price" ? (
                  <PricePin price={p.price} selected={selected} dimmed={dimmed} featured={Boolean(p.featured)} />
                ) : (
                  <StorePin initials={p.initials} accentClass={p.accentClass} selected={selected} featured={Boolean(p.featured)} />
                )}
              </AdvancedMarker>
            );
          })}
        </Map>
        <LocateButton onLocated={setUserLocation} />
      </APIProvider>
    </div>
  );
}
