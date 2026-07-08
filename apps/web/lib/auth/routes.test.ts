import { describe, expect, it } from "vitest";

import {
  AUTH_ROUTES,
  isGuestOnlyPath,
  isProtectedPath,
  pathnameMatchesPrefix,
  safeNextPath,
} from "./routes";

describe("pathnameMatchesPrefix", () => {
  it("matches exact paths", () => {
    expect(pathnameMatchesPrefix("/shows", ["/shows"])).toBe(true);
  });

  it("matches nested paths", () => {
    expect(pathnameMatchesPrefix("/shows/42", ["/shows"])).toBe(true);
  });

  it("does not match partial segment prefixes", () => {
    expect(pathnameMatchesPrefix("/shows-old", ["/shows"])).toBe(false);
  });
});

describe("isProtectedPath", () => {
  it("returns true for protected routes", () => {
    expect(isProtectedPath("/shows")).toBe(true);
    expect(isProtectedPath("/shows/1")).toBe(true);
    expect(isProtectedPath("/recommendations")).toBe(true);
  });

  it("returns false for public routes", () => {
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/login")).toBe(false);
    expect(isProtectedPath("/signup")).toBe(false);
  });
});

describe("isGuestOnlyPath", () => {
  it("returns true for guest-only routes", () => {
    expect(isGuestOnlyPath("/")).toBe(true);
    expect(isGuestOnlyPath("/login")).toBe(true);
    expect(isGuestOnlyPath("/signup")).toBe(true);
  });

  it("returns false for app routes", () => {
    expect(isGuestOnlyPath("/shows")).toBe(false);
    expect(isGuestOnlyPath("/recommendations")).toBe(false);
  });
});

describe("safeNextPath", () => {
  it("returns valid internal paths", () => {
    expect(safeNextPath("/recommendations")).toBe("/recommendations");
    expect(safeNextPath("/shows/42")).toBe("/shows/42");
  });

  it("falls back for missing or unsafe values", () => {
    expect(safeNextPath(undefined)).toBe(AUTH_ROUTES.defaultAfterLogin);
    expect(safeNextPath(null)).toBe(AUTH_ROUTES.defaultAfterLogin);
    expect(safeNextPath("")).toBe(AUTH_ROUTES.defaultAfterLogin);
    expect(safeNextPath("https://evil.com")).toBe(
      AUTH_ROUTES.defaultAfterLogin,
    );
    expect(safeNextPath("//evil.com")).toBe(AUTH_ROUTES.defaultAfterLogin);
  });
});
