import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background:
            "radial-gradient(circle at 70% 0%, rgba(10, 41, 66, 1) 0%, rgba(2, 9, 18, 1) 55%, rgba(1, 4, 10, 1) 100%)",
          color: "#EAF7FF",
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>
            Hantavirus Outbreak Tracker
          </div>
          <div style={{ fontSize: 26, opacity: 0.9 }}>
            MV Hondius 2026 • Global monitoring • Real-time ingestion
          </div>
          <div style={{ marginTop: 26, display: "flex", gap: 12 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(16,185,129,0.14)",
                color: "#CFFAEA",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Live map + timeline
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(125,220,255,0.06)",
                color: "#DFF3FF",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              WHO / CDC / ECDC sources
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

