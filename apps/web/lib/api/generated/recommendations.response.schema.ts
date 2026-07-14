import { z } from "zod";

export const recommendationResponseSchema = z
  .object({ recommendedShowIds: z.array(z.number().int()) })
  .strict();
