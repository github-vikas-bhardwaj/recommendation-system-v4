import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./LoginFormSection", () => ({
  LoginFormSection: () => null,
}));

import LoginPage from "./page";

describe("Login page", () => {
  it("renders the login heading", () => {
    render(<LoginPage searchParams={Promise.resolve({})} />);

    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
  });
});
