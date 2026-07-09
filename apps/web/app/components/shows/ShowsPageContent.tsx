import { Suspense } from "react";

import { ShowsResults } from "./ShowsResults";
import { ShowsResultsSkeleton } from "./ShowsResultsSkeleton";
import { ShowsSearchBar } from "./ShowsSearchBar";

type ShowsPageContentProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};
export async function ShowsPageContent({
  searchParams,
}: ShowsPageContentProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Number(params.page ?? "1");
  const safePage = Number.isFinite(page) ? page : 1;

  return (
    <>
      <ShowsSearchBar defaultQuery={query} />
      <Suspense
        key={`${safePage}-${query}`}
        fallback={<ShowsResultsSkeleton />}
      >
        <ShowsResults query={query} page={safePage} />
      </Suspense>
    </>
  );
}
