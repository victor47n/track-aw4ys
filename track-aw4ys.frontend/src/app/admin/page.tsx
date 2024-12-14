"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../_hooks/use-map";
import { socket } from "@/_utils/socket-io";
import type { NewPoints } from "../driver/_components/map-driver";

export default function AdminPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map) return;

    socket.on("server:new-points:list", async (data: NewPoints) => {
      console.log(data);

      if (!map.hasRoute(data.routeId)) {
        const response = await fetch(
          `http://localhost:3001/api/routes/${data.routeId}`
        );
        const route = await response.json();

        const { start_location, end_location } =
          route.directions.routes[0].legs[0];

        map.addRouteWithIcons({
          routeId: data.routeId,
          startMarkerOptions: {
            position: start_location,
          },
          endMarkerOptions: {
            position: end_location,
          },
          carMarkerOptions: {
            position: start_location,
          },
        });
      }

      map.moveCar(data.routeId, { lat: data.lat, lng: data.lng });
    });

    return () => {
      socket.disconnect();
    };
  }, [map]);

  return <div className="w-[100wh] h-[100vh]" ref={mapContainerRef} />;
}
