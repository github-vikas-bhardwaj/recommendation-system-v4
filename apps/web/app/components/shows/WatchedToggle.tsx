"use client";

import { useState, useTransition } from "react";

import { setWatchedAction } from "@/actions/watched";

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
  const [watched, setWatched] = useState(initialWatched);
  const [pending, startTransition] = useTransition();

  const handleChange = (nextWatched: boolean) => {
    setWatched(nextWatched);

    startTransition(async () => {
      const result = await setWatchedAction(showId, nextWatched);

      if (!result.ok) {
        setWatched(!nextWatched);
      }
    });
  };

  return (
    <label
      htmlFor={`watched-${showId}`}
      className={`flex cursor-pointer items-center gap-2.5 ${
        pending ? "opacity-70" : ""
      }`}
    >
      <span className="text-xs font-medium text-zinc-400">Watched</span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          id={`watched-${showId}`}
          type="checkbox"
          className="peer sr-only"
          checked={watched}
          disabled={pending}
          onChange={(event) => handleChange(event.target.checked)}
          aria-label={`Mark ${showName} as watched`}
        />
        <span className="absolute inset-0 rounded-full bg-white/10 transition peer-checked:bg-violet-600" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
