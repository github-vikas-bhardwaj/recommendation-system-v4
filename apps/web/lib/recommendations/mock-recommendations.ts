import { mockShows } from "@/lib/shows/mock-shows";
import type { Show } from "@/lib/shows/types";

/** Mock recommendations for UI — replace with API data later. */
export function getMockRecommendations(): Show[] {
  return mockShows.slice(0, 12);
}
