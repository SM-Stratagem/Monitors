"use client";

import React, { useMemo, useState } from "react";

type Case = {
  id: string;
  caseId: string;
  name: string;
  status: string;
  generation: number;
  date: string | null;
  onsetDate: string | null;
  nationality: string;
  sex: string | null;
  age: number | null;
  clinicalNotes: string;
  country: string;
  city: string | null;
  cabin: string | null;
  deck: number | null;
  role: string | null;
  infectedBy: string | null;
};

type Props = {
  cases: Case[];
};

const STATUS_COLORS: Record<string, string> = {
  deceased: "#445566",
  confirmed: "#FF1744",
  symptomatic: "#FF6600",
  asymptomatic: "#00BCD4",
  monitoring: "#31d7ff",
  recovered: "#00FF41",
};

const GEN_COLORS = ["#FF1744", "#FF6600", "#FFD700", "#FF3B63"];

export function CaseTracker({ cases }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return cases;
    return cases.filter(c => c.status === filter);
  }, [cases, filter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cases.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return counts;
  }, [cases]);

  return (
    <div className="case-tracker">
      <div className="case-tracker-header">
        <h2>Case Tracker — Ebola Outbreak</h2>
        <div className="case-tracker-stats">
          <span className="ct-stat">Total: <strong>{cases.length}</strong></span>
          {Object.entries(statusCounts).map(([status, count]) => (
            <span key={status} className="ct-stat" style={{ color: STATUS_COLORS[status] || "#ccc" }}>
              {status}: <strong>{count}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="case-filters">
        {["all", "deceased", "confirmed", "asymptomatic", "monitoring"].map(s => (
          <button
            key={s}
            className={`case-filter-btn ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
            style={filter === s ? { borderColor: STATUS_COLORS[s] || "#31d7ff", color: STATUS_COLORS[s] || "#31d7ff" } : {}}
          >
            {s === "all" ? `All (${cases.length})` : `${s} (${statusCounts[s] || 0})`}
          </button>
        ))}
      </div>

      <div className="case-grid">
        <div className="case-list-panel">
          {filtered.map((c, idx) => (
            <button
              key={c.caseId}
              className={`case-card stagger-card card-glow-${c.status} ${selectedCase?.caseId === c.caseId ? "selected" : ""}`}
              style={{ "--i": idx } as React.CSSProperties}
              onClick={() => setSelectedCase(c)}
            >
              <div className="case-card-header">
                <span className="case-card-id">{c.caseId}</span>
                <span className="case-gen" style={{ background: GEN_COLORS[c.generation] || GEN_COLORS[3] }}>
                  G{c.generation}
                </span>
                <span className="case-status-badge" style={{ background: STATUS_COLORS[c.status] || "#666" }}>
                  {c.status}
                </span>
              </div>
              <div className="case-card-name">{c.name}</div>
              <div className="case-card-meta">
                {c.nationality} · {c.country}{c.city ? `, ${c.city}` : ""}
                {c.age ? ` · Age ${c.age}` : ""}
              </div>
            </button>
          ))}
        </div>

        <div className="case-detail-panel">
          {selectedCase ? (
            <>
              <h3>{selectedCase.name}</h3>
              <div className="case-detail-grid">
                <div className="detail-field"><label>Case ID</label><span>{selectedCase.caseId}</span></div>
                <div className="detail-field"><label>Status</label><span style={{ color: STATUS_COLORS[selectedCase.status] }}>{selectedCase.status}</span></div>
                <div className="detail-field"><label>Generation</label><span>G{selectedCase.generation}</span></div>
                <div className="detail-field"><label>Nationality</label><span>{selectedCase.nationality}</span></div>
                <div className="detail-field"><label>Sex</label><span>{selectedCase.sex || "Unknown"}</span></div>
                <div className="detail-field"><label>Age</label><span>{selectedCase.age || "Unknown"}</span></div>
                <div className="detail-field"><label>Country</label><span>{selectedCase.country}</span></div>
                <div className="detail-field"><label>City</label><span>{selectedCase.city || "Unknown"}</span></div>
                {selectedCase.cabin && <div className="detail-field"><label>Cabin</label><span>{selectedCase.cabin}</span></div>}
                {selectedCase.deck && <div className="detail-field"><label>Deck</label><span>{selectedCase.deck}</span></div>}
                {selectedCase.role && <div className="detail-field"><label>Role</label><span>{selectedCase.role}</span></div>}
                {selectedCase.onsetDate && <div className="detail-field"><label>Onset Date</label><span>{selectedCase.onsetDate}</span></div>}
                {selectedCase.date && <div className="detail-field"><label>Date</label><span>{selectedCase.date}</span></div>}
                {selectedCase.infectedBy && <div className="detail-field"><label>Infected By</label><span>{selectedCase.infectedBy}</span></div>}
              </div>
              <div className="case-clinical-notes">
                <label>Clinical Notes</label>
                <p>{selectedCase.clinicalNotes}</p>
              </div>
            </>
          ) : (
            <div className="case-detail-empty">Select a case to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
