import type { MetadataRoute } from "next";
import { CATEGORY_LABELS, slugify } from "@/lib/format";

const KNOWN_REGIONS = [
  "Europe", "Asia", "Southeast Asia", "Oceania",
  "North Africa & Middle East", "West & Central Africa", "Southern Africa", "East Africa",
  "North America", "Central America & Caribbean", "South America",
  "Central Africa", "West Africa", "South Asia",
];

// We deliberately do NOT list the per-country pages here. They are near-identical,
// programmatically generated data views (thin content) and are marked noindex; only
// pages that carry substantial original content belong in the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL?.replace(/\/+$/, "") ?? "https://www.monitor-info.app";
  const lastModified = new Date();

  const fixed: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/dashboard`, lastModified, changeFrequency: "hourly", priority: 0.85 },
    { url: `${base}/signals`, lastModified, changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/sources`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/map`, lastModified, changeFrequency: "hourly", priority: 0.7 },
    { url: `${base}/countries`, lastModified, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/api-docs`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: 0.4 },
  ];

  const diseases = Object.keys(CATEGORY_LABELS).map((c) => ({
    url: `${base}/disease/${c}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  const regions = KNOWN_REGIONS.map((r) => ({
    url: `${base}/region/${slugify(r)}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.65,
  }));

  return [...fixed, ...diseases, ...regions];
}
