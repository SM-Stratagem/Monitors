"use client";

export function InfoTab({ lastSyncAt }: { lastSyncAt: string | null }) {
  return (
    <div className="info-tab">
      {/* About Section */}
      <div className="info-section">
        <h3>📡 About EVDTrack</h3>
        <p>
          EVDTrack is an unofficial real-time intelligence dashboard that aggregates 
          public-source Ebola virus disease signals for situational awareness. It is not affiliated 
          with WHO, CDC, or any official public health authority.
        </p>
        <p>
          Data is collected automatically from RSS feeds and official health authority 
          websites, then processed with AI-assisted analysis to identify relevant signals.
        </p>
      </div>

      {/* Data Sources */}
      <div className="info-section">
        <h3>📊 Data Sources</h3>
        <div className="info-links">
          <a href="https://www.who.int/emergencies/disease-outbreak-news" target="_blank" rel="noreferrer" className="info-link">
            <span className="info-link-icon">🌐</span>
            <div className="info-link-text">
              <strong>WHO Disease Outbreak News</strong>
              <span>Official WHO situation reports</span>
            </div>
            <span className="info-link-arrow">↗</span>
          </a>
          <a href="https://www.cdc.gov/ebola/" target="_blank" rel="noreferrer" className="info-link">
            <span className="info-link-icon">🇺🇸</span>
            <div className="info-link-text">
              <strong>CDC - Ebola</strong>
              <span>US Centers for Disease Control</span>
            </div>
            <span className="info-link-arrow">↗</span>
          </a>
          <a href="https://news.google.com/rss/search?q=ebola+virus+disease" target="_blank" rel="noreferrer" className="info-link">
            <span className="info-link-icon">📰</span>
            <div className="info-link-text">
              <strong>Google News</strong>
              <span>Aggregated news coverage</span>
            </div>
            <span className="info-link-arrow">↗</span>
          </a>
        </div>
      </div>

      {/* Limitations */}
      <div className="info-section">
        <h3>⚠️ Limitations</h3>
        <p>
          This dashboard aggregates publicly available information. Data may be incomplete, 
          delayed, duplicated, or inaccurate. Always verify critical information with 
          official public health authorities before making decisions.
        </p>
        <p style={{ color: "#f97316", fontWeight: "500" }}>
          This is NOT a substitute for official health guidance. For medical decisions, 
          consult qualified healthcare professionals and official authorities.
        </p>
      </div>

      {/* System Status */}
      <div className="info-section">
        <h3>⚙️ System Status</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <div style={{ padding: "12px", background: "rgba(30, 41, 59, 0.5)", borderRadius: "8px" }}>
            <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Last Sync</div>
            <div style={{ fontSize: "13px", color: "#f1f5f9", fontFamily: "'IBM Plex Mono', monospace" }}>
              {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : "Unknown"}
            </div>
          </div>
          <div style={{ padding: "12px", background: "rgba(30, 41, 59, 0.5)", borderRadius: "8px" }}>
            <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Ingestion</div>
            <div style={{ fontSize: "13px", color: "#10b981" }}>
              Every 5 minutes via Railway Cron
            </div>
          </div>
          <div style={{ padding: "12px", background: "rgba(30, 41, 59, 0.5)", borderRadius: "8px" }}>
            <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>AI Analysis</div>
            <div style={{ fontSize: "13px", color: "#8b5cf6" }}>
              Google Gemini for risk assessment
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "16px", color: "#64748b", fontSize: "11px" }}>
        EVDTrack | Built for public health awareness | Data may be delayed or incomplete
      </div>
    </div>
  );
}
