import { RecommendationsPageShell } from "@/app/components/recommendations/RecommendationsPageShell";
import { RecommendationsPageSkeleton } from "@/app/components/recommendations/RecommendationsPageSkeleton";

export default function RecommendationsLoading() {
  return (
    <RecommendationsPageShell>
      <RecommendationsPageSkeleton />
    </RecommendationsPageShell>
  );
}
