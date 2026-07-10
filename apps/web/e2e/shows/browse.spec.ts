import { expect, test } from "@playwright/test";

import {
  waitForFirstPoster,
  waitForShowsCatalog,
  waitForShowsPage,
} from "../fixtures/shows";

test.describe("shows browse", () => {
  test("lists shows on the first page", async ({ page }) => {
    await page.goto("/shows");

    await expect(
      page.getByRole("heading", { name: /movies & shows/i }),
    ).toBeVisible({ timeout: 15_000 });
    await waitForFirstPoster(page);
  });

  test("supports search query", async ({ page }) => {
    await page.goto("/shows?q=dome");

    await waitForFirstPoster(page);
    await expect(page.getByText(/"dome"/i)).toBeVisible();
  });

  test(
    "supports pagination when the catalog has multiple pages",
    { tag: "@pagination" },
    async ({ page }) => {
      await page.goto("/shows");
      await waitForShowsCatalog(page);

      const page2Link = page
        .getByRole("navigation", { name: "Shows pagination" })
        .getByRole("link", { name: "2", exact: true });

      if ((await page2Link.count()) === 0) {
        test.skip(true, "Catalog has fewer than two pages of shows.");
      }

      await page2Link.click();
      await waitForShowsPage(page, 2);
      await waitForFirstPoster(page);
    },
  );
});
