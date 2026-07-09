import { ShowDetailHeroSkeleton } from "@/app/components/shows/ShowDetailHeroSkeleton";
import { ShowsPageShell } from "@/app/components/shows/ShowsPageShell";

export default function ShowDetailLoading() {
  return (
    <ShowsPageShell>
      <div className="mx-auto max-w-7xl">
        <ShowDetailHeroSkeleton />
      </div>
    </ShowsPageShell>
  );
}
