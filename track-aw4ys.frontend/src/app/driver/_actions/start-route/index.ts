"use server";

import type { StartRouteSchema } from "./schema";

export async function startRoute({ routeId }: StartRouteSchema) {
  if (!routeId) {
    return { error: "Route ID is required" };
  }

  const response = await fetch(
    `${process.env.NEST_API_URL}/routes/${routeId}/start`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    console.error(await response.text());
    return { error: "Failed to start route" };
  }

  return { success: true };
}
