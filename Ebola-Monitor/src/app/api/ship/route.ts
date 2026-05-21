import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { shipPositions } from "../../../../db/schema";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

const FALLBACK_SHIP = {
  vesselName: "WHO Mercy Ship",
  imo: "N/A",
  mmsi: "N/A",
  latitude: "9.6412",
  longitude: "-13.5784",
  speed: "0",
  course: "0",
  heading: "0",
  destination: "West Africa",
  port: "Conakry, Guinea",
  status: "deployed",
  lastPort: "Dakar, Senegal",
  notes: "WHO emergency medical deployment to West Africa. Mobile ETU support and training.",
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
