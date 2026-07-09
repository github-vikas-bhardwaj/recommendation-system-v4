import { notFound } from "next/navigation";

import { ShowDetailHero } from "@/app/components/shows/ShowDetailHero";
import { getShowByIdCached } from "@/lib/shows/query.cached";

type ShowDetailPageContentProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function ShowDetailPageContent({
  params,
}: ShowDetailPageContentProps) {
  const { id } = await params;
  const show = await getShowByIdCached(Number(id));

  if (!show) {
    notFound();
  }

  return <ShowDetailHero show={show} />;
}
