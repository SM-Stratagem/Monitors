import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "ebola-monitor", at: new Date().toISOString() });
}
