"use client";

import { useEffect, useState, useRef } from "react";
import type { SignalReport } from "@/lib/reports/types";

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  "United States": { lat: 37.09, lng: -95.71 },
  "Argentina": { lat: -38.41, lng: -63.61 },
  "Chile": { lat: -35.67, lng: -71.54 },
  "Brazil": { lat: -14.23, lng: -51.92 },
  "Canada": { lat: 56.13, lng: -106.34 },
  "United Kingdom": { lat: 55.37, lng: -3.43 },
  "France": { lat: 46.22, lng: 2.21 },
  "Germany": { lat: 51.16, lng: 10.45 },
  "Spain": { lat: 40.46, lng: -3.74 },
  "China": { lat: 35.86, lng: 104.19 },
  "Japan": { lat: 36.2, lng: 138.25 },
  "Australia": { lat: -25.27, lng: 133.77 },
  "South Africa": { lat: -30.55, lng: 22.93 },
  "Mexico": { lat: 23.63, lng: -102.55 },
  "Peru": { lat: -9.19, lng: -75.01 },
  "Colombia": { lat: 4.57, lng: -74.29 },
  "Netherlands": { lat: 52.13, lng: 5.29 },
  "Belgium": { lat: 50.85, lng: 4.35 },
  "Italy": { lat: 41.87, lng: 12.56 },
  "Norway": { lat: 60.47, lng: 8.46 },
  "Ireland": { lat: 53.14, lng: -7.69 },
  "Turkey": { lat: 38.96, lng: 35.24 },
};

function getSeverityColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical": return "#FF1744";
    case "high": return "#FF6600";
    case "medium": return "#FFD700";
    case "low": case "recovered": return "#00FF41";
    default: return "#31d7ff";
  }
}

function groupByCountry(reports: SignalReport[]) {
  const map = new Map<string, { country: string; reports: number; highest: string; dates: Date[] }>();
  
  for (const report of reports) {
    const country = report.country;
    if (!country) continue;
    
    const existing = map.get(country);
    const reportDate = report.publishedAt ? new Date(report.publishedAt) : new Date();
    
    if (existing) {
      existing.reports++;
      existing.dates.push(reportDate);
      const sevLevels: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      if ((sevLevels[report.severity?.toLowerCase()] || 0) > (sevLevels[existing.highest] || 0)) {
        existing.highest = report.severity || "low";
      }
    } else {
      map.set(country, {
        country,
        reports: 1,
        highest: report.severity || "low",
        dates: [reportDate],
      });
    }
  }
  
  return Array.from(map.values()).sort((a, b) => b.reports - a.reports);
}

export function WorldMapTab({ reports, onSelectCountry }: { reports: SignalReport[]; onSelectCountry: () => void }) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const [play, setPlay] = useState(false);
  const [slider, setSlider] = useState(0);

  const dated = reports
    .map((r) => ({ r, t: r.publishedAt ? new Date(r.publishedAt).getTime() : null }))
    .filter((x) => typeof x.t === "number" && Number.isFinite(x.t)) as { r: SignalReport; t: number }[];

  const uniqueDays = Array.from(new Set(dated.map((x) => new Date(x.t).toISOString().slice(0, 10)))).sort();
  const maxIndex = Math.max(0, uniqueDays.length - 1);
  const sliderIndex = Math.min(slider, maxIndex);
  const selectedDay = uniqueDays[sliderIndex] ?? null;
  const activeReports = selectedDay
    ? reports.filter((r) => (r.publishedAt ? r.publishedAt.slice(0, 10) <= selectedDay : true))
    : reports;

  const grouped = groupByCountry(activeReports);

  useEffect(() => {
    if (!play) return;
    if (uniqueDays.length <= 1) return;
    const timer = window.setInterval(() => {
      setSlider((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 900);
    return () => window.clearInterval(timer);
  }, [maxIndex, play, uniqueDays.length]);

  // Initialize map once
  useEffect(() => {
    let map: any = null;
    let cancelled = false;

    const init = async () => {
      if (!containerRef.current || mapRef.current) return;
      
      // Check if container already has a map
      if ((containerRef.current as any)._leaflet_id) {
        return;
      }

      try {
        const L = await import("leaflet");
        
        if (cancelled || !containerRef.current) return;

        map = L.map(containerRef.current, {
          center: [20, 0],
          zoom: 2,
          minZoom: 2,
          maxZoom: 8,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '© OpenStreetMap © CARTO',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
        if (!cancelled) setMapReady(true);
      } catch (e) {
        console.error("Map init error:", e);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // Leaflet attaches to window in dev; fall back to require for SSR-safe builds.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const L = (window as any).L || require("leaflet");
    
    // Remove old markers
    const layersToRemove: any[] = [];
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker) {
        layersToRemove.push(layer);
      }
    });
    layersToRemove.forEach(l => mapRef.current.removeLayer(l));

    // Add new markers
    for (const group of grouped) {
      const coords = COUNTRY_COORDS[group.country];
      if (!coords) continue;

      const color = getSeverityColor(group.highest);
      const radius = Math.min(6 + group.reports * 1.5, 20);
      const dates = group.dates.sort((a, b) => a.getTime() - b.getTime());
      const firstDate = dates[0]?.toLocaleDateString() || "Unknown";
      const lastDate = dates[dates.length - 1]?.toLocaleDateString() || "Unknown";

      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius,
        fillColor: color,
        color: "#fff",
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.7,
      }).addTo(mapRef.current);

      marker.bindPopup(`
        <div style="min-width: 180px; font-family: monospace;">
          <strong style="font-size: 14px; color: ${color};">${group.country}</strong><br/>
          <span>Reports: ${group.reports}</span><br/>
          <span>Highest: ${group.highest}</span><br/>
          <span style="font-size: 10px;">First: ${firstDate}</span><br/>
          <span style="font-size: 10px;">Latest: ${lastDate}</span>
        </div>
      `);
    }

    // Fit bounds when playing so the map feels "alive" like the reference UI.
    if (grouped.length > 0) {
      const bounds = L.latLngBounds([]);
      for (const group of grouped) {
        const coords = COUNTRY_COORDS[group.country];
        if (!coords) continue;
        bounds.extend([coords.lat, coords.lng]);
      }
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds.pad(0.25), { animate: true, duration: 0.35 });
      }
    }
  }, [mapReady, grouped]);

  const canShare = typeof navigator !== "undefined" && typeof (navigator as any).share === "function";
  const share = async (title: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (canShare) {
        await (navigator as any).share({ title, text: title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      // eslint-disable-next-line no-alert
      alert("Link copied to clipboard.");
    } catch {
      // ignore
    }
  };

  return (
    <div className="world-map-tab">
      <div className="map-controls">
        <div className="map-controls-left">
          <div className="legend-title">Geographic Distribution</div>
          <div className="legend-items">
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--color-confirmed)" }}></span> Confirmed</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--color-symptomatic)" }}></span> Monitoring - Symptomatic</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--amber)" }}></span> Monitoring - Asymptomatic</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--color-recovered)" }}></span> Recovered</span>
          </div>
        </div>

        <div className="map-controls-right">
          <div className="map-actions">
            <div className="map-chip mono">{activeReports.length} cases</div>
            <button className="map-btn" onClick={() => mapRef.current?.fitWorld?.({ animate: true })}>Fit</button>
            <button className="map-btn map-btn-accent" onClick={() => share("Share with Mom")}>Share with Mom</button>
            <button className="map-btn" onClick={() => share("Outbreak Tracker")}>Share</button>
          </div>
          <div className="map-timeline">
            <button className="map-btn" onClick={() => setPlay((p) => !p)}>{play ? "Pause" : "Play"}</button>
            <input
              className="map-slider"
              type="range"
              min={0}
              max={maxIndex}
              value={sliderIndex}
              onChange={(e) => {
                setPlay(false);
                setSlider(Number(e.target.value));
              }}
            />
            <div className="map-day mono">{selectedDay ? selectedDay : "All dates"}</div>
            <button
              className="map-btn"
              onClick={() => {
                setPlay(false);
                setSlider(maxIndex);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div className="leaflet-map-container" style={{ height: "450px" }}>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
          {!mapReady && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#8faac0" }}>Loading map...</div>}
        </div>
      </div>

      <div className="country-stats">
        <h4>Countries by Report Count</h4>
        <div className="stats-grid">
          {grouped.slice(0, 12).map((group) => {
            const dates = group.dates.sort((a, b) => a.getTime() - b.getTime());
            return (
              <div key={group.country} className="stat-item">
                <span className="stat-country">{group.country}</span>
                <span className="stat-count" style={{ color: getSeverityColor(group.highest) }}>
                  {group.reports}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
