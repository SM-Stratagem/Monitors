"use client";

import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";
import Link from "next/link";

export default function OutbreakTimelinePage() {
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs.outbreakTimeline);

  return (
    <main className="timeline-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} suppressHydrationWarning />
      <article>
        <h1>2026 Ebola Outbreak Timeline</h1>
        <p>March-May: Active Ebola virus disease (EVD) outbreaks across West and Central Africa. Real-time data available on main dashboard.</p>
        <p><Link href="/">← Back to Dashboard</Link></p>
      </article>
      <style jsx>{`
        .timeline-page { max-width: 900px; margin: 0 auto; padding: 2rem; background: linear-gradient(135deg, #0a1628 0%, #1a2744 100%); color: #e0e0e0; }
        h1 { color: #10b981; }
        a { color: #00d4ff; }
      `}</style>
    </main>
  );
}
