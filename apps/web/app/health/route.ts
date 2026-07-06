import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    appEnv: serverEnv.appEnv,
    apiUrlConfigured: Boolean(serverEnv.apiUrl),
  });
}
