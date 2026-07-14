import { z } from "zod";

export const recommendationRequestSchema = z
  .object({ showIds: z.array(z.number().int()).min(1) })
  .strict();
