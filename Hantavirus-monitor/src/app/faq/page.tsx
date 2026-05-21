"use client";

import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";
import Link from "next/link";

const faqData = [
  { q: "What is hantavirus?", a: "A virus family that can cause severe diseases. The 2026 outbreak involves Andes virus with human-to-human transmission capability. (Source: CDC)" },
  { q: "How does it spread?", a: "Most spread through rodent contact. Andes virus spreads person-to-person via respiratory droplets. (Source: WHO, CDC)" },
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
