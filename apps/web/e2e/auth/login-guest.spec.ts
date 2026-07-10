import { expect, test } from "@playwright/test";

const hasRealSupabase =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL!.includes("example.supabase.co");

test.describe("login (guest)", () => {
  test.beforeEach(() => {
    test.skip(
      !hasRealSupabase,
      "Requires a real Supabase project (not CI placeholders).",
    );
  });

  test("shows an error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    const loginForm = page.getByRole("form", { name: "Login form" });

    await loginForm
      .locator('[name="email"]')
      .fill("not-a-real-user@example.com");
    await loginForm.locator('[name="password"]').fill("wrong-password-123");
    await loginForm.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Invalid email or password.")).toBeVisible({
      timeout: 15_000,
    });
  });
});
