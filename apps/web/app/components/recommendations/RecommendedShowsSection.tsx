import { ShowCardGrid } from "@/app/components/shows/ShowCardGrid";
import { fetchRecommendations } from "@/lib/api/recommendations";
import { getShowsByIds } from "@/lib/shows/queries";

type RecommendedShowsSectionProps = {
  seedShowIds: number[];
  watchedShowIds: ReadonlySet<number>;
};

export async function RecommendedShowsSection({
  seedShowIds,
  watchedShowIds,
}: RecommendedShowsSectionProps) {
  if (seedShowIds.length === 0) {
    return (
      <ShowCardGrid
        shows={[]}
        watchedShowIds={watchedShowIds}
        emptyTitle="No recommendations yet"
        emptyDescription="Mark a few shows as watched and we'll suggest similar titles."
      />
    );
  }

  let recommendations: { showId: number; score: number }[] = [];
  try {
    const result = await fetchRecommendations(seedShowIds);
    recommendations = result.recommendations;
  } catch {
    return (
      <ShowCardGrid
        shows={[]}
        watchedShowIds={watchedShowIds}
        emptyTitle="Recommendations unavailable"
        emptyDescription="We couldn't load picks right now. Try again in a moment."
      />
    );
  }

  const showIds = recommendations.map((item) => item.showId);
  const matchScoresById = new Map(
    recommendations.map((item) => [item.showId, item.score]),
  );
  const shows = await getShowsByIds(showIds);

  return (
    <ShowCardGrid
      shows={shows}
      watchedShowIds={watchedShowIds}
      matchScoresById={matchScoresById}
      emptyTitle="No recommendations yet"
      emptyDescription="We couldn't find similar titles. Watch a few more shows and try again."
    />
  );
}
