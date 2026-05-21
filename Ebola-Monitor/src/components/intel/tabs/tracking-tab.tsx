"use client";

import { useState } from "react";

interface Flight {
  id: string;
  country: string;
  flag: string;
  status: string;
  route: string;
  details: string;
  passengers: number;
  departedTime: string;
  arrivedTime: string;
  sources: Array<{ text: string; url: string }>;
}

const REPATRIATION_FLIGHTS: Flight[] = [
  {
    id: "es",
    country: "Spain",
    flag: "🇪🇸",
    status: "ARRIVED",
    route: "TFS → Torrejón Air Base, Madrid",
    details: "A310 \"Reino de España\" T.22-2",
    passengers: 14,
    departedTime: "~13:00 local",
    arrivedTime: "Arrived",
    sources: [
      { text: "AP — Plane carrying Spanish passengers from Ebola-affected area", url: "https://www.2news.com" }
    ]
  },
  {
    id: "fr",
    country: "France",
    flag: "🇫🇷",
    status: "ARRIVED ⚠",
    route: "TFS → Paris Le Bourget",
    details: "Medical charter · French Foreign Office",
    passengers: 5,
    departedTime: "~12:00 local",
    arrivedTime: "Arrived",
    sources: [
      { text: "The Guardian — France medical repatriation", url: "https://www.theguardian.com" }
    ]
  },
  {
    id: "gb",
    country: "United Kingdom",
    flag: "🇬🇧",
    status: "ARRIVED",
    route: "ZT791 · Manchester Airport",
    details: "19 guests + 3 crew · Hospitalization on arrival",
    passengers: 22,
    departedTime: "Afternoon",
    arrivedTime: "Arrived",
    sources: [
      { text: "AP — Ebola medical evacuation coverage", url: "https://www.2news.com" }
    ]
  },
  {
    id: "nl",
    country: "Netherlands",
    flag: "🇳🇱",
    status: "ARRIVED",
    route: "Eindhoven Airport",
    details: "29-person charter",
    passengers: 29,
    departedTime: "Afternoon",
    arrivedTime: "Arrived",
    sources: [
      { text: "Dutch Foreign Ministry confirmation", url: "https://www.2news.com" }
    ]
  },
  {
    id: "ca",
    country: "Canada",
    flag: "🇨🇦",
    status: "DEPARTED",
    route: "TFS → Bagotville → British Columbia",
    details: "4 passengers",
    passengers: 4,
    departedTime: "Afternoon",
    arrivedTime: "En route",
    sources: [
      { text: "CBC — Ebola medical evacuation", url: "https://www.cbc.ca" }
    ]
  },
  {
    id: "tr",
    country: "Turkey",
    flag: "🇹🇷",
    status: "DEPARTED",
    route: "TFS → Turkey",
    details: "3 passengers",
    passengers: 3,
    departedTime: "Afternoon",
    arrivedTime: "En route",
    sources: []
  },
  {
    id: "ie",
    country: "Ireland",
    flag: "🇮🇪",
    status: "DEPARTED",
    route: "IRL290 · Irish Air Corps",
    details: "1 passenger + medical escort",
    passengers: 2,
    departedTime: "Afternoon",
    arrivedTime: "En route",
    sources: []
  },
  {
    id: "us",
    country: "United States",
    flag: "🇺🇸",
    status: "DEPARTED",
    route: "TFS → D.C. → Nebraska Biocontainment Unit",
    details: "Biocontainment charter · CDC escort",
    passengers: 17,
    departedTime: "Afternoon",
    arrivedTime: "En route",
    sources: [
      { text: "AP — US biocontainment charter", url: "https://www.2news.com" }
    ]
  },
  {
    id: "au",
    country: "Australia",
    flag: "🇦🇺",
    status: "MONDAY",
    route: "Last flight out of TFS",
    details: "Also evacuating 🇳🇿 + nearby nationalities",
    passengers: 8,
    departedTime: "Monday",
    arrivedTime: "Pending",
    sources: []
  }
];

export function TrackingTab() {
  const [selectedFlight, setSelectedFlight] = useState<Flight>(REPATRIATION_FLIGHTS[0]);

  return (
    <div className="tracking-tab">
      <div className="tracking-layout">
        {/* Flight Selector */}
        <div className="tracking-sidebar">
          <div className="sidebar-header">Repatriation Flights</div>
          {REPATRIATION_FLIGHTS.map((flight) => (
            <button
              key={flight.id}
              className={`flight-item ${selectedFlight.id === flight.id ? "active" : ""}`}
              onClick={() => setSelectedFlight(flight)}
            >
              <div className="flight-item-header">
                <span className="flight-flag">{flight.flag}</span>
                <span className="flight-country">{flight.country}</span>
              </div>
              <div className="flight-item-status" data-status={flight.status.toLowerCase()}>
                {flight.status}
              </div>
              <div className="flight-item-route">{flight.route.split("→")[0]}</div>
            </button>
          ))}
        </div>

        {/* Flight Details */}
        <div className="tracking-content">
          <div className="flight-detail-header">
            <span className="flight-detail-flag">{selectedFlight.flag}</span>
            <div>
              <h3>{selectedFlight.country} — {selectedFlight.status}</h3>
              <p>{selectedFlight.route}</p>
            </div>
          </div>

          <div className="flight-detail-body">
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value status-badge" data-status={selectedFlight.status.toLowerCase()}>
                {selectedFlight.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Route</span>
              <span className="detail-value">{selectedFlight.route}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Aircraft</span>
              <span className="detail-value">{selectedFlight.details}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Passengers</span>
              <span className="detail-value">{selectedFlight.passengers}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Departed</span>
              <span className="detail-value">{selectedFlight.departedTime}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Arrived</span>
              <span className="detail-value">{selectedFlight.arrivedTime}</span>
            </div>

            {selectedFlight.sources.length > 0 && (
              <div className="flight-sources">
                <div className="sources-header">Sources</div>
                {selectedFlight.sources.map((source, idx) => (
                  <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="source-link">
                    · {source.text} ↗
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Map placeholder */}
          <div className="flight-map-placeholder">
            <div className="map-icon">🗺️</div>
            <p>Flight tracking map</p>
            <small>Real-time tracking data when available</small>
          </div>
        </div>
      </div>
    </div>
  );
}
