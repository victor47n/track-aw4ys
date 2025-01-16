"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../../_hooks/use-map";
import { socket } from "@/_utils/socket-io";

type Position = {
  lat: number;
  lng: number;
};

export type MapDriverProps = {
  routeIdElementId: string;
};

export type NewPoints = Position & {
  routeId: string;
};

export function MapDriver({ routeIdElementId }: MapDriverProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    console.log(`######### ENTROU NO USE EFFECT`);

    if (!map || !routeIdElementId) return;

    console.log(`######### ANTES DE CONNECTAR`);

    const selectElement = document.querySelector(
      `select[name=${routeIdElementId}]`
    )!;

    console.log(selectElement);

    socket.connect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = async (event: any) => {
      console.log(`######### handler: ${event}`);

      socket.offAny();

      const routeId = event.target!.value;

      socket.on(
        `server:new-points/${routeId}:list`,
        async (data: NewPoints) => {
          console.log(`######### antes do if map-driver route: ${data}`);

          if (!map.hasRoute(routeId)) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_NEXT_API_URL}/routes/${data.routeId}`
            );
            const route = await response.json();

            console.log(`######### map-driver route: ${route}`);

            const { start_location: startLocation, end_location: endLocation } =
              route.directions.routes[0].legs[0];

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
        }
      );
    };

    selectElement.addEventListener("change", handler);

    return () => {
      selectElement.removeEventListener("change", handler);
      socket.disconnect();
    };
  }, [routeIdElementId, map]);

  return <div className="w-full h-full" ref={mapContainerRef} />;
}
