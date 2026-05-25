import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";
import { getSeoContext } from "@/lib/seo-context";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";

const SITE_NAME = "Ebola Outbreak Tracker";
const PRIMARY_DOMAIN = "https://www.ebolamonitorapp.com";
const SECONDARY_DOMAIN = "https://ebolamonitor.sm-stratagem.com";

export async function generateMetadata(): Promise<Metadata> {
  const envUrl = getSiteUrl();
  const requestUrl = await getBaseUrlFromRequest();
  const siteUrl = (requestUrl ?? envUrl).replace(/\/+$/, "");

  const seo = await getSeoContext();
  const updatedAt = seo.lastSnapshotAt ?? seo.lastIngestAt;
  const updatedIso = updatedAt ? updatedAt.toISOString() : null;

  const title = "Ebola Outbreak Tracker — Ebola Virus Disease (EVD) · Live Dashboard";
  const description =
    "Live Ebola virus disease (EVD) outbreak tracker monitoring active outbreaks in West and Central Africa. Real-time case tracking, medical evacuation flights, quarantine countdowns across 15+ countries. Data from WHO, CDC, Africa CDC, and 20+ verified sources. Updated every 12 hours.";

  return {
    metadataBase: new URL(PRIMARY_DOMAIN),
    title,
    description,
    applicationName: SITE_NAME,
    manifest: "/manifest.webmanifest",
    keywords: [
      "ebola", "ebola virus disease", "EVD", "ebola outbreak 2026",
      "outbreak tracker", "disease surveillance", "public health monitoring",
      "WHO", "CDC", "Africa CDC", "ebola cases", "ebola deaths",
      "ebola quarantine", "medical evacuation flights", "ebola map",
      "ebola timeline", "ebola news", "ebola hemorrhagic fever",
      "ebola travel advisory", "West Africa ebola", "Central Africa ebola",
      "ebola DRC", "ebola Guinea", "ebola Sierra Leone", "ebola Liberia",
      "ebola tracking", "live outbreak data",
    ],
    authors: [{ name: "SM Stratagem" }],
    creator: "SM Stratagem",
    publisher: "SM Stratagem",
    formatDetection: { telephone: false },
    alternates: {
      canonical: PRIMARY_DOMAIN,
      languages: { "en": PRIMARY_DOMAIN },
      types: {
        "application/json": `${PRIMARY_DOMAIN}/api/dashboard`,
      },
    },
    openGraph: {
      title,
      description,
      url: PRIMARY_DOMAIN,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${PRIMARY_DOMAIN}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Ebola Outbreak Tracker 2026 — Live dashboard with global case tracking, flight routes, and quarantine countdowns",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${PRIMARY_DOMAIN}/twitter-image`],
      creator: "@SMStratagem",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "Health",
    classification: "Public Health Surveillance",
    referrer: "origin-when-cross-origin",
    other: {
      ...(updatedIso ? { "last-modified": updatedIso } : {}),
      "google-adsense-account": "ca-pub-2896982474245057",
      "ai-content-declaration": "human-authored",
      "citation-title": title,
      "citation-online-date": updatedIso ? updatedIso.split("T")[0] : "2026-05-01",
      "citation-publication-name": SITE_NAME,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const envUrl = getSiteUrl();
  const requestUrl = await getBaseUrlFromRequest();
  const siteUrl = (requestUrl ?? envUrl).replace(/\/+$/, "");
  const bingVerification = process.env.BING_WEBMASTER_VERIFICATION?.trim();

  const seo = await getSeoContext();
  const updatedAt = seo.lastSnapshotAt ?? seo.lastIngestAt;
  const updatedIso = updatedAt ? updatedAt.toISOString() : new Date().toISOString();
  const modifiedDate = updatedIso ? updatedIso.split("T")[0] : "2026-05-01";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Thing",
      name: "Data Freshness",
      dateModified: updatedIso,
      description: "Last update of Ebola outbreak data",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "SM Stratagem",
      url: PRIMARY_DOMAIN,
      sameAs: [
        "https://github.com/SM-Stratagem",
        "https://www.buymeacoffee.com/SMStratagem",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: PRIMARY_DOMAIN,
      inLanguage: "en",
      description: "Live Ebola virus disease (EVD) outbreak tracker monitoring active outbreaks in West and Central Africa.",
      publisher: { "@type": "Organization", name: "SM Stratagem" },
      dateModified: modifiedDate,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      description: "Live monitoring dashboard for Ebola virus disease (EVD) outbreak tracking. Aggregates official public-health guidance and verified public reporting with citations and timestamps.",
      url: PRIMARY_DOMAIN,
      applicationCategory: "MedicalApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Organization", name: "SM Stratagem" },
      publisher: { "@type": "Organization", name: "SM Stratagem" },
      datePublished: "2026-05-01",
      dateModified: modifiedDate,
      about: {
        "@type": "Thing",
        name: "Ebola virus disease outbreak — 2026",
        sameAs: "https://www.who.int/emergencies/disease-outbreak-news",
      },
      featureList: [
        "Live world map with case markers and flight routes",
        "Case tracker with transmission chain mapping and clinical notes",
        "Flight tracker for medical evacuation aircraft",
        "Quarantine countdown timers by country (21-day incubation)",
        "Timeline visualization of outbreak progression",
        "News feed from 20+ verified sources",
        "Reddit community intelligence from r/ebola and r/worldnews",
        "Disease encyclopedia with Ebola strain information",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ebola Monitor — Live Outbreak Data",
      description: "Machine-readable Ebola outbreak data including case timeline, flight tracking, quarantine status, and news signals. Updated every 12 hours.",
      url: PRIMARY_DOMAIN,
      creator: { "@type": "Organization", name: "SM Stratagem" },
      dateModified: modifiedDate,
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
      distribution: [
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/dashboard`, encodingFormat: "application/json", name: "Dashboard Summary" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/cases`, encodingFormat: "application/json", name: "Case Timeline" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/flights`, encodingFormat: "application/json", name: "Flight Tracking" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/quarantine`, encodingFormat: "application/json", name: "Quarantine Status" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/disease-info`, encodingFormat: "application/json", name: "Disease Information" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      name: "Ebola Virus Disease",
      alternateName: ["EVD", "Ebola Hemorrhagic Fever", "EHF"],
      description: "Severe and often fatal illness caused by the Ebola virus. Transmitted through direct contact with blood, secretions, organs, or other bodily fluids of infected people, and with surfaces and materials contaminated with these fluids.",
      cause: { "@type": "MedicalCause", name: "Ebola virus (Ebolavirus genus, Filoviridae family)" },
      riskFactor: "Direct contact with infected individuals or bodily fluids, contact with contaminated surfaces, traditional burial practices",
      possibleTreatment: { "@type": "MedicalTherapy", name: "Supportive care with experimental therapeutics", procedure: "IV fluids, electrolyte management, antiviral therapy, monoclonal antibodies" },
      relatedLink: "https://www.cdc.gov/vhf/ebola/",
    },
  ];

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bree+Serif&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a1628" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="ai-content-declaration" content="human-authored" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="6 hours" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />

        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="99Piz242wQqsUXIGWCqvWpnGaMwwU356sdZd73ppoLA" />
        <meta name="google-site-verification" content="2vnTK5dDPaXTuauQrGKyfqjPfNcstPsGSO_fotkJ1y4" />

        {/* Bing Webmaster Tools verification */}
        {bingVerification ? <meta name="msvalidate.01" content={bingVerification} /> : null}

        {/* Alternate domain canonical */}
        <link rel="alternate" href={SECONDARY_DOMAIN} hrefLang="en" />
        <link rel="alternate" href={`${PRIMARY_DOMAIN}/sitemap.xml`} type="application/xml" title="Sitemap" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body>
        <WebVitalsReporter />
        {children}
        <Script
          src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
          data-name="bmc-button"
          data-slug="SMStratagem"
          data-color="#7a7a7a"
          data-emoji="☕"
          data-font="Bree"
          data-text="Buy me a Spanish Latte"
          data-outline-color="#ffffff"
          data-font-color="#ffffff"
          data-coffee-color="#FFDD00"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
