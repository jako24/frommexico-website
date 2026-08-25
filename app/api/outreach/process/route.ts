import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/outreach/auth";
import { processDueSequences } from "@/lib/outreach/send";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-cron-secret");
  if (!verifyCronSecret(auth) && !verifyCronSecret(cronHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processDueSequences();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Process failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
