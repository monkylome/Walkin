"use client";

import { useState } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { LocateFixed, LoaderCircle, MapPin } from "lucide-react";
import BottomSheet, { SheetStore } from "@/app/components/bottom-sheet";
import { useTheme, themes } from "@/app/components/theme-provider";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;

type UserLocation = {
  position: { lat: number; lng: number };
};

const stores: SheetStore[] = [
  {
    id: 1,
    name: "Papageorgiou Hardware",
    category: "Hardware",
    distance: "0.3 km",
    walkTime: "4 min",
    itemCount: 8,
    items: [
      { name: "Allen Key Set",     stock: 5 },
      { name: "Work Gloves L",     stock: 2 },
      { name: "Masking Tape 50mm", stock: 11 },
    ],
  },
  {
    id: 2,
    name: "TechStop Kolonaki",
    category: "Electronics",
    distance: "0.7 km",
    walkTime: "9 min",
    itemCount: 24,
    items: [
      { name: "HDMI Cable 2m",   stock: 7 },
      { name: "USB-C Hub",        stock: 3 },
      { name: "Phone Stand",      stock: 1 },
    ],
  },
  {
    id: 3,
    name: "ProBuild Supplies",
    category: "Tools",
    distance: "1.2 km",
    walkTime: "15 min",
    itemCount: 15,
    items: [
      { name: "DeWalt 20V Drill",  stock: 3 },
      { name: "Bosch Circular Saw", stock: 1 },
      { name: "Safety Goggles",    stock: 8 },
    ],
  },
];

const positions: Record<number, { lat: number; lng: number }> = {
  1: { lat: 37.9792, lng: 23.7404 },
  2: { lat: 37.9768, lng: 23.7432 },
  3: { lat: 37.9751, lng: 23.7368 },
};

function StorePin({ active, color }: { active: boolean; color: string }) {
  return (
    <MapPin
      size={40}
      fill="white"
      color={color}
      strokeWidth={active ? 2.2 : 1.8}
      style={{
        filter: "drop-shadow(0 4px 8px rgb(0 0 0 / 0.25))",
        transition: "transform 0.15s ease",
        transform: active ? "scale(1.2)" : "scale(1)",
      }}
    />
  );
}

function CurrentLocationDot() {
  return (
    <div className="h-4 w-4 rounded-full border-2 border-white bg-primary shadow-md" />
  );
}

function LocateButton({ onLocated }: { onLocated: (location: UserLocation) => void }) {
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
        onLocated({ position: center });
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
      style={{ bottom: "calc(6.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {locating ? (
        <LoaderCircle size={21} className="animate-spin" />
      ) : (
        <LocateFixed size={21} strokeWidth={2.1} />
      )}
    </button>
  );
}

export default function MapPage() {
  const [selected, setSelected] = useState<SheetStore | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const { theme } = useTheme();
  const pinColor = themes[theme].accent;

  return (
    <div className="h-full w-full relative">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={{ lat: 37.9775, lng: 23.7400 }}
          defaultZoom={15}
          mapId="walkin-map"
          disableDefaultUI
          style={{ width: "100%", height: "100%" }}
          onClick={() => setSelected(null)}
        >
          {userLocation && (
            <AdvancedMarker position={userLocation.position}>
              <CurrentLocationDot />
            </AdvancedMarker>
          )}
          {stores.map((store) => (
            <AdvancedMarker
              key={store.id}
              position={positions[store.id]}
              onClick={() => setSelected(store)}
            >
              <StorePin active={selected?.id === store.id} color={pinColor} />
            </AdvancedMarker>
          ))}
        </Map>
        <LocateButton onLocated={setUserLocation} />
      </APIProvider>

      <BottomSheet store={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
