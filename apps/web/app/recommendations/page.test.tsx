import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/components/recommendations/RecommendationsPageContent", () => ({
  RecommendationsPageContent: () => (
    <>
      <h1>Recommendations</h1>
      <p>Under the Dome</p>
      <section aria-label="Recommended shows">
        <h2>Breaking Bad</h2>
      </section>
    </>
  ),
}));

import RecommendationsPage from "./page";

describe("Recommendations page", () => {
  it("renders the recommendations heading", () => {
    render(<RecommendationsPage />);

    expect(
      screen.getByRole("heading", { name: /recommendations/i }),
    ).toBeInTheDocument();
  });

  it("renders watched and recommended content", () => {
    render(<RecommendationsPage />);

    expect(screen.getByText("Under the Dome")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Breaking Bad" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /recommended shows/i }),
    ).toBeInTheDocument();
  });
});
