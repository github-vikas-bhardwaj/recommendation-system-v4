"use client";

export function Year() {
  return (
    <p className="text-sm text-zinc-500">
      © {new Date().getFullYear()} ReelMind. All rights reserved.
    </p>
  );
}
