import { expect, test as setup } from "@playwright/test";

import { authFile } from "./constants";
import { canRunAuthenticatedE2e } from "./fixtures/ci-env";
import { waitForFirstPoster } from "./fixtures/shows";
import { getE2eCredentials } from "./fixtures/test-user";

setup("authenticate", async ({ page }) => {
  setup.skip(
    !canRunAuthenticatedE2e(),
    "Set E2E_USER_* and Supabase secrets (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY) for authenticated E2E.",
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
