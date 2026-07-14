import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import type { Show } from "@/lib/shows/types";

const sampleShow: Show = {
  id: 1,
  name: "Under the Dome",
  type: "Scripted",
  language: "English",
  genres: ["Drama", "Science-Fiction", "Thriller"],
  status: "Ended",
  premiered: "2013-06-24",
  ended: "2015-09-10",
  weight: 99,
  image: {
    original:
      "https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg",
  },
  summary: "<p>Under the Dome summary.</p>",
};

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt} />
  ),
}));

vi.mock("@/lib/watched/queries", () => ({
  listWatchedShows: vi.fn(async () => [sampleShow]),
}));

vi.mock("@/lib/api/recommendations", () => ({
  fetchRecommendations: vi.fn(async () => ({
    recommendedShowIds: [123, 456],
  })),
}));

import RecommendationsPage from "./page";

describe("Recommendations page", () => {
  it("renders the recommendations heading", async () => {
    const ui = await RecommendationsPage();
    render(ui);

    expect(
      screen.getByRole("heading", { name: /recommendations/i }),
    ).toBeInTheDocument();
  });

  it("renders watched show pills", async () => {
    const ui = await RecommendationsPage();
    render(ui);

    expect(screen.getByText("Under the Dome")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /remove under the dome from watched shows/i,
      }),
    ).toBeInTheDocument();
  });
});
