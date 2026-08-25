import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "This public send link has been removed. Use the password-protected /outreach desk.",
    },
    { status: 410 }
  );
}
