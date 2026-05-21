"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";

type Props = {
  stats: any;
  latest: any[];
  geo: any[];
  ship: any;
  quarantine: any[];
  cases: any[];
  flights: any[];
};

const COUNTRY_COORDS: Record<string, [number, number]> = {
  "Global": [15, 0],
  "United States": [39.8, -98.5],
  "United Kingdom": [55.4, -3.4],
  "Canada": [56.1, -106.3],
  "Spain": [40.5, -3.7],
  "France": [46.2, 2.2],
  "Netherlands": [52.1, 5.3],
  "Germany": [51.2, 10.4],
  "Argentina": [-38.4, -63.6],
  "Chile": [-35.7, -71.5],
  "Australia": [-25.3, 133.8],
  "New Zealand": [-40.9, 174.9],
  "South Africa": [-30.6, 22.9],
  "Norway": [60.5, 8.5],
  "Sweden": [60.1, 18.6],
  "Finland": [61.9, 25.8],
  "Japan": [36.2, 138.3],
  "China": [35.9, 104.2],
  "South Korea": [35.9, 127.8],
  "Russia": [61.5, 105.3],
  "Turkey": [38.9, 35.2],
  "Mongolia": [46.9, 103.8],
  "Colombia": [4.6, -74.1],
  "Peru": [-9.2, -75.0],
  "Mexico": [23.6, -102.5],
  "Brazil": [-14.2, -51.9],
  "Philippines": [12.9, 121.8],
  "Israel": [31.0, 34.8],
  "Lebanon": [33.9, 35.9],
  "Poland": [51.9, 19.1],
  "Czech Republic": [49.8, 15.5],
  "Austria": [47.5, 14.6],
  "Romania": [45.9, 25.0],
  "Bulgaria": [42.7, 25.5],
  "Portugal": [39.4, -8.2],
  "Italy": [41.9, 12.6],
  "Denmark": [56.3, 9.5],
  "Belgium": [50.5, 4.5],
  "Ireland": [53.4, -8.2],
  "Malaysia": [4.2, 101.9],
  "Indonesia": [-0.8, 113.9],
  "Thailand": [15.9, 100.9],
  "Bolivia": [-16.3, -68.1],
  "Saint Helena": [-15.9, -5.7],
  "International Waters": [0, 0],
};

const SEV_COLORS: Record<string, string> = {
  critical: "#FF1744",
  high: "#FF6600",
  moderate: "#FFD700",
  low: "#31d7ff",
};

const STATUS_COLORS: Record<string, string> = {
  deceased: "#445566",
  confirmed: "#FF1744",
  symptomatic: "#FF6600",
  asymptomatic: "#00BCD4",
  monitoring: "#31d7ff",
  recovered: "#00FF41",
};

const AIRPORT_COORDS: Record<string, [number, number]> = {
  TFS: [28.04, -16.57],
  MAD: [40.47, -3.56],
  MAN: [53.47, -2.28],
  LBG: [48.97, 2.44],
  EIN: [51.45, 5.37],
  YBG: [48.43, -71.07],
  DCA: [38.85, -77.04],
  SYD: [-33.95, 151.18],
  IST: [41.26, 28.73],
  "N/A": [0, 0],
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 80;
  const h = 28;
  const padding = 2;
  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (w - padding * 2);
    const y = h - padding - (v / max) * (h - padding * 2);
    return `${x},${y}`;
  });
  const pathD = `M${points.join(" L")}`;
  const totalLen = data.length * 12;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
        style={{ strokeDasharray: totalLen, strokeDashoffset: totalLen }}
      />
    </svg>
  );
}

function SeverityBarChart({ counts }: { counts: Record<string, number> }) {
  const max = Math.max(...Object.values(counts), 1);
  const bars = [
    { label: "Critical", value: counts.critical || 0, color: "#FF1744" },
    { label: "High", value: counts.high || 0, color: "#FF6600" },
    { label: "Moderate", value: counts.moderate || 0, color: "#FFD700" },
    { label: "Low", value: counts.low || 0, color: "#31d7ff" },
  ];

  return (
    <div className="overview-panel">
      <h3>Severity Distribution</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {bars.map((b, i) => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--muted)", minWidth: 70 }}>{b.label}</span>
            <div style={{ flex: 1, height: 8, background: "rgba(49,215,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <div
                className="severity-bar-fill"
                style={{
                  height: "100%",
                  width: `${(b.value / max) * 100}%`,
                  background: b.color,
                  borderRadius: 4,
                  boxShadow: `0 0 8px ${b.color}44`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            </div>
            <span style={{ fontSize: 12, fontFamily: "IBM Plex Mono, monospace", color: b.color, minWidth: 30, textAlign: "right" }}>{b.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardOverview({ stats, latest, geo, ship, quarantine, cases, flights }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [15, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);

    const LegendClass = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create("div", "map-legend-control");
        div.innerHTML = `
          <div style="background:rgba(3,19,31,0.92);padding:10px 12px;border-radius:8px;border:1px solid rgba(49,215,255,0.3);font-size:10px;color:#94a3b8;font-family:'IBM Plex Mono',monospace;">
            <div style="font-weight:700;color:#31d7ff;margin-bottom:6px;font-size:11px;">LEGEND</div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#FF1744;margin-right:6px;"></span>Case marker</span>
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#FF6600;margin-right:6px;"></span>News signal cluster</span>
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#31d7ff;margin-right:6px;"></span>Flight route</span>
              <span style="margin-top:2px;">🚢 MV Hondius</span>
            </div>
          </div>
        `;
        return div;
      }
    });
    const legend = new LegendClass({ position: "bottomright" as any });
    legend.addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !markersLayerRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // Helper: find nearby signals from latest news for a given country
    function nearbySignals(country: string, max = 4): any[] {
      if (!country || !Array.isArray(latest)) return [];
      return latest.filter((s: any) => {
        if (s.country === country) return true;
        const c1 = COUNTRY_COORDS[country];
        const c2 = COUNTRY_COORDS[s.country];
        if (!c1 || !c2) return false;
        const dist = Math.sqrt(Math.pow((c1[0] - c2[0]) * 111, 2) + Math.pow((c1[1] - c2[1]) * 80, 2));
        return dist < 2000;
      }).slice(0, max);
    }

    // 1. Plot cases from case_timeline (real lat/lng) with surrounding activity
    let markerDelay = 0;
    if (Array.isArray(cases)) {
      for (const c of cases) {
        const lat = parseFloat(c.latitude);
        const lng = parseFloat(c.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

        const color = STATUS_COLORS[c.status] || "#31d7ff";
        const nearby = nearbySignals(c.country);

        const pulseClass = c.status === "confirmed" ? "marker-pulse-critical"
          : c.status === "symptomatic" ? "marker-pulse-high"
          : c.status === "asymptomatic" ? "marker-pulse-moderate"
          : "marker-pulse-low";

        const markerHtml = `
          <div style="position:relative;">
            <div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color}88;border:2px solid rgba(255,255,255,0.8);"
                 class="${pulseClass}"></div>
            ${c.severity === "critical" ? '<div class="sonar-ring" style="position:absolute;top:-3px;left:-3px;"></div>' : ""}
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const circle = L.marker([lat, lng], { icon });

        const nearbyHtml = nearby.length > 0
          ? `<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(49,215,255,0.25);">
              <div style="font-weight:600;color:#31d7ff;font-size:9px;text-transform:uppercase;margin-bottom:4px;">Surrounding Area Activity</div>
              ${nearby.map((n: any) => `<div style="font-size:9px;color:#94a3b8;padding:2px 0;border-bottom:1px solid rgba(49,215,255,0.1);">• ${n.title?.slice(0, 65) || "Report"}</div>`).join("")}
            </div>`
          : "";

        circle.bindPopup(`
          <div style="font-family:'IBM Plex Mono',monospace;min-width:240px;max-width:320px;">
            <div style="font-weight:700;color:${color};font-size:13px;margin-bottom:4px;">${c.caseId}</div>
            <div style="font-size:11px;color:#e8f6ff;margin-bottom:6px;">${c.name}</div>
            <div style="font-size:10px;color:#94a3b8;line-height:1.6;">
              Status: <strong style="color:${color}">${c.status}</strong><br/>
              Generation: ${c.generation ?? "N/A"}<br/>
              Country: ${c.country}${c.city ? ", " + c.city : ""}<br/>
              ${c.nationality ? "Nationality: " + c.nationality + "<br/>" : ""}
              ${c.age ? "Age: " + c.age + " · " : ""}${c.sex || ""}<br/>
              ${c.clinicalNotes ? '<div style="margin-top:4px;padding:4px;background:rgba(5,18,30,0.5);border-radius:3px;font-style:italic;">' + c.clinicalNotes.slice(0, 250) + '</div>' : ""}
            </div>
            ${nearbyHtml}
          </div>
        `);

        circle.on("mouseover", function(this: any) {
          const el = this.getElement();
          if (el) el.style.transform += " scale(1.3)";
        });
        circle.on("mouseout", function(this: any) {
          const el = this.getElement();
          if (el) el.style.transform = el.style.transform.replace(" scale(1.3)", "");
        });

        setTimeout(() => circle.addTo(layer), markerDelay);
        markerDelay += 50;
      }
    }

    // 2. Plot news signal clusters (use geo country centroids)
    if (Array.isArray(geo)) {
      for (const entry of geo) {
        const country = String(entry?.country ?? "").trim();
        const reports = Number(entry?.reports ?? 0);
        const point = COUNTRY_COORDS[country];
        if (!point || reports <= 0) continue;

        const color = reports >= 10 ? "#FF1744" : reports >= 5 ? "#FF6600" : "#FFD700";
        const radius = Math.min(18, 4 + Math.sqrt(reports) * 2.5);

        const circle = L.circleMarker(point, {
          radius,
          fillColor: color,
          color: "#fff",
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.4,
          dashArray: "4,4",
        }).addTo(layer);

        // Find related signals from surrounding countries
        const nearby = nearbySignals(country);

        circle.bindPopup(`
          <div style="font-family:'IBM Plex Mono',monospace;min-width:220px;max-width:320px;">
            <div style="font-weight:700;color:${color};font-size:13px;margin-bottom:4px;">${country}</div>
            <div style="font-size:10px;color:#94a3b8;line-height:1.6;">
              <strong style="color:${color}">${reports}</strong> reports in news feed<br/>
              Sources: WHO, CDC, ECDC, RKI, SerpAPI, Reddit
            </div>
            ${nearby.length > 0 ? `
              <div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(49,215,255,0.25);">
                <div style="font-weight:600;color:#31d7ff;font-size:9px;text-transform:uppercase;margin-bottom:4px;">Surrounding Activity</div>
                ${nearby.map((n: any) => `<div style="font-size:9px;color:#94a3b8;padding:2px 0;border-bottom:1px solid rgba(49,215,255,0.1);">• <span style="color:#aaa;">${n.country}</span> ${n.title?.slice(0, 50) || "Report"}</div>`).join("")}
              </div>
            ` : ""}
          </div>
        `);
      }
    }

    // 3. Plot flight routes
    if (Array.isArray(flights)) {
      for (const f of flights) {
        const fromCoords = AIRPORT_COORDS[f.departureAirport];
        const toCoords = AIRPORT_COORDS[f.arrivalAirport];
        if (!fromCoords || !toCoords || (fromCoords[0] === 0 && toCoords[0] === 0)) continue;

        const statusColor = f.status === "arrived" ? "#00FF41" : f.status === "departed" ? "#FF6600" : "#31d7ff";

        L.polyline([fromCoords, toCoords], {
          color: statusColor,
          weight: 1.5,
          opacity: 0.5,
          dashArray: "6,8",
        }).addTo(layer);

        const midLat = (fromCoords[0] + toCoords[0]) / 2;
        const midLng = (fromCoords[1] + toCoords[1]) / 2;

        const planeIcon = L.divIcon({
          html: `<div style="font-size:14px;filter:drop-shadow(0 0 4px rgba(49,215,255,0.7));">✈️</div>`,
          className: "",
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const plane = L.marker([midLat, midLng], { icon: planeIcon }).addTo(layer);
        plane.bindPopup(`
          <div style="font-family:'IBM Plex Mono',monospace;min-width:200px;">
            <div style="font-weight:700;color:${statusColor};font-size:12px;margin-bottom:4px;">${f.flightNumber}</div>
            <div style="font-size:10px;color:#94a3b8;line-height:1.6;">
              ${f.departureAirport} → ${f.arrivalAirport}<br/>
              Country: ${f.departureCountry || f.arrivalCountry || "Unknown"}<br/>
              Status: <strong style="color:${statusColor}">${f.status || "Scheduled"}</strong><br/>
              ${f.notes || ""}
            </div>
          </div>
        `);
      }
    }

    // 4. Plot ship position
    if (ship?.latitude && ship?.longitude) {
      const lat = Number(ship.latitude);
      const lng = Number(ship.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        const shipIcon = L.divIcon({
          html: `<div style="font-size:28px;filter:drop-shadow(0 0 10px rgba(49,215,255,0.9));">🚢</div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        const shipMarker = L.marker([lat, lng], { icon: shipIcon }).addTo(layer);
        shipMarker.bindPopup(`
          <div style="font-family:'IBM Plex Mono',monospace;min-width:220px;">
            <div style="font-weight:700;color:#31d7ff;font-size:13px;margin-bottom:4px;">🚢 ${ship.vesselName || "Vessel"}</div>
            <div style="font-size:10px;color:#94a3b8;line-height:1.6;">
              Status: ${ship.status || "Unknown"}<br/>
              Port: ${ship.port || "Unknown"}<br/>
              Destination: ${ship.destination || "Unknown"}<br/>
              ${ship.lastPort ? "Last port: " + ship.lastPort + "<br/>" : ""}
              Position: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°<br/>
              Updated: ${ship.lastUpdated ? new Date(ship.lastUpdated).toLocaleString() : "Unknown"}
            </div>
          </div>
        `);

        L.circle([lat, lng], {
          radius: 800,
          color: "#31d7ff",
          fillColor: "#31d7ff",
          fillOpacity: 0.08,
          weight: 1,
          dashArray: "4,4",
        }).addTo(layer);
      }
    }

    // 5. Fit bounds to show everything
    const allCoords: [number, number][] = [];
    if (Array.isArray(cases)) {
      for (const c of cases) {
        const lat = parseFloat(c.latitude);
        const lng = parseFloat(c.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) allCoords.push([lat, lng]);
      }
    }
    if (ship?.latitude && ship?.longitude) {
      allCoords.push([Number(ship.latitude), Number(ship.longitude)]);
    }
    if (allCoords.length > 2) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(allCoords).pad(0.15), { animate: false, maxZoom: 6 });
    }
  }, [cases, geo, flights, ship, mapReady]);

  const totalQuarantine = quarantine.reduce((sum: number, q: any) => sum + (q.passengers || 0), 0);

  const caseSparkline = (() => {
    if (!Array.isArray(cases) || cases.length === 0) return [];
    const byDate: Record<string, number> = {};
    for (const c of cases) {
      const d = (c.date || c.reportedAt || "").slice(0, 10);
      if (d) byDate[d] = (byDate[d] || 0) + 1;
    }
    const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
    return sorted.slice(-7).map(([, count]) => count);
  })();

  const reportSparkline = (() => {
    if (!Array.isArray(latest) || latest.length === 0) return [];
    const byDate: Record<string, number> = {};
    for (const item of latest) {
      const d = (item.publishedAt || "").slice(0, 10);
      if (d) byDate[d] = (byDate[d] || 0) + 1;
    }
    const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
    return sorted.slice(-7).map(([, count]) => count);
  })();

  const severityCounts = (() => {
    const counts: Record<string, number> = {};
    if (Array.isArray(latest)) {
      for (const item of latest) {
        const sev = item.severity || "low";
        counts[sev] = (counts[sev] || 0) + 1;
      }
    }
    return counts;
  })();

  return (
    <div className="dashboard-overview">
      <div className="overview-stats-grid">
        <div className="overview-stat-card stat-critical" title="Unique news reports from 20+ sources including WHO, CDC, ECDC, RKI, BBC, Reuters, Reddit">
          <div className="stat-card-icon">🔴</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.totalTrackedReports || 0}</div>
            <div className="stat-card-label">Reports (deduplicated)</div>
            <Sparkline data={reportSparkline} color="#FF1744" />
            <div className="stat-card-source">20+ sources</div>
          </div>
        </div>
        <div className="overview-stat-card stat-high" title="Reports tagged high or critical severity in the last 14 days">
          <div className="stat-card-icon">🟠</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.highSeverityLast14Days || 0}</div>
            <div className="stat-card-label">High/Critical (14d)</div>
            <div className="stat-card-source">AI-classified severity</div>
          </div>
        </div>
        <div className="overview-stat-card stat-info" title="MV Hondius outbreak cases tracked from WHO DON599, CDC, and country health authorities">
          <div className="stat-card-icon">🔬</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{cases?.length || 0}</div>
            <div className="stat-card-label">Cases Tracked</div>
            <Sparkline data={caseSparkline} color="#31d7ff" />
            <div className="stat-card-source">WHO, CDC, RKI, country health</div>
          </div>
        </div>
        <div className="overview-stat-card stat-info" title="Repatriation flights from Tenerife tracked via OpenSky Network">
          <div className="stat-card-icon">✈️</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{flights?.length || 0}</div>
            <div className="stat-card-label">Flights Tracked</div>
            <div className="stat-card-source">OpenSky Network + curated</div>
          </div>
        </div>
        <div className="overview-stat-card stat-info" title="Countries with active news signals or hantavirus case reports">
          <div className="stat-card-icon">🌍</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{Array.isArray(geo) ? geo.length : 0}</div>
            <div className="stat-card-label">Countries Affected</div>
            <div className="stat-card-source">Geo-tagged from news feeds</div>
          </div>
        </div>
        <div className="overview-stat-card stat-info" title="Passengers in quarantine across 9 countries with 45-day isolation protocols">
          <div className="stat-card-icon">🏥</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{totalQuarantine || 0}</div>
            <div className="stat-card-label">In Quarantine</div>
            <div className="stat-card-source">Country health authorities</div>
          </div>
        </div>
      </div>

      <SeverityBarChart counts={severityCounts} />

      <div className="dashboard-three-col">
        <div className="dashboard-col-left">
          <div className="overview-panel">
            <h3>📰 Latest Signals</h3>
            <div className="cases-scroll-list">
              {latest.length === 0 ? (
                <div className="empty-state">No signals yet</div>
              ) : (
                latest.slice(0, 12).map((r: any, i: number) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="case-feed-item">
                    <span className={`signal-severity sev-${r.severity}`}>{r.severity?.slice(0, 4)}</span>
                    <div className="case-feed-info">
                      <div className="case-feed-title">{r.title}</div>
                      <div className="case-feed-meta">{r.country || "Global"} · {r.source?.slice(0, 20)}</div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-col-center">
          <div className="hero-map-section">
            <div className="hero-map-container">
              <div ref={mapRef} style={{ width: "100%", height: "100%", background: "#02070d" }} />
            </div>
          </div>
        </div>

        <div className="dashboard-col-right">
          <div className="overview-panel">
            <h3>🔬 Case Details</h3>
            <div className="cases-scroll-list">
              {!cases || cases.length === 0 ? (
                <div className="empty-state">No case data</div>
              ) : (
                cases.slice(0, 12).map((c: any, i: number) => {
                  const color = STATUS_COLORS[c.status] || "#31d7ff";
                  return (
                    <div key={i} className="case-feed-item">
                      <span className="signal-severity" style={{ background: color + "22", color, border: "1px solid " + color + "44" }}>{c.status}</span>
                      <div className="case-feed-info">
                        <div className="case-feed-title">{c.caseId} — {c.name}</div>
                        <div className="case-feed-meta">{c.country} · Gen {c.generation ?? "?"}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overview-two-col">
        <div className="overview-panel">
          <h3>🏥 Quarantine Countdown</h3>
          <div className="overview-quarantine-list">
            {quarantine.slice(0, 8).map((q: any, i: number) => (
              <div key={i} className="overview-quarantine-item">
                <span className="quar-flag">{q.flag}</span>
                <span className="quar-country">{q.country}</span>
                <span className="quar-passengers">{q.passengers} pax</span>
                <span className="quar-days">{q.daysRemaining ?? 43}d</span>
                <span className={`quar-status quar-${q.status}`}>{q.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-panel">
          <h3>🗺️ Global Status</h3>
          <div className="overview-geo-section">
            <div className="geo-section-title">🔴 Countries Affected (MV Hondius)</div>
            <div className="overview-geo-list">
              {[
                { country: "Netherlands", flag: "🇳🇱", pax: 29, note: "Largest group evacuated" },
                { country: "United Kingdom", flag: "🇬🇧", pax: 22, note: "19 passengers + 3 crew" },
                { country: "United States", flag: "🇺🇸", pax: 17, note: "Nebraska BCU" },
                { country: "Spain", flag: "🇪🇸", pax: 14, note: "A310 charter" },
                { country: "Australia", flag: "🇦🇺", pax: 8, note: "Pending Monday" },
                { country: "Canada", flag: "🇨🇦", pax: 4, note: "Quebec isolation" },
                { country: "France", flag: "🇫🇷", pax: 5, note: "Paris Le Bourget" },
                { country: "Turkey", flag: "🇹🇷", pax: 3, note: "14-day quarantine" },
                { country: "Ireland", flag: "🇮🇪", pax: 2, note: "Air Corps evacuation" },
              ].map((g, i) => (
                <div key={i} className="overview-geo-item">
                  <span className="geo-country">{g.flag} {g.country}</span>
                  <span className="geo-note">{g.note}</span>
                  <span className="geo-count">{g.pax}</span>
                </div>
              ))}
            </div>

            <div className="geo-section-title" style={{ marginTop: 12 }}>🟠 Endemic Hantavirus Regions</div>
            <div className="overview-geo-list">
              {[
                { country: "China", cases: 746, note: "Highest global burden" },
                { country: "Argentina", cases: 312, note: "Endemic Andes virus" },
                { country: "Russia", cases: 323, note: "Major HFRS burden" },
                { country: "South Korea", cases: 156, note: "Hantaan endemic" },
                { country: "Finland", cases: 187, note: "Puumala epidemic" },
                { country: "Turkey", cases: 162, note: "Endemic HFRS" },
                { country: "Chile", cases: 89, note: "Andes virus" },
                { country: "Japan", cases: 88, note: "Endemic HFRS" },
              ].map((g, i) => (
                <div key={i} className="overview-geo-item">
                  <span className="geo-country">{g.country}</span>
                  <span className="geo-note">{g.note}</span>
                  <span className="geo-count">{g.cases}</span>
                </div>
              ))}
            </div>

            <div className="geo-section-title" style={{ marginTop: 12 }}>🟡 Possible Affected (MV Hondius Contacts)</div>
            <div className="overview-geo-list">
              {[
                { country: "South Africa", note: "Index death (JNB), KLM contact traced" },
                { country: "Saint Helena", note: "30-40 passengers disembarked, contact tracing" },
                { country: "Tristan da Cunha", note: "1 suspected case, paratroopers deployed" },
                { country: "Portugal", note: "Canary Islands TFS transit hub" },
                { country: "Germany", note: "RKI advisory issued, monitoring" },
                { country: "Norway", note: "Air ambulance on standby" },
                { country: "Sweden", note: "Scandinavian passengers monitoring" },
              ].map((g, i) => (
                <div key={i} className="overview-geo-item">
                  <span className="geo-country">{g.country}</span>
                  <span className="geo-note">{g.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
