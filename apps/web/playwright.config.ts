import { defineConfig, devices } from "@playwright/test";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

import { authFile } from "./e2e/constants";
import { hasE2eCredentials } from "./e2e/fixtures/test-user";

function loadLocalEnv() {
  for (const file of [".env", ".env.local"]) {
    const envPath = resolve(__dirname, file);
    if (!existsSync(envPath)) continue;

    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;

      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

loadLocalEnv();

const e2ePort = 3001;
const e2eBaseURL = `http://localhost:${e2ePort}`;

const e2eCredentialsConfigured = hasE2eCredentials();

const guestProject = {
  name: "guest",
  testMatch: [
    /homepage\.spec\.ts/,
    /guest-redirect\.spec\.ts/,
    /login-guest\.spec\.ts/,
  ],
  use: { ...devices["Desktop Chrome"] },
};

const authenticatedProjects = [
  {
    name: "setup",
    testMatch: /auth\.setup\.ts/,
  },
  {
    name: "authenticated",
    testMatch: [
      /session\.spec\.ts/,
      /browse\.spec\.ts/,
      /show-detail\.spec\.ts/,
      /toggle\.spec\.ts/,
    ],
    dependencies: ["setup"],
    use: {
      ...devices["Desktop Chrome"],
      storageState: authFile,
    },
  },
  {
    name: "authenticated-logout",
    testMatch: /logout\.spec\.ts/,
    dependencies: ["authenticated"],
    use: {
      ...devices["Desktop Chrome"],
      storageState: authFile,
    },
  },
];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: e2eCredentialsConfigured ? 1 : process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: e2eBaseURL,
    trace: "on-first-retry",
  },
  projects: [guestProject, ...authenticatedProjects],
  webServer: {
    command: `npm run dev -- -p ${e2ePort}`,
    url: e2eBaseURL,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      PORT: String(e2ePort),
    } as Record<string, string>,
  },
});
