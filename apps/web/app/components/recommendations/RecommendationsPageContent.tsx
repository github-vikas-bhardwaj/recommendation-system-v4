import { GetRecommendationsPanel } from "@/app/components/recommendations/GetRecommendationsPanel";
import { RecommendationPillList } from "@/app/components/recommendations/RecommendationPillList";
import { RecommendationsHeader } from "@/app/components/recommendations/RecommendationsHeader";
import { listWatchedShows } from "@/lib/watched/queries";

export async function RecommendationsPageContent() {
  const watchedShows = await listWatchedShows();
  const watchedShowIds = watchedShows.map((show) => show.id);

  return (
    <>
      <RecommendationsHeader count={watchedShows.length} />

      <section aria-label="Watched shows" className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide text-zinc-300 uppercase">
          Watched
        </h2>
        <RecommendationPillList shows={watchedShows} />
      </section>

      <GetRecommendationsPanel
        key={watchedShowIds
          .slice()
          .sort((a, b) => a - b)
          .join(",")}
        watchedShowIds={watchedShowIds}
      />
    </>
  );
}
