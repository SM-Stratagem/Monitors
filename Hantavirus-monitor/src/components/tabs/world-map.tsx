"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

type Case = {
  caseId: string;
  name: string;
  status: string;
  generation: number;
  country: string;
  city: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  nationality?: string;
  age?: number | null;
  sex?: string | null;
  clinicalNotes?: string;
};

type Flight = {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  status: string;
  departureCountry: string;
  arrivalCountry: string;
  notes: string;
};

type Props = {
  cases: Case[];
  geo?: any[];
  flights?: Flight[];
  ship?: any;
  latest?: any[];
};

const STATUS_COLORS: Record<string, string> = {
  deceased: "#445566",
  confirmed: "#FF1744",
  symptomatic: "#FF6600",
  asymptomatic: "#00BCD4",
  monitoring: "#31d7ff",
  recovered: "#00FF41",
};

const COUNTRY_COORDS: Record<string, [number, number]> = {
  "Argentina": [-38.4, -63.6], "Chile": [-35.7, -71.5], "Brazil": [-14.2, -51.9],
  "United Kingdom": [55.4, -3.4], "Spain": [40.5, -3.7], "France": [46.2, 2.2],
  "Netherlands": [52.1, 5.3], "Germany": [51.2, 10.4], "Canada": [56.1, -106.3],
  "United States": [39.8, -98.5], "Australia": [-25.3, 133.8], "New Zealand": [-40.9, 174.9],
  "South Africa": [-30.6, 22.9], "Norway": [60.5, 8.5], "Sweden": [60.1, 18.6],
  "Finland": [61.9, 25.8], "Japan": [36.2, 138.3], "China": [35.9, 104.2],
  "South Korea": [35.9, 127.8], "Russia": [61.5, 105.3], "Turkey": [38.9, 35.2],
  "Mongolia": [46.9, 103.8], "Colombia": [4.6, -74.1], "Peru": [-9.2, -75.0],
  "Mexico": [23.6, -102.5], "Israel": [31.0, 34.8], "Ireland": [53.4, -8.2],
  "Italy": [41.9, 12.6], "Portugal": [39.4, -8.2], "Poland": [51.9, 19.1],
  "Romania": [45.9, 25.0], "Bulgaria": [42.7, 25.5], "Austria": [47.5, 14.6],
  "Belgium": [50.5, 4.5], "Denmark": [56.3, 9.5], "Czech Republic": [49.8, 15.5],
  "Saint Helena": [-15.9, -5.7],
};

const AIRPORT_COORDS: Record<string, [number, number]> = {
  TFS: [28.04, -16.57], MAD: [40.47, -3.56], MAN: [53.47, -2.28],
  LBG: [48.97, 2.44], EIN: [51.45, 5.37], YBG: [48.43, -71.07],
  DCA: [38.85, -77.04], SYD: [-33.95, 151.18], IST: [41.26, 28.73],
};

export function WorldMap({ cases, geo = [], flights = [], ship, latest = [] }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [15, 0], zoom: 2, minZoom: 2, maxZoom: 12,
      zoomControl: true, scrollWheelZoom: true, attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);

    const LegendClass = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create("div");
        div.innerHTML = `
          <div style="background:rgba(3,19,31,0.92);padding:10px 12px;border-radius:8px;border:1px solid rgba(49,215,255,0.3);font-size:10px;color:#94a3b8;font-family:'IBM Plex Mono',monospace;">
            <div style="font-weight:700;color:#31d7ff;margin-bottom:6px;font-size:11px;">LEGEND</div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#FF1744;margin-right:6px;"></span>Case marker</span>
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#FF6600;margin-right:6px;"></span>News signal cluster</span>
              <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#31d7ff;margin-right:6px;"></span>Flight route</span>
              <span style="margin-top:2px;">🚢 MV Hondius</span>
            </div>
          </div>`;
        return div;
      }
    });
    new (LegendClass as any)({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!layerRef.current) return;
    const layer = layerRef.current;
    layer.clearLayers();

    // Helper: find nearby signals for surrounding area activity
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

    // 1. Case markers with surrounding area activity
    for (const c of cases) {
      const lat = parseFloat(String(c.latitude));
      const lng = parseFloat(String(c.longitude));
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const color = STATUS_COLORS[c.status] || "#31d7ff";
      const r = c.status === "deceased" ? 9 : c.status === "confirmed" ? 8 : 6;
      const nearby = nearbySignals(c.country);

      const m = L.circleMarker([lat, lng], { radius: r, fillColor: color, color: "#fff", weight: 1.5, opacity: 0.9, fillOpacity: 0.75 }).addTo(layer);
      m.on("mouseover", function(this: any) { this.setStyle({ weight: 3, fillOpacity: 0.9 }); });
      m.on("mouseout", function(this: any) { this.setStyle({ weight: 1.5, fillOpacity: 0.75 }); });

      const nearbyHtml = nearby.length > 0
        ? `<div style="margin-top:8px;padding-top:6px;border-top:1px solid rgba(49,215,255,0.25);"><div style="font-weight:600;color:#31d7ff;font-size:9px;text-transform:uppercase;margin-bottom:4px;">Surrounding Area Activity</div>${nearby.map((n: any) => `<div style="font-size:9px;color:#94a3b8;padding:2px 0;border-bottom:1px solid rgba(49,215,255,0.1);">• ${n.title?.slice(0, 65) || "Report"}</div>`).join("")}</div>`
        : "";

      m.bindPopup(`<div style="font-family:'IBM Plex Mono',monospace;min-width:240px;max-width:320px;"><div style="font-weight:700;color:${color};font-size:13px;margin-bottom:4px;">${c.caseId}</div><div style="font-size:11px;color:#e8f6ff;margin-bottom:6px;">${c.name}</div><div style="font-size:10px;color:#94a3b8;line-height:1.6;">Status: <strong style="color:${color}">${c.status}</strong><br/>Generation: ${c.generation ?? "N/A"}<br/>Country: ${c.country}${c.city ? ", " + c.city : ""}<br/>${c.nationality ? "Nationality: " + c.nationality + "<br/>" : ""}${c.age ? "Age: " + c.age + " · " : ""}${c.sex || ""}</div>${nearbyHtml}</div>`);
    }

    // 2. News clusters with surrounding activity
    for (const entry of geo) {
      const country = String(entry?.country ?? "").trim();
      if (!country || country === "International Waters") continue;
      const reports = Number(entry?.reports ?? 0);
      const point = COUNTRY_COORDS[country];
      if (!point || reports <= 0) continue;
      const color = reports >= 100 ? "#FF1744" : reports >= 50 ? "#FF6600" : reports >= 10 ? "#FFD700" : "#31d7ff";
      const r = Math.min(18, 3 + Math.log2(reports + 1) * 3);
      const nearby = nearbySignals(country);

      const m = L.circleMarker(point, { radius: r, fillColor: color, color: "#fff", weight: 1, opacity: 0.6, fillOpacity: 0.35, dashArray: "4,4" }).addTo(layer);

      const nearbyHtml = nearby.length > 0
        ? `<div style="margin-top:6px;padding-top:4px;border-top:1px solid rgba(49,215,255,0.25);"><div style="font-weight:600;color:#31d7ff;font-size:9px;text-transform:uppercase;margin-bottom:3px;">Surrounding Activity</div>${nearby.map((n: any) => `<div style="font-size:9px;color:#94a3b8;padding:2px 0;">• <span style="color:#aaa;">${n.country}</span> ${n.title?.slice(0, 50) || "Report"}</div>`).join("")}</div>`
        : "";

      m.bindPopup(`<div style="font-family:'IBM Plex Mono',monospace;min-width:220px;max-width:320px;"><div style="font-weight:700;color:${color};font-size:13px;margin-bottom:4px;">${country}</div><div style="font-size:10px;color:#94a3b8;line-height:1.6;"><strong style="color:${color}">${reports}</strong> reports in news feed<br/>Sources: WHO, CDC, ECDC, RKI, SerpAPI, Reddit</div>${nearbyHtml}</div>`);
    }

    // 3. Flight routes with details
    for (const f of flights) {
      const from = AIRPORT_COORDS[f.departureAirport];
      const to = AIRPORT_COORDS[f.arrivalAirport];
      if (!from || !to) continue;
      const sc = f.status === "arrived" ? "#00FF41" : f.status === "departed" ? "#FF6600" : "#31d7ff";
      L.polyline([from, to], { color: sc, weight: 1.5, opacity: 0.5, dashArray: "6,8" }).addTo(layer);
      const icon = L.divIcon({ html: `<div style="font-size:14px;filter:drop-shadow(0 0 4px rgba(49,215,255,0.6));">✈️</div>`, className: "", iconSize: [18, 18], iconAnchor: [9, 9] });
      const mid: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
      L.marker(mid, { icon }).addTo(layer).bindPopup(`<div style="font-family:'IBM Plex Mono',monospace;min-width:200px;"><div style="font-weight:700;color:${sc};font-size:12px;">${f.flightNumber}</div><div style="font-size:10px;color:#94a3b8;line-height:1.6;">${f.departureAirport} → ${f.arrivalAirport}<br/>Country: ${f.departureCountry || f.arrivalCountry || "Unknown"}<br/>Status: <strong style="color:${sc}">${f.status || "Scheduled"}</strong><br/>${f.notes || ""}</div></div>`);
    }

    // 4. Ship with full details
    if (ship?.latitude && ship?.longitude) {
      const lat = Number(ship.latitude), lng = Number(ship.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        const icon = L.divIcon({ html: `<div style="font-size:28px;filter:drop-shadow(0 0 10px rgba(49,215,255,0.9));">🚢</div>`, className: "", iconSize: [32, 32], iconAnchor: [16, 16] });
        L.marker([lat, lng], { icon }).addTo(layer).bindPopup(`<div style="font-family:'IBM Plex Mono',monospace;min-width:240px;"><div style="font-weight:700;color:#31d7ff;font-size:13px;margin-bottom:4px;">🚢 ${ship.vesselName || "Vessel"}</div><div style="font-size:10px;color:#94a3b8;line-height:1.7;">Status: <strong>${ship.status || "Unknown"}</strong><br/>Port: ${ship.port || "Unknown"}<br/>Destination: ${ship.destination || "Unknown"}<br/>${ship.lastPort ? "Last port: " + ship.lastPort + "<br/>" : ""}Speed: ${ship.speed || 0} knots<br/>Position: ${lat.toFixed(4)}°N, ${Math.abs(lng).toFixed(4)}°W<br/>${ship.notes || ""}</div></div>`);
        L.circle([lat, lng], { radius: 800, color: "#31d7ff", fillColor: "#31d7ff", fillOpacity: 0.08, weight: 1, dashArray: "4,4" }).addTo(layer);
      }
    }

    // Fit bounds
    const coords: [number, number][] = [];
    for (const c of cases) { const la = parseFloat(String(c.latitude)), lo = parseFloat(String(c.longitude)); if (Number.isFinite(la) && Number.isFinite(lo)) coords.push([la, lo]); }
    if (ship?.latitude && ship?.longitude) coords.push([Number(ship.latitude), Number(ship.longitude)]);
    if (coords.length > 2) mapInstanceRef.current.fitBounds(L.latLngBounds(coords).pad(0.15), { animate: false, maxZoom: 6 });
  }, [cases, geo, flights, ship, latest]);

  return (
    <div className="world-map-tab">
      <div className="map-legend-bar">
        <span className="legend-item"><span className="legend-dot" style={{ background: "#FF1744" }} /> Cases</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#FF6600" }} /> News signals</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: "#31d7ff" }} /> Flights</span>
        <span className="legend-item">🚢 MV Hondius</span>
      </div>
      <div className="leaflet-map-container">
        <div ref={mapRef} style={{ width: "100%", height: "100%", background: "#02070d" }} />
      </div>
      <div className="map-stats-bar">
        <span>{cases.filter(c => c.latitude).length} cases plotted</span>
        <span>{new Set(cases.map(c => c.country)).size} countries</span>
        <span>{flights.length} flight routes</span>
        <span>{geo.length} news regions</span>
      </div>
    </div>
  );
}
