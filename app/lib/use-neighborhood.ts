"use client";

import { useState, useCallback, useEffect } from "react";

type LocationState = { name: string; denied: boolean };

function reverseGeocode(lat: number, lon: number): Promise<string> {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=16&addressdetails=1`,
    { headers: { "Accept-Language": "en" } }
  )
    .then(res => res.json())
    .then(data => {
      const addr = data.address;
      return addr.suburb || addr.neighbourhood || addr.city_district || addr.town || addr.city || "Nearby";
    });
}

export function useNeighborhood() {
  const [state, setState] = useState<LocationState>({ name: "Locating…", denied: false });

  const locate = useCallback(() => {
    if (!navigator.geolocation) { setState({ name: "Athens", denied: true }); return; }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          .then(area => setState({ name: area, denied: false }))
          .catch(() => setState({ name: "Athens", denied: false }));
      },
      () => setState({ name: "", denied: true }),
      { timeout: 5000 }
    );
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- geolocation is an external system subscription
  useEffect(() => { locate(); }, [locate]);

  return { ...state, retry: locate };
}
