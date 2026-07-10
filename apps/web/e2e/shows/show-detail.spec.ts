import { expect, test } from "@playwright/test";

import { waitForFirstPoster, waitForShowsCatalog } from "../fixtures/shows";

test.describe("show detail", () => {
  test("opens a show from the catalog", async ({ page }) => {
    await page.goto("/shows");
    await waitForShowsCatalog(page);

    const firstShowHeading = page.getByRole("heading", { level: 2 }).first();
    await expect(firstShowHeading).toBeVisible();
    await waitForFirstPoster(page);

    const showName = await firstShowHeading.innerText();
    await firstShowHeading.click();

    await expect(page).toHaveURL(/\/shows\/\d+/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { level: 1, name: showName }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("link", { name: /back to shows/i }),
    ).toBeVisible();
  });
});
