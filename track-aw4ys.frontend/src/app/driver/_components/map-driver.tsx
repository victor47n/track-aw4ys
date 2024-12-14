"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../../_hooks/use-map";
import { socket } from "@/_utils/socket-io";

type Position = {
  lat: number;
  lng: number;
};

export type MapDriverProps = {
  routeId: string | null;
  startLocation: Position | null;
  endLocation: Position | null;
};

export type NewPoints = Position & {
  routeId: string;
};

export function MapDriver({
  routeId,
  startLocation,
  endLocation,
}: MapDriverProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !routeId || !startLocation || !endLocation) return;

    if (socket.disconnected) {
      socket.connect();
    } else {
      socket.offAny();
    }

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("client:new-points", { routeId });
    });

    socket.on(`server:new-points/${routeId}:list`, (data: NewPoints) => {
      if (!map.hasRoute(routeId)) {
        map.addRouteWithIcons({
          routeId: data.routeId,
          startMarkerOptions: {
            position: startLocation,
          },
          endMarkerOptions: {
            position: endLocation,
          },
          carMarkerOptions: {
            position: startLocation,
          },
        });
      }

      map.moveCar(data.routeId, { lat: data.lat, lng: data.lng });
    });

    return () => {
      socket.disconnect();
    };
  }, [routeId, startLocation, endLocation, map]);

  return <div className="w-full h-full" ref={mapContainerRef} />;
}
