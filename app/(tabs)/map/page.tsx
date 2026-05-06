"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!;

const stores = [
  { id: 1, name: "Papageorgiou Hardware", lat: 37.9792, lng: 23.7404 },
  { id: 2, name: "TechStop Kolonaki", lat: 37.9768, lng: 23.7432 },
  { id: 3, name: "ProBuild Supplies", lat: 37.9751, lng: 23.7368 },
];

function StorePin() {
  return (
    <svg width="32" height="42" viewBox="-3 -3 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="white"
        stroke="#2563eb"
        strokeWidth="2"
      />
      <circle cx="14" cy="14" r="4" fill="#2563eb" />
    </svg>
  );
}

export default function MapPage() {
  return (
    <div className="h-full w-full">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={{ lat: 37.9775, lng: 23.7400 }}
          defaultZoom={15}
          mapId="walkin-map"
          disableDefaultUI
          style={{ width: "100%", height: "100%" }}
        >
          {stores.map((store) => (
            <AdvancedMarker
              key={store.id}
              position={{ lat: store.lat, lng: store.lng }}
            >
              <StorePin />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
