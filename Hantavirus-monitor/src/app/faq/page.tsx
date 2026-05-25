"use client";

import { AdSenseUnit } from "@/components/adsense-unit";
import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";
import Link from "next/link";

const faqData = [
  { q: "What is hantavirus?", a: "A virus family that can cause severe diseases. The 2026 outbreak involves Andes virus with human-to-human transmission capability. (Source: CDC)" },
  { q: "How does it spread?", a: "Most spread through rodent contact. Andes virus spreads person-to-person via respiratory droplets. (Source: WHO, CDC)" },
  { q: "Why is there so much detail here?", a: "Because the site should be useful even without the tracker. The FAQ is part of the editorial content that supports the site, not an ad wrapper." },
  { q: "Is this the official public-health guidance?", a: "No. It is an independent tracker that summarizes public information and links out to official sources." },
  { q: "What should I do if I think I was exposed?", a: "Seek medical advice promptly, explain the exposure clearly, and follow local public-health instructions." },
];

export default function Page() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqData.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  const breadSchema = generateBreadcrumbSchema(breadcrumbs.faq);

  return (
    <main className="pillar-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadSchema) }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} suppressHydrationWarning />
      <article className="content-wrapper">
        <p className="eyebrow">Frequently asked questions</p>
        <h1>FAQ</h1>
        <p>
          The FAQ is written as a real help page with original explanatory text so the site has enough publisher
          content to support advertising without turning the page into a thin ad screen.
        </p>

        <div className="faq-list">
          {faqData.map((item) => (
            <section key={item.q} className="faq-item">
              <h2>{item.q}</h2>
              <p>{item.a}</p>
            </section>
          ))}
        </div>

        <AdSenseUnit className="article-ad" label="Sponsored placement" />

        <p className="article-footnote">
          <Link href="/">← Back to Dashboard</Link>
        </p>
      </article>
    </main>
  );
}
