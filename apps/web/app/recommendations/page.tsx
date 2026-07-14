import type { Metadata } from "next";

import { RecommendationPillList } from "@/app/components/recommendations/RecommendationPillList";
import { RecommendationsHeader } from "@/app/components/recommendations/RecommendationsHeader";
import { RecommendationsPageShell } from "@/app/components/recommendations/RecommendationsPageShell";
import { fetchRecommendations } from "@/lib/api/recommendations";
import { listWatchedShows } from "@/lib/watched/queries";

export const metadata: Metadata = {
  title: "Recommendations — ReelMind",
  description: "Your personalized movie and show recommendations.",
};

export default async function RecommendationsPage() {
  const watchedShows = await listWatchedShows();
  const showIds = watchedShows.map((show) => show.id);

  // Stub phase: call the BFF, but don't fail the page if the API is down
  // (Playwright CI, Render cold start). Wire ui to apiResult next.
  try {
    await fetchRecommendations(showIds);
  } catch {
    // Intentionally ignored until recommendations UI consumes the response.
  }

  return (
    <RecommendationsPageShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <RecommendationsHeader count={watchedShows.length} />
        <section aria-label="Watched shows">
          <RecommendationPillList shows={watchedShows} />
        </section>
      </div>
    </RecommendationsPageShell>
  );
}
