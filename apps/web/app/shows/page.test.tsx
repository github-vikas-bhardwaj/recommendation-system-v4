import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt} />
  ),
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
