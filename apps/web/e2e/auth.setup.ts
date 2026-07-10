import { expect, test as setup } from "@playwright/test";

import { authFile } from "./constants";
import { waitForFirstPoster } from "./fixtures/shows";
import { getE2eCredentials, hasE2eCredentials } from "./fixtures/test-user";

setup("authenticate", async ({ page }) => {
  setup.skip(
    !hasE2eCredentials(),
    "Set E2E_USER_EMAIL and E2E_USER_PASSWORD in apps/web/.env.local",
  );

  const credentials = getE2eCredentials();
  if (!credentials) {
    return;
  }

  await page.goto("/login");

  const loginForm = page.getByRole("form", { name: "Login form" });
  await loginForm.locator('[name="email"]').fill(credentials.email);
  await loginForm.locator('[name="password"]').fill(credentials.password);
  await loginForm.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/shows/, { timeout: 15_000 });
  await waitForFirstPoster(page);

  await page.context().storageState({ path: authFile });
});
