import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { shipPositions } from "../../../../db/schema";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

const FALLBACK_SHIP = {
  vesselName: "MV Hondius",
  imo: "9812003",
  mmsi: "232005476",
  latitude: "28.0614",
  longitude: "-16.5714",
  speed: "0",
  course: "0",
  heading: "0",
  destination: "Rotterdam, Netherlands",
  port: "Port of Granadilla, Tenerife",
  status: "docked",
  lastPort: "Ushuaia, Argentina",
  notes: "MV Hondius docked at Tenerife. 147 passengers & crew aboard. Repatriation flights ongoing.",
  lastUpdated: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(shipPositions)
      .orderBy(desc(shipPositions.lastUpdated))
      .limit(1);

    if (!rows[0]) return NextResponse.json({ ship: FALLBACK_SHIP });
    return NextResponse.json({ ship: rows[0] });
  } catch {
    return NextResponse.json({ ship: FALLBACK_SHIP });
  }
}
