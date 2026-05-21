"use client";

import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";
import Link from "next/link";

const faqData = [
  { q: "What is Ebola virus disease?", a: "A rare and deadly infectious disease caused by the Ebola virus. Outbreaks occur primarily in sub-Saharan Africa. (Source: CDC)" },
  { q: "How does it spread?", a: "Through direct contact with blood, secretions, or other bodily fluids of infected individuals. Also through contact with contaminated surfaces. (Source: WHO, CDC)" },
];

export default function Page() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqData.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  const breadSchema = generateBreadcrumbSchema(breadcrumbs.faq);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadSchema) }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} suppressHydrationWarning />
      <h1>FAQ</h1>
      <p><Link href="/">← Back to Dashboard</Link></p>
    </main>
  );
}
