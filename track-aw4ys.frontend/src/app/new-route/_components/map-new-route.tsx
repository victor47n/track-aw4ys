"use client";

import { useMap } from "@/_hooks/use-map";
import type { DirectionsData } from "@/_types/directions-data";
import { useEffect, useRef } from "react";

export type MapNewRouteProps = {
  directionsData: DirectionsData;
};

export function MapNewRoute({ directionsData }: MapNewRouteProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !directionsData) return;

    map.removeAllRoutes();
    map.addRouteWithIcons({
      routeId: "1",
      startMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: directionsData.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
    });
  }, [map, directionsData]);

  return <div className="h-full w-full" ref={mapContainerRef} />;
}
