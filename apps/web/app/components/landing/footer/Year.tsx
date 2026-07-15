import { connection } from "next/server";

export async function Year() {
  await connection();
  const year = new Date().getFullYear();

  return (
    <p className="text-sm text-zinc-500">
      © {year} ReelMind. All rights reserved.
    </p>
  );
}
