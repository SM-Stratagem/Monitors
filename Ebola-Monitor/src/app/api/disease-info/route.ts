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
  name: "Ebola Virus Disease",
  synonyms: ["EVD", "Ebola Hemorrhagic Fever", "EHF"],
  transmission: [
    "Direct contact with blood, secretions, organs, or other bodily fluids of infected individuals",
    "Contact with contaminated surfaces and materials (fomites)",
    "Contact with infected animals (bushmeat, fruit bats, primates)",
    "Sexual transmission (recovering patients can shed virus for months)",
  ],
  symptoms: [
    "Early: Sudden fever, fatigue, muscle pain, headache, sore throat",
    "Progressive: Vomiting, diarrhea, rash, impaired kidney and liver function",
    "Severe: Internal and external bleeding, multi-organ failure",
  ],
  incubationPeriod: "2-21 days (typically 8-10 days)",
  mortalityRate: "25-90% depending on strain and supportive care quality (average ~50%)",
  prevention: [
    "Avoid contact with infected individuals and their bodily fluids",
    "Practice strict infection prevention and control (IPC) measures",
    "Use personal protective equipment (PPE) when caring for patients",
    "Safe burial practices to prevent transmission from deceased",
    "Avoid contact with fruit bats and non-human primates",
  ],
  treatment: "Supportive care with oral/IV rehydration. Specific treatments include Inmazeb (atoltivimab/maftivimab/odesivimab) — first FDA-approved treatment for Zaire ebolavirus. Vaccination with rVSV-ZEBOV (Ervebo) for prevention.",
  strains: [
    { name: "Zaire ebolavirus (EBOV)", region: "Central/West Africa", transmission: "Human-to-human efficient", severity: "High (up to 90% mortality)" },
    { name: "Sudan ebolavirus (SUDV)", region: "East/Central Africa", transmission: "Human-to-human possible", severity: "High (40-60% mortality)" },
    { name: "Bundibugyo ebolavirus (BDBV)", region: "Uganda", transmission: "Human-to-human possible", severity: "Moderate (25-40% mortality)" },
    { name: "Taï Forest ebolavirus (TAFV)", region: "Côte d'Ivoire", transmission: "Limited human cases", severity: "Low (1 known case, recovered)" },
    { name: "Reston ebolavirus (RESTV)", region: "Philippines/USA", transmission: "Non-pathogenic in humans", severity: "None in humans (fatal in primates)" },
  ],
  currentOutbreak: {
    region: "Democratic Republic of the Congo",
    cases: 128,
    deaths: 55,
    countries: 3,
    strain: "Zaire ebolavirus",
    source: "WHO Disease Outbreak News, May 2026",
    lastUpdated: "2026-05-15",
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
          return /ebola|hemorrhagic fever|evd|filovirus/.test(text);
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
