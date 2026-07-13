import { expect, test } from "@playwright/test";

test.describe("authenticated session", () => {
  test("shows account navigation", async ({ page }) => {
    await page.goto("/shows");

    await expect(
      page.getByRole("navigation", { name: "Account" }),
    ).toContainText("Shows");
    await expect(
      page.getByRole("navigation", { name: "Account" }),
    ).toContainText("Recommendations");
    await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();
  });

  test("redirects logged-in user away from login", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveURL(/\/shows/);
  });
});
