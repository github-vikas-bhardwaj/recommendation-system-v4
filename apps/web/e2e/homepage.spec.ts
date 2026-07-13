import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/ReelMind/i);
  await expect(
    page.getByRole("heading", { name: /discover what to watch/i }),
  ).toBeVisible();
});
