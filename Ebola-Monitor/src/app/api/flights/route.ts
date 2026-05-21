import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { flightPositions } from "../../../../db/schema";
import { desc, eq } from "drizzle-orm";

export const runtime = "nodejs";

const FALLBACK_FLIGHTS = [
  { id: 1, flightNumber: "UNHAS-101", airline: "UNHAS", departureAirport: "GOM", arrivalAirport: "EBB", departureCity: "Goma", arrivalCity: "Entebbe", departureCountry: "DR Congo", arrivalCountry: "Uganda", status: "arrived", latitude: "0.0424", longitude: "32.4435", altitude: null, speed: null, heading: null, totalPassengers: 12, totalCrew: 3, notes: "UNHAS specialized clinical team transport.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 2, flightNumber: "AFX120E", airline: "French Air Force", departureAirport: "CKY", arrivalAirport: "CDG", departureCity: "Conakry", arrivalCity: "Paris", departureCountry: "Guinea", arrivalCountry: "France", status: "arrived", latitude: "49.0097", longitude: "2.5479", altitude: null, speed: null, heading: null, totalPassengers: 5, totalCrew: 4, notes: "Falcon 900EX F-HREG. Medevac of laboratory personnel.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 3, flightNumber: "ZT791", airline: "Titan Airways", departureAirport: "FNA", arrivalAirport: "LHR", departureCity: "Freetown", arrivalCity: "London", departureCountry: "Sierra Leone", arrivalCountry: "United Kingdom", status: "arrived", latitude: "51.4700", longitude: "-0.4543", altitude: null, speed: null, heading: null, totalPassengers: 22, totalCrew: 6, notes: "Specialized clinical researchers transport.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 4, flightNumber: "KLM-EIN", airline: "KLM Charter", departureAirport: "ROB", arrivalAirport: "AMS", departureCity: "Monrovia", arrivalCity: "Amsterdam", departureCountry: "Liberia", arrivalCountry: "Netherlands", status: "arrived", latitude: "52.3105", longitude: "4.7683", altitude: null, speed: null, heading: null, totalPassengers: 29, totalCrew: 7, notes: "Evacuation of WHO field coordinators.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 5, flightNumber: "CFC301", airline: "Canadian Forces", departureAirport: "FNA", arrivalAirport: "YBG", departureCity: "Freetown", arrivalCity: "Bagotville", departureCountry: "Sierra Leone", arrivalCountry: "Canada", status: "departed", latitude: "38.5", longitude: "-30.0", altitude: 35000, speed: 450, heading: 315, totalPassengers: 4, totalCrew: 5, notes: "Transport of mobile lab staff to Quebec isolation.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 6, flightNumber: "THY-EBB", airline: "Turkish Airlines", departureAirport: "EBB", arrivalAirport: "IST", departureCity: "Entebbe", arrivalCity: "Istanbul", departureCountry: "Uganda", arrivalCountry: "Turkey", status: "departed", latitude: "40.0", longitude: "10.0", altitude: 38000, speed: 480, heading: 65, totalPassengers: 3, totalCrew: 4, notes: "Repatriation of aid workers.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 7, flightNumber: "IRL290", airline: "Irish Air Corps", departureAirport: "ROB", arrivalAirport: "BRU", departureCity: "Monrovia", arrivalCity: "Brussels", departureCountry: "Liberia", arrivalCountry: "Belgium", status: "departed", latitude: "42.0", longitude: "-15.0", altitude: 33000, speed: 420, heading: 350, totalPassengers: 2, totalCrew: 3, notes: "Patient transport with strict bio-bubble protocol.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 8, flightNumber: "RCH801", airline: "USAF Biocontainment", departureAirport: "CKY", arrivalAirport: "OMA", departureCity: "Conakry", arrivalCity: "Omaha", departureCountry: "Guinea", arrivalCountry: "United States", status: "departed", latitude: "35.0", longitude: "-40.0", altitude: 36000, speed: 460, heading: 295, totalPassengers: 17, totalCrew: 8, notes: "Transport of symptomatic field doctor to Nebraska BCU.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 9, flightNumber: "AUS001", airline: "Qantas Charter", departureAirport: "LOS", arrivalAirport: "SYD", departureCity: "Lagos", arrivalCity: "Sydney", departureCountry: "Nigeria", arrivalCountry: "Australia", status: "scheduled", latitude: null, longitude: null, altitude: null, speed: null, heading: null, totalPassengers: 8, totalCrew: 5, notes: "Curated medevac transport.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
];

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const flightNumber = searchParams.get("flightNumber");

    let rows;
    if (flightNumber) {
      rows = await db.select().from(flightPositions)
        .where(eq(flightPositions.flightNumber, flightNumber))
        .orderBy(desc(flightPositions.lastUpdated));
    } else {
      rows = await db.select().from(flightPositions)
        .orderBy(desc(flightPositions.lastUpdated));
    }

    if (rows.length === 0) return NextResponse.json({ flights: FALLBACK_FLIGHTS });
    return NextResponse.json({ flights: rows });
  } catch {
    return NextResponse.json({ flights: FALLBACK_FLIGHTS });
  }
}
