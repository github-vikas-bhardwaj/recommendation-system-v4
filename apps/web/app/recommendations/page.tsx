import type { Metadata } from "next";

import { RecommendationPillList } from "@/app/components/recommendations/RecommendationPillList";
import { RecommendationsHeader } from "@/app/components/recommendations/RecommendationsHeader";
import { RecommendationsPageShell } from "@/app/components/recommendations/RecommendationsPageShell";
import { listWatchedShows } from "@/lib/watched/queries";

export const metadata: Metadata = {
  title: "Recommendations — ReelMind",
  description: "Your personalized movie and show recommendations.",
};

export default async function RecommendationsPage() {
  const watchedShows = await listWatchedShows();

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
