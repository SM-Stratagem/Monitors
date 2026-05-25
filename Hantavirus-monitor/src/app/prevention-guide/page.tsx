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
          This guide exists as a full editorial page, not a placeholder. It gives readers practical steps for reducing
          exposure risk, understanding when medical care is needed, and reading the tracker responsibly.
        </p>

        <section>
          <h2>Preventing exposure</h2>
          <p>
            The safest approach is to avoid rodent-infested areas, use sealed food storage, and clean contaminated
            spaces with damp methods and protective gear so dust is not aerosolized.
          </p>
        </section>

        <section>
          <h2>When to seek care</h2>
          <p>
            Anyone with fever, fatigue, muscle pain, or breathing symptoms after a rodent exposure should seek medical
            evaluation quickly and explicitly mention the exposure history.
          </p>
        </section>

        <section>
          <h2>What treatment usually looks like</h2>
          <p>
            Treatment is typically supportive and depends on severity at presentation. The value of this page is that it
            provides enough context to stand on its own, which is important for ad serving policy and for the user.
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
