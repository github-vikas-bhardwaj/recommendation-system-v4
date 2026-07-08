import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoginPage from "./page";

describe("Login page", () => {
  it("renders the login heading", async () => {
    const ui = await LoginPage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
  });
});
