import { isShowWatched } from "@/lib/watched/queries";

import { WatchedToggle } from "./WatchedToggle";

type ShowDetailWatchedToggleProps = {
  showId: number;
  showName: string;
};

export async function ShowDetailWatchedToggle({
  showId,
  showName,
}: ShowDetailWatchedToggleProps) {
  const initialWatched = await isShowWatched(showId);

  return (
    <WatchedToggle
      showId={showId}
      showName={showName}
      initialWatched={initialWatched}
    />
  );
}
