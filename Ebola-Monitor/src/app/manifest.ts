import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getBaseUrlFromRequest } from "@/lib/request-url";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const siteUrl = ((await getBaseUrlFromRequest()) ?? getSiteUrl()).replace(/\/+$/, "");

  return {
    name: "Ebola Outbreak Tracker",
    short_name: "EVDTrack",
    description: "Live monitoring dashboard for ebola virus disease (EVD) reporting from affected regions worldwide. Real-time case tracking, flight routes, quarantine countdowns.",
    start_url: "/",
    display: "standalone",
    background_color: "#03131f",
    theme_color: "#03131f",
    scope: "/",
    lang: "en",
    id: siteUrl,
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
