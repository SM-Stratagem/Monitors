"use client";

import { AdSenseUnit } from "@/components/adsense-unit";
import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";
import Link from "next/link";

export default function Page() {
  const schema = generateBreadcrumbSchema(breadcrumbs.healthAuthorityGuidance);
  return (
    <main className="pillar-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} suppressHydrationWarning />
      <article className="content-wrapper">
        <p className="eyebrow">Official guidance summary</p>
        <h1>Health Authority Guidance</h1>
        <p>
          This page turns official guidance into usable context for the tracker audience. It is designed to hold
          original editorial content, not just a back-link, so the page has enough publisher value to support ads.
        </p>

        <section>
          <h2>Who this guidance is for</h2>
          <p>
            Travelers, households, clinicians, and public-health readers all need different context. The goal here is to
            provide enough structure and explanation for each audience.
          </p>
        </section>

        <section>
          <h2>How to use the tracker responsibly</h2>
          <p>
            Use the dashboard for situational awareness, then move to source-linked pages for symptoms, prevention, and
            local health authority guidance. The tracker should inform, not replace, official notices.
          </p>
        </section>

        <section>
          <h2>What not to do</h2>
          <p>
            Do not rely on this site as your only emergency source. The editorial material is meant to support the
            dashboard, which is why it belongs on its own content-heavy page before any ad placement.
          </p>
        </section>

        <AdSenseUnit className="article-ad" label="Sponsored placement" />

        <p className="article-footnote">
          <Link href="/">← Back to Dashboard</Link>
        </p>
      </article>
    </main>
  );
}
