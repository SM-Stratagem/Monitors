"use client";

import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";
import Link from "next/link";

export default function Page() {
  const schema = generateBreadcrumbSchema(breadcrumbs.preventionGuide);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} suppressHydrationWarning />
      <h1>Prevention & Treatment Guide</h1>
      <p><Link href="/">← Back to Dashboard</Link></p>
    </main>
  );
}
