import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SignupPage from "./page";

describe("Signup page", () => {
  it("renders the signup heading", () => {
    render(<SignupPage />);

    expect(
      screen.getByRole("heading", { name: /create your account/i }),
    ).toBeInTheDocument();
  });
});
