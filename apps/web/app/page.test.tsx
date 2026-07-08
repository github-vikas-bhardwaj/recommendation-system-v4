import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home page", () => {
  it("renders the hero heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /discover what to watch/i }),
    ).toBeInTheDocument();
  });

  it("renders auth links in the hero", () => {
    render(<Home />);

    expect(
      screen.getByRole("link", { name: /start for free/i }),
    ).toHaveAttribute("href", "/signup");
  });
});
