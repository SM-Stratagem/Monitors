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
          This page translates official guidance into readable context for the tracker audience. It is written as a
          substantive content page so the site has real publisher material around any ad placements.
        </p>

        <section>
          <h2>Who this guidance is for</h2>
          <p>
            It is useful for travelers, household contacts, clinicians, and public-health readers who need a quick way
            to interpret what the tracker is showing.
          </p>
        </section>

        <section>
          <h2>How to use the tracker responsibly</h2>
          <p>
            Use the dashboard for situational awareness, then move to the linked source pages for country guidance,
            symptom context, and prevention steps. Do not treat the dashboard as a substitute for an official notice.
          </p>
        </section>

        <section>
          <h2>What not to do</h2>
          <p>
            Do not rely on this site as the only source for emergency decisions. The content is curated and explanatory,
            which is exactly what ad-supported pages need in order to be legitimate publisher-content screens.
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
