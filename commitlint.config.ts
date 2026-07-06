import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "web",
        "bff",
        "api",
        "root",
        "deps",
        "ci",
        "docs",
        "design",
        "test",
        "config",
        "tool",
        "web:api",
      ],
    ],
    "header-max-length": [2, "always", 300],
  },
};

export default config;
