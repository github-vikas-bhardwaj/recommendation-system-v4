import type { Metadata } from "next";

import { RecommendationPillList } from "@/app/components/recommendations/RecommendationPillList";
import { RecommendationsHeader } from "@/app/components/recommendations/RecommendationsHeader";
import { RecommendationsPageShell } from "@/app/components/recommendations/RecommendationsPageShell";
import { getMockRecommendations } from "@/lib/recommendations/mock-recommendations";

export const metadata: Metadata = {
  title: "Recommendations — ReelMind",
  description: "Your personalized movie and show recommendations.",
};

export default function RecommendationsPage() {
  const recommendations = getMockRecommendations();
  return (
    <RecommendationsPageShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <RecommendationsHeader count={recommendations.length} />
        <section aria-label="Recommended shows">
          <RecommendationPillList shows={recommendations} />
        </section>
      </div>
    </RecommendationsPageShell>
  );
}
