"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";

type TimelineEntry = {
  caseId: string;
  name: string;
  status: string;
  generation: number;
  date: string | null;
  onsetDate: string | null;
  infectedBy: string | null;
  nationality: string;
  country: string;
  clinicalNotes: string;
};

type Props = {
  entries: TimelineEntry[];
};

const GEN_COLORS: Record<number, string> = {
  0: "#FF1744",
  1: "#FF6600",
  2: "#FFD700",
  3: "#FF3B63",
};

const STATUS_COLORS: Record<string, string> = {
  deceased: "#445566",
  confirmed: "#FF1744",
  symptomatic: "#FF6600",
  asymptomatic: "#00BCD4",
  monitoring: "#31d7ff",
  recovered: "#00FF41",
};

export function Timeline({ entries }: Props) {
  const [sortBy, setSortBy] = useState<"onset" | "gen">("onset");

  const sorted = useMemo(() => {
    const clone = [...entries];
    if (sortBy === "onset") {
      return clone.sort((a, b) => {
        const aDate = a.onsetDate ? new Date(a.onsetDate).getTime() : Infinity;
        const bDate = b.onsetDate ? new Date(b.onsetDate).getTime() : Infinity;
        return aDate - bDate;
      });
    }
    return clone.sort((a, b) => a.generation - b.generation);
  }, [entries, sortBy]);

  const minDate = useMemo(() => {
    const dates = entries.filter(e => e.onsetDate).map(e => new Date(e.onsetDate!).getTime());
    return dates.length ? dayjs(Math.min(...dates)).subtract(2, "day") : dayjs("2026-04-01");
  }, [entries]);

  const maxDate = useMemo(() => {
    const dates = entries.filter(e => e.date || e.onsetDate).map(e => new Date(e.date || e.onsetDate!).getTime());
    return dates.length ? dayjs(Math.max(...dates)).add(2, "day") : dayjs("2026-05-12");
  }, [entries]);

  const totalDays = maxDate.diff(minDate, "day");

  function getPosition(date: string | null): number {
    if (!date) return -1;
    const d = dayjs(date);
    return Math.max(0, Math.min(100, ((d.diff(minDate, "day") / totalDays) * 100)));
  }

  return (
    <div className="timeline-tab">
      <div className="timeline-header">
        <h2>Transmission Timeline</h2>
        <div className="timeline-controls">
          <button className={`tl-btn ${sortBy === "onset" ? "active" : ""}`} onClick={() => setSortBy("onset")}>By Onset Date</button>
          <button className={`tl-btn ${sortBy === "gen" ? "active" : ""}`} onClick={() => setSortBy("gen")}>By Generation</button>
        </div>
      </div>

      <div className="timeline-gantt">
        <div className="timeline-axis">
          {Array.from({ length: totalDays + 1 }, (_, i) => {
            const d = minDate.add(i, "day");
            if (i % 3 === 0) {
              return <div key={i} className="axis-tick" style={{ left: `${(i / totalDays) * 100}%` }}>{d.format("MMM D")}</div>;
            }
            return null;
          })}
        </div>

        <div className="timeline-rows">
          {sorted.map((entry) => {
            const onsetPos = getPosition(entry.onsetDate);
            const endPos = getPosition(entry.date);
            const color = GEN_COLORS[entry.generation] || GEN_COLORS[3];

            return (
              <div key={entry.caseId} className="timeline-row">
                <div className="tl-row-label">
                  <span className="tl-case-id" style={{ color }}>{entry.caseId}</span>
                  <span className="tl-case-name">{entry.name}</span>
                  <span className="tl-case-status" style={{ color: STATUS_COLORS[entry.status] }}>{entry.status}</span>
                </div>
                <div className="tl-row-bar">
                  {onsetPos >= 0 && (
                    <div
                      className="tl-bar"
                      style={{
                        left: `${onsetPos}%`,
                        width: endPos >= onsetPos ? `${endPos - onsetPos}%` : "2%",
                        background: color,
                      }}
                      title={`${entry.caseId}: ${entry.onsetDate || "?"} → ${entry.date || "?"}`}
                    />
                  )}
                  {onsetPos >= 0 && (
                    <div className="tl-onset-marker" style={{ left: `${onsetPos}%` }} title={`Onset: ${entry.onsetDate}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="timeline-legend">
        <span><span className="gen-dot" style={{ background: GEN_COLORS[0] }} /> Gen 0 (Index)</span>
        <span><span className="gen-dot" style={{ background: GEN_COLORS[1] }} /> Gen 1</span>
        <span><span className="gen-dot" style={{ background: GEN_COLORS[2] }} /> Gen 2</span>
        <span><span className="gen-dot" style={{ background: GEN_COLORS[3] }} /> Gen 3+</span>
        <span>● Onset date</span>
        <span>— Duration to death/last update</span>
      </div>
    </div>
  );
}
