import { expect, test } from "@playwright/test";

import { waitForShowsCatalog } from "../fixtures/shows";

test.describe("watched toggle", () => {
  test("marks a show watched and removes it from recommendations", async ({
    page,
  }) => {
    await page.goto("/shows");
    await waitForShowsCatalog(page);

    const watchButton = page
      .getByRole("button", { name: /mark .+ as watched/i })
      .first();

    await expect(watchButton).toBeVisible({ timeout: 15_000 });

    const showName = (await watchButton.getAttribute("aria-label"))?.replace(
      /^Mark (.+) as watched$/,
      "$1",
    );

    if (!showName) {
      throw new Error("Could not read show name from watched toggle.");
    }

    await watchButton.click();
    await expect(
      page.getByRole("button", { name: `Mark ${showName} as not watched` }),
    ).toBeVisible({ timeout: 15_000 });

    await page.goto("/recommendations");

    await expect(page.getByRole("link", { name: showName })).toBeVisible({
      timeout: 15_000,
    });

    await page
      .getByRole("button", { name: `Remove ${showName} from watched shows` })
      .click();

    await expect(page.getByRole("link", { name: showName })).not.toBeVisible({
      timeout: 15_000,
    });
  });
});
