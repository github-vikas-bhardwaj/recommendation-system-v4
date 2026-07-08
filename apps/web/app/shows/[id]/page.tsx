import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShowDetailHero } from "@/app/components/shows/ShowDetailHero";
import { ShowsPageShell } from "@/app/components/shows/ShowsPageShell";
import { stripHtml } from "@/lib/shows/format";
import { getShowById } from "@/lib/shows/queries";

type ShowDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ShowDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getShowById(Number(id));

  if (!show) {
    return { title: "Show not found — ReelMind" };
  }

  return {
    title: `${show.name} — ReelMind`,
    description: stripHtml(show.summary).slice(0, 160),
  };
}

export default async function ShowDetailPage({ params }: ShowDetailPageProps) {
  const { id } = await params;
  const show = await getShowById(Number(id));

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
