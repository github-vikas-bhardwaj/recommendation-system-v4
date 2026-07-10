import { expect, test } from "@playwright/test";

test.describe("logout", () => {
  test("returns guest navigation", async ({ page }) => {
    await page.goto("/shows");
    await page.getByRole("button", { name: "Log out" }).click();

    await expect(page.getByRole("link", { name: "Login" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole("navigation", { name: "Account" }).getByRole("link", {
        name: "Sign up",
      }),
    ).toBeVisible();
  });
});
