"use client";

import React, { useState } from "react";

type Flight = {
  id: number;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureCountry: string;
  arrivalCountry: string;
  status: string;
  latitude: string | null;
  longitude: string | null;
  altitude: number | null;
  speed: string | null;
  heading: string | null;
  totalPassengers: number;
  totalCrew: number;
  notes: string;
  lastUpdated: string;
};

type Props = {
  flights: Flight[];
};

const STATUS_COLORS: Record<string, string> = {
  airborne: "#00FF41",
  ground: "#FFD700",
  scheduled: "#31d7ff",
  departed: "#FF6600",
  arrived: "#00FF41",
  en_route: "#FF6600",
  landed: "#00FF41",
  cancelled: "#FF1744",
};

export function FlightTracker({ flights }: Props) {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  return (
    <div className="flight-tracker">
      <div className="flight-tracker-header">
        <h2>Flight Tracker — Repatriation Flights</h2>
        <span className="flight-count">{flights.length} flights tracked</span>
      </div>

      <div className="flight-layout">
        <div className="flight-list-panel">
          {flights.map((f, idx) => (
            <button
              key={f.id}
              className={`flight-card stagger-card ${selectedFlight?.id === f.id ? "selected" : ""}`}
              style={{ "--i": idx } as React.CSSProperties}
              onClick={() => setSelectedFlight(f)}
            >
              <div className="flight-card-header">
                <span className="flight-number">{f.flightNumber}</span>
                <span className="flight-status" style={{ color: STATUS_COLORS[f.status?.toLowerCase()] || "#94a3b8" }}>
                  {f.status || "Unknown"}
                </span>
              </div>
              <div className="flight-route">
                {f.departureAirport} → {f.arrivalAirport}
              </div>
              <div className="flight-meta">
                {f.departureCountry} · {f.notes ? "Charter" : "Scheduled"}
              </div>
            </button>
          ))}
        </div>

        <div className="flight-detail-panel">
          {selectedFlight ? (
            <>
              <h3>{selectedFlight.flightNumber}</h3>
              <div className="flight-detail-grid">
                <div className="detail-field"><label>Airline</label><span>{selectedFlight.airline || "Charter"}</span></div>
                <div className="detail-field"><label>Status</label>
                  <span style={{ color: STATUS_COLORS[selectedFlight.status?.toLowerCase()] || "#94a3b8" }}>
                    {selectedFlight.status || "Unknown"}
                  </span>
                </div>
                <div className="detail-field"><label>Route</label><span>{selectedFlight.departureAirport} → {selectedFlight.arrivalAirport}</span></div>
                <div className="detail-field"><label>From</label><span>{selectedFlight.departureCity || selectedFlight.departureCountry}</span></div>
                <div className="detail-field"><label>To</label><span>{selectedFlight.arrivalCity || selectedFlight.arrivalCountry}</span></div>
                {selectedFlight.altitude != null && <div className="detail-field"><label>Altitude</label><span>{selectedFlight.altitude} ft</span></div>}
                {selectedFlight.speed && <div className="detail-field"><label>Speed</label><span>{selectedFlight.speed} kts</span></div>}
                {selectedFlight.latitude && selectedFlight.longitude && (
                  <div className="detail-field"><label>Position</label>
                    <span>{Number(selectedFlight.latitude).toFixed(4)}°, {Number(selectedFlight.longitude).toFixed(4)}°</span>
                  </div>
                )}
                <div className="detail-field"><label>Last Updated</label><span>{new Date(selectedFlight.lastUpdated).toLocaleString()}</span></div>
              </div>
              {selectedFlight.notes && (
                <div className="flight-notes">
                  <label>Notes</label>
                  <p>{selectedFlight.notes}</p>
                </div>
              )}
              {selectedFlight.latitude && selectedFlight.longitude && (
                <div className="flight-position-map">
                  <div className="position-info">
                    📍 Live position: {Number(selectedFlight.latitude).toFixed(4)}°, {Number(selectedFlight.longitude).toFixed(4)}°
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flight-detail-empty">Select a flight to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
