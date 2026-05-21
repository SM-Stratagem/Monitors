import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { flightPositions } from "../../../../db/schema";
import { desc, eq } from "drizzle-orm";

export const runtime = "nodejs";

const FALLBACK_FLIGHTS = [
  { id: 1, flightNumber: "IBE3201", airline: "Iberia Charter", departureAirport: "TFS", arrivalAirport: "MAD", departureCity: "Tenerife", arrivalCity: "Madrid", departureCountry: "Spain", arrivalCountry: "Spain", status: "arrived", latitude: "40.4722", longitude: "-3.5611", altitude: null, speed: null, heading: null, totalPassengers: 14, totalCrew: 0, notes: "A310 Reino de España. 14 Spanish nationals evacuated.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 2, flightNumber: "AFX120E", airline: "French Air Force", departureAirport: "TFS", arrivalAirport: "LBG", departureCity: "Tenerife", arrivalCity: "Paris", departureCountry: "France", arrivalCountry: "France", status: "arrived", latitude: "48.9693", longitude: "2.4414", altitude: null, speed: null, heading: null, totalPassengers: 5, totalCrew: 0, notes: "Falcon 900EX F-HREG. 1 of 5 symptomatic in-flight.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 3, flightNumber: "ZT791", airline: "Titan Airways", departureAirport: "TFS", arrivalAirport: "MAN", departureCity: "Tenerife", arrivalCity: "Manchester", departureCountry: "United Kingdom", arrivalCountry: "United Kingdom", status: "arrived", latitude: "53.4747", longitude: "-2.2784", altitude: null, speed: null, heading: null, totalPassengers: 22, totalCrew: 0, notes: "19 guests + 3 crew. Hospitalization on arrival.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 4, flightNumber: "KLM-EIN", airline: "KLM Charter", departureAirport: "TFS", arrivalAirport: "EIN", departureCity: "Tenerife", arrivalCity: "Eindhoven", departureCountry: "Netherlands", arrivalCountry: "Netherlands", status: "arrived", latitude: "51.4500", longitude: "5.3745", altitude: null, speed: null, heading: null, totalPassengers: 29, totalCrew: 0, notes: "29 Dutch nationals. Menzies Aviation ground handling.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 5, flightNumber: "CFC301", airline: "Canadian Forces", departureAirport: "TFS", arrivalAirport: "YBG", departureCity: "Tenerife", arrivalCity: "Bagotville", departureCountry: "Canada", arrivalCountry: "Canada", status: "departed", latitude: "38.5", longitude: "-30.0", altitude: 35000, speed: 450, heading: 315, totalPassengers: 4, totalCrew: 0, notes: "4 passengers en route to Bagotville, Quebec.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 6, flightNumber: "THY-TFS", airline: "Turkish Airlines", departureAirport: "TFS", arrivalAirport: "IST", departureCity: "Tenerife", arrivalCity: "Istanbul", departureCountry: "Turkey", arrivalCountry: "Turkey", status: "departed", latitude: "40.0", longitude: "-10.0", altitude: 38000, speed: 480, heading: 65, totalPassengers: 3, totalCrew: 0, notes: "3 Turkish citizens evacuated.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 7, flightNumber: "IRL290", airline: "Irish Air Corps", departureAirport: "TFS", arrivalAirport: "N/A", departureCity: "Tenerife", arrivalCity: "Ireland", departureCountry: "Ireland", arrivalCountry: "Ireland", status: "departed", latitude: "42.0", longitude: "-15.0", altitude: 33000, speed: 420, heading: 350, totalPassengers: 2, totalCrew: 0, notes: "1 passenger + medical escort.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 8, flightNumber: "RCH801", airline: "USAF Biocontainment", departureAirport: "TFS", arrivalAirport: "DCA", departureCity: "Tenerife", arrivalCity: "Washington D.C.", departureCountry: "United States", arrivalCountry: "United States", status: "departed", latitude: "35.0", longitude: "-40.0", altitude: 36000, speed: 460, heading: 295, totalPassengers: 17, totalCrew: 0, notes: "Biocontainment charter. CDC escort. Nebraska BCU.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: 9, flightNumber: "AUS001", airline: "Qantas Charter", departureAirport: "TFS", arrivalAirport: "SYD", departureCity: "Tenerife", arrivalCity: "Sydney", departureCountry: "Australia", arrivalCountry: "Australia", status: "scheduled", latitude: null, longitude: null, altitude: null, speed: null, heading: null, totalPassengers: 8, totalCrew: 0, notes: "Monday flight. Final TFS evacuation.", lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() },
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
