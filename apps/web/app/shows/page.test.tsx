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

vi.mock("@/lib/shows/queries", () => ({
  listShows: vi.fn(async () => ({
    items: [sampleShow],
    currentPage: 1,
    totalPages: 1,
    total: 1,
  })),
}));

import ShowsPage from "./page";

describe("Shows page", () => {
  it("renders the shows heading", async () => {
    const ui = await ShowsPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(
      screen.getByRole("heading", { name: /movies & shows/i }),
    ).toBeInTheDocument();
  });

  it("renders show cards on the first page", async () => {
    const ui = await ShowsPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(
      screen.getByRole("heading", { name: /under the dome/i }),
    ).toBeInTheDocument();
  });
});
