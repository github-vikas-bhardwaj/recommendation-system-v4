import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Show } from "@/lib/shows/types";

const show: Show = {
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

const { getRecommendationsAction } = vi.hoisted(() => ({
  getRecommendationsAction: vi.fn(),
}));

vi.mock("@/actions/recommendations", () => ({
  getRecommendationsAction,
}));

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

import { GetRecommendationsPanel } from "./GetRecommendationsPanel";

describe("GetRecommendationsPanel", () => {
  beforeEach(() => {
    getRecommendationsAction.mockReset();
  });

  it("does not fetch until the button is clicked", () => {
    render(<GetRecommendationsPanel watchedShowIds={[1]} />);

    expect(getRecommendationsAction).not.toHaveBeenCalled();
    expect(
      screen.getByText(/press get recommendations when you're ready/i),
    ).toBeInTheDocument();
  });

  it("loads cards after a successful fetch", async () => {
    getRecommendationsAction.mockResolvedValue({
      ok: true,
      source: "api",
      items: [{ show, score: 94 }],
    });

    render(<GetRecommendationsPanel watchedShowIds={[1]} />);
    fireEvent.click(
      screen.getByRole("button", { name: /get recommendations/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Breaking Bad" }),
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/match score 94 percent/i)).toHaveTextContent(
      "94%",
    );
  });
});
