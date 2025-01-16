import { z } from "zod";

export const startRouteSchema = z.object({
  routeId: z.string(),
});

export type StartRouteSchema = z.infer<typeof startRouteSchema>;
