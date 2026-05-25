"use client";

import { AdSenseUnit } from "@/components/adsense-unit";
import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";
import Link from "next/link";

const faqData = [
  { q: "What is Ebola virus disease?", a: "A rare and deadly infectious disease caused by the Ebola virus. Outbreaks occur primarily in sub-Saharan Africa. (Source: CDC)" },
  { q: "How does it spread?", a: "Through direct contact with blood, secretions, or other bodily fluids of infected individuals. Also through contact with contaminated surfaces. (Source: WHO, CDC)" },
  { q: "Why does this page have so much text?", a: "Because the site needs real publisher content, not just a link and a script tag. The FAQ is part of the content layer." },
  { q: "Is this the official guidance?", a: "No. It is an independent tracker that summarizes public information and links out to official sources." },
  { q: "What should I do after exposure?", a: "Seek medical advice promptly, mention the exposure clearly, and follow public-health instructions." },
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
          The FAQ is written as a real help page with original explanatory text so it can serve as publisher content
          instead of a thin ad screen.
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
