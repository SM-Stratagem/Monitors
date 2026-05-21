"use client";

import type { SignalReport } from "@/lib/reports/types";

export function TransmissionChainsTab({ reports, onOpen }: { reports: SignalReport[]; onOpen: (report: SignalReport) => void }) {
  if (!reports.length) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#8faac0" }}>
        <p>No signals available to generate transmission graph.</p>
      </div>
    );
  }

  // Simple SVG-based network visualization
  const nodes = reports.slice(0, 20).map((report, idx) => ({
    id: `node-${idx}`,
    report,
    title: report.title || "No title",
    country: report.country || "Global",
    severity: report.severity || "low",
  }));

  // Create links based on shared country or source
  const links: Array<{ source: number; target: number }> = [];
  for (let i = 0; i < nodes.length && links.length < 30; i++) {
    for (let j = i + 1; j < nodes.length && links.length < 30; j++) {
      if (nodes[i].country === nodes[j].country || nodes[i].report.source === nodes[j].report.source) {
        links.push({ source: i, target: j });
      }
    }
  }

  // Calculate positions (force-directed simplified)
  const width = 900;
  const height = 450;
  const nodePositions = nodes.map((_, idx) => ({
    x: 80 + (idx % 5) * 160 + seededOffset(idx, 41, 40),
    y: 60 + Math.floor(idx / 5) * 80 + seededOffset(idx, 73, 30),
  }));

  const getSeverityColor = (sev: string) => {
    switch (sev?.toLowerCase()) {
      case "critical": return "#FF1744";
      case "high": return "#FF6600";
      case "medium": return "#FFD700";
      case "low": return "#00FF41";
      default: return "#31d7ff";
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="chain-toolbar" style={{ marginBottom: "10px", padding: "8px", background: "rgba(5,18,30,0.5)", borderRadius: "8px" }}>
        <span style={{ fontSize: "10px", color: "#7ddcff", textTransform: "uppercase" }}>Signal Relationship Graph</span>
        <span style={{ fontSize: "11px", color: "#8faac0", marginLeft: "auto" }}>
          {nodes.length} nodes · {links.length} connections
        </span>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} style={{ 
        width: "100%", 
        height: "450px", 
        background: "#04121d", 
        borderRadius: "10px",
        border: "1px solid rgba(49,215,255,0.2)"
      }}>
        {/* Links */}
        {links.map((link, idx) => {
          const source = nodePositions[link.source];
          const target = nodePositions[link.target];
          if (!source || !target) return null;
          return (
            <line
              key={idx}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="rgba(255,176,32,0.4)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const pos = nodePositions[idx];
          const color = getSeverityColor(node.severity);
          const radius = 12 + seededOffset(idx, 17, 8);
          
          return (
            <g 
              key={node.id} 
              onClick={() => onOpen(node.report)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius + 8}
                fill={`${color}22`}
                className="pulse-ring"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={color}
                fillOpacity="0.8"
                stroke="#fff"
                strokeWidth="0.5"
              />
              <text
                x={pos.x}
                y={pos.y + 20}
                fill="#e8f6ff"
                fontSize="9"
                textAnchor="middle"
              >
                {node.country.slice(0, 3).toUpperCase()}
              </text>
              <title>{node.title}</title>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginTop: "10px", fontSize: "11px", color: "#8faac0" }}>
        <span>● <span style={{ color: "#FF1744" }}>Critical</span></span>
        <span>● <span style={{ color: "#FF6600" }}>High</span></span>
        <span>● <span style={{ color: "#FFD700" }}>Medium</span></span>
        <span>● <span style={{ color: "#00FF41" }}>Low</span></span>
        <span style={{ marginLeft: "auto" }}>Dashed lines = shared country or source</span>
      </div>
    </div>
  );
}

function seededOffset(index: number, salt: number, spread: number) {
  const value = (index * salt * 13) % 997;
  return (value / 997) * spread;
}
