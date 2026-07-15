import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import type { Show } from "@/lib/shows/types";

const recommendedShow: Show = {
  id: 123,
  name: "Breaking Bad",
  type: "Scripted",
  language: "English",
  genres: ["Drama", "Crime"],
  status: "Ended",
  premiered: "2008-01-20",
  ended: "2013-09-29",
  weight: 100,
  image: {
    original:
      "https://static.tvmaze.com/uploads/images/original_untouched/0/1.jpg",
  },
  summary: "<p>Breaking Bad summary.</p>",
};

vi.mock("next/image", () => ({
  default: ({
    fill: _fill,
    priority: _priority,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt} />
  ),
}));

vi.mock("@/lib/api/recommendations", () => ({
  fetchRecommendations: vi.fn(async () => ({
    recommendations: [{ showId: 123, score: 94 }],
  })),
}));

vi.mock("@/lib/shows/queries", () => ({
  getShowsByIds: vi.fn(async () => [recommendedShow]),
}));

import { RecommendedShowsSection } from "./RecommendedShowsSection";

describe("RecommendedShowsSection", () => {
  it("renders recommended show cards from API ids", async () => {
    const ui = await RecommendedShowsSection({
      seedShowIds: [1],
      watchedShowIds: new Set([1]),
    });
    render(ui);

    expect(
      screen.getByRole("heading", { name: "Breaking Bad" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/match score 94 percent/i)).toHaveTextContent(
      "94%",
    );
  });

  it("shows empty state when there are no seed shows", async () => {
    const ui = await RecommendedShowsSection({
      seedShowIds: [],
      watchedShowIds: new Set(),
    });
    render(ui);

    expect(screen.getByText("No recommendations yet")).toBeInTheDocument();
  });
});
