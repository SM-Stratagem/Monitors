"use client";

import { timelineEvents, type TimelineMode } from "@/lib/reports/report-timeline-utils";
import type { SignalReport } from "@/lib/reports/types";
import { EmptyState, Panel } from "../parts";

export function TimelineTab({ 
  reports, 
  mode, 
  setMode, 
  onOpen 
}: { 
  reports: SignalReport[]; 
  mode: TimelineMode; 
  setMode: (mode: TimelineMode) => void; 
  onOpen: (report: SignalReport) => void;
}) {
  const events = timelineEvents(reports, mode);

  return (
    <Panel
      title="Timeline"
      subtitle="Switch between publication time and ingestion time to inspect the reporting cadence."
      actions={
        <div className="timeline-toolbar">
          <label style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>
            Show by:
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as TimelineMode)}
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              color: "#e2e8f0",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            <option value="published">Published Date</option>
            <option value="ingested">Ingested Date</option>
          </select>
          <span style={{ marginLeft: "auto", fontSize: "12px", color: "#94a3b8" }}>
            {events.length} events
          </span>
        </div>
      }
    >
      {!events.length ? (
        <EmptyState title="No timeline events" description="No valid dates available for selected mode." />
      ) : (
        <div className="timeline-list">
          {events.map((entry) => (
            <button
              key={`${entry.report.id}-${entry.time}`}
              className="timeline-item"
              onClick={() => onOpen(entry.report)}
            >
              <div className="timeline-date">
                {entry.time ? new Date(entry.time).toLocaleDateString() : "Unknown"}
                <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                  {entry.time ? new Date(entry.time).toLocaleTimeString() : ""}
                </div>
              </div>
              <div className="timeline-content">
                <h4>{entry.report.title}</h4>
                <p>
                  {entry.report.country && <span>{entry.report.country} · </span>}
                  {entry.report.source}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </Panel>
  );
}
