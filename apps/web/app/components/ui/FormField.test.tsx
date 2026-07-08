import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormField } from "./FormField";

describe("FormField", () => {
  it("shows a red asterisk for required fields", () => {
    render(
      <FormField id="name" name="name" label="Name" required defaultValue="" />,
    );

    expect(screen.getByText("*")).toHaveClass("text-red-400");
  });

  it("shows an error message and invalid state", () => {
    render(
      <FormField
        id="email"
        name="email"
        label="Email"
        required
        error="Invalid email address"
        defaultValue=""
      />,
    );

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});
