import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt} />
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

  it("renders recommendation pills", () => {
    render(<RecommendationsPage />);

    expect(screen.getByText("Under the Dome")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /remove under the dome from recommendations/i,
      }),
    ).toBeInTheDocument();
  });
});
