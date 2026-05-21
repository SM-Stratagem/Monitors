"use client";

import React, { useMemo, useState } from "react";
import { HISTORICAL_OUTBREAKS, getAllTimeStats, type HistoricalOutbreak } from "@/lib/historical-outbreaks";

const COUNTRY_FLAGS: Record<string, string> = {
  "Zaire (DRC)": "🇨🇩", "DRC": "🇨🇩", "Sudan": "🇸🇩", "Uganda": "🇺🇬",
  "Gabon": "🇬🇦", "Guinea": "🇬🇳", "Sierra Leone": "🇸🇱", "Liberia": "🇱🇷",
  "Mali": "🇲🇱", "Nigeria": "🇳🇬", "Senegal": "🇸🇳", "Spain": "🇪🇸",
  "United Kingdom": "🇬🇧", "United States": "🇺🇸", "China": "🇨🇳",
};

function getCfrColor(cfr: number): string {
  if (cfr >= 70) return "#ef4444";
  if (cfr >= 40) return "#f97316";
  if (cfr >= 25) return "#f59e0b";
  return "#10b981";
}

function getCaseBarColor(cases: number): string {
  if (cases >= 5000) return "#ef4444";
  if (cases >= 500) return "#f97316";
  return "#f59e0b";
}

export function AllTimeTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const stats = useMemo(() => getAllTimeStats(HISTORICAL_OUTBREAKS), []);

  const sorted = useMemo(() =>
    [...HISTORICAL_OUTBREAKS].sort((a, b) => {
      if (a.id === "ebola-2026-current") return -1;
      if (b.id === "ebola-2026-current") return 1;
      return b.yearStart - a.yearStart;
    }), []);

  const topDeadliest = useMemo(() =>
    [...HISTORICAL_OUTBREAKS]
      .filter(o => o.totalDeaths > 0)
      .sort((a, b) => b.totalDeaths - a.totalDeaths)
      .slice(0, 5), []);

  const maxDeaths = topDeadliest[0]?.totalDeaths ?? 1;

  const chartData = useMemo(() =>
    [...HISTORICAL_OUTBREAKS]
      .sort((a, b) => a.yearStart - b.yearStart)
      .map(o => ({
        year: `${o.yearStart}${o.yearStart !== o.yearEnd ? `-${o.yearEnd}` : ""}`,
        cases: o.totalCases,
        deaths: o.totalDeaths,
        name: o.name,
        country: o.country,
      })), []);

  const maxCases = Math.max(...chartData.map(d => d.cases), 1);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, color: "var(--cyan)" }}>📜 All-Time Ebola Tracking</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted)" }}>1976 – Present · Every Known Outbreak</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
        {[
          { icon: "🦠", value: stats.totalOutbreaks, label: "Outbreaks" },
          { icon: "📊", value: stats.totalCases.toLocaleString(), label: "Total Cases" },
          { icon: "💀", value: stats.totalDeaths.toLocaleString(), label: "Total Deaths" },
          { icon: "📈", value: `${stats.averageCFR.toFixed(1)}%`, label: "Avg CFR" },
          { icon: "🌍", value: stats.countriesAffected, label: "Countries" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 10,
            padding: "12px 10px", textAlign: "center",
          }}>
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: "var(--cyan)" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 13, color: "var(--cyan)" }}>📊 Cases & Deaths by Outbreak</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 160, overflowX: "auto" }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 34, flex: 1, gap: 1 }}>
              <div style={{ display: "flex", gap: 1, alignItems: "flex-end", height: 130 }}>
                <div style={{
                  width: "100%", maxWidth: 11,
                  height: `${Math.max((d.cases / maxCases) * 120, d.cases > 0 ? 4 : 0)}px`,
                  background: getCaseBarColor(d.cases),
                  borderRadius: "2px 2px 0 0",
                  opacity: 0.85,
                }} title={`${d.name}: ${d.cases.toLocaleString()} cases`} />
                <div style={{
                  width: "100%", maxWidth: 11,
                  height: `${Math.max((d.deaths / maxCases) * 120, d.deaths > 0 ? 4 : 0)}px`,
                  background: "#ef4444",
                  borderRadius: "2px 2px 0 0",
                  opacity: 0.9,
                }} title={`${d.name}: ${d.deaths.toLocaleString()} deaths`} />
              </div>
              <div style={{ fontSize: 7, color: "var(--muted)", marginTop: 3, textAlign: "center", lineHeight: 1.1 }}>{d.year}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 9, color: "var(--muted)" }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#f59e0b", marginRight: 4 }} />Cases</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#ef4444", marginRight: 4 }} />Deaths</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#ef4444", marginRight: 4 }} />5000+</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#f97316", marginRight: 4 }} />500+</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#f59e0b", marginRight: 4 }} />&lt;500</span>
        </div>
      </div>

      <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 13, color: "var(--red)" }}>💀 Deadliest Outbreaks</h3>
        {topDeadliest.map((o, i) => (
          <div key={o.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: "var(--text)" }}>{COUNTRY_FLAGS[o.country] || "🌍"} {o.name} ({o.yearStart})</span>
              <span style={{ color: "var(--red)", fontFamily: "'IBM Plex Mono', monospace" }}>{o.totalDeaths.toLocaleString()}</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3 }}>
              <div style={{
                height: "100%", borderRadius: 3,
                width: `${(o.totalDeaths / maxDeaths) * 100}%`,
                background: i === 0 ? "#ef4444" : i < 3 ? "#f97316" : "#f59e0b",
              }} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ margin: "0 0 12px", fontSize: 13, color: "var(--cyan)" }}>📋 All Outbreaks</h3>
        <div style={{ display: "grid", gap: 6 }}>
          {sorted.map((o) => {
            const isExpanded = expandedId === o.id;
            const isCurrent = o.id === "ebola-2026-current";
            return (
              <div
                key={o.id}
                onClick={() => setExpandedId(isExpanded ? null : o.id)}
                style={{
                  background: isCurrent ? "rgba(16,185,129,0.08)" : "rgba(5,18,30,0.5)",
                  border: `1px solid ${isCurrent ? "rgba(16,185,129,0.3)" : "rgba(49,215,255,0.1)"}`,
                  borderRadius: 8, padding: "10px 12px", cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                      {COUNTRY_FLAGS[o.country] || "🌍"} {o.name} {isCurrent && <span style={{ fontSize: 9, color: "var(--cyan)", marginLeft: 4 }}>● CURRENT</span>}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
                      {o.country} · {o.yearStart}{o.yearStart !== o.yearEnd ? `–${o.yearEnd}` : ""} · {o.strain}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", textAlign: "right" }}>
                    <div>
                      <div style={{ color: "var(--text)" }}>{o.totalCases.toLocaleString()}</div>
                      <div style={{ fontSize: 8, color: "var(--muted)" }}>CASES</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--red)" }}>{o.totalDeaths.toLocaleString()}</div>
                      <div style={{ fontSize: 8, color: "var(--muted)" }}>DEATHS</div>
                    </div>
                    <div>
                      <div style={{ color: getCfrColor(o.caseFatalityRate) }}>{o.caseFatalityRate}%</div>
                      <div style={{ fontSize: 8, color: "var(--muted)" }}>CFR</div>
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", lineHeight: 1.6 }}>
                    <p style={{ margin: "0 0 8px" }}>{o.summary}</p>
                    <p style={{ margin: 0, fontSize: 10 }}><strong style={{ color: "var(--cyan)" }}>WHO Response:</strong> {o.whoResponse}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
