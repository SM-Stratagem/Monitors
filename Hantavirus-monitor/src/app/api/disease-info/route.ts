import { NextResponse } from "next/server";
import Parser from "rss-parser";

export const runtime = "nodejs";

const parser = new Parser();

const DISEASE_FEEDS = [
  { name: "WHO Disease Outbreak News", url: "https://www.who.int/feeds/entity/don/en/rss.xml", credibility: 98 },
  { name: "CDC MMWR", url: "https://tools.cdc.gov/podcasts/feed.asp?feedid=183", credibility: 96 },
  { name: "ProMED", url: "https://promedmail.org/promed-posts/feed/", credibility: 92 },
  { name: "ECDC Threats", url: "https://www.ecdc.europa.eu/en/rss", credibility: 94 },
];

const DISEASE_INFO = {
  name: "Hantavirus",
  synonyms: ["Hantavirus Pulmonary Syndrome", "Hemorrhagic Fever with Renal Syndrome", "Andes Virus"],
  transmission: [
    "Inhalation of aerosolized rodent excreta (urine, feces, saliva)",
    "Direct contact with infected rodent excreta",
    "Limited human-to-human transmission (Andes virus only)",
    "Contaminated food or surfaces",
  ],
  symptoms: [
    "Early: Fever, muscle aches, fatigue, headache, nausea, vomiting, diarrhea",
    "Late (HPS): Cough, shortness of breath, pulmonary edema",
    "Late (HFRS): Kidney failure, hemorrhaging",
  ],
  incubationPeriod: "1-8 weeks (typically 2-4 weeks)",
  mortalityRate: "HPS: 36%, HFRS: 1-15% depending on strain",
  prevention: [
    "Avoid contact with rodents and their excreta",
    "Seal holes and gaps in homes and cabins",
    "Store food in rodent-proof containers",
    "Wear gloves when cleaning potentially contaminated areas",
    "Ventilate enclosed spaces before cleaning",
  ],
  treatment: "Supportive care. No specific antiviral treatment. Ribavirin may be used in HFRS cases.",
  strains: [
    { name: "Andes (ANDV)", region: "South America", transmission: "Human-to-human possible", severity: "High (36% mortality)" },
    { name: "Sin Nombre (SNV)", region: "North America", transmission: "Rodent-to-human only", severity: "High (36% mortality)" },
    { name: "Hantaan (HTNV)", region: "East Asia", transmission: "Rodent-to-human only", severity: "Moderate (5-15% mortality)" },
    { name: "Puumala (PUUV)", region: "Europe", transmission: "Rodent-to-human only", severity: "Low (<1% mortality)" },
    { name: "Dobrava-Belgrade (DOBV)", region: "Southeast Europe", transmission: "Rodent-to-human only", severity: "Moderate (5-12% mortality)" },
  ],
  currentOutbreak: {
    vessel: "MV Hondius",
    cases: 39,
    deaths: 3,
    countries: 14,
    strain: "Andes virus",
    source: "WHO DON599, May 7 2026",
    lastUpdated: "2026-05-10",
  },
};

export async function GET() {
  const feedItems: Array<{ source: string; title: string; url: string; summary: string; publishedAt: string; credibility: number }> = [];

  for (const feed of DISEASE_FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      const items = (data.items ?? [])
        .filter(item => {
          const text = `${item.title ?? ""} ${item.contentSnippet ?? ""}`.toLowerCase();
          return /hantavirus|hemorrhagic fever|andes virus|rodent.borne/.test(text);
        })
        .slice(0, 10);

      for (const item of items) {
        feedItems.push({
          source: feed.name,
          title: item.title || "",
          url: item.link || "",
          summary: (item.contentSnippet || item.content || item.title || "").slice(0, 400),
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          credibility: feed.credibility,
        });
      }
    } catch { /* continue */ }
  }

  return NextResponse.json({
    disease: DISEASE_INFO,
    feedItems,
    sources: DISEASE_FEEDS.map(f => ({ name: f.name, credibility: f.credibility })),
  });
}
