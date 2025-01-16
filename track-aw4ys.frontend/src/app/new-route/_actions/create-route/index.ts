"use server";

import { revalidateTag } from "next/cache";
import type { CreateRouteSchema } from "./schema";

export async function createRoute({
  sourceId,
  destinationId,
}: CreateRouteSchema) {
  const directionsResponse = await fetch(
    `${process.env.NEST_API_URL}/directions?originId=${sourceId}&destinationId=${destinationId}`,
    {
      // cache: "force-cache", //default
      // next: {
      //   revalidate: 1 * 60 * 60 * 24, // 1 dia
      // }
    }
  );

  if (!directionsResponse.ok) {
    console.error(await directionsResponse.text());
    return { error: "Failed to fetch directions" };
  }

  const directionsData = await directionsResponse.json();

  const startAddress = directionsData.routes[0].legs[0].start_address;
  const endAddress = directionsData.routes[0].legs[0].end_address;

  const response = await fetch(`${process.env.NEST_API_URL}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${startAddress} - ${endAddress}`,
      source_id: directionsData.request.origin.place_id.replace(
        "place_id:",
        ""
      ),
      destination_id: directionsData.request.destination.place_id.replace(
        "place_id:",
        ""
      ),
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Failed to create route");
  }

  revalidateTag("routes");

  return "Rota criada com sucesso!";
}
