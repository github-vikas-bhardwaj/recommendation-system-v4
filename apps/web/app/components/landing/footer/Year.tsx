import { connection } from "next/server";

export async function Year() {
  await connection();
  return (
    <p className="text-sm text-zinc-500">
      © {new Date().getFullYear()} ReelMind. All rights reserved.
    </p>
  );
}
