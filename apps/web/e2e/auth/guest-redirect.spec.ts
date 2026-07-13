import { expect, test } from "@playwright/test";

test.describe("guest route guards", () => {
  test("redirects /shows to login with next param", async ({ page }) => {
    await page.goto("/shows");

    await expect(page).toHaveURL(/\/login/);
    expect(new URL(page.url()).searchParams.get("next")).toBe("/shows");
  });

  test("redirects /recommendations to login", async ({ page }) => {
    await page.goto("/recommendations");

    await expect(page).toHaveURL(/\/login/);
  });

  test("can open login and signup as guest", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible();

    await page.goto("/signup");
    await expect(
      page.getByRole("heading", { name: /create your account/i }),
    ).toBeVisible();
  });
});
