import "server-only";

import { publicEnv } from "./public";
import { required } from "./required";

const appEnv = process.env.APP_ENV ?? "local";

export const serverEnv = {
  ...publicEnv,
  appEnv,
  apiUrl: required("API_URL"),
  dbPassword: required("DB_PASSWORD"),
  isLocal: appEnv === "local",
  isProduction: appEnv === "production",
  apiInternalSecret: required("API_INTERNAL_SECRET"),
} as const;
