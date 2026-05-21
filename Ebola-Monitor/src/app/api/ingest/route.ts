import { NextRequest, NextResponse } from "next/server";
import { ingestFeeds } from "@/lib/ingest";

export const runtime = "nodejs";

function isAuthorizedCron(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  // Check for Railway native cron (no secret needed)
  const railwayCronHeader = request.headers.get("x-railway-cron-id");

  // Check for explicit cron key auth
  const incoming = request.headers.get("x-cron-key");

  // Allow Railway native cron OR matching secret
  if (railwayCronHeader) return true;
  if (!cronSecret) return true;
  return incoming === cronSecret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedCron(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await ingestFeeds();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await ingestFeeds();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
