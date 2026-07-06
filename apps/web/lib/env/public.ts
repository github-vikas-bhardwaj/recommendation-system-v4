import { required } from "./required";

/** Safe for client components (NEXT_PUBLIC_* only). */
export const publicEnv = {
  appUrl: required("NEXT_PUBLIC_APP_URL"),
} as const;
