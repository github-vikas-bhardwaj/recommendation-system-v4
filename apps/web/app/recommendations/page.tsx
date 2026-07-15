import type { Metadata } from "next";
import { Suspense } from "react";

import { RecommendationsPageContent } from "@/app/components/recommendations/RecommendationsPageContent";
import { RecommendationsPageShell } from "@/app/components/recommendations/RecommendationsPageShell";
import { RecommendationsPageSkeleton } from "@/app/components/recommendations/RecommendationsPageSkeleton";

export const metadata: Metadata = {
  title: "Recommendations — ReelMind",
  description: "Your personalized movie and show recommendations.",
};

export default function RecommendationsPage() {
  return (
    <RecommendationsPageShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <Suspense fallback={<RecommendationsPageSkeleton />}>
          <RecommendationsPageContent />
        </Suspense>
      </div>
    </RecommendationsPageShell>
  );
}
