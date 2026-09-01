/// <reference types="google.maps" />
"use client";

import { useEffect, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker, useMap, ColorScheme, useMapsLibrary } from "@vis.gl/react-google-maps";
import { LocateFixed, LocateOff, LoaderCircle } from "lucide-react";
import { useMode } from "@/app/components/theme-provider";

import { categoryIcon, pinColorFor } from "@/app/lib/categories";
import { Package } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;

export type MapPoint = {
  id: string;
  position: { lat: number; lng: number };
  featured?: boolean;
} & (
  | { kind: "price"; price: number; outOfStock?: boolean }
  | { kind: "store"; initials: string; accentClass: string; category: string }
);

const FEATURED_HALO = "0 0 0 2px #f59e0b";

export type RouteConfig = {
  origin: string;
  destination: string;
  waypoint?: string;
};

function RouteLayer({ config }: { config: RouteConfig }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLib || !map) return;
    const renderer = new routesLib.DirectionsRenderer({ suppressMarkers: true });
    renderer.setMap(map);
    rendererRef.current = renderer;
    return () => { renderer.setMap(null); rendererRef.current = null; };
  }, [routesLib, map]);

  useEffect(() => {
    if (!routesLib || !rendererRef.current) return;
    const service = new routesLib.DirectionsService();
    service.route(
      {
        origin: config.origin,
        destination: config.destination,
        waypoints: config.waypoint ? [{ location: config.waypoint, stopover: true }] : [],
        travelMode: routesLib.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) rendererRef.current?.setDirections(result);
      }
    );
  }, [routesLib, config.origin, config.destination, config.waypoint]);

  return null;
}

type UserLocation = { lat: number; lng: number };

type Props = {
  points: MapPoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onMapClick?: () => void;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  routeConfig?: RouteConfig;
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
  name,
  category,
  selected,
  featured,
}: {
  name: string;
  category: string;
  selected: boolean;
  featured: boolean;
}) {
  const baseShadow = "0 4px 10px rgb(0 0 0 / 0.25)";
  const Icon = categoryIcon[category] ?? Package;
  const color = pinColorFor(category);
  const size = selected ? 36 : 28;

  return (
    <div className="flex items-center gap-1.5" style={{ transition: "all 0.15s ease", transform: `translateY(-${size / 2 + 4}px)` }}>
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center rounded-full border-2 border-white ${color}`}
          style={{
            width: size,
            height: size,
            boxShadow: featured ? `${FEATURED_HALO}, ${baseShadow}` : baseShadow,
          }}
        >
          <Icon size={selected ? 16 : 13} strokeWidth={2.2} className="text-white" />
        </div>
        <div
          className={`w-2 h-2 rotate-45 -mt-1.25 border-b-2 border-r-2 border-white ${color}`}
          style={{ boxShadow: "2px 2px 4px rgb(0 0 0 / 0.15)" }}
        />
      </div>
      <div className="flex flex-col ml-0.5" style={{ WebkitTextStroke: "2px var(--app-bg)", paintOrder: "stroke fill" }}>
        <span className="text-[11px] font-bold text-foreground leading-tight whitespace-nowrap">{name}</span>
        <span className="text-[10px] text-foreground leading-tight whitespace-nowrap">{category}</span>
      </div>
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
      className={`absolute right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
        error
          ? "border-red-200 bg-red-50 text-red-500"
          : "border-border bg-surface text-primary hover:bg-background"
      }`}
      style={{ bottom: "calc(7.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {locating ? (
        <LoaderCircle size={21} className="animate-spin" />
      ) : error ? (
        <LocateOff size={21} strokeWidth={2.1} />
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
  defaultCenter = { lat: 38.0345, lng: 23.7530 },
  defaultZoom = 15,
  routeConfig,
}: Props) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const { effectiveMode } = useMode();

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.permissions?.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
          () => {},
          { maximumAge: 60000 }
        );
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="h-full w-full relative">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapId="f88c6801e8382e068890f459"
          colorScheme={effectiveMode === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT}
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
          {routeConfig && <RouteLayer config={routeConfig} />}
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
                  <StorePin name={p.id} category={p.category} selected={selected} featured={Boolean(p.featured)} />
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
