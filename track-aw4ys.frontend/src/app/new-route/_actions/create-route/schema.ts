import { z } from "zod";

export const createRouteSchema = z.object({
  sourceId: z.string(),
  destinationId: z.string(),
});

export type CreateRouteSchema = z.infer<typeof createRouteSchema>;
