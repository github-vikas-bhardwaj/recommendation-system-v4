import { z } from "zod";

export const recommendationResponseSchema = z
  .object({
    recommendations: z.array(
      z
        .object({
          showId: z.number().int(),
          score: z
            .number()
            .int()
            .gte(0)
            .lte(100)
            .describe("Similarity as a percentage (0-100)."),
        })
        .strict(),
    ),
  })
  .strict();
