import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_NAME = "Watchcomman Monitor";
const SITE_URL = process.env.SITE_URL?.replace(/\/+$/, "") ?? "https://www.monitor-info.app";
const ADSENSE_CLIENT = "ca-pub-2896982474245057";
const DESCRIPTION =
  "An independent open-source-intelligence platform fusing live disease, disaster, environmental, sanctions, cyber, and defense signals into one continuously updated editorial dashboard.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Live OSINT & Global Monitoring`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "SM Stratagem" }],
  creator: "SM Stratagem",
  publisher: "SM Stratagem",
  keywords: [
    "OSINT",
    "open source intelligence",
    "global monitoring",
    "disease surveillance",
    "disaster tracking",
    "earthquake monitor",
    "sanctions tracker",
    "cyber threat intelligence",
    "situational awareness",
    "live intelligence dashboard",
  ],
  formatDetection: { telephone: false },
  openGraph: {
    title: `${SITE_NAME} — Global Monitoring Intelligence`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Global Monitoring Intelligence`,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04060c",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/* Google AdSense — site verification + auto ads */}
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
