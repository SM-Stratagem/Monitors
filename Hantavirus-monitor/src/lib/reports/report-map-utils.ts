import type { SeverityLevel, SignalReport } from "./types";

export const COUNTRY_COORDS: Record<string, { x: number; y: number }> = {
  "United States": { x: 190, y: 120 }, Canada: { x: 190, y: 85 }, Mexico: { x: 165, y: 150 }, Argentina: { x: 245, y: 250 },
  Chile: { x: 223, y: 228 }, Brazil: { x: 292, y: 208 }, "United Kingdom": { x: 446, y: 98 }, France: { x: 468, y: 112 }, Germany: { x: 490, y: 106 }, Spain: { x: 455, y: 125 },
  China: { x: 640, y: 130 }, Japan: { x: 710, y: 135 }, India: { x: 590, y: 162 }, Australia: { x: 728, y: 252 }, Russia: { x: 620, y: 84 },
  Portugal: { x: 445, y: 122 }, Italy: { x: 496, y: 124 }, Netherlands: { x: 476, y: 102 }, Belgium: { x: 471, y: 106 }, Switzerland: { x: 480, y: 114 },
  Poland: { x: 510, y: 104 }, Sweden: { x: 505, y: 76 }, Norway: { x: 483, y: 74 }, Finland: { x: 526, y: 75 }, Ukraine: { x: 540, y: 112 },
  Turkey: { x: 553, y: 130 }, Greece: { x: 514, y: 136 }, Morocco: { x: 450, y: 155 }, Algeria: { x: 478, y: 158 }, Tunisia: { x: 495, y: 154 },
  Egypt: { x: 530, y: 162 }, Nigeria: { x: 496, y: 196 }, Ethiopia: { x: 548, y: 194 }, Kenya: { x: 548, y: 212 }, "South Africa": { x: 520, y: 274 },
  Senegal: { x: 448, y: 193 }, Ghana: { x: 480, y: 202 }, "Saudi Arabia": { x: 575, y: 168 }, Iran: { x: 590, y: 145 }, Iraq: { x: 572, y: 145 },
  Pakistan: { x: 608, y: 150 }, Bangladesh: { x: 628, y: 160 }, Nepal: { x: 618, y: 150 }, Thailand: { x: 650, y: 178 }, Vietnam: { x: 666, y: 176 },
  Indonesia: { x: 692, y: 214 }, Philippines: { x: 700, y: 186 }, "New Zealand": { x: 804, y: 285 }, Peru: { x: 235, y: 218 }, Colombia: { x: 225, y: 182 },
  Ecuador: { x: 216, y: 198 }, Bolivia: { x: 248, y: 230 }, Paraguay: { x: 260, y: 238 }, Uruguay: { x: 274, y: 248 }, Cuba: { x: 184, y: 160 },
  "Dominican Republic": { x: 206, y: 165 }, Guatemala: { x: 162, y: 164 }, Panama: { x: 205, y: 176 },
};

export function severityColor(level: SeverityLevel): string {
  if (level === "critical") return "#ff3b63";
  if (level === "high") return "#ff7a1a";
  if (level === "medium") return "#31d7ff";
  if (level === "low") return "#16f28b";
  return "#7f8ea3";
}

export function groupForMap(reports: SignalReport[]) {
  const grouped: Record<string, { country: string; reports: number; highest: SeverityLevel; latest: SignalReport | null }> = {};
  for (const report of reports) {
    const key = report.country;
    const existing = grouped[key] ?? { country: report.country, reports: 0, highest: "unknown" as SeverityLevel, latest: null };
    existing.reports += 1;
    if (!existing.latest || new Date(report.publishedAt ?? 0).getTime() > new Date(existing.latest.publishedAt ?? 0).getTime()) {
      existing.latest = report;
    }
    if (severityScore(report.severity) > severityScore(existing.highest)) existing.highest = report.severity;
    grouped[key] = existing;
  }
  return Object.values(grouped);
}

function severityScore(level: SeverityLevel): number {
  if (level === "critical") return 4;
  if (level === "high") return 3;
  if (level === "medium") return 2;
  if (level === "low") return 1;
  return 0;
}
