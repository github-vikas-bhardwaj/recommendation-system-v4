import type { Metadata } from "next";
import { Suspense } from "react";

import { ShowDetailHeroSkeleton } from "@/app/components/shows/ShowDetailHeroSkeleton";
import { ShowsPageShell } from "@/app/components/shows/ShowsPageShell";
import { stripHtml } from "@/lib/shows/format";
import { getShowByIdCached } from "@/lib/shows/query.cached";

import { ShowDetailPageContent } from "./ShowDetailPageContent";

type ShowDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ShowDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getShowByIdCached(Number(id));

  if (!show) {
    return { title: "Show not found — ReelMind" };
  }

  return {
    title: `${show.name} — ReelMind`,
    description: stripHtml(show.summary).slice(0, 160),
  };
}

export default function ShowDetailPage({ params }: ShowDetailPageProps) {
  return (
    <ShowsPageShell>
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<ShowDetailHeroSkeleton />}>
          <ShowDetailPageContent params={params} />
        </Suspense>
      </div>
    </ShowsPageShell>
  );
}
