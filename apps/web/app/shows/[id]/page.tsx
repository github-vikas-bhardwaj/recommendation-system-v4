import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShowDetailHero } from "@/app/components/shows/ShowDetailHero";
import { ShowsPageShell } from "@/app/components/shows/ShowsPageShell";
import { getShowById } from "@/lib/shows/mock-shows";

type ShowDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ShowDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const show = getShowById(Number(id));

  if (!show) {
    return { title: "Show not found — ReelMind" };
  }

  return {
    title: `${show.name} — ReelMind`,
    description: show.summary.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function ShowDetailPage({ params }: ShowDetailPageProps) {
  const { id } = await params;
  const show = getShowById(Number(id));

  if (!show) {
    notFound();
  }

  return (
    <ShowsPageShell>
      <div className="mx-auto max-w-7xl">
        <ShowDetailHero show={show} />
      </div>
    </ShowsPageShell>
  );
}
