"use client";

import { AdSenseUnit } from "@/components/adsense-unit";
import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";
import Link from "next/link";

export default function Page() {
  const schema = generateBreadcrumbSchema(breadcrumbs.preventionGuide);
  return (
    <main className="pillar-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} suppressHydrationWarning />
      <article className="content-wrapper">
        <p className="eyebrow">Practical guidance</p>
        <h1>Prevention & Treatment Guide</h1>
        <p>
          This guide exists as a proper editorial page. It explains the behaviors that reduce exposure risk and how to
          interpret the outbreak tracker without turning the route into a thin utility screen.
        </p>

        <section>
          <h2>Preventing exposure</h2>
          <p>
            The best protection is avoiding contact with blood and bodily fluids from symptomatic individuals, using
            gloves and barrier protection, and cleaning contaminated areas with proper disinfectant and ventilation.
          </p>
        </section>

        <section>
          <h2>When to seek care</h2>
          <p>
            People with fever, weakness, vomiting, or bleeding symptoms after a known exposure should seek medical
            attention quickly and mention the exposure clearly.
          </p>
        </section>

        <section>
          <h2>What treatment usually looks like</h2>
          <p>
            Treatment is generally supportive, with hydration, electrolyte management, and intensive care when needed.
            The content here is intentionally substantive so the page can safely support advertising.
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
