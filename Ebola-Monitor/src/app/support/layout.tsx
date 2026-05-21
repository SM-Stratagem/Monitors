import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support the Tracker",
  description: "Support the ongoing maintenance and data ingestion for the Ebola Outbreak Tracker.",
  robots: { index: true, follow: true },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}

