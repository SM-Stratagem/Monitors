"use client";

import { useEffect, useRef } from "react";

type ShipData = {
  vesselName: string;
  imo: string;
  mmsi: string;
  latitude: string;
  longitude: string;
  speed: string;
  course: string;
  heading: string;
  destination: string;
  port: string;
  status: string;
  lastPort: string;
  notes: string;
  lastUpdated: string;
};

type Props = {
  ship: ShipData | null;
};

export function ShipDeck({ ship }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !ship) return;

    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapRef.current) return;

      const lat = Number(ship.latitude) || 28.0614;
      const lng = Number(ship.longitude) || -16.5714;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 13,
        minZoom: 3,
        maxZoom: 17,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      const shipIcon = L.divIcon({
        html: `<div style="font-size: 36px; filter: drop-shadow(0 0 12px rgba(49,215,255,0.8));">🚢</div>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([lat, lng], { icon: shipIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'IBM Plex Mono', monospace; min-width: 220px;">
            <div style="font-weight: 700; color: #31d7ff; font-size: 14px; margin-bottom: 6px;">${ship.vesselName}</div>
            <div style="font-size: 10px; color: #94a3b8; line-height: 1.6;">
              Status: ${ship.status}<br/>
              Port: ${ship.port}<br/>
              Destination: ${ship.destination}<br/>
              Position: ${lat.toFixed(4)}°N, ${Math.abs(lng).toFixed(4)}°W<br/>
              Speed: ${ship.speed} knots<br/>
              IMO: ${ship.imo}<br/>
              MMSI: ${ship.mmsi}
            </div>
          </div>
        `)
        .openPopup();

      // Port circle
      L.circle([lat, lng], {
        radius: 500,
        color: "#31d7ff",
        fillColor: "#31d7ff",
        fillOpacity: 0.1,
        weight: 1,
        dashArray: "5,5",
      }).addTo(map);

      mapInstanceRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [ship]);

  const deckLayout = [
    { deck: 4, name: "Passenger Cabins", cabins: ["402", "403", "404", "405", "406", "407", "408", "409", "410"] },
    { deck: 3, name: "Passenger Cabins", cabins: ["301", "302", "303", "304", "305", "306", "307", "308"] },
    { deck: 2, name: "Crew Areas", cabins: ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12"] },
    { deck: 1, name: "Common Areas", cabins: ["Restaurant", "Lounge", "Medical Bay", "Bridge"] },
  ];

  const cabinCases: Record<string, string[]> = {
    "406": ["P002"],
    "C08": ["P004"],
    "C12": ["P003"],
  };

  return (
    <div className="ship-deck-tab">
      <div className="ship-header">
        <h2>🏥 {ship?.vesselName || "Ebola Treatment Center"}</h2>
        <div className="ship-status-bar">
          <span className="ship-status-badge">{ship?.status || "Unknown"}</span>
          <span>{ship?.port || "Unknown port"}</span>
          <span>Destination: {ship?.destination || "Unknown"}</span>
          {ship?.lastUpdated && <span>Updated: {new Date(ship.lastUpdated).toLocaleString()}</span>}
        </div>
      </div>

      <div className="ship-content">
        <div className="ship-map-panel">
          <h3>Live Position</h3>
          <div className="leaflet-map-container" style={{ height: 350 }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%", background: "#02070d" }} />
          </div>
          {ship && (
            <div className="ship-position-info">
              <div className="pos-field"><label>Coordinates</label><span>{Number(ship.latitude).toFixed(4)}°N, {Math.abs(Number(ship.longitude)).toFixed(4)}°W</span></div>
              <div className="pos-field"><label>Speed</label><span>{ship.speed} knots</span></div>
              <div className="pos-field"><label>Course</label><span>{ship.course}°</span></div>
              <div className="pos-field"><label>Last Port</label><span>{ship.lastPort || "Unknown"}</span></div>
            </div>
          )}
        </div>

        <div className="ship-deck-panel">
          <h3>Deck Layout</h3>
          <div className="deck-schematic">
            {deckLayout.map((d) => (
              <div key={d.deck} className="deck-section">
                <div className="deck-label">Deck {d.deck} — {d.name}</div>
                <div className="deck-grid">
                  {d.cabins.map((cabin) => {
                    const hasCase = cabinCases[cabin];
                    return (
                      <div key={cabin} className={`deck-cell ${hasCase ? "has-case" : ""}`} title={cabin}>
                        <div className="cell-name">{cabin}</div>
                        {hasCase && (
                          <div className="cell-indicator">
                            {hasCase.map(id => (
                              <span key={id} className="case-dot" title={id} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="deck-legend">
            <span><span className="case-dot" /> Case linked</span>
            <span>No cases</span>
          </div>
        </div>
      </div>
    </div>
  );
}
