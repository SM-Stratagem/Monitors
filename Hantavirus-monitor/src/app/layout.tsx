import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";
import { getSeoContext } from "@/lib/seo-context";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";

const SITE_NAME = "Hantavirus Outbreak Tracker";
const PRIMARY_DOMAIN = "https://www.hantavirusmonitorapp.com";
const SECONDARY_DOMAIN = "https://hanatavirusmonitor.sm-stratagem.com";

export async function generateMetadata(): Promise<Metadata> {
  const envUrl = getSiteUrl();
  const requestUrl = await getBaseUrlFromRequest();
  const siteUrl = (requestUrl ?? envUrl).replace(/\/+$/, "");

  const seo = await getSeoContext();
  const updatedAt = seo.lastSnapshotAt ?? seo.lastIngestAt;
  const updatedIso = updatedAt ? updatedAt.toISOString() : null;

  const title = "Hantavirus Outbreak Tracker — MV Hondius (Andes Virus) · Live Dashboard";
  const description =
    "Live hantavirus outbreak tracker monitoring the 2026 MV Hondius cruise ship incident. Real-time case tracking, repatriation flights, quarantine countdowns across 19 countries. Data from WHO, CDC, ECDC, RKI, and 20+ verified sources. Updated every 12 hours.";

  return {
    metadataBase: new URL(PRIMARY_DOMAIN),
    title,
    description,
    applicationName: SITE_NAME,
    manifest: "/manifest.webmanifest",
    keywords: [
      "hantavirus", "Andes virus", "MV Hondius", "cruise ship outbreak 2026",
      "outbreak tracker", "disease surveillance", "public health monitoring",
      "WHO", "CDC", "ECDC", "RKI", "hantavirus cases", "hantavirus deaths",
      "hantavirus quarantine", "repatriation flights", "hantavirus map",
      "hantavirus timeline", "hantavirus news", "Andes virus human-to-human",
      "hantavirus travel advisory", "hantavirus cruise ship",
      "hantavirus Argentina", "hantavirus Chile", "hantavirus Spain",
      "MV Hondius repatriation", "hantavirus tracking", "live outbreak data",
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
          alt: "Hantavirus Outbreak Tracker — MV Hondius 2026 — Live dashboard with global case tracking, flight routes, and quarantine countdowns",
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
      description: "Last update of hantavirus outbreak data",
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
      description: "Live hantavirus outbreak tracker monitoring the 2026 MV Hondius cruise ship incident.",
      publisher: { "@type": "Organization", name: "SM Stratagem" },
      dateModified: modifiedDate,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      description: "Live monitoring dashboard for hantavirus (Andes virus) reporting linked to the MV Hondius outbreak. Aggregates official public-health guidance and verified public reporting with citations and timestamps.",
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
        name: "Hantavirus outbreak — MV Hondius 2026",
        sameAs: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599",
      },
      featureList: [
        "Live world map with case markers and flight routes",
        "Case tracker with generation mapping and clinical notes",
        "Flight tracker for repatriation aircraft",
        "Ship deck and position tracker for MV Hondius",
        "Quarantine countdown timers by country",
        "Timeline visualization of outbreak progression",
        "News feed from 20+ verified sources",
        "Reddit community intelligence from r/hantavirus and r/worldnews",
        "Disease encyclopedia with hantavirus strain information",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Hantavirus Monitor — Live Outbreak Data",
      description: "Machine-readable hantavirus outbreak data including case timeline, flight tracking, quarantine status, and news signals. Updated every 12 hours.",
      url: PRIMARY_DOMAIN,
      creator: { "@type": "Organization", name: "SM Stratagem" },
      dateModified: modifiedDate,
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
      distribution: [
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/dashboard`, encodingFormat: "application/json", name: "Dashboard Summary" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/cases`, encodingFormat: "application/json", name: "Case Timeline" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/flights`, encodingFormat: "application/json", name: "Flight Tracking" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/ship`, encodingFormat: "application/json", name: "Ship Position" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/quarantine`, encodingFormat: "application/json", name: "Quarantine Status" },
        { "@type": "DataDownload", contentUrl: `${PRIMARY_DOMAIN}/api/disease-info`, encodingFormat: "application/json", name: "Disease Information" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      name: "Hantavirus Infection",
      alternateName: ["Hantavirus Pulmonary Syndrome", "Hemorrhagic Fever with Renal Syndrome", "Andes Virus Infection"],
      description: "Viral disease transmitted by rodents, with human-to-human transmission possible for the Andes virus strain.",
      cause: { "@type": "MedicalCause", name: "Hantavirus (Orthohantavirus genus)" },
      riskFactor: "Rodent exposure, close contact with infected individuals (Andes virus)",
      possibleTreatment: { "@type": "MedicalTherapy", name: "Supportive care", procedure: "Hospitalization, respiratory support" },
      relatedLink: "https://www.cdc.gov/hantavirus/",
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
        <meta name="theme-color" content="#03131f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="ai-content-declaration" content="human-authored" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="6 hours" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="google-adsense-account" content="ca-pub-2896982474245057" />

        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="99Piz242wQqsUXIGWCqvWpnGaMwwU356sdZd73ppoLA" />
        <meta name="google-site-verification" content="2vnTK5dDPaXTuauQrGKyfqjPfNcstPsGSO_fotkJ1y4" />

        {/* Bing Webmaster Tools verification — CRITICAL for ChatGPT/Copilot visibility */}
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2896982474245057"
          crossOrigin="anonymous"
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
