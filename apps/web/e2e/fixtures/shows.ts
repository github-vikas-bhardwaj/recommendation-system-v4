import { expect, type Page } from "@playwright/test";

/** Waits until Suspense resolves and real catalog cards replace the skeleton. */
export async function waitForShowsCatalog(page: Page) {
  await expect(
    page.getByRole("article").first().or(page.getByText("No shows found")),
  ).toBeVisible({ timeout: 15_000 });
}

/** Waits until a specific catalog page has finished loading (avoids stale page-1 content). */
export async function waitForShowsPage(page: Page, pageNumber: number) {
  await expect(page).toHaveURL(new RegExp(`page=${pageNumber}`), {
    timeout: 15_000,
  });
  await expect(
    page.getByText(new RegExp(`page ${pageNumber} of`, "i")),
  ).toBeVisible({ timeout: 15_000 });
  await waitForShowsCatalog(page);
}

export async function waitForFirstPoster(page: Page) {
  await waitForShowsCatalog(page);

  const poster = page.locator("article:not([aria-hidden]) img").first();
  const hasPoster = (await poster.count()) > 0;

  if (!hasPoster) {
    return;
  }

  await poster.scrollIntoViewIfNeeded();
  await expect(poster).not.toHaveJSProperty("naturalWidth", 0, {
    timeout: 30_000,
  });
}
