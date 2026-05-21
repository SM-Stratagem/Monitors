import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import path from "node:path";

import stats from "@/lib/reference/remote-stats.json";
import cases from "@/lib/reference/remote-cases.json";
import flights from "@/lib/reference/remote-flights.json";
import exposureEvents from "@/lib/reference/remote-exposure-events.json";
import timeline from "@/lib/reference/remote-timeline.json";
import transmission from "@/lib/reference/remote-transmission-chain.json";

export const dynamic = "force-static";

function extractBetween(html: string, start: string, end: string) {
  const startIdx = html.indexOf(start);
  if (startIdx < 0) return "";
  const endIdx = html.indexOf(end, startIdx + start.length);
  if (endIdx < 0) return "";
  return html.slice(startIdx + start.length, endIdx).trim();
}

export async function GET() {
  const htmlPath = path.join(process.cwd(), "src", "lib", "reference", "html", "index.html");
  const html = readFileSync(htmlPath, "utf-8");
  const trackingInner = extractBetween(html, '<div class="tab-pane" id="tab-tracking">', '<div class="tab-pane" id="tab-quarantine">');
  const quarantineInner = extractBetween(html, '<div class="tab-pane" id="tab-quarantine">', '<div class="tab-pane" id="tab-info">');
  const infoInner = extractBetween(html, '<div class="tab-pane" id="tab-info">', "</div><!-- .tab-content -->");

  // Snapshot of the deployed tracker data. This keeps the local app deterministic and pixel-accurate.
  return NextResponse.json({
    lastUpdatedLabel: "Updated 12:13 PM GMT+4",
    stats,
    cases,
    flights,
    exposureEvents,
    timeline,
    transmission,
    tabHtml: {
      trackingInner,
      quarantineInner,
      infoInner,
    },
  });
}
