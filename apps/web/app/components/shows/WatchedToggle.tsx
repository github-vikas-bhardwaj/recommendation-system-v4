import { unwatchShowAction, watchShowAction } from "@/actions/watched";

import { WatchedToggleSubmit } from "./WatchedToggleSubmit";

type WatchedToggleProps = {
  showId: number;
  showName: string;
  initialWatched: boolean;
};

export function WatchedToggle({
  showId,
  showName,
  initialWatched,
}: WatchedToggleProps) {
  const action = initialWatched
    ? unwatchShowAction.bind(null, showId)
    : watchShowAction.bind(null, showId);

  const ariaLabel = initialWatched
    ? `Mark ${showName} as not watched`
    : `Mark ${showName} as watched`;

  return (
    <form action={action}>
      <WatchedToggleSubmit ariaLabel={ariaLabel} watched={initialWatched} />
    </form>
  );
}
