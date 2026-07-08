import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingSpinner } from "./LoadingSpinner";
import { LoadingSpinnerOverlay } from "./LoadingSpinnerOverlay";

describe("LoadingSpinner", () => {
  it("renders with accessible status role", () => {
    render(<LoadingSpinner label="Loading shows" />);

    expect(
      screen.getByRole("status", { name: "Loading shows" }),
    ).toBeInTheDocument();
  });

  it("renders overlay with label text", () => {
    render(<LoadingSpinnerOverlay label="Loading recommendations" />);

    expect(
      screen.getByRole("status", { name: "Loading recommendations" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Loading recommendations")).toBeInTheDocument();
  });
});
